"use client";

import { useState, type ReactNode } from "react";
import { faqItems, type FaqItem } from "@/lib/faq";
import { site, whatsappLink } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";

interface FaqProps {
  items?: FaqItem[];
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  id?: string;
  /** item aberto ao carregar: índice, "all" (todos) ou null (nenhum) */
  defaultOpen?: number | "all" | null;
  /** permite vários itens abertos ao mesmo tempo */
  multiple?: boolean;
}

export default function Faq({
  items = faqItems,
  eyebrow = "Dúvidas",
  title = (
    <>
      Perguntas <br />
      <em>frequentes</em>
    </>
  ),
  lead,
  id = "perguntas",
  defaultOpen = 0,
  multiple = false,
}: FaqProps) {
  const [open, setOpen] = useState<Set<number>>(
    () =>
      new Set(
        defaultOpen === "all"
          ? items.map((_, i) => i)
          : defaultOpen === null
            ? []
            : [defaultOpen],
      ),
  );

  const toggle = (i: number) =>
    setOpen((prev) => {
      const isOpen = prev.has(i);
      if (!multiple) return isOpen ? new Set() : new Set([i]);

      const next = new Set(prev);
      if (isOpen) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section id={id} className="section faq">
      <div className="container faq__grid">
        <div className="faq__intro">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <p className="faq__lead">
            {lead ?? (
              <>
                O que os casais e famílias mais perguntam antes de fechar. Não
                achou a sua?{" "}
                <a
                  href={whatsappLink()}
                  className="link-underline"
                  aria-label={`Chame no WhatsApp ${site.phoneLabel}`}
                >
                  Chame no WhatsApp
                </a>
                .
              </>
            )}
          </p>
        </div>

        <div className="faq__list">
          {items.map((item, i) => {
            const isOpen = open.has(i);
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
                    aria-controls={`${id}-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span>{item.question}</span>
                    <i aria-hidden />
                  </button>
                </h3>
                <div id={`${id}-${i}`} role="region" className="faq__answer">
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
