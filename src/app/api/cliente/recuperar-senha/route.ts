import { and, eq } from "drizzle-orm";
import { after, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createResetToken } from "@/lib/auth/password-reset";
import { appUrl, sendEmail } from "@/lib/email/send";
import { passwordResetEmail } from "@/lib/email/templates";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/security/request";
import { site } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
  }

  // Limite por IP (a resposta de limite não revela nada sobre contas)
  const ip = getClientIp(request);
  const ipLimit = await rateLimit(`reset:ip:${ip}`, 10, 60 * 60);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde um pouco e tente novamente." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const raw = (body as { email?: unknown } | null)?.email;
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  // Resposta única: igual exista ou não uma conta com esse e-mail
  const OK = NextResponse.json({ ok: true });

  // Limite por e-mail: acima disso não envia nada, mas responde igual
  const emailLimit = await rateLimit(`reset:email:${email}`, 3, 60 * 60);
  if (!emailLimit.allowed) return OK;

  const [user] = await db
    .select({ id: users.id, name: users.name, login: users.login, email: users.email })
    .from(users)
    .where(and(eq(users.email, email), eq(users.active, true)))
    .limit(1);

  if (!user) return OK;

  // O trabalho pesado acontece DEPOIS da resposta: o tempo não entrega se a conta existe
  after(async () => {
    try {
      const token = await createResetToken(user.id);
      const link = `${appUrl()}/cliente/redefinir-senha?token=${token}`;
      const mail = passwordResetEmail({
        name: user.name,
        login: user.login,
        link,
        brand: site.name,
      });
      await sendEmail({ to: user.email, ...mail });
    } catch (error) {
      console.error("[recuperar-senha]", error);
    }
  });

  return OK;
}