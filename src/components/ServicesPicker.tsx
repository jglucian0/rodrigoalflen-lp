"use client";

import { useEffect, useRef, useState } from "react";
import type { Service } from "@/lib/services";
import { ArrowLeftIcon, ArrowRightIcon } from "./ui/Icons";

const pad = (n: number) => String(n).padStart(2, "0");

/** Seletor de serviços para celular: abas rolantes + um cartão por vez */
export default function ServicesPicker({ services }: { services: Service[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const tabsRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const total = services.length;
  const current = services[index];

  const select = (next: number) => {
    if (next === index) return;
    setDir(next > index ? "next" : "prev");
    setIndex(next);
  };

  const step = (delta: 1 | -1) => {
    setDir(delta === 1 ? "next" : "prev");
    setIndex((i) => (i + delta + total) % total);
  };

  // Mantém a aba ativa centralizada na linha de abas (sem rolar a página)
  useEffect(() => {
    const tabs = tabsRef.current;
    const tab = tabs?.children[index] as HTMLElement | undefined;
    if (!tabs || !tab) return;
    tabs.scrollTo({
      left: tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [index]);

  return (
    <div className="svc">
      <div
        ref={tabsRef}
        className="svc__tabs"
        role="tablist"
        aria-label="Serviços"
      >
        {services.map((service, i) => (
          <button
            key={service.number}
            type="button"
            role="tab"
            id={`svc-tab-${i}`}
            aria-selected={index === i}
            aria-controls="svc-panel"
            className={`svc__tab ${index === i ? "is-active" : ""}`}
            onClick={() => select(i)}
          >
            <span className="svc__tab-num">{service.number}</span>
            {service.title}
          </button>
        ))}
      </div>

      <div
        id="svc-panel"
        role="tabpanel"
        aria-labelledby={`svc-tab-${index}`}
        className="svc-card"
        onTouchStart={(e) => {
          const t = e.touches[0];
          touch.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          // Só conta como "arrastar de lado" se for um gesto claramente horizontal
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            step(dx < 0 ? 1 : -1);
          }
        }}
      >
        {/* key: recria o bloco a cada troca, disparando a animação de entrada */}
        <div key={current.number} className="svc-card__body" data-dir={dir}>
          <span className="svc-card__bg" aria-hidden>
            {current.number}
          </span>
          <p className="svc-card__eyebrow">Serviço {current.number}</p>
          <h3 className="svc-card__title">{current.title}</h3>
          <p className="svc-card__desc">{current.description}</p>
          <a href={current.href} className="btn btn--dark">
            Saber mais <ArrowRightIcon />
          </a>
        </div>

        <div className="svc-card__nav">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Serviço anterior"
          >
            <ArrowLeftIcon width={14} height={14} />
          </button>
          <span className="svc-card__count">
            {pad(index + 1)} / {pad(total)}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Próximo serviço"
          >
            <ArrowRightIcon width={14} height={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
