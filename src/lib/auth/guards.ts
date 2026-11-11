import { redirect } from "next/navigation";
import { getSession } from "./session";

/**
 * Exige um administrador logado. Chame no começo de TODA página e ação do painel:
 * o layout não é reexecutado em navegações internas, então ele sozinho não protege.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "admin") redirect("/admin/entrar");
  return session.user;
}

/** Para Route Handlers: devolve o admin logado ou null (sem redirecionar) */
export async function getAdminOrNull() {
  const session = await getSession();
  return session && session.user.role === "admin" ? session.user : null;
}

/** Exige um cliente logado (para as páginas da galeria) */
export async function requireClient() {
  const session = await getSession();
  if (!session || session.user.role !== "client") redirect("/cliente");
  return session.user;
}