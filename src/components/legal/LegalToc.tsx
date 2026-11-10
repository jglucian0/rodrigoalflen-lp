"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  title: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Índice lateral que destaca a seção que está sendo lida */
export default function LegalToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current = items[0]?.id ?? "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav className="toc" aria-label="Nesta página">
      <p className="toc__title">Nesta página</p>
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={active === item.id ? "is-active" : undefined}
              aria-current={active === item.id ? "true" : undefined}
            >
              <span>{pad(i + 1)}</span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
