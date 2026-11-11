"use client";

import { useActionState } from "react";
import { updateGallery } from "@/lib/admin/gallery-actions";
import type { ActionState } from "@/lib/admin/types";

interface GallerySettingsFormProps {
  galleryId: string;
  title: string;
  eventDate: string | null;
  expiresAt: string; // YYYY-MM-DD
  allowDownload: boolean;
}

export default function GallerySettingsForm({
  galleryId,
  title,
  eventDate,
  expiresAt,
  allowDownload,
}: GallerySettingsFormProps) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateGallery.bind(null, galleryId),
    null,
  );

  return (
    <form action={action} className="adm-form">
      <label className="field">
        <span>Título</span>
        <input
          name="title"
          type="text"
          required
          maxLength={120}
          defaultValue={title}
        />
      </label>

      <div className="adm-frow">
        <label className="field">
          <span>Data do evento</span>
          <input name="eventDate" type="date" defaultValue={eventDate ?? ""} />
        </label>
        <label className="field">
          <span>Disponível até</span>
          <input
            name="expiresAt"
            type="date"
            required
            defaultValue={expiresAt}
          />
        </label>
      </div>

      <label className="adm-check">
        <input
          name="allowDownload"
          type="checkbox"
          defaultChecked={allowDownload}
        />
        <span>
          Permitir que o cliente baixe as fotos
          <small>Desmarcado, ele só poderá visualizar.</small>
        </span>
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
        {pending ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
