import { readdir } from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGE_EXT = /\.(avif|webp|jpe?g|png)$/i;

/** Aceita as grafias que podem existir no projeto */
const FOLDERS = ["portfolio", "portifolio", "portfólio"];

/** Embaralhamento Fisher-Yates (cada foto aparece no máximo uma vez) */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Sorteia `count` fotos diferentes de public/portfolio. Server-only. */
export async function getRandomPortfolioImages(count = 6): Promise<string[]> {
  "use cache"; // resultado guardado em cache: o sorteio acontece 1x, no build

  for (const folder of FOLDERS) {
    try {
      const entries = await readdir(path.join(PUBLIC_DIR, folder), {
        withFileTypes: true,
      });

      // Só arquivos soltos na pasta (ignora subpastas, como "destaque")
      const files = entries
        .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
        .map((entry) => entry.name);

      if (files.length > 0) {
        return shuffle(files)
          .slice(0, count)
          .map((file) => `/${folder}/${encodeURIComponent(file)}`);
      }
    } catch {
      // pasta inexistente: tenta a próxima grafia
    }
  }
  return [];
}