"use server";

import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { galleries, photos, users } from "@/db/schema";
import type { ActionState } from "@/lib/admin/types";
import { requireAdmin } from "@/lib/auth/guards";
import { deleteObjects } from "@/lib/storage/r2";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value);
}

/** Apaga arquivos do R2 sem derrubar a ação se falhar (sobra só lixo no bucket) */
async function removeFiles(keys: string[]) {
  if (keys.length === 0) return;
  try {
    await deleteObjects(keys);
  } catch (error) {
    console.error("[r2] falha ao apagar arquivos", error);
  }
}

/** Grava a nova ordem das fotos com um único UPDATE */
async function writeOrder(galleryId: string, orderedIds: string[]) {
  if (orderedIds.length === 0) return;
  const values = sql.join(
    orderedIds.map((id, i) => sql`(${id}::uuid, ${i + 1}::int)`),
    sql`, `,
  );
  await db.execute(sql`
    update photos as p
    set position = v.pos
    from (values ${values}) as v(id, pos)
    where p.id = v.id and p.gallery_id = ${galleryId}::uuid
  `);
}

/** Cria a galeria e abre a página dela */
export async function createGallery(
  userId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(userId)) return { error: "Cliente inválido." };

  const title = String(formData.get("title") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();

  if (title.length < 2 || title.length > 120) return { error: "Informe o título da galeria." };
  if (eventDate && !isValidDate(eventDate)) return { error: "Data do evento inválida." };

  const [client] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.role, "client")))
    .limit(1);
  if (!client) return { error: "Cliente não encontrado." };

  const [created] = await db
    .insert(galleries)
    .values({ userId, title, eventDate: eventDate || null })
    .returning({ id: galleries.id });

  revalidatePath(`/admin/clientes/${userId}`);
  redirect(`/admin/galerias/${created.id}`);
}

/** Título, data do evento, validade e permissão de download */
export async function updateGallery(
  galleryId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(galleryId)) return { error: "Galeria inválida." };

  const title = String(formData.get("title") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const expires = String(formData.get("expiresAt") ?? "").trim();
  const allowDownload = formData.get("allowDownload") === "on";

  if (title.length < 2 || title.length > 120) return { error: "Informe o título da galeria." };
  if (eventDate && !isValidDate(eventDate)) return { error: "Data do evento inválida." };
  if (!isValidDate(expires)) return { error: "Informe a data de validade." };

  const [updated] = await db
    .update(galleries)
    .set({
      title,
      eventDate: eventDate || null,
      // vale até o fim do dia escolhido (horário de Brasília)
      expiresAt: new Date(`${expires}T23:59:59-03:00`),
      allowDownload,
    })
    .where(eq(galleries.id, galleryId))
    .returning({ userId: galleries.userId });

  if (!updated) return { error: "Galeria não encontrada." };

  revalidatePath(`/admin/galerias/${galleryId}`);
  revalidatePath(`/admin/clientes/${updated.userId}`);
  return { message: "Galeria salva." };
}

/** Exclui a galeria, as fotos e os arquivos do R2 */
export async function deleteGallery(galleryId: string): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(galleryId)) return { error: "Galeria inválida." };

  const [gallery] = await db
    .select({ userId: galleries.userId })
    .from(galleries)
    .where(eq(galleries.id, galleryId))
    .limit(1);
  if (!gallery) return { error: "Galeria não encontrada." };

  const rows = await db
    .select({ o: photos.originalKey, p: photos.previewKey, t: photos.thumbKey })
    .from(photos)
    .where(eq(photos.galleryId, galleryId));

  // O banco apaga fotos e links de compartilhamento em cascata
  await db.delete(galleries).where(eq(galleries.id, galleryId));
  await removeFiles(rows.flatMap((r) => [r.o, r.p, r.t]));

  revalidatePath(`/admin/clientes/${gallery.userId}`);
  redirect(`/admin/clientes/${gallery.userId}`);
}

/** Exclui as fotos escolhidas (banco + R2) */
export async function deletePhotos(
  galleryId: string,
  photoIds: string[],
): Promise<ActionState> {
  await requireAdmin();

  const ids = [...new Set(photoIds)].filter((id) => UUID_RE.test(id)).slice(0, 500);
  if (!UUID_RE.test(galleryId) || ids.length === 0) {
    return { error: "Nenhuma foto selecionada." };
  }

  const deleted = await db
    .delete(photos)
    .where(and(eq(photos.galleryId, galleryId), inArray(photos.id, ids)))
    .returning({ o: photos.originalKey, p: photos.previewKey, t: photos.thumbKey });

  // Se a capa foi apagada, a galeria fica sem capa
  await db
    .update(galleries)
    .set({ coverPhotoId: null })
    .where(and(eq(galleries.id, galleryId), inArray(galleries.coverPhotoId, ids)));

  await removeFiles(deleted.flatMap((r) => [r.o, r.p, r.t]));

  revalidatePath(`/admin/galerias/${galleryId}`);
  return { message: `${deleted.length} foto(s) excluída(s).` };
}

export async function setCoverPhoto(
  galleryId: string,
  photoId: string,
): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(galleryId) || !UUID_RE.test(photoId)) return { error: "Foto inválida." };

  const [photo] = await db
    .select({ id: photos.id })
    .from(photos)
    .where(and(eq(photos.id, photoId), eq(photos.galleryId, galleryId)))
    .limit(1);
  if (!photo) return { error: "Foto não encontrada." };

  await db.update(galleries).set({ coverPhotoId: photoId }).where(eq(galleries.id, galleryId));

  revalidatePath(`/admin/galerias/${galleryId}`);
  return { message: "Capa definida." };
}

const byOrder = [asc(photos.position), asc(photos.createdAt), asc(photos.id)];

/** Leva as fotos escolhidas para o início da galeria */
export async function movePhotosToStart(
  galleryId: string,
  photoIds: string[],
): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(galleryId)) return { error: "Galeria inválida." };

  const selected = new Set(photoIds.filter((id) => UUID_RE.test(id)));
  if (selected.size === 0) return { error: "Nenhuma foto selecionada." };

  const all = await db
    .select({ id: photos.id })
    .from(photos)
    .where(eq(photos.galleryId, galleryId))
    .orderBy(...byOrder);

  await writeOrder(galleryId, [
    ...all.filter((p) => selected.has(p.id)).map((p) => p.id),
    ...all.filter((p) => !selected.has(p.id)).map((p) => p.id),
  ]);

  revalidatePath(`/admin/galerias/${galleryId}`);
  return { message: "Fotos movidas para o início." };
}

/** Ordena toda a galeria pelo nome do arquivo (IMG_2 antes de IMG_10) */
export async function sortPhotosByName(galleryId: string): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(galleryId)) return { error: "Galeria inválida." };

  const all = await db
    .select({ id: photos.id, filename: photos.filename })
    .from(photos)
    .where(eq(photos.galleryId, galleryId));

  all.sort((a, b) =>
    a.filename.localeCompare(b.filename, "pt-BR", { numeric: true, sensitivity: "base" }),
  );
  await writeOrder(galleryId, all.map((p) => p.id));

  revalidatePath(`/admin/galerias/${galleryId}`);
  return { message: "Fotos ordenadas por nome." };
}