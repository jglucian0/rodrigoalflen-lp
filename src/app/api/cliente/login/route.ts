import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth/session";
import {
  hashPassword,
  randomDigits,
  verifyPassword,
} from "@/lib/security/passwords";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/security/request";

const GENERIC_ERROR = "Login ou senha incorretos.";
const MAX_FAILED = 5; // erros seguidos antes de bloquear a conta
const LOCK_MINUTES = 15;
const IP_LIMIT = 20; // tentativas por IP...
const IP_WINDOW = 15 * 60; // ...a cada 15 minutos

/**
 * Hash falso, usado quando o login não existe: assim a resposta demora o
 * mesmo tempo e ninguém descobre quais logins são válidos.
 */
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword(randomDigits(8)));

const tooMany = (retryAfter: number) =>
  NextResponse.json(
    { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
  }

  // 1. Limite por IP
  const ip = getClientIp(request);
  const limit = await rateLimit(`login:ip:${ip}`, IP_LIMIT, IP_WINDOW);
  if (!limit.allowed) return tooMany(limit.retryAfter);

  // 2. Leitura e validação do corpo
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const { login, password } = (body ?? {}) as {
    login?: unknown;
    password?: unknown;
  };

  if (
    typeof login !== "string" ||
    typeof password !== "string" ||
    !/^\d{4,32}$/.test(login) ||
    !/^\d{8,32}$/.test(password)
  ) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  // 3. Busca a conta (somente clientes ativos)
  const [user] = await db
    .select({
      id: users.id,
      role: users.role,
      passwordHash: users.passwordHash,
      lockedUntil: users.lockedUntil,
    })
    .from(users)
    .where(
      and(
        eq(users.login, login),
        eq(users.role, "client"),
        eq(users.active, true),
      ),
    )
    .limit(1);

  if (!user) {
    await verifyPassword(password, await getDummyHash());
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  // 4. Conta bloqueada por excesso de erros
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return tooMany(
      Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000),
    );
  }

  // 5. Confere a senha
  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    const [updated] = await db
      .update(users)
      .set({ failedAttempts: sql`${users.failedAttempts} + 1` })
      .where(eq(users.id, user.id))
      .returning({ failedAttempts: users.failedAttempts });

    if (updated && updated.failedAttempts >= MAX_FAILED) {
      await db
        .update(users)
        .set({
          failedAttempts: 0,
          lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60 * 1000),
        })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  // 6. Sucesso: zera as tentativas e abre a sessão
  await db
    .update(users)
    .set({ failedAttempts: 0, lockedUntil: null })
    .where(eq(users.id, user.id));

  await createSession({ id: user.id, role: user.role });

  return NextResponse.json({ redirect: "/cliente/galeria" });
}