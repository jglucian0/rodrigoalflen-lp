"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/lib/site";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export default function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  // No celular a lista vira um carrossel: descobre qual passo está em foco
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      const padLeft = parseFloat(getComputedStyle(list).paddingLeft) || 0;
      const origin = list.getBoundingClientRect().left + padLeft;

      let best = 0;
      let bestDist = Infinity;
      Array.from(list.children).forEach((el, i) => {
        const dist = Math.abs(el.getBoundingClientRect().left - origin);
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
        }
      });
      setActive(best);
    };

    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const goTo = (index: number) => {
    const list = listRef.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item) return;

    const padLeft = parseFloat(getComputedStyle(list).paddingLeft) || 0;
    const delta =
      item.getBoundingClientRect().left -
      list.getBoundingClientRect().left -
      padLeft;

    list.scrollTo({ left: list.scrollLeft + delta, behavior: "smooth" });
  };

  return (
    <section className="section process" aria-labelledby="como-funciona">
      <div className="container">
        <SectionHeading
          eyebrow="Como funciona"
          title={
            <>
              Da primeira conversa <em>ao álbum</em>
            </>
          }
          id="como-funciona"
        />

        <ol ref={listRef} className="process__list">
          {processSteps.map((step, i) => (
            <li key={step.numeral} data-active={active === i}>
              <Reveal delay={i * 90} className="step">
                <span className="step__numeral">{step.numeral}</span>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__text">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Barra de progresso (aparece só no celular) */}
        <div className="process__nav">
          {processSteps.map((step, i) => (
            <button
              key={step.numeral}
              type="button"
              className={active === i ? "is-active" : undefined}
              aria-label={`Ir para o passo ${step.numeral}: ${step.title}`}
              aria-current={active === i ? "step" : undefined}
              onClick={() => goTo(i)}
            >
              <span>{step.numeral}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
