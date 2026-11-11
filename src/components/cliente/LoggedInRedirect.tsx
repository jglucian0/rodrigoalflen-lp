import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

/** Quem já está logado e abre /cliente vai direto para as galerias */
export default async function LoggedInRedirect() {
  const session = await getSession();
  if (session?.user.role === "client") redirect("/cliente/galeria");
  return null;
}
