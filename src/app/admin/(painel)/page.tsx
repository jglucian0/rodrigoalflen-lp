import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { galleries, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/guards";

export default async function ClientsPage() {
  await requireAdmin();

  const clients = await db
    .select({
      id: users.id,
      name: users.name,
      login: users.login,
      email: users.email,
      active: users.active,
    })
    .from(users)
    .where(eq(users.role, "client"))
    .orderBy(desc(users.createdAt));

  const counts = await db
    .select({ userId: galleries.userId, total: count() })
    .from(galleries)
    .groupBy(galleries.userId);
  const galleryCount = new Map(counts.map((c) => [c.userId, c.total]));

  return (
    <>
      <div className="adm__head">
        <div>
          <p className="adm__crumb">Painel</p>
          <h1 className="adm__title">
            Clientes <em>({clients.length})</em>
          </h1>
        </div>
        <Link href="/admin/clientes/novo" className="btn btn--dark">
          Novo cliente
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="adm-card adm-empty">
          <p>Nenhum cliente cadastrado ainda.</p>
          <Link href="/admin/clientes/novo" className="auth__link">
            Cadastrar o primeiro cliente
          </Link>
        </div>
      ) : (
        <ul className="adm-list">
          <li className="adm-row adm-row--head" aria-hidden>
            <span>Cliente</span>
            <span>Login</span>
            <span>Galerias</span>
            <span>Acesso</span>
          </li>
          {clients.map((client) => (
            <li key={client.id}>
              <Link href={`/admin/clientes/${client.id}`} className="adm-row">
                <span className="adm-row__name">
                  <strong>{client.name}</strong>
                  <small>{client.email}</small>
                </span>
                <span className="adm-row__login">{client.login}</span>
                <span className="adm-row__count">
                  {galleryCount.get(client.id) ?? 0}
                </span>
                <span>
                  <span
                    className={`adm-badge ${client.active ? "adm-badge--on" : "adm-badge--off"}`}
                  >
                    {client.active ? "Ativo" : "Desativado"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
