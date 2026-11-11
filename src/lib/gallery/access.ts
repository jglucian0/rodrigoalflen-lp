import { and, asc, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { galleries, photos } from "@/db/schema";
import { getSession } from "@/lib/auth/session";

/** Cliente logado (ou null). Para Route Handlers. */
export async function getClientUser() {
  const session = await getSession();
  return session && session.user.role === "client" ? session.user : null;
}

const expiredSql = sql<boolean>`${galleries.expiresAt} <= now()`;
const daysLeftSql = sql<number>`greatest(0, ceil(extract(epoch from (${galleries.expiresAt} - now())) / 86400))::int`;

/** Foto que o cliente pode ver: é dele e a galeria não expirou */
export async function findClientPhoto(photoId: string, userId: string) {
  const [row] = await db
    .select({
      id: photos.id,
      filename: photos.filename,
      originalKey: photos.originalKey,
      previewKey: photos.previewKey,
      thumbKey: photos.thumbKey,
      allowDownload: galleries.allowDownload,
    })
    .from(photos)
    .innerJoin(galleries, eq(galleries.id, photos.galleryId))
    .where(
      and(
        eq(photos.id, photoId),
        eq(galleries.userId, userId),
        gt(galleries.expiresAt, sql`now()`),
      ),
    )
    .limit(1);
  return row ?? null;
}

/** Galeria do cliente (retorna também as expiradas, para mostrar o aviso) */
export async function findClientGallery(galleryId: string, userId: string) {
  const [row] = await db
    .select({
      id: galleries.id,
      title: galleries.title,
      eventDate: galleries.eventDate,
      expiresAt: galleries.expiresAt,
      allowDownload: galleries.allowDownload,
      expired: expiredSql,
      daysLeft: daysLeftSql,
    })
    .from(galleries)
    .where(and(eq(galleries.id, galleryId), eq(galleries.userId, userId)))
    .limit(1);
  return row ?? null;
}

export function listClientGalleries(userId: string) {
  return db
    .select({
      id: galleries.id,
      title: galleries.title,
      eventDate: galleries.eventDate,
      expired: expiredSql,
      daysLeft: daysLeftSql,
      photoCount: sql<number>`(select count(*)::int from photos p where p.gallery_id = "galleries"."id")`,
      // capa escolhida no painel; se não houver, a primeira foto
      coverId: sql<string | null>`coalesce("galleries"."cover_photo_id", (select p.id from photos p where p.gallery_id = "galleries"."id" order by p.position asc, p.created_at asc limit 1))`,
    })
    .from(galleries)
    .where(eq(galleries.userId, userId))
    .orderBy(desc(galleries.createdAt));
}

const order = [asc(photos.position), asc(photos.createdAt), asc(photos.id)];

/** Fotos na ordem definida no painel */
export function listGalleryPhotos(galleryId: string) {
  return db
    .select({
      id: photos.id,
      filename: photos.filename,
      width: photos.width,
      height: photos.height,
      sizeBytes: photos.sizeBytes,
    })
    .from(photos)
    .where(eq(photos.galleryId, galleryId))
    .orderBy(...order);
}

/** Mesma ordem e mesmos campos de tamanho, mais as chaves dos originais (só para o ZIP) */
export function listPhotosForZip(galleryId: string) {
  return db
    .select({
      filename: photos.filename,
      originalKey: photos.originalKey,
      sizeBytes: photos.sizeBytes,
    })
    .from(photos)
    .where(eq(photos.galleryId, galleryId))
    .orderBy(...order);
}