import Link from "next/link";
import type { ReactNode } from "react";
import HeroSlideshow from "../HeroSlideshow";
import {
  CalendarCheckIcon,
  DownloadIcon,
  ShieldIcon,
  SmartphoneIcon,
} from "../ui/Icons";
import ClientLoginForm from "./ClientLoginForm";

const features: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <ShieldIcon />,
    title: "Galeria privada e segura",
    text: "Só quem tem o seu acesso vê as fotos",
  },
  {
    icon: <DownloadIcon />,
    title: "Download em alta resolução",
    text: "Arquivos prontos para imprimir",
  },
  {
    icon: <SmartphoneIcon />,
    title: "Pelo celular, sem app",
    text: "Funciona direto no navegador",
  },
  {
    icon: <CalendarCheckIcon />,
    title: "Disponível por 365 dias",
    text: "Tempo de sobra para baixar tudo",
  },
];

export default function ClientHero({ slides }: { slides: string[] }) {
  return (
    <section className="cl-hero">
      <div className="cl-hero__inner">
        <div className="cl-hero__content">
          <nav className="legal-crumbs" aria-label="Você está em">
            <Link href="/">Início</Link>
            <span aria-hidden>/</span>
            <span aria-current="page">Área do Cliente</span>
          </nav>

          <span className="eyebrow">Área do cliente</span>
          <h1 className="section-title">
            Suas memórias <em>estão aqui</em>
          </h1>
          <p className="cl-hero__lead">
            Um espaço exclusivo onde cada foto conta a história do seu momento
            mais especial. Entre com o login e a senha que você recebeu da nossa
            equipe.
          </p>

          <ul className="cl-features">
            {features.map((feature) => (
              <li key={feature.title} className="cl-feature">
                <span className="cl-feature__ico" aria-hidden>
                  {feature.icon}
                </span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="cl-hero__visual">
          <div className="cl-hero__arch" aria-hidden>
            <HeroSlideshow images={slides} alt="" sizes="316px" />
          </div>

          <div className="cl-card">
            <div className="cl-card__frame">
              <ClientLoginForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
