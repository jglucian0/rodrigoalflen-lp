"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { galleries, sessions, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import type { ActionState } from "@/lib/admin/types";
import { validateNewPassword } from "@/lib/security/password-rules";
import {
  hashPassword,
  randomDigits,
  randomLogin,
} from "@/lib/security/passwords";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 8 dígitos aleatórios que passam nas regras (sem sequências nem repetições) */
function newClientPassword() {
  for (; ;) {
    const candidate = randomDigits(8);
    if (validateNewPassword("client", candidate) === null) return candidate;
  }
}

/** Login numérico que ainda não existe */
async function uniqueLogin() {
  for (; ;) {
    const candidate = randomLogin();
    const [taken] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.login, candidate))
      .limit(1);
    if (!taken) return candidate;
  }
}

function parseFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
  };
}

function checkFields(name: string, email: string): string | null {
  if (name.length < 2 || name.length > 120) return "Informe o nome do cliente.";
  if (email.length > 254 || !EMAIL_RE.test(email)) return "Informe um e-mail válido.";
  return null;
}

/** Cadastra um cliente e devolve o login e a senha (mostrados uma única vez) */
export async function createClient(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const { name, email } = parseFields(formData);
  const problem = checkFields(name, email);
  if (problem) return { error: problem };

  const [duplicate] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (duplicate) return { error: "Já existe uma conta com esse e-mail." };

  const login = await uniqueLogin();
  const password = newClientPassword();

  let clientId: string;
  try {
    const [created] = await db
      .insert(users)
      .values({
        role: "client",
        name,
        email,
        login,
        passwordHash: await hashPassword(password),
      })
      .returning({ id: users.id });
    clientId = created.id;
  } catch {
    return { error: "Não foi possível cadastrar. Tente novamente." };
  }

  revalidatePath("/admin");
  return { clientId, credentials: { name, email, login, password } };
}

/** Atualiza nome e e-mail (o e-mail é usado na recuperação de senha) */
export async function updateClient(
  userId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(userId)) return { error: "Cliente inválido." };

  const { name, email } = parseFields(formData);
  const problem = checkFields(name, email);
  if (problem) return { error: problem };

  const [duplicate] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, userId)))
    .limit(1);
  if (duplicate) return { error: "Já existe outra conta com esse e-mail." };

  await db
    .update(users)
    .set({ name, email })
    .where(and(eq(users.id, userId), eq(users.role, "client")));

  revalidatePath("/admin");
  revalidatePath(`/admin/clientes/${userId}`);
  return { message: "Dados salvos." };
}

/** Gera uma nova senha, desbloqueia a conta e desconecta o cliente de todos os aparelhos */
export async function resetClientPassword(userId: string): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(userId)) return { error: "Cliente inválido." };

  const password = newClientPassword();

  const [user] = await db
    .update(users)
    .set({
      passwordHash: await hashPassword(password),
      failedAttempts: 0,
      lockedUntil: null,
    })
    .where(and(eq(users.id, userId), eq(users.role, "client")))
    .returning({ name: users.name, email: users.email, login: users.login });

  if (!user || !user.login) return { error: "Cliente não encontrado." };

  await db.delete(sessions).where(eq(sessions.userId, userId));

  return {
    credentials: {
      name: user.name,
      email: user.email,
      login: user.login,
      password,
    },
  };
}

/** Ativa ou desativa o acesso (desativar também encerra as sessões abertas) */
export async function setClientActive(
  userId: string,
  active: boolean,
): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(userId)) return { error: "Cliente inválido." };

  await db
    .update(users)
    .set({ active })
    .where(and(eq(users.id, userId), eq(users.role, "client")));

  if (!active) await db.delete(sessions).where(eq(sessions.userId, userId));

  revalidatePath("/admin");
  revalidatePath(`/admin/clientes/${userId}`);
  return { message: active ? "Acesso reativado." : "Acesso desativado." };
}

/** Exclui o cliente. Bloqueado enquanto houver galerias (as fotos ficariam órfãs). */
export async function deleteClient(userId: string): Promise<ActionState> {
  await requireAdmin();
  if (!UUID_RE.test(userId)) return { error: "Cliente inválido." };

  const [{ total }] = await db
    .select({ total: count() })
    .from(galleries)
    .where(eq(galleries.userId, userId));

  if (total > 0) {
    return {
      error: "Este cliente ainda tem galerias. Exclua as galerias primeiro.",
    };
  }

  await db
    .delete(users)
    .where(and(eq(users.id, userId), eq(users.role, "client")));

  revalidatePath("/admin");
  redirect("/admin");
}