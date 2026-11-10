"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1200;

// Começa rápido e desacelera suavemente até o número final
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Texto só para leitores de tela (o número animado fica escondido deles)
const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

interface CountUpProps {
  /** Valor final, ex.: "+700", "14", "+1200" */
  value: string;
}

export default function CountUp({ value }: CountUpProps) {
  // Separa prefixo/sufixo do número: "+700" -> "+", 700, ""
  const match = /^(\D*)(\d+)(\D*)$/.exec(value);
  const prefix = match?.[1] ?? "";
  const target = match ? Number(match[2]) : 0;
  const suffix = match?.[3] ?? "";

  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;

    let raf = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION_MS, 1);
        setCurrent(Math.round(target * easeOutCubic(t)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // Primeira visualização: conta uma única vez e para de observar.
        // Depois disso o número fica estático no valor final.
        io.disconnect();
        run();
      },
      { threshold: 0.5 },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // Valor sem número (ex.: "N/A"): mostra como está
  if (!match) return <>{value}</>;

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {prefix}
        {current}
        {suffix}
      </span>
      <span style={srOnly}>{value}</span>
    </>
  );
}
