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

function useColumns() {
  const [columns, setColumns] = useState(3);
  useEffect(() => {
    const update = () =>
      setColumns(
        window.innerWidth >= 900 ? 3 : window.innerWidth >= 560 ? 2 : 1,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return columns;
}

export default function Portfolio() {
  const [active, setActive] = useState<Filter>("Todos");
  const columnCount = useColumns();

  const columns = useMemo(() => {
    const items =
      active === "Todos"
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === active);
    return distribute(items, columnCount);
  }, [active, columnCount]);

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
              onClick={() => setActive(category)}
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
                      sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
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
      </div>
    </section>
  );
}
