"use client";

import { useState, useTransition } from "react";
import {
  deleteClient,
  resetClientPassword,
  setClientActive,
} from "@/lib/admin/client-actions";
import type { ActionState, Credentials } from "@/lib/admin/types";
import CredentialsCard from "./CredentialsCard";

interface ClientActionsProps {
  userId: string;
  name: string;
  active: boolean;
  galleryCount: number;
}

export default function ClientActions({
  userId,
  name,
  active,
  galleryCount,
}: ClientActionsProps) {
  const [pending, startTransition] = useTransition();
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  const run = (task: () => Promise<ActionState>) =>
    startTransition(async () => {
      setFeedback(null);
      const result = await task();
      if (result?.error) setFeedback({ type: "error", text: result.error });
      if (result?.message) setFeedback({ type: "ok", text: result.message });
      if (result?.credentials) setCredentials(result.credentials);
    });

  return (
    <div className="adm-actions">
      <button
        type="button"
        className="btn btn--outline btn--sm"
        disabled={pending}
        onClick={() => {
          if (
            window.confirm(
              `Gerar uma nova senha para ${name}? A senha atual deixa de funcionar e o cliente é desconectado.`,
            )
          ) {
            run(() => resetClientPassword(userId));
          }
        }}
      >
        Gerar nova senha
      </button>

      <button
        type="button"
        className="btn btn--outline btn--sm"
        disabled={pending}
        onClick={() => {
          if (
            active &&
            !window.confirm(
              `Desativar o acesso de ${name}? Ele será desconectado agora.`,
            )
          ) {
            return;
          }
          run(() => setClientActive(userId, !active));
        }}
      >
        {active ? "Desativar acesso" : "Reativar acesso"}
      </button>

      <button
        type="button"
        className="btn btn--danger btn--sm"
        disabled={pending || galleryCount > 0}
        title={galleryCount > 0 ? "Exclua as galerias primeiro" : undefined}
        onClick={() => {
          if (
            window.confirm(
              `Excluir ${name} definitivamente? Isso não pode ser desfeito.`,
            )
          ) {
            run(() => deleteClient(userId));
          }
        }}
      >
        Excluir cliente
      </button>

      {galleryCount > 0 && (
        <p className="adm-muted">
          Para excluir, remova antes as galerias do cliente.
        </p>
      )}

      {feedback && (
        <p
          className={feedback.type === "error" ? "form__error" : "adm-ok"}
          role="status"
        >
          {feedback.text}
        </p>
      )}

      {credentials && (
        <CredentialsCard credentials={credentials} title="Nova senha gerada" />
      )}
    </div>
  );
}
