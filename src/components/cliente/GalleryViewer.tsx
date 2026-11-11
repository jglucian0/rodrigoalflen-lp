"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  DownloadIcon,
} from "../ui/Icons";

interface Photo {
  id: string;
  filename: string;
  width: number;
  height: number;
}

interface GalleryViewerProps {
  photos: Photo[];
  allowDownload: boolean;
  /** Onde ficam as imagens: `${basePath}/${id}/thumb|preview|download` */
  basePath?: string;
  /** Dificulta arrastar e salvar a imagem (é só uma barreira leve) */
  protect?: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function GalleryViewer({
  photos,
  allowDownload,
  basePath = "/api/cliente/fotos",
  protect = false,
}: GalleryViewerProps) {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const total = photos.length;
  const isOpen = open !== null;

  const url = useCallback(
    (id: string, variant: "thumb" | "preview" | "download") =>
      `${basePath}/${id}/${variant}`,
    [basePath],
  );

  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus(); // devolve o foco à miniatura de onde saiu
  }, []);

  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) => (i === null ? i : (i + dir + total) % total)),
    [total],
  );

  // Teclado, trava a rolagem da página e mantém o foco dentro do visualizador
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key === "ArrowRight") return step(1);
      if (e.key === "ArrowLeft") return step(-1);

      if (e.key === "Tab") {
        const nodes =
          dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, step]);

  // Carrega antes a foto anterior e a próxima
  useEffect(() => {
    if (open === null) return;
    for (const dir of [1, -1]) {
      const neighbor = photos[(open + dir + total) % total];
      new Image().src = url(neighbor.id, "preview");
    }
  }, [open, photos, total, url]);

  const current = open !== null ? photos[open] : null;
  const guard = protect ? " is-protected" : "";

  return (
    <>
      <ul className={`gal-photos${guard}`}>
        {photos.map((photo, i) => (
          <li
            key={photo.id}
            className="gal-photo"
            style={{ "--ar": photo.width / photo.height } as CSSProperties}
          >
            <button
              type="button"
              aria-label={`Abrir foto ${i + 1} de ${total}`}
              onClick={(e) => {
                lastFocus.current = e.currentTarget;
                setOpen(i);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url(photo.id, "thumb")}
                alt=""
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                draggable={!protect}
              />
            </button>
          </li>
        ))}
      </ul>

      {current && open !== null && (
        <div
          ref={dialogRef}
          className={`lb${guard}`}
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de fotos"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            // só vale um gesto claramente horizontal
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
              step(dx < 0 ? 1 : -1);
          }}
        >
          <div className="lb__top">
            <span className="lb__count">
              {pad(open + 1)} / {pad(total)}
            </span>
            <div className="lb__actions">
              {allowDownload && (
                <a
                  href={url(current.id, "download")}
                  download
                  className="lb__btn"
                  aria-label="Baixar esta foto"
                >
                  <DownloadIcon width={15} height={15} />
                  <span>Baixar</span>
                </a>
              )}
              <button
                type="button"
                className="lb__btn"
                onClick={close}
                aria-label="Fechar"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>
          </div>

          <div className="lb__stage">
            {total > 1 && (
              <button
                type="button"
                className="lb__nav lb__nav--prev"
                onClick={() => step(-1)}
                aria-label="Foto anterior"
              >
                <ArrowLeftIcon width={18} height={18} />
              </button>
            )}

            {/* key: recria a imagem a cada troca, disparando o fade */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.id}
              className="lb__img"
              src={url(current.id, "preview")}
              alt={`Foto ${open + 1} de ${total}`}
              draggable={false}
            />

            {total > 1 && (
              <button
                type="button"
                className="lb__nav lb__nav--next"
                onClick={() => step(1)}
                aria-label="Próxima foto"
              >
                <ArrowRightIcon width={18} height={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
