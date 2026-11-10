import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { SITE_URL, site, whatsappLink } from "@/lib/site";
import Placeholder from "./ui/Placeholder";
import { getRandomPortfolioImages } from "@/lib/footer-images";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PinIcon,
  PinterestIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./ui/Icons";

export default async function Footer() {
  const photos = await getRandomPortfolioImages(6);

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div>
          <Image
            src="/RodrigoAlflenFotografia.webp"
            alt="Rodrigo Alflen Fotografia"
            width={340}
            height={54}
            className="footer__logo"
          />
          <p className="footer__tagline">
            Eternizando momentos com uma cobertura fotográfica impecável.
          </p>
        </div>

        <div className="footer__cta">
          <a href={whatsappLink()} className="btn btn--cream btn--xs">
            <WhatsappIcon /> {site.phoneLabel}
          </a>
          <a
            href={site.socials.instagram}
            className="btn btn--ghost btn--xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon /> Instagram
          </a>
        </div>
      </div>

      <div className="container">
        <ul className="footer__gallery">
          {Array.from({ length: 6 }, (_, i) => {
            const src = photos[i];
            return (
              <li key={src ?? `empty-${i}`}>
                {src ? (
                  <Image
                    src={src}
                    alt="Trabalho fotográfico finalizado"
                    fill
                    sizes="(max-width: 560px) 33vw, 160px"
                  />
                ) : (
                  // Se a pasta tiver menos de 6 fotos, completa com placeholder
                  <Placeholder alt="" ratio="square" tone={i} />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="container footer__cols">
        <div>
          <h3>Sobre</h3>
          <p className="footer__about">
            Direto de Manoel Ribas, cobrimos eventos no Paraná e região Sul.
            Captamos a essência e a energia de cerimônias, recepções e festas,
            além de realizarmos ensaios de pré-casamento.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <h3>Navegação</h3>
          <ul>
            <li>
              <a href="/#servicos">Serviços</a>
            </li>
            <li>
              <a href="/#portfolio">Portfólio</a>
            </li>
            <li>
              <a href="/#perguntas">Perguntas frequentes</a>
            </li>
            <li>
              <a href="/#servicos">Serviços</a>
            </li>
            <li>
              <a href="/#portfolio">Portfólio</a>
            </li>
            <li>
              <a href="/#perguntas">Perguntas frequentes</a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Serviços">
          <h3>Serviços</h3>
          <ul>
            {services.map((s) => (
              <li key={s.number}>
                <a href={s.href.startsWith("#") ? `/${s.href}` : s.href}>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3>Contato</h3>
          <ul className="footer__contact">
            <li>
              <WhatsappIcon width={13} height={13} />
              <a href={whatsappLink()}>{site.phoneLabel}</a>
            </li>
            <li>
              <MailIcon width={13} height={13} />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <PinIcon width={13} height={13} />
              <span>Manoel Ribas — PR</span>
            </li>
            <li>
              <ClockIcon width={13} height={13} />
              <span>{site.hoursShort}</span>
            </li>
          </ul>
          <div className="socials socials--footer">
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
            {/* <a
              href={site.socials.youtube}
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeIcon />
            </a> */}
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 Rodrigo Alflen Fotografia · CNPJ 25.203.532/0001-57</p>
        <p>
          <Link href="/politica-de-privacidade">Privacidade</Link> ·{" "}
          <Link href="/termos-de-uso">Termos</Link>
        </p>
      </div>
    </footer>
  );
}
