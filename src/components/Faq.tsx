"use client";

import { useState } from "react";
import { faqItems } from "@/lib/faq";
import { site, whatsappLink, WHATSAPP_FAQ_MESSAGE } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="perguntas" className="section faq">
      <div className="container faq__grid">
        <div className="faq__intro">
          <SectionHeading
            eyebrow="Dúvidas"
            title={
              <>
                Perguntas <br />
                <em>frequentes</em>
              </>
            }
          />
          <p className="faq__lead">
            O que os casais e famílias mais perguntam antes de fechar. Não achou
            a sua?{" "}
            <a
              href={whatsappLink(WHATSAPP_FAQ_MESSAGE)}
              className="link-underline"
              target="_blank"
              aria-label={`Chame no WhatsApp ${site.phoneLabel}`}
            >
              Chame no WhatsApp
            </a>
            .
          </p>
        </div>

        <div className="faq__list">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.question}
                className={`faq__item ${isOpen ? "is-open" : ""}`}
              >
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.question}</span>
                    <i aria-hidden />
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" className="faq__answer">
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
