"use client";

import { useState, useTransition } from "react";
import { deleteGallery } from "@/lib/admin/gallery-actions";

export default function GalleryDeleteButton({
  galleryId,
  title,
  photoCount,
}: {
  galleryId: string;
  title: string;
  photoCount: number;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    const text =
      photoCount > 0
        ? `Excluir a galeria "${title}" e as ${photoCount} foto(s)? Isso não pode ser desfeito.`
        : `Excluir a galeria "${title}"?`;
    if (!window.confirm(text)) return;

    start(async () => {
      setError(null);
      const result = await deleteGallery(galleryId); // redireciona se der certo
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn--danger btn--sm"
        onClick={onClick}
        disabled={pending}
      >
        {pending ? "Excluindo…" : "Excluir galeria"}
      </button>
      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
