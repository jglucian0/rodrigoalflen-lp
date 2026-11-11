import { and, eq, gt, lt, sql } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { generateToken, hashToken } from "@/lib/security/tokens";

const isProd = process.env.NODE_ENV === "production";

/** Em produção usa o prefixo __Host-, que exige HTTPS e impede ataques por subdomínio */
export const SESSION_COOKIE = isProd ? "__Host-session" : "session";

/** Cliente: 30 dias · Administrador: 8 horas */
const TTL_MS = {
  client: 30 * 24 * 60 * 60 * 1000,
  admin: 8 * 60 * 60 * 1000,
} as const;

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

/** Abre a sessão e grava o cookie. Só chame em Route Handlers ou Server Actions. */
export async function createSession(user: {
  id: string;
  role: "admin" | "client";
}) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + TTL_MS[user.role]);
  const userAgent =
    (await headers()).get("user-agent")?.slice(0, 255) ?? null;

  await db.insert(sessions).values({
    userId: user.id,
    tokenHash: hashToken(token), // o token em si nunca vai para o banco
    userAgent,
    expiresAt,
  });

  // Limpeza oportunista de sessões vencidas
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));

  (await cookies()).set(SESSION_COOKIE, token, {
    ...cookieOptions,
    expires: expiresAt,
  });
}

/** Lê a sessão atual (uma consulta por requisição). Retorna null se não houver. */
export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db
    .select({
      sessionId: sessions.id,
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        gt(sessions.expiresAt, sql`now()`), // antes: new Date()
        eq(users.active, true),
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    sessionId: row.sessionId,
    user: { id: row.id, name: row.name, email: row.email, role: row.role },
  };
});

/** Encerra a sessão atual e apaga o cookie */
export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }
  jar.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

/** Encerra todas as sessões de um usuário (usado ao trocar a senha) */
export const destroyAllSessions = (userId: string) =>
  db.delete(sessions).where(eq(sessions.userId, userId));