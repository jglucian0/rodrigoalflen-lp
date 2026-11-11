import { Resend } from "resend";

interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: Mail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!key || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY e EMAIL_FROM precisam estar configurados.");
    }
    // Desenvolvimento sem chave: mostra o e-mail no terminal
    console.log(`\n[e-mail simulado]\nPara: ${to}\nAssunto: ${subject}\n\n${text}\n`);
    return;
  }

  const { error } = await new Resend(key).emails.send({
    from,
    to,
    subject,
    html,
    text,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

/** Endereço público do site, vindo do ambiente (nunca do cabeçalho da requisição) */
export function appUrl() {
  const url = process.env.APP_URL;
  if (!url) throw new Error("APP_URL não definida (.env.local).");
  return url.replace(/\/+$/, "");
}