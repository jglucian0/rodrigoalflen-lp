/** Cada ZIP tem no máximo isto (evita estourar o tempo e a memória da hospedagem) */
export const MAX_PART_BYTES = 350 * 1024 * 1024;
export const MAX_PART_FILES = 200;

/** Divide as fotos em partes. A página e o ZIP usam esta mesma função, então as partes coincidem. */
export function planZipParts<T extends { sizeBytes: number }>(list: T[]): T[][] {
  const parts: T[][] = [];
  let current: T[] = [];
  let bytes = 0;

  for (const item of list) {
    const full =
      current.length >= MAX_PART_FILES ||
      (current.length > 0 && bytes + item.sizeBytes > MAX_PART_BYTES);

    if (full) {
      parts.push(current);
      current = [];
      bytes = 0;
    }
    current.push(item);
    bytes += item.sizeBytes;
  }

  if (current.length > 0) parts.push(current);
  return parts;
}