import { SITE_URL } from "./site";

export interface Service {
  number: string;
  title: string;
  description: string;
  href: string;
}

export const services: Service[] = [
  { number: "01", title: "Casamentos", description: "Do making-of ao baile, cada emoção eternizada", href: `${SITE_URL}/fotografo-de-casamento` },
  { number: "02", title: "Casamento Civil", description: "A delicadeza do “sim” no cartório", href: `${SITE_URL}/fotografo-de-casamento-civil` },
  { number: "03", title: "Pré-Wedding", description: "Sua história antes do grande dia", href: `${SITE_URL}/wp/` },
  { number: "04", title: "15 Anos · Debutante", description: "A magia da transição eternizada", href: `${SITE_URL}/fotografo-de-15-anos` },
  { number: "05", title: "Formatura", description: "O fim de um ciclo, o início de uma era", href: `${SITE_URL}/formaturas` },
  { number: "06", title: "Ensaio em Estúdio", description: "Luz controlada, beleza revelada", href: "#contato" },
  { number: "07", title: "Gestante", description: "A espera mais bonita da vida", href: "#contato" },
  { number: "08", title: "Infantil", description: "A pureza de cada fase, guardada para sempre", href: `${SITE_URL}/infantil/` },
  { number: "09", title: "Eventos Corporativos", description: "Profissionalismo e narrativa visual da marca", href: "#contato" },
];