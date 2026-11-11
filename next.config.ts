import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// O envio de fotos do painel vai direto do navegador para o R2
const r2 = process.env.R2_ACCOUNT_ID
  ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  : "";

/**
 * Política de conteúdo (só em produção: o modo de desenvolvimento do Next
 * precisa de recursos que ela bloquearia).
 * Se um dia adicionar Google Analytics, YouTube etc., inclua os domínios aqui.
 * Sintoma de algo faltando: "Refused to load..." no console do navegador.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self' ${r2}`.trim(),
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
  // Só vale em HTTPS: obriga o navegador a usar sempre a versão segura do site
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** Áreas privadas: fora de buscadores, mesmo que alguém coloque o link em algum lugar */
const noIndex = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80],
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  poweredByHeader: false, // não anuncia que o site usa Next.js
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: noIndex },
      { source: "/cliente/galeria/:path*", headers: noIndex },
      { source: "/cliente/recuperar-senha", headers: noIndex },
      { source: "/cliente/redefinir-senha", headers: noIndex },
      { source: "/ver/:path*", headers: noIndex },
      { source: "/api/:path*", headers: noIndex },
    ];
  },
};

export default nextConfig;