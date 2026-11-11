"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createShareLink,
  revokeShareLink,
  type ShareState,
} from "@/lib/gallery/share-actions";

export interface ShareLinkItem {
  id: string;
  label: string;
  createdText: string;
  expiresText: string;
  expired: boolean;
  views: number;
  lastViewedText: string | null;
}

interface SharePanelProps {
  galleryId: string;
  galleryTitle: string;
  links: ShareLinkItem[];
}

export default function SharePanel({
  galleryId,
  galleryTitle,
  links,
}: SharePanelProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const [revoking, startRevoke] = useTransition();
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const [state, action, pending] = useActionState<ShareState, FormData>(
    createShareLink.bind(null, galleryId),
    null,
  );

  const link = state?.link && state.link !== dismissed ? state.link : null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copie o link:", text);
    }
  };

  const whatsapp = (url: string) =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Olá! Veja as fotos do nosso "${galleryTitle}": ${url}`,
      )}`,
      "_blank",
      "noopener,noreferrer",
    );

  const revoke = (item: ShareLinkItem) => {
    if (
      !window.confirm(
        `Desativar o link "${item.label}"? Quem tiver esse link deixa de ver as fotos.`,
      )
    ) {
      return;
    }
    startRevoke(async () => {
      setFeedback(null);
      const result = await revokeShareLink(galleryId, item.id);
      if (result?.error) setFeedback({ ok: false, text: result.error });
      if (result?.message) setFeedback({ ok: true, text: result.message });
    });
  };

  return (
    <div className="shr">
      <div className="shr__head">
        <div>
          <h2>Compartilhar com a família</h2>
          <p>
            Gere um link para quem você quiser ver as fotos, sem precisar de
            login. Quem tem o link <strong>só visualiza</strong>: não baixa nem
            altera nada. Você pode desativar quando quiser.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Gerar link"}
        </button>
      </div>

      {open && (
        <form action={action} className="shr__form">
          <label className="field">
            <span>Para quem é este link? (só para você lembrar)</span>
            <input
              name="label"
              type="text"
              maxLength={60}
              placeholder="Ex.: Tia Marta"
            />
          </label>

          <label className="field">
            <span>Validade do link</span>
            <select name="duration" defaultValue="30">
              <option value="7">7 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
              <option value="gallery">Até a galeria expirar</option>
            </select>
          </label>

          <button
            type="submit"
            className="btn btn--dark btn--sm"
            disabled={pending}
          >
            {pending ? "Gerando…" : "Gerar link"}
          </button>

          {state?.error && (
            <p className="form__error" role="alert">
              {state.error}
            </p>
          )}
        </form>
      )}

      {link && (
        <div className="shr__result" role="status">
          <p className="shr__note">
            Copie agora:{" "}
            <strong>
              por segurança, o link completo aparece só desta vez.
            </strong>{" "}
            Se perder, desative e gere outro.
          </p>
          <input
            className="shr__url"
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Link de visualização"
          />
          <div className="shr__actions">
            <button
              type="button"
              className="btn btn--dark btn--sm"
              onClick={() => copy(link)}
            >
              {copied ? "Copiado ✓" : "Copiar link"}
            </button>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => whatsapp(link)}
            >
              Enviar por WhatsApp
            </button>
            <button
              type="button"
              className="auth__link"
              onClick={() => setDismissed(link)}
            >
              Pronto, já copiei
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <p className={feedback.ok ? "adm-ok" : "form__error"} role="status">
          {feedback.text}
        </p>
      )}

      {links.length > 0 && (
        <ul className="shr__list">
          {links.map((item) => (
            <li key={item.id} className="shr__item">
              <div>
                <strong>{item.label}</strong>
                <small>
                  Criado em {item.createdText} ·{" "}
                  {item.expired ? "Vencido" : item.expiresText} · {item.views}{" "}
                  visualização{item.views === 1 ? "" : "ões"}
                  {item.lastViewedText
                    ? ` · último acesso em ${item.lastViewedText}`
                    : ""}
                </small>
              </div>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                disabled={revoking}
                onClick={() => revoke(item)}
              >
                Desativar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
