import { and, count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientActions from "@/components/admin/ClientActions";
import ClientEditForm from "@/components/admin/ClientEditForm";
import GalleryCreateForm from "@/components/admin/GalleryCreateForm";
import { db } from "@/db";
import { galleries, photos, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { formatDateBR } from "@/lib/format";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const [client] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      login: users.login,
      active: users.active,
      lockedUntil: users.lockedUntil,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, "client")))
    .limit(1);

  if (!client) notFound();

  const clientGalleries = await db
    .select({
      id: galleries.id,
      title: galleries.title,
      eventDate: galleries.eventDate,
      expiresAt: galleries.expiresAt,
      photoCount: count(photos.id),
    })
    .from(galleries)
    .leftJoin(photos, eq(photos.galleryId, galleries.id))
    .where(eq(galleries.userId, client.id))
    .groupBy(galleries.id)
    .orderBy(desc(galleries.createdAt));

  const isLocked =
    client.lockedUntil !== null && client.lockedUntil.getTime() > Date.now();

  return (
    <>
      <div className="adm__head">
        <div>
          <p className="adm__crumb">
            <Link href="/admin">Clientes</Link> / {client.name}
          </p>
          <h1 className="adm__title">{client.name}</h1>
        </div>
        <span
          className={`adm-badge ${client.active ? "adm-badge--on" : "adm-badge--off"}`}
        >
          {client.active ? "Ativo" : "Desativado"}
        </span>
      </div>

      <div className="adm-grid">
        <section className="adm-card">
          <h2 className="adm-card__title">Dados</h2>
          <ClientEditForm
            userId={client.id}
            name={client.name}
            email={client.email}
          />
        </section>

        <section className="adm-card">
          <h2 className="adm-card__title">Acesso</h2>
          <dl className="adm-facts">
            <div>
              <dt>Login</dt>
              <dd>{client.login}</dd>
            </div>
            <div>
              <dt>Cadastrado em</dt>
              <dd>{client.createdAt.toLocaleDateString("pt-BR")}</dd>
            </div>
            {isLocked && (
              <div>
                <dt>Situação</dt>
                <dd>Bloqueado temporariamente por erros de senha</dd>
              </div>
            )}
          </dl>

          <ClientActions
            userId={client.id}
            name={client.name}
            active={client.active}
            galleryCount={clientGalleries.length}
          />
        </section>
      </div>

      <section className="adm-card" style={{ marginTop: 24 }}>
        <h2 className="adm-card__title">Galerias ({clientGalleries.length})</h2>

        {clientGalleries.length > 0 && (
          <ul className="adm-list" style={{ marginBottom: 24 }}>
            {clientGalleries.map((gallery) => {
              const expired = gallery.expiresAt.getTime() < Date.now();
              return (
                <li key={gallery.id}>
                  <Link
                    href={`/admin/galerias/${gallery.id}`}
                    className="adm-row adm-row--gal"
                  >
                    <span className="adm-row__name">
                      <strong>{gallery.title}</strong>
                      <small>
                        {gallery.eventDate
                          ? formatDateBR(gallery.eventDate)
                          : "Sem data do evento"}
                      </small>
                    </span>
                    <span className="adm-row__count">
                      {gallery.photoCount} foto(s)
                    </span>
                    <span>
                      <span
                        className={`adm-badge ${expired ? "adm-badge--off" : "adm-badge--on"}`}
                      >
                        {expired
                          ? "Expirada"
                          : `Até ${formatDateBR(gallery.expiresAt)}`}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <h3 className="adm-subtitle">Nova galeria</h3>
        <GalleryCreateForm userId={client.id} />
      </section>
    </>
  );
}
