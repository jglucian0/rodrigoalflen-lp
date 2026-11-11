const REQUIRED = [
  "DATABASE_URL",
  "APP_URL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
] as const;

const errors: string[] = [];
const warnings: string[] = [];

for (const name of REQUIRED) {
  if (!process.env[name]?.trim()) errors.push(`${name} está vazia ou ausente.`);
}

const appUrl = process.env.APP_URL ?? "";
if (appUrl) {
  try {
    const url = new URL(appUrl);
    if (url.protocol !== "https:") errors.push("APP_URL precisa começar com https:// em produção.");
    if (url.pathname !== "/" && url.pathname !== "") warnings.push("APP_URL não deve ter caminho (só o domínio).");
    if (/localhost|127\.0\.0\.1/.test(url.hostname)) errors.push("APP_URL aponta para localhost.");
  } catch {
    errors.push("APP_URL não é um endereço válido.");
  }
}

const db = process.env.DATABASE_URL ?? "";
if (db && !/sslmode=require/.test(db)) warnings.push("DATABASE_URL sem ?sslmode=require.");
if (db && !/-pooler\./.test(db)) {
  warnings.push("DATABASE_URL não parece ser a conexão 'pooled' da Neon (host com -pooler). Use-a em produção.");
}

if ((process.env.EMAIL_FROM ?? "").includes("resend.dev")) {
  warnings.push("EMAIL_FROM usa o remetente de teste do Resend: só entrega para o dono da conta. Use um endereço do seu domínio.");
}

if (process.env.CLIENT_GALLERIES) {
  warnings.push("CLIENT_GALLERIES é do login antigo e não é mais usada. Remova.");
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("\n✔ Variáveis de ambiente OK.\n");
  process.exit(0);
}

if (errors.length > 0) {
  console.log("\n✖ Erros:");
  errors.forEach((e) => console.log(`  - ${e}`));
}
if (warnings.length > 0) {
  console.log("\n⚠ Avisos:");
  warnings.forEach((w) => console.log(`  - ${w}`));
}
console.log("");
process.exit(errors.length > 0 ? 1 : 0);