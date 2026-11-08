"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Placeholder from "./ui/Placeholder";

/** Tempo que cada foto fica na tela antes de trocar */
const INTERVAL_MS = 6000;

interface HeroSlideshowProps {
  images: string[];
  alt: string;
}

export default function HeroSlideshow({ images, alt }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  useEffect(() => {
    if (total < 2) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      timer = setInterval(() => setIndex((i) => (i + 1) % total), INTERVAL_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    // Pausa quando a aba não está visível
    const onVisibility = () => {
      stop();
      if (!document.hidden) start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [total]);

  // Sem fotos na pasta: mantém o placeholder
  if (total === 0) {
    return <Placeholder alt={alt} ratio="portrait" tone={1} />;
  }

  return (
    <div className="slideshow">
      {images.map((src, i) => (
        <div
          key={src}
          className={`slideshow__slide ${i === index ? "is-active" : ""}`}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt={i === index ? alt : ""}
            fill
            sizes="(max-width: 960px) 80vw, 371px"
            className="slideshow__img"
            // A 1ª foto carrega com prioridade (é o LCP da página)
            loading="eager"
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
    </div>
  );
}
