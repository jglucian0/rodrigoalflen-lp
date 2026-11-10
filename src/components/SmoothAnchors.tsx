"use client";

import { useEffect } from "react";

const MIN_MS = 500; // duração mínima (distâncias curtas)
const MAX_MS = 900; // duração máxima (distâncias longas)
const MS_PER_PX = 0.35; // quanto maior, mais devagar em distâncias longas

// Suave no começo e no fim
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function SmoothAnchors() {
  useEffect(() => {
    let raf = 0;

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const scrollNow = (y: number) =>
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as Element).closest("a");
      if (!link) return;
      if (link.target && link.target !== "_self") return;

      // Só links que apontam para uma âncora da própria página
      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      ) {
        return;
      }

      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;

      e.preventDefault();
      stop();

      // Descobre o destino exato (respeita scroll-padding e o zoom do site):
      // salta até lá, lê a posição e volta ao ponto de partida no mesmo frame.
      const from = window.scrollY;
      el.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
        block: "start",
      });
      const to = window.scrollY;
      scrollNow(from);

      window.history.pushState(null, "", url.hash);

      const distance = Math.abs(to - from);
      if (distance < 2) return;

      const duration = Math.min(MAX_MS, Math.max(MIN_MS, distance * MS_PER_PX));
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        scrollNow(from + (to - from) * ease(t));
        raf = t < 1 ? requestAnimationFrame(step) : 0;
      };
      raf = requestAnimationFrame(step);
    };

    document.addEventListener("click", onClick);
    // Se o usuário rolar durante a animação, ele assume o controle
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);

    return () => {
      stop();
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);

  return null;
}
