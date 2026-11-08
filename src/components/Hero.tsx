import Image from "next/image";
import { getHeroSlides } from "@/lib/hero-images";
import { site, stats } from "@/lib/site";
import HeroSlideshow from "./HeroSlideshow";
import CountUp from "./CountUp";

export default async function Hero() {
  // Apenas a chamada para os slides foi mantida
  const slides = await getHeroSlides();

  return (
    <section id="inicio" className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow">
            Fotografia &amp; Filmagem · Manoel Ribas/PR
          </span>

          <h1 className="hero__title">
            Histórias de <br />
            amor registradas <br />
            com <em>alma</em> e <br />
            técnica
          </h1>
          <p className="hero__since">desde 2014</p>

          <p className="hero__text">
            Mais de uma década transformando emoções em memórias eternas.
            Fotografia artística, com sensibilidade única, para os momentos que
            merecem durar para sempre.
          </p>

          <div className="hero__cta">
            <a href="#portfolio" className="btn btn--dark">
              Ver Portfólio
            </a>
            <a href={site.budgetUrl} className="btn btn--outline">
              Ver Preços
            </a>
          </div>

          <dl className="hero__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <dt>{stat.label}</dt>
                <dd>
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual">
          {/* Arco grande: fotos de public/portfolio/destaque, trocando sozinhas */}
          <div className="hero__arch">
            <HeroSlideshow
              images={slides}
              alt="Casal de noivos em ensaio fotográfico"
            />
          </div>

          <div className="hero__badge" aria-hidden>
            <svg className="hero__badge-ring" viewBox="0 0 120 120">
              <defs>
                <path
                  id="badge-path"
                  d="M 13 60 a 47 47 0 1 1 94 0 a 47 47 0 1 1 -94 0"
                />
              </defs>
              <text fontSize="7" fontWeight="500" fill="currentColor">
                <textPath
                  href="#badge-path"
                  textLength="262"
                  lengthAdjust="spacing"
                >
                  REGISTRANDO SUA HISTÓRIA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· NA
                  NOSSA ·
                </textPath>
              </text>
            </svg>

            <Image
              src="/RodigoIcon.webp"
              alt=""
              width={112}
              height={112}
              className="hero__badge-icon"
            />
          </div>

          {/* Quadrado pequeno: foto estática */}
          <div className="hero__card">
            <div className="hero__card-img">
              <Image
                src="/RodrigoAlflenPerson.webp"
                alt="Fotógrafo Rodrigo Alflen"
                fill
                sizes="160px"
              />
            </div>
          </div>
        </div>
      </div>

      <span className="hero__scroll" aria-hidden />
    </section>
  );
}
