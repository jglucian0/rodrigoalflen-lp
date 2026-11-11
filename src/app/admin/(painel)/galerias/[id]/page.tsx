import { asc, count, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryDeleteButton from "@/components/admin/GalleryDeleteButton";
import GallerySettingsForm from "@/components/admin/GallerySettingsForm";
import PhotoGrid from "@/components/admin/PhotoGrid";
import PhotoUploader from "@/components/admin/PhotoUploader";
import { db } from "@/db";
import { galleries, photos, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { formatDateBR, toDateInput } from "@/lib/format";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function GalleryAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const [gallery] = await db
    .select({
      id: galleries.id,
      title: galleries.title,
      eventDate: galleries.eventDate,
      expiresAt: galleries.expiresAt,
      allowDownload: galleries.allowDownload,
      coverPhotoId: galleries.coverPhotoId,
      userId: galleries.userId,
      clientName: users.name,
    })
    .from(galleries)
    .innerJoin(users, eq(users.id, galleries.userId))
    .where(eq(galleries.id, id))
    .limit(1);

  if (!gallery) notFound();

  const list = await db
    .select({ id: photos.id, filename: photos.filename })
    .from(photos)
    .where(eq(photos.galleryId, id))
    .orderBy(asc(photos.position), asc(photos.createdAt), asc(photos.id));

  const expired = gallery.expiresAt.getTime() < Date.now();

  return (
    <>
      <div className="adm__head">
        <div>
          <p className="adm__crumb">
            <Link href="/admin">Clientes</Link> /{" "}
            <Link href={`/admin/clientes/${gallery.userId}`}>
              {gallery.clientName}
            </Link>{" "}
            / {gallery.title}
          </p>
          <h1 className="adm__title">{gallery.title}</h1>
        </div>
        <span
          className={`adm-badge ${expired ? "adm-badge--off" : "adm-badge--on"}`}
        >
          {expired ? "Expirada" : `Até ${formatDateBR(gallery.expiresAt)}`}
        </span>
      </div>

      <div className="adm-grid">
        <section className="adm-card">
          <h2 className="adm-card__title">Configurações</h2>
          <GallerySettingsForm
            galleryId={gallery.id}
            title={gallery.title}
            eventDate={gallery.eventDate}
            expiresAt={toDateInput(gallery.expiresAt)}
            allowDownload={gallery.allowDownload}
          />
        </section>

        <section className="adm-card">
          <h2 className="adm-card__title">Enviar fotos</h2>
          <PhotoUploader galleryId={gallery.id} />
        </section>
      </div>

      <section className="adm-card" style={{ marginTop: 24 }}>
        <h2 className="adm-card__title">Fotos ({list.length})</h2>
        <PhotoGrid
          galleryId={gallery.id}
          coverId={gallery.coverPhotoId}
          photos={list}
        />
      </section>

      <section className="adm-card" style={{ marginTop: 24 }}>
        <h2 className="adm-card__title">Excluir galeria</h2>
        <p className="adm-muted" style={{ marginBottom: 14 }}>
          Remove a galeria, todas as fotos e os arquivos do armazenamento. Não
          dá para desfazer.
        </p>
        <GalleryDeleteButton
          galleryId={gallery.id}
          title={gallery.title}
          photoCount={list.length}
        />
      </section>
    </>
  );
}
