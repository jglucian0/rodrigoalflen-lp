/** Cabeçalho de download com nome de arquivo seguro (aceita acentos) */
export function contentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7e]|["\\%]/g, "_");
  const encoded = encodeURIComponent(filename).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

/** Garante a extensão do original no nome do arquivo */
export function withExtension(filename: string, key: string): string {
  if (/\.(jpe?g|png|webp)$/i.test(filename)) return filename;
  const ext = key.split(".").pop() ?? "jpg";
  return `${filename}.${ext}`;
}

/** "Casamento: Camila & Fernando" -> "casamento-camila-fernando" */
export function fileSlug(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "galeria"
  );
}

/** Evita dois arquivos com o mesmo nome dentro do ZIP */
export function uniqueName(name: string, used: Set<string>): string {
  let candidate = name;
  let n = 2;
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";

  while (used.has(candidate.toLowerCase())) {
    candidate = `${base} (${n++})${ext}`;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

export const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};