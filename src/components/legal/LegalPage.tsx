import Link from "next/link";
import type { ReactNode } from "react";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SmoothAnchors from "@/components/SmoothAnchors";
import { whatsappLink } from "@/lib/site";
import LegalToc from "./LegalToc";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  crumb: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  updatedAt: string;
  summary: ReactNode;
  sections: LegalSection[];
  helpMessage: string;
  related: { label: string; href: string }[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function LegalPage({
  crumb,
  eyebrow,
  title,
  lead,
  updatedAt,
  summary,
  sections,
  helpMessage,
  related,
}: LegalPageProps) {
  const tocItems = sections.map(({ id, title }) => ({ id, title }));

  return (
    <>
      <Header />
      <SmoothAnchors />

      <main id="conteudo">
        <section className="legal-hero">
          <div className="container">
            <nav className="legal-crumbs" aria-label="Você está em">
              <Link href="/">Início</Link>
              <span aria-hidden>/</span>
              <span aria-current="page">{crumb}</span>
            </nav>

            <span className="eyebrow">{eyebrow}</span>
            <h1 className="section-title">{title}</h1>
            <p className="legal-hero__lead">{lead}</p>
            <p className="legal-hero__date">Última atualização: {updatedAt}</p>
          </div>
        </section>

        <div className="legal">
          <div className="container legal__grid">
            <aside className="legal__aside">
              <LegalToc items={tocItems} />

              <div className="legal-help">
                <span className="legal-help__script">dúvidas?</span>
                <p>Fale com a gente sobre seus dados ou sobre estes termos.</p>
                <a
                  href={whatsappLink(helpMessage)}
                  className="btn btn--dark btn--sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </aside>

            <article className="legal__content">
              <div className="legal-summary">
                <small>Em resumo</small>
                <p>{summary}</p>
              </div>

              {sections.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="legal-section"
                >
                  <h2>
                    <span>{pad(i + 1)}</span>
                    {section.title}
                  </h2>
                  {section.body}
                </section>
              ))}

              <div className="legal-related">
                <small>Veja também</small>
                <ul>
                  {related.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="link-arrow">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
