import { eq, sql } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { after } from "next/server";
import { Suspense, type ReactNode } from "react";
import GalleryViewer from "@/components/cliente/GalleryViewer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { db } from "@/db";
import { shareLinks } from "@/db/schema";
import { formatDateBR } from "@/lib/format";
import { listGalleryPhotos } from "@/lib/gallery/access";
import { findActiveShare } from "@/lib/gallery/share";
import { rateLimit } from "@/lib/security/rate-limit";
import { ipFromHeaders } from "@/lib/security/request";
import { site } from "@/lib/site";

export const instant = false;

// Página privada: fora do Google, sem cache e sem vazar o endereço para outros sites
export const metadata: Metadata = {
  title: `Fotos compartilhadas | ${site.name}`,
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

type Props = { params: Promise<{ token: string }> };

function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="gal-body gal-body--solo">
      <div className="container">
        <div className="gal-notice">
          <h2>{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

async function SharedContent({ params }: Props) {
  const { token } = await params;

  const ip = ipFromHeaders(await headers());
  const limit = await rateLimit(`share-view:ip:${ip}`, 120, 10 * 60);
  if (!limit.allowed) {
    return (
      <Notice title="Muitos acessos">
        <p>Aguarde alguns minutos e tente abrir o link novamente.</p>
      </Notice>
    );
  }

  const share = await findActiveShare(token);
  if (!share) {
    return (
      <Notice title="Este link não está mais disponível">
        <p>
          Ele pode ter sido desativado ou ter vencido. Peça um novo link a quem
          compartilhou as fotos com você.
        </p>
        <Link href="/" className="btn btn--dark">
          Conhecer o trabalho
        </Link>
      </Notice>
    );
  }

  const photos = await listGalleryPhotos(share.galleryId);

  // Conta a visita depois de responder (não atrasa a página)
  after(async () => {
    try {
      await db
        .update(shareLinks)
        .set({
          viewCount: sql`${shareLinks.viewCount} + 1`,
          lastViewedAt: sql`now()`,
        })
        .where(eq(shareLinks.id, share.linkId));
    } catch (error) {
      console.error("[ver] contagem de visitas", error);
    }
  });

  return (
    <>
      <section className="gal-hero">
        <div className="container">
          <span className="eyebrow">Fotos compartilhadas</span>
          <h1 className="section-title">{share.title}</h1>

          <p className="gal-meta">
            {share.eventDate && <span>{formatDateBR(share.eventDate)}</span>}
            <span>
              {photos.length} foto{photos.length === 1 ? "" : "s"}
            </span>
            <span>Somente visualização</span>
          </p>
          <p className="gal-hint">
            Você recebeu um link para ver estas fotos. Não é preciso entrar em
            nenhuma conta.
          </p>
        </div>
      </section>

      <section className="gal-body">
        <div className="container">
          {photos.length === 0 ? (
            <div className="gal-notice">
              <h2>As fotos ainda estão sendo preparadas</h2>
              <p>Volte em breve para ver.</p>
            </div>
          ) : (
            <GalleryViewer
              photos={photos}
              allowDownload={false}
              protect
              basePath={`/api/ver/${token}/fotos`}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default function SharedPage({ params }: Props) {
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
          <SharedContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
