"use client";

import { useState, type FormEvent } from "react";
import { MailIcon } from "../ui/Icons";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cliente/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) setSent(true);
      else
        setError(
          data.error ?? "Não foi possível enviar agora. Tente novamente.",
        );
    } catch {
      setError("Não foi possível enviar agora. Tente novamente em instantes.");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="auth__ok">
        <span className="auth__ok-ico">
          <MailIcon width={20} height={20} />
        </span>
        <h2>Confira seu e-mail</h2>
        <p>
          Se <strong>{email}</strong> estiver cadastrado, enviamos o link para
          criar uma nova senha (e o seu login). Ele vale por 1 hora. Não achou?
          Olhe também a caixa de spam.
        </p>
        <button
          type="button"
          className="auth__link"
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
        >
          Usar outro e-mail
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <label className="field">
        <span>E-mail cadastrado</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--dark" disabled={loading}>
        {loading ? "Enviando…" : "Enviar link"}
      </button>
    </form>
  );
}
