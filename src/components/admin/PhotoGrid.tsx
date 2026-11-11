"use client";

import { useState, useTransition } from "react";
import {
  deletePhotos,
  movePhotosToStart,
  setCoverPhoto,
  sortPhotosByName,
} from "@/lib/admin/gallery-actions";
import type { ActionState } from "@/lib/admin/types";

interface PhotoGridProps {
  galleryId: string;
  coverId: string | null;
  photos: { id: string; filename: string }[];
}

export default function PhotoGrid({
  galleryId,
  coverId,
  photos,
}: PhotoGridProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, start] = useTransition();
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const run = (task: () => Promise<ActionState>, clearSelection = false) =>
    start(async () => {
      setFeedback(null);
      const result = await task();
      if (result?.error) setFeedback({ ok: false, text: result.error });
      else {
        if (result?.message) setFeedback({ ok: true, text: result.message });
        if (clearSelection) setSelected(new Set());
      }
    });

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (photos.length === 0) {
    return (
      <p className="adm-muted">
        Nenhuma foto ainda. Envie as fotos no quadro acima.
      </p>
    );
  }

  const ids = Array.from(selected);

  return (
    <div>
      <div className="adm-toolbar">
        <button
          type="button"
          className="auth__link"
          onClick={() =>
            setSelected(
              selected.size === photos.length
                ? new Set()
                : new Set(photos.map((p) => p.id)),
            )
          }
        >
          {selected.size === photos.length
            ? "Limpar seleção"
            : "Selecionar tudo"}
        </button>

        <span className="adm-toolbar__count">
          {selected.size > 0
            ? `${selected.size} selecionada(s)`
            : `${photos.length} foto(s)`}
        </span>

        <div className="adm-toolbar__actions">
          {selected.size > 0 ? (
            <>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                disabled={pending}
                onClick={() =>
                  run(() => movePhotosToStart(galleryId, ids), true)
                }
              >
                Mover para o início
              </button>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                disabled={pending}
                onClick={() => {
                  if (
                    window.confirm(
                      `Excluir ${selected.size} foto(s)? Isso não pode ser desfeito.`,
                    )
                  ) {
                    run(() => deletePhotos(galleryId, ids), true);
                  }
                }}
              >
                Excluir
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              disabled={pending}
              onClick={() => run(() => sortPhotosByName(galleryId))}
            >
              Ordenar por nome
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <p className={feedback.ok ? "adm-ok" : "form__error"} role="status">
          {feedback.text}
        </p>
      )}

      <ul className="adm-photos" aria-busy={pending}>
        {photos.map((photo) => {
          const isSelected = selected.has(photo.id);
          return (
            <li
              key={photo.id}
              className={`adm-photo ${isSelected ? "is-selected" : ""}`}
            >
              <label className="adm-photo__check">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(photo.id)}
                  aria-label={`Selecionar ${photo.filename}`}
                />
              </label>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/admin/fotos/${photo.id}/thumb`}
                alt={photo.filename}
                loading="lazy"
              />

              {coverId === photo.id && (
                <span className="adm-photo__cover">Capa</span>
              )}

              <div className="adm-photo__bar">
                <a
                  href={`/api/admin/fotos/${photo.id}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver
                </a>
                {coverId !== photo.id && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      run(() => setCoverPhoto(galleryId, photo.id))
                    }
                  >
                    Capa
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
