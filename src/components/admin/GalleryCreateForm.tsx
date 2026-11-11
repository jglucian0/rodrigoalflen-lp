"use client";

import { useActionState } from "react";
import { createGallery } from "@/lib/admin/gallery-actions";
import type { ActionState } from "@/lib/admin/types";

export default function GalleryCreateForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createGallery.bind(null, userId),
    null,
  );

  return (
    <form action={action} className="adm-form adm-gform">
      <label className="field">
        <span>Título da galeria</span>
        <input
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder="Casamento"
        />
      </label>

      <label className="field">
        <span>Data do evento (opcional)</span>
        <input name="eventDate" type="date" />
      </label>

      <button
        type="submit"
        className="btn btn--dark btn--sm"
        disabled={pending}
      >
        {pending ? "Criando…" : "Criar galeria"}
      </button>

      {state?.error && (
        <p className="form__error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
