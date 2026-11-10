export const SITE_URL = "https://www.rodrigoalflen.com.br";

export const site = {
  name: "Rodrigo Alflen Fotografia",
  tagline: "Registrando sua história, na nossa.",
  phoneLabel: "(43) 9 9930-9945",
  whatsappNumber: "5543999309945",
  email: "contato@rodrigoalflenfotografia.com.br",
  location: "Manoel Ribas — PR, Brasil",
  hours: "Segunda a sexta, 9h às 18h",
  hoursShort: "Seg. a sex., 9h às 18h",
  hoursNote: "Sáb / Dom: registrando histórias de amor",
  cnpj: "25.203.532/0001-57",
  budgetUrl: "http://localhost:3000/wp",
  clientAreaUrl: `${SITE_URL}/cliente`,
  blogUrl: `${SITE_URL}/blog/`,
  formaturasUrl: `${SITE_URL}/formaturas`,
  socials: {
    instagram: "https://www.instagram.com/rodrigoalflenfotografia/",
    facebook: "https://www.facebook.com/rodrigoalflenfotografia",
  },
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WHATSAPP_BUDGET_MESSAGE =
  "Olá, estava visitando seu site e gostaria de um orçamento por gentileza!";

export const WHATSAPP_AVAILABILITY_MESSAGE =
  "Olá! Gostaria de verificar a disponibilidade para a minha data.";

export const WHATSAPP_FAQ_MESSAGE =
  "Olá! Gostaria de tirar algumas duvidas.";

export const navLinks = [
  { label: "Serviços", href: "#servicos" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Formaturas", href: site.formaturasUrl },
  { label: "Sobre", href: "#sobre" },
  //{ label: "Blog", href: site.blogUrl },
  { label: "Contato", href: "#contato" },
] as const;

export const stats = [
  { value: "+700", label: "Casamentos" },
  { value: "14", label: "Anos de experiência" },
  { value: "+1200", label: "Eventos realizados" },
] as const;

export const awards = [
  "Bride Association Award",
  "Profissioal Pré-wedding e Wedding",
  "+1.200 Eventos Realizados",
  "Premiação Mywed",
  "Melhor Atendimento do Paraná",
  "+700 Casamentos Registrados",
] as const;

export const processSteps = [
  {
    numeral: "I",
    title: "Primeira conversa",
    text: "Você conta sua história, suas ideias e o que sonha para o dia. Juntos montamos um pacote sob medida.",
  },
  {
    numeral: "II",
    title: "Data reservada",
    text: "Com o contrato assinado, sua data fica exclusiva e o planejamento começa — locais, horários e detalhes.",
  },
  {
    numeral: "III",
    title: "O grande dia",
    text: "Equipe e olhar atentos para registrar cada emoção com naturalidade, do making-of ao último brinde.",
  },
  {
    numeral: "IV",
    title: "A entrega",
    text: "Galeria online privada com suas imagens tratadas e, conforme o pacote, álbum premium e filme.",
  },
] as const;