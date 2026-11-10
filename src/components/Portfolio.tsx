"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  portfolioCategories,
  portfolioItems,
  type PortfolioItem,
} from "@/lib/portfolio";
import SectionHeading from "./ui/SectionHeading";

type Filter = (typeof portfolioCategories)[number];

const HEIGHT = { landscape: 2 / 3, portrait: 3 / 2 } as const;
const GAP = 18 / 301;

/** Celular: fotos mostradas de início e quantas entram a cada "Ver mais" */
const INITIAL_MOBILE = 6;
const STEP_MOBILE = 6;

function distribute(
  items: PortfolioItem[],
  columns: number,
): PortfolioItem[][] {
  const cols: PortfolioItem[][] = Array.from({ length: columns }, () => []);
  const heights = Array<number>(columns).fill(0);

  for (const item of items) {
    let target = 0;
    for (let i = 1; i < columns; i++) {
      if (heights[i] < heights[target] - 0.001) target = i;
    }
    cols[target].push(item);
    heights[target] += HEIGHT[item.ratio] + GAP;
  }
  return cols;
}

/** columns: 2 no celular, 3 no resto · compact: celular (limita as fotos) */
function useLayout() {
  const [layout, setLayout] = useState({ columns: 3, compact: false });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const next = { columns: w >= 560 ? 3 : 2, compact: w < 560 };
      setLayout((prev) =>
        prev.columns === next.columns && prev.compact === next.compact
          ? prev
          : next,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}

export default function Portfolio() {
  const [active, setActive] = useState<Filter>("Todos");
  const [visible, setVisible] = useState(INITIAL_MOBILE);
  const { columns: columnCount, compact } = useLayout();

  const filtered = useMemo(
    () =>
      active === "Todos"
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === active),
    [active],
  );

  const shown = useMemo(
    () => (compact ? filtered.slice(0, visible) : filtered),
    [compact, filtered, visible],
  );

  const columns = useMemo(
    () => distribute(shown, columnCount),
    [shown, columnCount],
  );

  const remaining = filtered.length - shown.length;
  const canExpand = compact && filtered.length > INITIAL_MOBILE;

  const collapse = () => {
    setVisible(INITIAL_MOBILE);
    document
      .getElementById("portfolio")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="portfolio" className="section portfolio">
      <div className="container">
        <SectionHeading
          eyebrow="Trabalhos selecionados"
          title="Portfólio"
          description="Uma curadoria que representa a evolução artística de mais de uma década dedicada à fotografia."
        />

        <div className="filters" role="tablist" aria-label="Filtrar portfólio">
          {portfolioCategories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active === category}
              className={`filters__btn ${active === category ? "is-active" : ""}`}
              onClick={() => {
                setActive(category);
                setVisible(INITIAL_MOBILE);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="masonry">
          {columns.map((column, ci) => (
            <ul key={ci} className="masonry__col">
              {column.map((item) => (
                <li key={item.title}>
                  <figure className="work">
                    <Image
                      src={item.src}
                      alt={`${item.title} — ${item.subtitle}`}
                      width={600}
                      height={item.ratio === "landscape" ? 400 : 900}
                      sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 33vw"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <figcaption className="work__caption">
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {canExpand && (
          <div className="portfolio__more">
            {remaining > 0 ? (
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setVisible((v) => v + STEP_MOBILE)}
              >
                Ver mais ({remaining})
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--outline"
                onClick={collapse}
              >
                Ver menos
              </button>
            )}
            <p className="portfolio__count" aria-live="polite">
              Mostrando {shown.length} de {filtered.length}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
