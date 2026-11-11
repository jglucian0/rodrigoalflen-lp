import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { db } from "@/db";
import { galleries, photos } from "@/db/schema";
import { getAdminOrNull } from "@/lib/auth/guards";
import { isSameOrigin } from "@/lib/security/request";
import {
  deleteObjects,
  getObjectBuffer,
  headObject,
  putObject,
} from "@/lib/storage/r2";

export const maxDuration = 60;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BYTES = 40 * 1024 * 1024;
const MAX_PIXELS = 150_000_000;
const ALLOWED = new Set(["jpeg", "png", "webp"]);

const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

/** Lê as informações da imagem; devolve null se o arquivo não for uma imagem válida */
async function readMetadata(input: Buffer) {
  try {
    return await sharp(input, { limitInputPixels: MAX_PIXELS }).metadata();
  } catch {
    return null;
  }
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request)) return fail("Requisição inválida.", 403);
  if (!(await getAdminOrNull())) return fail("Não autorizado.", 401);

  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return fail("Galeria inválida.", 400);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Requisição inválida.", 400);
  }

  const { key, filename } = (body ?? {}) as { key?: unknown; filename?: unknown };

  // A chave precisa pertencer a ESTA galeria (impede registrar arquivos alheios)
  const keyRe = new RegExp(`^galleries/${id}/orig/[0-9a-f-]{36}\\.(jpg|png|webp)$`);
  if (typeof key !== "string" || !keyRe.test(key)) return fail("Arquivo inválido.", 400);

  const safeName =
    String(typeof filename === "string" ? filename : "")
      .replace(/[\\/]/g, "")
      .slice(0, 200) || "foto";

  const [gallery] = await db
    .select({ id: galleries.id })
    .from(galleries)
    .where(eq(galleries.id, id))
    .limit(1);
  if (!gallery) return fail("Galeria não encontrada.", 404);

  // Já registrada? (repetição do mesmo pedido)
  const [existing] = await db
    .select({ id: photos.id })
    .from(photos)
    .where(eq(photos.originalKey, key))
    .limit(1);
  if (existing) return NextResponse.json({ photo: { id: existing.id } });

  const head = await headObject(key);
  if (!head) return fail("O arquivo não chegou ao armazenamento. Tente enviar de novo.", 404);
  if (head.size > MAX_BYTES) {
    await deleteObjects([key]);
    return fail(`O arquivo deve ter até ${MAX_BYTES / 1024 / 1024} MB.`, 413);
  }

  const original = await getObjectBuffer(key);

  const meta = await readMetadata(original);
  if (!meta) {
    await deleteObjects([key]);
    return fail("Não foi possível ler a imagem.", 415);
  }

  if (!meta.format || !ALLOWED.has(meta.format) || !meta.width || !meta.height) {
    await deleteObjects([key]);
    return fail("Formato não aceito. Use JPG, PNG ou WebP.", 415);
  }

  // Orientações 5 a 8 do EXIF giram a foto 90°: largura e altura se invertem
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;

  const photoId = randomUUID();
  const previewKey = `galleries/${id}/preview/${photoId}.webp`;
  const thumbKey = `galleries/${id}/thumb/${photoId}.webp`;

  try {
    // .rotate() aplica a orientação do EXIF; os metadados (inclusive GPS) são descartados
    const base = sharp(original, { limitInputPixels: MAX_PIXELS }).rotate();

    const [preview, thumb] = await Promise.all([
      base
        .clone()
        .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer(),
      base
        .clone()
        .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 72 })
        .toBuffer(),
    ]);

    await Promise.all([
      putObject(previewKey, preview, "image/webp"),
      putObject(thumbKey, thumb, "image/webp"),
    ]);

    await db.insert(photos).values({
      id: photoId,
      galleryId: id,
      filename: safeName,
      originalKey: key,
      previewKey,
      thumbKey,
      width,
      height,
      sizeBytes: head.size,
      position: sql`(select coalesce(max(position), 0) + 1 from photos where gallery_id = ${id})`,
    });
  } catch (error) {
    console.error("[fotos/process]", error);
    await deleteObjects([key, previewKey, thumbKey]).catch(() => { });
    return fail("Não foi possível processar a foto. Tente novamente.", 500);
  }

  return NextResponse.json({ photo: { id: photoId, width, height } });
}