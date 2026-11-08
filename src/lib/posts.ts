import { SITE_URL } from "./site";

export interface Post {
  title: string;
  category: string;
  date: string;
  imageAlt: string;
  href: string;
}

export const posts: Post[] = [
  {
    title: "Álbum de formatura: como evitar cobrança abusiva e saber o preço antes",
    category: "Formatura",
    date: "29 de outubro de 2026",
    imageAlt: "Festa de formatura registrada pela Rodrigo Alflen Fotografia",
    href: `${SITE_URL}/blog/album-de-formatura-cobranca-abusiva`,
  },
  {
    title: "Como escolher a empresa de fotografia da formatura: checklist da comissão",
    category: "Formatura",
    date: "29 de outubro de 2026",
    imageAlt: "Formandas reunidas na festa de formatura",
    href: `${SITE_URL}/blog/como-escolher-empresa-de-fotografia-de-formatura`,
  },
  {
    title: "Como escolher um fotógrafo de casamento: 10 perguntas antes de fechar",
    category: "Casamento",
    date: "29 de outubro de 2026",
    imageAlt: "Noivos Nathali e Alinaldo no dia do casamento em São Carlos/SP",
    href: `${SITE_URL}/blog/como-escolher-fotografo-de-casamento`,
  },
];