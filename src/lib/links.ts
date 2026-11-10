import { whatsappLink } from "./site";

export const linksPage = {
  tagline: "Registrando sua história, na nossa!",
  cnpj: "25.203.532/0001-57",
};

export type BudgetIcon = "heart" | "crown" | "graduation" | "chat";

/** Cada botão abre o WhatsApp já com a mensagem pronta */
export const budgetLinks: {
  label: string;
  message: string;
  icon: BudgetIcon;
  href: string;
}[] = [
  {
    label: "Orçamento para Casamento",
    message: "Olá! Gostaria de solicitar um orçamento para casamento.",
    icon: "heart" as const,
  },
  {
    label: "Orçamento para 15 Anos",
    message: "Olá! Gostaria de solicitar um orçamento para festa de 15 anos.",
    icon: "crown" as const,
  },
  {
    label: "Orçamento para Formatura",
    message: "Olá! Gostaria de solicitar um orçamento para formatura.",
    icon: "graduation" as const,
  },
  {
    label: "Outros Orçamentos",
    message: "Olá! Gostaria de solicitar um orçamento. Pode me ajudar?",
    icon: "chat" as const,
  },
].map((item) => ({ ...item, href: whatsappLink(item.message) }));