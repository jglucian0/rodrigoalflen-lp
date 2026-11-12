export interface Service {
  number: string;
  /** Nome do arquivo da foto em public/servicos (ex.: casamentos -> casamentos.webp) */
  slug: string;
  title: string;
  description: string;
  /** Página própria ("/fotografo-...") ou formulário ("/#contato") */
  href: string;
}

const FORM = "/#contato";

export const services: Service[] = [
  { number: "01", slug: "casamentos", title: "Casamentos", description: "Do making-of ao baile, cada emoção eternizada", href: "/fotografo-de-casamento" },
  { number: "02", slug: "casamento-civil", title: "Casamento Civil", description: "A delicadeza do “sim” no cartório", href: FORM },
  { number: "03", slug: "pre-wedding", title: "Pré-Wedding", description: "Sua história antes do grande dia", href: FORM },
  { number: "04", slug: "15-anos", title: "15 Anos · Debutante", description: "A magia da transição eternizada", href: "/fotografo-de-15-anos" },
  { number: "05", slug: "formatura", title: "Formatura", description: "O fim de um ciclo, o início de uma era", href: FORM },
  { number: "06", slug: "ensaio-estudio", title: "Ensaio em Estúdio", description: "Luz controlada, beleza revelada", href: FORM },
  { number: "07", slug: "gestante", title: "Gestante", description: "A espera mais bonita da vida", href: FORM },
  { number: "08", slug: "infantil", title: "Infantil", description: "A pureza de cada fase, guardada para sempre", href: FORM },
  //{ number: "09", slug: "eventos-corporativos", title: "Eventos Corporativos", description: "Profissionalismo e narrativa visual da marca", href: FORM },
];