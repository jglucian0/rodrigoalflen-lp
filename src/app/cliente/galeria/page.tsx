import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LogoutButton from "@/components/cliente/LogoutButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Placeholder from "@/components/ui/Placeholder";
import { requireClient } from "@/lib/auth/guards";
import { formatDateBR } from "@/lib/format";
import { listClientGalleries } from "@/lib/gallery/access";
import { site, whatsappLink } from "@/lib/site";

export const instant = false;

export const metadata: Metadata = {
  title: `Minhas fotos | ${site.name}`,
  robots: { index: false, follow: false }, // área privada: fora do Google
};

async function Galleries() {
  const user = await requireClient();
  const list = await listClientGalleries(user.id);
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <section className="gal-hero">
        <div className="container">
          <span className="eyebrow">Área do cliente</span>
          <h1 className="section-title">
            Olá, <em>{firstName}</em>
          </h1>
          <p className="legal-hero__lead">
            {list.length > 0
              ? "Escolha uma galeria para ver e baixar as suas fotos."
              : "Suas galerias aparecem aqui assim que estiverem prontas."}
          </p>
          <div className="gal-actions">
            <LogoutButton />
          </div>
        </div>
      </section>

      <section className="gal-body">
        <div className="container">
          {list.length === 0 ? (
            <div className="gal-notice">
              <h2>Ainda não há galerias por aqui</h2>
              <p>
                Quando as suas fotos estiverem prontas, a gente avisa. Se tiver
                alguma dúvida, é só chamar.
              </p>
              <a
                href={whatsappLink(
                  "Olá! Gostaria de saber sobre a minha galeria de fotos.",
                )}
                className="btn btn--dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>
          ) : (
            <ul className="gal-cards">
              {list.map((gallery, i) => (
                <li key={gallery.id}>
                  <Link
                    href={`/cliente/galeria/${gallery.id}`}
                    className="gal-card"
                  >
                    <span className="gal-card__cover">
                      {gallery.coverId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`/api/cliente/fotos/${gallery.coverId}/thumb`}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <Placeholder alt="" ratio="landscape" tone={i} />
                      )}
                    </span>

                    <span className="gal-card__body">
                      <strong>{gallery.title}</strong>
                      <small>
                        {gallery.eventDate
                          ? `${formatDateBR(gallery.eventDate)} · `
                          : ""}
                        {gallery.photoCount} foto
                        {gallery.photoCount === 1 ? "" : "s"}
                      </small>
                      <span
                        className={`adm-badge ${
                          gallery.expired || gallery.daysLeft <= 30
                            ? "adm-badge--off"
                            : "adm-badge--on"
                        }`}
                      >
                        {gallery.expired
                          ? "Expirada"
                          : gallery.daysLeft <= 30
                            ? `Faltam ${gallery.daysLeft} dia${gallery.daysLeft === 1 ? "" : "s"}`
                            : `Disponível por ${gallery.daysLeft} dias`}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

export default function GalleriesPage() {
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
          <Galleries />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
