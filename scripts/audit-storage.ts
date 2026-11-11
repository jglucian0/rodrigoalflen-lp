import { db } from "../src/db";
import { photos } from "../src/db/schema";
import { deleteObjects, listObjects } from "../src/lib/storage/r2";

const DELETE = process.argv.includes("--delete");
const MIN_AGE_MS = 24 * 60 * 60 * 1000;

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

async function main() {
  console.log(`\nAuditoria do armazenamento (${DELETE ? "COM exclusão" : "somente leitura"})\n`);

  const rows = await db
    .select({ o: photos.originalKey, p: photos.previewKey, t: photos.thumbKey })
    .from(photos);
  const referenced = new Set(rows.flatMap((r) => [r.o, r.p, r.t]));

  const objects = await listObjects("galleries/");
  const inBucket = new Set(objects.map((o) => o.key));
  const now = Date.now();

  // Arquivos no bucket sem registro no banco (sobras de envios que falharam, galerias apagadas...)
  const orphans = objects.filter(
    (o) => !referenced.has(o.key) && now - o.modified.getTime() > MIN_AGE_MS,
  );
  // Registros no banco cujo arquivo sumiu do bucket
  const missing = [...referenced].filter((key) => !inBucket.has(key));

  console.log(`Fotos no banco:        ${rows.length}`);
  console.log(`Arquivos no bucket:    ${objects.length}`);
  console.log(`Sobras no bucket:      ${orphans.length} (${mb(orphans.reduce((s, o) => s + o.size, 0))})`);
  console.log(`Arquivos que sumiram:  ${missing.length}\n`);

  orphans.slice(0, 20).forEach((o) => console.log(`  sobra   ${o.key}`));
  if (orphans.length > 20) console.log(`  ... e mais ${orphans.length - 20}`);
  missing.slice(0, 20).forEach((key) => console.log(`  ausente ${key}`));
  if (missing.length > 20) console.log(`  ... e mais ${missing.length - 20}`);

  if (orphans.length > 0 && DELETE) {
    await deleteObjects(orphans.map((o) => o.key));
    console.log(`\n✔ ${orphans.length} sobra(s) apagada(s).`);
  } else if (orphans.length > 0) {
    console.log("\nPara apagar as sobras: npm run storage:audit -- --delete");
  }
  if (missing.length > 0) {
    console.log("\n⚠ Arquivos ausentes precisam de atenção: reenvie essas fotos pelo painel.");
  }
  console.log("");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});