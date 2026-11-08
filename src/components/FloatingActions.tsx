"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_BUDGET_MESSAGE, whatsappLink } from "@/lib/site";
import { ArrowUpIcon, WhatsappIcon } from "./ui/Icons";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#topo"
        className={`fab fab--top ${showTop ? "is-visible" : ""}`}
        aria-label="Voltar ao topo"
      >
        <ArrowUpIcon width={14} height={14} />
      </a>

      <a
        href={whatsappLink(WHATSAPP_BUDGET_MESSAGE)}
        className="fab fab--whatsapp"
        aria-label="Falar no WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsappIcon width={22} height={22} />
      </a>
    </>
  );
}
