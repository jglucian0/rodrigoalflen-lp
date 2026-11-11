"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { EyeIcon, EyeOffIcon, LockIcon } from "../ui/Icons";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && typeof data.redirect === "string") {
        window.location.assign(data.redirect);
        return;
      }
      setError(data.error ?? "E-mail ou senha incorretos.");
    } catch {
      setError("Não foi possível entrar agora. Tente novamente em instantes.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <label className="field">
        <span>E-mail</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Senha</span>
        <div className="cl-pass">
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="cl-pass__toggle"
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={show}
            onClick={() => setShow((v) => !v)}
          >
            {show ? (
              <EyeOffIcon width={17} height={17} />
            ) : (
              <EyeIcon width={17} height={17} />
            )}
          </button>
        </div>
      </label>

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--dark" disabled={loading}>
        <LockIcon width={13} height={13} />
        {loading ? "Entrando…" : "Entrar"}
      </button>

      <Link href="/cliente/recuperar-senha" className="cl-form__forgot">
        Esqueci minha senha
      </Link>
    </form>
  );
}
