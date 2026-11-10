"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
import { LockIcon } from "./ui/Icons";

/** Seções observadas para marcar o item ativo do menu */
const SPY_IDS = ["servicos", "portfolio", "sobre", "contato"] as const;

const toHome = (href: string) => (href.startsWith("#") ? `/${href}` : href);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 20);

      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of SPY_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) current = id;
      }

      const nearBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;
      // No rodapé, mantém o último item ativo (como no site original)
      if (current !== null || !nearBottom) setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__inner">
        <a href={toHome("#inicio")} className="header__logo" onClick={close}>
          <Image
            src="/RodrigoAlflenFotografia.webp"
            alt="Rodrigo Alflen Fotografia"
            width={340}
            height={54}
            priority
          />
        </a>

        <nav
          id="menu-principal"
          className={`nav ${open ? "nav--open" : ""}`}
          aria-label="Principal"
        >
          <ul className="nav__list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={toHome(link.href)}
                  className={`nav__link ${active && link.href === `#${active}` ? "is-active" : ""}`}
                  onClick={close}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.clientAreaUrl}
                className="nav__link nav__client"
                onClick={close}
              >
                <LockIcon />
                Área do Cliente
              </a>
            </li>
            <li>
              <a
                href={site.budgetUrl}
                className="btn btn--dark btn--sm"
                onClick={close}
              >
                Orçamento
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className={`burger ${open ? "burger--open" : ""}`}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
