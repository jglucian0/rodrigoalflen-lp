import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth/session";
import {
  hashPassword,
  randomStrongPassword,
  verifyPassword,
} from "@/lib/security/passwords";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/security/request";

const GENERIC_ERROR = "E-mail ou senha incorretos.";
const MAX_FAILED = 5;
const LOCK_MINUTES = 15;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hash falso: e-mail inexistente demora o mesmo que senha errada
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword(randomStrongPassword()));

const tooMany = (retryAfter: number) =>
  NextResponse.json(
    { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
  }

  // Limite mais rígido que o do cliente: 10 tentativas por IP a cada 15 min
  const ip = getClientIp(request);
  const ipLimit = await rateLimit(`admin-login:ip:${ip}`, 10, 15 * 60);
  if (!ipLimit.allowed) return tooMany(ipLimit.retryAfter);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const { email: rawEmail, password } = (body ?? {}) as {
    email?: unknown;
    password?: unknown;
  };

  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (
    !email ||
    email.length > 254 ||
    !EMAIL_RE.test(email) ||
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 128
  ) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const [user] = await db
    .select({
      id: users.id,
      role: users.role,
      passwordHash: users.passwordHash,
      lockedUntil: users.lockedUntil,
    })
    .from(users)
    .where(
      and(eq(users.email, email), eq(users.role, "admin"), eq(users.active, true)),
    )
    .limit(1);

  if (!user) {
    await verifyPassword(password, await getDummyHash());
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return tooMany(Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000));
  }

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

  await db
    .update(users)
    .set({ failedAttempts: 0, lockedUntil: null })
    .where(eq(users.id, user.id));

  await createSession({ id: user.id, role: user.role });

  return NextResponse.json({ redirect: "/admin" });
}