import { access, readdir } from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGE_EXT = /\.(avif|webp|jpe?g|png)$/i;

/** Aceita a pasta com ou sem acento */
const SLIDE_DIRS = ["portfolio/destaque", "portfólio/destaque"];

/** Nome (sem extensão) da foto fixa do quadrado pequeno, dentro de /public */
const CARD_BASENAME = "herodestaque";

/** Lista as fotos do arco, ordenadas por nome (01, 02, 10...). Server-only. */
export async function getHeroSlides(): Promise<string[]> {
  "use cache"; // Informa ao Next.js para cachear este I/O estaticamente no build

  for (const dir of SLIDE_DIRS) {
    const absolute = path.join(PUBLIC_DIR, dir);

    try {
      await access(absolute);
    } catch {
      continue;
    }

    const files = await readdir(absolute);

    const validFiles = files
      .filter((file) => IMAGE_EXT.test(file))
      .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

    if (validFiles.length > 0) {
      return validFiles.map(
        (file) => "/" + [...dir.split("/"), file].map(encodeURIComponent).join("/"),
      );
    }
  }

  return [];
}

/** Retorna a foto fixa do quadrado (public/heroDestaque.*), ou null. Server-only. */
export async function getHeroCard(): Promise<string | null> {
  "use cache"; // Informa ao Next.js para cachear este I/O estaticamente no build

  try {
    await access(PUBLIC_DIR);
    const files = await readdir(PUBLIC_DIR);

    const file = files.find((name) => {
      const { name: base, ext } = path.parse(name);
      return base.toLowerCase() === CARD_BASENAME && IMAGE_EXT.test(ext);
    });

    return file ? `/${encodeURIComponent(file)}` : null;
  } catch {
    return null;
  }
}