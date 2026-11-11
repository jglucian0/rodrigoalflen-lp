/** CRC-32 (exigido pelo formato ZIP) */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(d: Date) {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

interface Entry {
  name: Buffer;
  crc: number;
  size: number;
  offset: number;
}

const UTF8_NAMES = 0x0800; // nomes com acento funcionam em qualquer programa

function localHeader(entry: Entry, stamp: { time: number; date: number }) {
  const h = Buffer.alloc(30 + entry.name.length);
  h.writeUInt32LE(0x04034b50, 0); // assinatura
  h.writeUInt16LE(20, 4); // versão necessária
  h.writeUInt16LE(UTF8_NAMES, 6);
  h.writeUInt16LE(0, 8); // método: armazenado (sem compressão)
  h.writeUInt16LE(stamp.time, 10);
  h.writeUInt16LE(stamp.date, 12);
  h.writeUInt32LE(entry.crc, 14);
  h.writeUInt32LE(entry.size, 18); // tamanho "comprimido"
  h.writeUInt32LE(entry.size, 22); // tamanho original
  h.writeUInt16LE(entry.name.length, 26);
  h.writeUInt16LE(0, 28); // campo extra
  entry.name.copy(h, 30);
  return h;
}

function centralHeader(entry: Entry, stamp: { time: number; date: number }) {
  const h = Buffer.alloc(46 + entry.name.length);
  h.writeUInt32LE(0x02014b50, 0);
  h.writeUInt16LE(20, 4); // versão de criação
  h.writeUInt16LE(20, 6); // versão necessária
  h.writeUInt16LE(UTF8_NAMES, 8);
  h.writeUInt16LE(0, 10);
  h.writeUInt16LE(stamp.time, 12);
  h.writeUInt16LE(stamp.date, 14);
  h.writeUInt32LE(entry.crc, 16);
  h.writeUInt32LE(entry.size, 20);
  h.writeUInt32LE(entry.size, 24);
  h.writeUInt16LE(entry.name.length, 28);
  // extra, comentário, disco, atributos: tudo zero
  h.writeUInt32LE(entry.offset, 42);
  entry.name.copy(h, 46);
  return h;
}

function endRecord(count: number, centralSize: number, centralOffset: number) {
  const h = Buffer.alloc(22);
  h.writeUInt32LE(0x06054b50, 0);
  h.writeUInt16LE(count, 8);
  h.writeUInt16LE(count, 10);
  h.writeUInt32LE(centralSize, 12);
  h.writeUInt32LE(centralOffset, 16);
  return h;
}

export interface ZipFile {
  name: string;
  /** Devolve o conteúdo, ou null para pular o arquivo */
  load: () => Promise<Buffer | null>;
}

/**
 * Gera um ZIP em streaming, um arquivo por vez.
 * Limites do formato usado: até 65.535 arquivos e 4 GB (as partes da galeria ficam bem abaixo).
 */
export function createZipStream(
  files: ZipFile[],
  signal?: AbortSignal,
): ReadableStream<Uint8Array> {
  const stamp = dosDateTime(new Date());
  const entries: Entry[] = [];
  let index = 0;
  let offset = 0;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (signal?.aborted) return controller.close();

        // Um arquivo por chamada: o navegador controla o ritmo (sem acumular na memória)
        while (index < files.length) {
          const file = files[index++];
          const data = await file.load();
          if (!data) continue;

          const entry: Entry = {
            name: Buffer.from(file.name, "utf8"),
            crc: crc32(data),
            size: data.length,
            offset,
          };
          const header = localHeader(entry, stamp);

          entries.push(entry);
          offset += header.length + data.length;
          controller.enqueue(header);
          controller.enqueue(data);
          return;
        }

        // Acabaram os arquivos: escreve o índice final do ZIP
        const central = entries.map((entry) => centralHeader(entry, stamp));
        const centralSize = central.reduce((sum, c) => sum + c.length, 0);
        controller.enqueue(
          Buffer.concat([...central, endRecord(entries.length, centralSize, offset)]),
        );
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      index = files.length;
    },
  });
}