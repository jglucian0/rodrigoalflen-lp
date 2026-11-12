import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import HeroSlideshow from "@/components/HeroSlideshow";
import LinkButton from "@/components/links/LinkButton";
import {
  ChatIcon,
  CrownIcon,
  FacebookIcon,
  GraduationIcon,
  HeartIcon,
  HomeIcon,
  InstagramIcon,
  UserIcon,
  WhatsappIcon,
} from "@/components/ui/Icons";
import { getHeroSlides } from "@/lib/hero-images";
import { budgetLinks, linksPage, type BudgetIcon } from "@/lib/links";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `Links | ${site.name}`,
  description: `Orçamentos, WhatsApp e área do cliente — todos os links da ${site.name}.`,
  alternates: { canonical: "/wp" },
  robots: { index: true, follow: true },
};

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

const budgetIcons: Record<BudgetIcon, ReactNode> = {
  heart: <HeartIcon />,
  crown: <CrownIcon />,
  graduation: <GraduationIcon />,
  chat: <ChatIcon />,
};

export default async function LinksPage() {
  const slides = await getHeroSlides();

  return (
    <main className="lk">
      <div className="lk__wrap">
        {/* Foto de topo: as mesmas fotos do hero, trocando sozinhas */}
        <div className="lk__cover">
          <HeroSlideshow
            images={slides}
            alt={`Casamento fotografado por ${site.name}`}
            sizes="(max-width: 480px) 100vw, 480px"
          />
        </div>

        <header className="lk__brand lk-rise" style={rise(0)}>
          <h1>
            <Image
              src="/RodrigoAlflenFotografia.webp"
              alt={site.name}
              width={340}
              height={54}
              priority
              className="lk__logo"
            />
          </h1>
          <p className="lk__tagline">{linksPage.tagline}</p>
        </header>

        <div className="lk__body">
          <section className="lk__group" aria-labelledby="lk-contato">
            <h2 id="lk-contato" className="lk__title lk-rise" style={rise(1)}>
              Fale com a gente
            </h2>
            <div className="lk__list">
              <LinkButton
                href={whatsappLink()}
                primary
                index={2}
                icon={<WhatsappIcon />}
              >
                WhatsApp
              </LinkButton>
            </div>
          </section>

          <section className="lk__group" aria-labelledby="lk-orcamentos">
            <h2
              id="lk-orcamentos"
              className="lk__title lk-rise"
              style={rise(3)}
            >
              Orçamentos
            </h2>
            <div className="lk__list">
              {budgetLinks.map((item, i) => (
                <LinkButton
                  key={item.label}
                  href={item.href}
                  index={4 + i}
                  icon={budgetIcons[item.icon]}
                >
                  {item.label}
                </LinkButton>
              ))}
            </div>
          </section>

          <section className="lk__group" aria-labelledby="lk-conheca">
            <h2 id="lk-conheca" className="lk__title lk-rise" style={rise(8)}>
              Conheça
            </h2>
            <div className="lk__list">
              <LinkButton href="/" index={9} icon={<HomeIcon />}>
                Site Oficial
              </LinkButton>
              {/* <LinkButton
                href={site.formaturasUrl}
                index={10}
                icon={<GraduationIcon />}
              >
                Formaturas
              </LinkButton> */}
            </div>
          </section>

          <section className="lk__group" aria-labelledby="lk-cliente">
            <h2 id="lk-cliente" className="lk__title lk-rise" style={rise(11)}>
              Já é cliente?
            </h2>
            <div className="lk__list">
              <LinkButton
                href={site.clientAreaUrl}
                index={12}
                icon={<UserIcon />}
              >
                Área do Cliente
              </LinkButton>
            </div>
          </section>

          <div
            className="socials socials--footer lk__socials lk-rise"
            style={rise(13)}
          >
            <a
              href={site.socials.instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </a>
            <a
              href={site.socials.facebook}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </a>
          </div>

          <footer className="lk__footer lk-rise" style={rise(14)}>
            <p>© 2026 {site.name}</p>
            <p>CNPJ {linksPage.cnpj}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
