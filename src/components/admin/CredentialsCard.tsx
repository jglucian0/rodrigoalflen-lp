"use client";

import { useState } from "react";
import type { Credentials } from "@/lib/admin/types";

export default function CredentialsCard({
  credentials,
  title = "Acesso criado",
}: {
  credentials: Credentials;
  title?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      window.prompt("Copie manualmente:", value);
    }
  };

  const message = () => {
    const first = credentials.name.split(" ")[0];
    return [
      `Olá, ${first}! Seu acesso à área do cliente foi criado.`,
      "",
      `Acesse: ${window.location.origin}/cliente`,
      `Login: ${credentials.login}`,
      `Senha: ${credentials.password}`,
      "",
      "Guarde esses dados com cuidado. Se esquecer, use “Esqueci minha senha” na página de acesso.",
    ].join("\n");
  };

  return (
    <div className="adm-cred" role="status">
      <h2>{title}</h2>
      <p className="adm-muted">
        Anote ou copie agora: <strong>a senha aparece só desta vez</strong> e
        não fica salva.
      </p>

      <dl>
        <div className="adm-cred__item">
          <div>
            <dt>Login</dt>
            <dd>{credentials.login}</dd>
          </div>
          <button
            type="button"
            className="auth__link"
            onClick={() => copy("login", credentials.login)}
          >
            {copied === "login" ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
        <div className="adm-cred__item">
          <div>
            <dt>Senha</dt>
            <dd>{credentials.password}</dd>
          </div>
          <button
            type="button"
            className="auth__link"
            onClick={() => copy("senha", credentials.password)}
          >
            {copied === "senha" ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
      </dl>

      <div className="adm-cred__actions">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => copy("msg", message())}
        >
          {copied === "msg" ? "Mensagem copiada ✓" : "Copiar mensagem"}
        </button>
        <button
          type="button"
          className="btn btn--dark btn--sm"
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(message())}`,
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          Enviar por WhatsApp
        </button>
      </div>
    </div>
  );
}
