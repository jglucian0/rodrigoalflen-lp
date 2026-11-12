import { existsSync } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const FOLDERS = ["servicos", "serviços"];
const EXTENSIONS = ["webp", "jpg", "jpeg", "png", "avif"];

/** Caminho público da foto do serviço, ou null se o arquivo não existir. Server-only. */
export function resolveServiceImage(slug: string): string | null {
  for (const folder of FOLDERS) {
    for (const ext of EXTENSIONS) {
      const file = `${slug}.${ext}`;
      if (existsSync(path.join(PUBLIC_DIR, folder, file))) {
        return `/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
      }
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(`[servicos] sem foto para "${slug}" (esperado: public/servicos/${slug}.webp)`);
  }
  return null;
}