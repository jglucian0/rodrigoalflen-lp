import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import GalleryViewer from "@/components/cliente/GalleryViewer";
import LogoutButton from "@/components/cliente/LogoutButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { DownloadIcon } from "@/components/ui/Icons";
import { requireClient } from "@/lib/auth/guards";
import { formatBytes, formatDateBR } from "@/lib/format";
import { findClientGallery, listGalleryPhotos } from "@/lib/gallery/access";
import { planZipParts } from "@/lib/gallery/zip-plan";
import { site, whatsappLink } from "@/lib/site";
import SharePanel from "@/components/cliente/SharePanel";
import { listShareLinks } from "@/lib/gallery/share";

export const instant = false;

export const metadata: Metadata = {
  title: `Minha galeria | ${site.name}`,
  robots: { index: false, follow: false },
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = { params: Promise<{ id: string }> };

async function GalleryContent({ params }: Props) {
  const user = await requireClient();

  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const gallery = await findClientGallery(id, user.id);
  if (!gallery) notFound();

  const photos = gallery.expired ? [] : await listGalleryPhotos(id);
  const parts = planZipParts(photos);
  const shareLinks = gallery.expired
    ? []
    : (await listShareLinks(id)).map((link) => ({
        id: link.id,
        label: link.label,
        createdText: formatDateBR(link.createdAt),
        expiresText: link.expiresAt
          ? `Até ${formatDateBR(link.expiresAt)}`
          : "Até a galeria expirar",
        expired: link.expired,
        views: link.viewCount,
        lastViewedText: link.lastViewedAt
          ? formatDateBR(link.lastViewedAt)
          : null,
      }));
  const sum = (list: { sizeBytes: number }[]) =>
    list.reduce((acc, p) => acc + p.sizeBytes, 0);

  return (
    <>
      <section className="gal-hero">
        <div className="container">
          <nav className="legal-crumbs" aria-label="Você está em">
            <Link href="/cliente/galeria">Minhas galerias</Link>
            <span aria-hidden>/</span>
            <span aria-current="page">{gallery.title}</span>
          </nav>

          <span className="eyebrow">Sua galeria</span>
          <h1 className="section-title">{gallery.title}</h1>

          <p className="gal-meta">
            {gallery.eventDate && (
              <span>{formatDateBR(gallery.eventDate)}</span>
            )}
            {!gallery.expired && (
              <span>
                {photos.length} foto{photos.length === 1 ? "" : "s"}
              </span>
            )}
            <span>
              {gallery.expired
                ? `Expirou em ${formatDateBR(gallery.expiresAt)}`
                : `Disponível até ${formatDateBR(gallery.expiresAt)} (${gallery.daysLeft} dia${gallery.daysLeft === 1 ? "" : "s"})`}
            </span>
          </p>

          <div className="gal-actions">
            {!gallery.expired &&
              photos.length > 0 &&
              gallery.allowDownload &&
              parts.length === 1 && (
                <a
                  href={`/api/cliente/galerias/${gallery.id}/zip?part=1`}
                  download
                  className="btn btn--dark"
                >
                  <DownloadIcon /> Baixar tudo ({formatBytes(sum(photos))})
                </a>
              )}
            <LogoutButton />
          </div>

          {!gallery.expired &&
            photos.length > 0 &&
            gallery.allowDownload &&
            parts.length > 1 && (
              <div className="gal-parts">
                <p>
                  São muitas fotos, então o download é dividido em{" "}
                  {parts.length} partes. Baixe uma de cada vez:
                </p>
                <ul>
                  {parts.map((part, i) => (
                    <li key={i}>
                      <a
                        href={`/api/cliente/galerias/${gallery.id}/zip?part=${i + 1}`}
                        download
                        className="btn btn--outline btn--sm"
                      >
                        <DownloadIcon /> Parte {i + 1} · {part.length} fotos ·{" "}
                        {formatBytes(sum(part))}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {!gallery.expired && photos.length > 0 && !gallery.allowDownload && (
            <p className="gal-hint">
              Esta galeria é somente para visualização. Para receber os
              arquivos,{" "}
              <a
                href={whatsappLink(
                  `Olá! Gostaria de receber as fotos da galeria "${gallery.title}".`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                fale com a gente
              </a>
              .
            </p>
          )}
        </div>
      </section>

      {!gallery.expired && photos.length > 0 && (
        <section className="gal-share" id="compartilhar">
          <div className="container">
            <SharePanel
              galleryId={gallery.id}
              galleryTitle={gallery.title}
              links={shareLinks}
            />
          </div>
        </section>
      )}

      <section className="gal-body">
        <div className="container">
          {gallery.expired ? (
            <div className="gal-notice">
              <h2>Esta galeria expirou</h2>
              <p>
                O prazo de acesso terminou em {formatDateBR(gallery.expiresAt)}.
                Se você ainda precisa das fotos, fale com a gente: podemos
                reativar o acesso.
              </p>
              <a
                href={whatsappLink(
                  `Olá! A minha galeria "${gallery.title}" expirou e preciso do acesso de novo.`,
                )}
                className="btn btn--dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>
          ) : photos.length === 0 ? (
            <div className="gal-notice">
              <h2>Suas fotos estão sendo preparadas</h2>
              <p>Assim que estiverem prontas, elas aparecem aqui.</p>
            </div>
          ) : (
            <GalleryViewer
              photos={photos}
              allowDownload={gallery.allowDownload}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default function GalleryPage({ params }: Props) {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Suspense
          fallback={
            <div
              className="gal-hero"
              aria-busy="true"
              style={{ minHeight: 420 }}
            />
          }
        >
          <GalleryContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
