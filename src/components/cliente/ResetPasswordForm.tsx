"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  CLIENT_PASSWORD_MIN,
  validateNewPassword,
  type Role,
} from "@/lib/security/password-rules";
import { CheckIcon, EyeIcon, EyeOffIcon } from "../ui/Icons";

/** 8 números aleatórios (crypto do navegador) */
function suggestPassword() {
  const values = new Uint32Array(8);
  crypto.getRandomValues(values);
  return Array.from(values, (n) => n % 10).join("");
}

export default function ResetPasswordForm({
  token,
  role,
}: {
  token: string;
  role: Role;
}) {
  const isClient = role === "client";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);

  const clean = (value: string) =>
    isClient ? value.replace(/\D/g, "") : value;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const problem = validateNewPassword(role, password);
    if (problem) return setError(problem);
    if (password !== confirm) return setError("As senhas não são iguais.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cliente/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setRedirect(
          typeof data.redirect === "string" ? data.redirect : "/cliente",
        );
        return;
      }
      if (data.code === "invalid_link") setExpired(true);
      setError(data.error ?? "Não foi possível salvar. Tente novamente.");
    } catch {
      setError("Não foi possível salvar agora. Tente novamente em instantes.");
    }
    setLoading(false);
  };

  if (redirect) {
    return (
      <div className="auth__ok">
        <span className="auth__ok-ico">
          <CheckIcon width={20} height={20} />
        </span>
        <h2>Senha alterada</h2>
        <p>Pronto! Agora você já pode entrar com a nova senha.</p>
        <a href={redirect} className="btn btn--dark" style={{ marginTop: 20 }}>
          Ir para o login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <label className="field">
        <span>Nova senha</span>
        <div className="cl-pass">
          <input
            name="password"
            type={show ? "text" : "password"}
            inputMode={isClient ? "numeric" : undefined}
            autoComplete="new-password"
            placeholder={
              isClient
                ? `Pelo menos ${CLIENT_PASSWORD_MIN} números`
                : "Pelo menos 12 caracteres"
            }
            required
            value={password}
            onChange={(e) => setPassword(clean(e.target.value))}
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

      <label className="field">
        <span>Repita a nova senha</span>
        <input
          name="confirm"
          type={show ? "text" : "password"}
          inputMode={isClient ? "numeric" : undefined}
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(clean(e.target.value))}
        />
      </label>

      {isClient && (
        <p className="auth__hint">
          Use só números, evitando sequências como 12345678.{" "}
          <button
            type="button"
            className="auth__suggest"
            onClick={() => {
              const next = suggestPassword();
              setPassword(next);
              setConfirm(next);
              setShow(true);
              setError(null);
            }}
          >
            Sugerir uma senha
          </button>
          . Anote antes de salvar.
        </p>
      )}

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      {expired && (
        <Link href="/cliente/recuperar-senha" className="auth__link">
          Pedir um novo link
        </Link>
      )}

      <button type="submit" className="btn btn--dark" disabled={loading}>
        {loading ? "Salvando…" : "Salvar nova senha"}
      </button>
    </form>
  );
}
