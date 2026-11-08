export const portfolioCategories = [
  "Todos",
  "Casamentos",
  "Pré-Wedding",
  "15 Anos",
  "Formatura",
  "Eventos",
] as const;

export type PortfolioCategory = Exclude<(typeof portfolioCategories)[number], "Todos">;

export interface PortfolioItem {
  title: string;
  subtitle: string;
  category: PortfolioCategory;
  ratio: "landscape" | "portrait";
  src: string;
}

export const portfolioItems: PortfolioItem[] = [
  { title: "Rubian & Schonrenan", subtitle: "Pré-Wedding · Ivaiporã/PR", category: "Pré-Wedding", ratio: "landscape", src: "/portfolio/rubian-schonrenan.webp" },
  { title: "Despedida Heloisa", subtitle: "Despedida de Solteira · Manoel Ribas/PR", category: "Eventos", ratio: "landscape", src: "/portfolio/heloisa.webp" },
  { title: "Isadora Orderdenge", subtitle: "Casamento · Manoel Ribas/PR", category: "Casamentos", ratio: "landscape", src: "/portfolio/isadora.webp" },
  { title: "Isabelly Ardigo", subtitle: "Ensaio 15 Anos · Manoel Ribas/PR", category: "15 Anos", ratio: "portrait", src: "/portfolio/isabelly-ardigo.webp" },
  { title: "Thays & Andrey", subtitle: "Casamento · Manoel Ribas/PR", category: "Casamentos", ratio: "landscape", src: "/portfolio/thaysricken-andrey.webp" },
  { title: "Ana Flávia & Igor", subtitle: "Pré-Wedding · Ivaiporã/PR", category: "Pré-Wedding", ratio: "landscape", src: "/portfolio/anaflavia-igor.webp" },
  { title: "Camila & Ericardo", subtitle: "Casamento · Manoel Ribas", category: "Casamentos", ratio: "landscape", src: "/portfolio/camila-ericardo.webp" },
  { title: "Claudio & Catarina", subtitle: "Casamento · Manoel Ribas/PR", category: "Casamentos", ratio: "landscape", src: "/portfolio/claudio-catarina.webp" },
  { title: "Camila Romagnolo", subtitle: "15 Anos · Estúdio Fotográfico", category: "15 Anos", ratio: "portrait", src: "/portfolio/camila.webp" },
  { title: "Ana Tilpe", subtitle: "Eventos · Manoel Ribas/PR", category: "Eventos", ratio: "portrait", src: "/portfolio/anatilpe.webp" },
  { title: "15 Anos Laura", subtitle: "15 Anos · Manoel Ribas/PR", category: "15 Anos", ratio: "portrait", src: "/portfolio/laura.webp" },
  { title: "Igor & Monica", subtitle: "Casamento · Pitanga/PR", category: "Casamentos", ratio: "landscape", src: "/portfolio/igor-monica.webp" },
  { title: "1 Aninho Maria Isis", subtitle: "Aniversário · Manoel Ribas/PR", category: "Eventos", ratio: "landscape", src: "/portfolio/maria-isis.webp" },
];