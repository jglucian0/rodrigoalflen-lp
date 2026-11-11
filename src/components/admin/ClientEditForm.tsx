"use client";

import { useActionState } from "react";
import { updateClient } from "@/lib/admin/client-actions";
import type { ActionState } from "@/lib/admin/types";

interface ClientEditFormProps {
  userId: string;
  name: string;
  email: string;
}

export default function ClientEditForm({
  userId,
  name,
  email,
}: ClientEditFormProps) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateClient.bind(null, userId),
    null,
  );

  return (
    <form action={action} className="adm-form">
      <label className="field">
        <span>Nome</span>
        <input
          name="name"
          type="text"
          required
          maxLength={120}
          defaultValue={name}
        />
      </label>

      <label className="field">
        <span>E-mail</span>
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          defaultValue={email}
        />
      </label>

      {state?.error && (
        <p className="form__error" role="alert">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p className="adm-ok" role="status">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        className="btn btn--dark btn--sm"
        disabled={pending}
      >
        {pending ? "Salvando…" : "Salvar dados"}
      </button>
    </form>
  );
}
