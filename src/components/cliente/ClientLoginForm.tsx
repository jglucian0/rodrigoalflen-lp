"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { whatsappLink } from "@/lib/site";
import { EyeIcon, EyeOffIcon, LockIcon, WhatsappIcon } from "../ui/Icons";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export default function ClientLoginForm() {
  const [login, setLogin] = useState("");
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
      const res = await fetch("/api/cliente/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && typeof data.redirect === "string") {
        window.location.assign(data.redirect); // vai para a área protegida
        return;
      }
      setError(data.error ?? "Login ou senha incorretos.");
    } catch {
      setError("Não foi possível entrar agora. Tente novamente em instantes.");
    }
    setLoading(false);
  };

  return (
    <form className="cl-form" onSubmit={onSubmit}>
      <span className="cl-form__script">bem-vindo de volta</span>
      <h2 className="cl-form__title">Acessar minhas fotos</h2>

      <label className="field">
        <span>Login</span>
        <input
          name="login"
          type="text"
          inputMode="numeric"
          autoComplete="username"
          placeholder="Seu número de login"
          required
          value={login}
          onChange={(e) => setLogin(onlyDigits(e.target.value))}
        />
      </label>

      <label className="field">
        <span>Senha</span>
        <div className="cl-pass">
          <input
            name="password"
            type={show ? "text" : "password"}
            inputMode="numeric"
            autoComplete="current-password"
            placeholder="Sua senha numérica"
            required
            value={password}
            onChange={(e) => setPassword(onlyDigits(e.target.value))}
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
        {loading ? "Entrando…" : "Acessar minhas fotos"}
      </button>

      <Link href="/cliente/recuperar-senha" className="cl-form__forgot">
        Esqueci minha senha
      </Link>

      <a
        href={whatsappLink(
          "Olá! Preciso de ajuda com o acesso à minha galeria.",
        )}
        className="cl-form__help"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsappIcon width={14} height={14} />
        Precisa de ajuda? Fale com a gente
      </a>
    </form>
  );
}
