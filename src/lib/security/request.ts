/** IP do visitante (a hospedagem preenche esses cabeçalhos) */
export function getClientIp(request: Request): string {
  return ipFromHeaders(request.headers);
}

/** IP do visitante a partir dos cabeçalhos (a hospedagem preenche esses campos) */
export function ipFromHeaders(headers: Headers): string {
  const real = headers.get("x-real-ip");
  if (real) return real.trim();

  const forwarded = headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}



/** Barra requisições vindas de outros sites (proteção contra CSRF) */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
