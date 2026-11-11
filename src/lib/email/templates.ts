import { greetingName } from "@/lib/names";
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

interface ResetEmailInput {
  name: string;
  /** Login numérico do cliente (nulo para o administrador) */
  login: string | null;
  link: string;
  brand: string;
}

export function passwordResetEmail({ name, login, link, brand }: ResetEmailInput) {
  const subject = `Redefinir sua senha — ${brand}`;
  const first = greetingName(name);

  const text = [
    `Olá, ${first}!`,
    "",
    "Recebemos um pedido para criar uma nova senha de acesso às suas fotos.",
    login ? `Seu login de acesso: ${login}` : "",
    "",
    "Para criar a nova senha, abra o link (vale por 1 hora e só funciona uma vez):",
    link,
    "",
    "Se você não pediu isso, ignore este e-mail: sua senha continua a mesma.",
    "",
    brand,
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");

  const html = `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#faf6f1;">
    <div style="max-width:520px;margin:0 auto;padding:40px 24px;font-family:Helvetica,Arial,sans-serif;color:#7d6c60;">
      <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:22px;color:#3e2a1f;">${escapeHtml(brand)}</p>
      <div style="background:#ffffff;border:1px solid #eadccb;padding:32px 28px;">
        <h1 style="margin:0 0 14px;font-family:Georgia,serif;font-weight:400;font-size:26px;line-height:1.2;color:#3e2a1f;">Olá, ${escapeHtml(first)}!</h1>
        <p style="margin:0 0 18px;font-size:14px;line-height:24px;">Recebemos um pedido para criar uma nova senha de acesso às suas fotos.</p>
        ${login
      ? `<p style="margin:0 0 22px;font-size:14px;line-height:24px;">Seu login de acesso: <strong style="color:#3e2a1f;font-size:16px;letter-spacing:1px;">${escapeHtml(login)}</strong></p>`
      : ""
    }
        <a href="${link}" style="display:inline-block;background:#3e2a1f;color:#ffffff;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:15px 28px;">Criar nova senha</a>
        <p style="margin:22px 0 0;font-size:12px;line-height:20px;">O link vale por 1 hora e só funciona uma vez. Se o botão não abrir, copie este endereço no navegador:<br><span style="word-break:break-all;color:#a8825d;">${link}</span></p>
      </div>
      <p style="margin:22px 0 0;font-size:12px;line-height:20px;">Se você não pediu isso, ignore este e-mail: sua senha continua a mesma.</p>
    </div>
  </body>
</html>`;

  return { subject, html, text };
}