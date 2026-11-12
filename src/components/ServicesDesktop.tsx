"use client";

import Image from "next/image";
import { useState } from "react";
import type { Service } from "@/lib/services";
import { ArrowRightIcon } from "./ui/Icons";
import Placeholder from "./ui/Placeholder";

export interface ServiceItem extends Service {
  image: string | null;
}

/** Lista + arco de foto que muda conforme o serviço sob o mouse (desktop) */
export default function ServicesDesktop({ items }: { items: ServiceItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="services__grid">
      <ol className="services__list">
        {items.map((service, i) => (
          <li key={service.number}>
            <a
              href={service.href}
              className="service"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="service__number">{service.number}</span>
              <span className="service__title">{service.title}</span>
              <span className="service__desc">{service.description}</span>
              <span className="service__arrow">
                <ArrowRightIcon width={12} height={12} />
              </span>
            </a>
          </li>
        ))}
      </ol>

      <div className="arch services__arch" aria-hidden>
        {items.map((service, i) => (
          <div
            key={service.number}
            className={`services__shot ${active === i ? "is-active" : ""}`}
          >
            {service.image ? (
              <Image src={service.image} alt="" fill sizes="304px" />
            ) : (
              <Placeholder alt="" ratio="portrait" tone={i} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
