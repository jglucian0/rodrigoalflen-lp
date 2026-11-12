import Image from "next/image";
import Link from "next/link";
import AvailabilityCta from "@/components/AvailabilityCta";
import CountUp from "@/components/CountUp";
import Faq from "@/components/Faq";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Process from "@/components/Process";
import SmoothAnchors from "@/components/SmoothAnchors";
import { CheckIcon } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import { portfolioItems } from "@/lib/portfolio";
import { contractSteps, type ServicePageData } from "@/lib/service-pages";
import { SITE_URL, awards, site, stats, whatsappLink } from "@/lib/site";

interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

interface ServicePageProps {
  data: ServicePageData;
  testimonial?: Testimonial;
}

/** 3 fotos para o topo: primeiro as da categoria do serviço, depois as demais */
function pickPhotos(category: string) {
  const own = portfolioItems.filter((item) => item.category === category);
  const rest = portfolioItems.filter((item) => item.category !== category);
  return [...own, ...rest].slice(0, 3);
}

const escapeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export default function ServicePage({ data, testimonial }: ServicePageProps) {
  const message = `Olá! Estava vendo seu site e vim pela página ${data.topic}. Gostaria de um orçamento.`;
  const availability = `Olá! Estava vendo a página ${data.topic} e gostaria de verificar a disponibilidade da minha data.`;
  const [main, cardA, cardB] = pickPhotos(data.portfolioCategory);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: data.title,
      description: data.metaDescription,
      url: `${SITE_URL}${data.path}`,
      areaServed: "Paraná e região Sul, Brasil",
      provider: { "@type": "Photographer", name: site.name, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <>
      <Header />
      <SmoothAnchors />

      <main id="conteudo">
        {/* Topo */}
        <section className="sp-hero">
          <div className="sp-hero__inner">
            <div className="sp-hero__content">
              <nav className="legal-crumbs" aria-label="Você está em">
                <Link href="/">Início</Link>
                <span aria-hidden>/</span>
                <span aria-current="page">{data.crumb}</span>
              </nav>

              <span className="eyebrow">{data.eyebrow}</span>
              <h1 className="section-title">{data.title}</h1>
              <p className="sp-hero__lead">{data.lead}</p>

              <div className="hero__cta">
                <a
                  href={whatsappLink(message)}
                  className="btn btn--dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pedir orçamento
                </a>
                <a href="/#portfolio" className="btn btn--outline">
                  Ver portfólio
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

            <div className="sp-collage">
              <div className="sp-collage__arch">
                <Image
                  src={main.src}
                  alt={`${data.title} — ${site.name}`}
                  fill
                  sizes="310px"
                  priority
                />
              </div>
              <div className="sp-collage__card sp-collage__card--a" aria-hidden>
                <div>
                  <Image src={cardA.src} alt="" fill sizes="150px" />
                </div>
              </div>
              <div className="sp-collage__card sp-collage__card--b" aria-hidden>
                <div>
                  <Image src={cardB.src} alt="" fill sizes="150px" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* "Vamos conversar?" + resposta rápida */}
        <section className="sp-intro">
          <div className="container sp-intro__grid">
            <div className="sp-talk">
              <span className="sp-talk__script">vamos conversar?</span>
              <p>
                Conte a data e o local do seu evento e receba um orçamento sob
                medida.
              </p>
              <a
                href={whatsappLink(message)}
                className="btn btn--dark btn--sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>

            <div className="sp-quick">
              <small>Resposta rápida</small>
              <p>{data.quickAnswer}</p>
            </div>
          </div>
        </section>

        {/* O que está incluído */}
        <section className="section sp-included">
          <div className="container">
            <SectionHeading
              eyebrow="Cobertura"
              title={
                <>
                  O que está <em>incluído</em>
                </>
              }
            />
            <ul className="sp-included__list">
              {data.included.map((item) => (
                <li key={item}>
                  <span aria-hidden>
                    <CheckIcon width={14} height={14} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Textos */}
        <section className="section sp-body">
          <div className="container">
            {data.sections.map((section) => (
              <article key={section.title} className="sp-text">
                <h2>{section.title}</h2>
                <div>
                  {section.paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  {section.closing?.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contratação */}
        <Process
          id="contratacao"
          eyebrow="Como funciona"
          title={
            <>
              A contratação, <em>passo a passo</em>
            </>
          }
          steps={contractSteps}
        />

        {/* Por que escolher */}
        <section className="section sp-why">
          <div className="container sp-why__grid">
            <div>
              <SectionHeading
                eyebrow="Confiança"
                title={
                  <>
                    Por que escolher o <em>Rodrigo Alflen</em>
                  </>
                }
              />
              <ul className="sp-why__list">
                {[
                  "Fotografia e filmagem com a mesma equipe, em linguagem documental e artística",
                  ...awards,
                ].map((item) => (
                  <li key={item}>
                    <span aria-hidden>
                      <CheckIcon width={14} height={14} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {testimonial && (
              <figure className="sp-quote">
                <blockquote>{testimonial.quote}</blockquote>
                <figcaption>
                  {testimonial.author}
                  <span>{testimonial.context}</span>
                </figcaption>
              </figure>
            )}
          </div>
        </section>

        <Faq items={data.faq} />

        <AvailabilityCta message={availability} />
      </main>

      <Footer />
      <FloatingActions />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJson(jsonLd) }}
      />
    </>
  );
}
