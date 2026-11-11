"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createClient } from "@/lib/admin/client-actions";
import type { ActionState } from "@/lib/admin/types";
import CredentialsCard from "./CredentialsCard";

export default function ClientCreateForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createClient,
    null,
  );

  return (
    <>
      {state?.credentials && (
        <>
          <CredentialsCard
            credentials={state.credentials}
            title="Cliente cadastrado"
          />
          <div className="adm-links">
            {state.clientId && (
              <Link
                href={`/admin/clientes/${state.clientId}`}
                className="auth__link"
              >
                Abrir cliente
              </Link>
            )}
            {/* link comum: recarrega a página e limpa o formulário */}
            <a href="/admin/clientes/novo" className="auth__link">
              Cadastrar outro
            </a>
          </div>
        </>
      )}

      {!state?.credentials && (
        <form action={action} className="adm-card adm-form">
          <label className="field">
            <span>Nome do cliente (ou do casal)</span>
            <input
              name="name"
              type="text"
              required
              maxLength={120}
              placeholder="Camila & Fernando"
            />
          </label>

          <label className="field">
            <span>E-mail (usado para recuperar a senha)</span>
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              placeholder="cliente@exemplo.com"
            />
          </label>

          <p className="adm-muted">
            O login e a senha (8 números cada) são gerados automaticamente e
            mostrados na próxima tela.
          </p>

          {state?.error && (
            <p className="form__error" role="alert">
              {state.error}
            </p>
          )}

          <button type="submit" className="btn btn--dark" disabled={pending}>
            {pending ? "Cadastrando…" : "Cadastrar cliente"}
          </button>
        </form>
      )}
    </>
  );
}
