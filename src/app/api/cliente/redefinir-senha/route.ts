import { NextResponse } from "next/server";
import {
  getResetTokenInfo,
  resetPasswordWithToken,
} from "@/lib/auth/password-reset";
import { hashPassword } from "@/lib/security/passwords";
import { PASSWORD_MAX, validateNewPassword } from "@/lib/security/password-rules";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/security/request";

const INVALID_LINK = {
  error: "Este link é inválido ou já expirou. Peça um novo link.",
  code: "invalid_link",
};

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limit = await rateLimit(`reset-confirm:ip:${ip}`, 10, 15 * 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const { token, password } = (body ?? {}) as {
    token?: unknown;
    password?: unknown;
  };

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 200 ||
    typeof password !== "string" ||
    password.length > PASSWORD_MAX
  ) {
    return NextResponse.json(INVALID_LINK, { status: 400 });
  }

  // 1. O link ainda vale? (também descobre se é cliente ou administrador)
  const info = await getResetTokenInfo(token);
  if (!info) return NextResponse.json(INVALID_LINK, { status: 400 });

  // 2. A senha segue as regras do tipo de conta?
  const problem = validateNewPassword(info.role, password);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  // 3. Troca a senha e consome o link (atômico)
  const user = await resetPasswordWithToken(token, await hashPassword(password));
  if (!user) return NextResponse.json(INVALID_LINK, { status: 400 });

  return NextResponse.json({
    ok: true,
    // /admin passa a existir na Parte 4
    redirect: user.role === "admin" ? "/admin" : "/cliente",
  });
}