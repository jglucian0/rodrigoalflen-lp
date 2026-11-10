import { SITE_URL, site } from "./site";

export const legal = {
  brand: site.name,
  /** Domínio exibido nos textos, derivado do SITE_URL */
  domain: new URL(SITE_URL).hostname.replace(/^www\./, ""),
  owner: "Rodrigo Alflen",
  city: "Manoel Ribas/PR",
  /** Foro eleito nos Termos de Uso */
  forum: "Manoel Ribas/PR",
  updatedAt: "10 de novembro de 2026",
  /** Prazo (em dias) para responder pedidos sobre dados pessoais */
  responseDays: 15,
} as const;