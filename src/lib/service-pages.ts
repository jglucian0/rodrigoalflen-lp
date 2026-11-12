import type { FaqItem } from "./faq";
import type { PortfolioCategory } from "./portfolio";
import { site } from "./site";

export interface ServiceSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  closing?: string[];
}

export interface ServicePageData {
  /** Endereço da página */
  path: string;
  metaTitle: string;
  metaDescription: string;
  crumb: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** Assunto que aparece na mensagem de WhatsApp */
  topic: string;
  /** De qual categoria do portfólio saem as fotos do topo */
  portfolioCategory: PortfolioCategory;
  quickAnswer: string;
  included: string[];
  sections: ServiceSection[];
  faq: FaqItem[];
}

/** Etapas da contratação (iguais nas duas páginas) */
export const contractSteps = [
  {
    numeral: "I",
    title: "Contato pelo WhatsApp",
    text: "Você conta a data, o local e o tipo de evento.",
  },
  {
    numeral: "II",
    title: "Orçamento sob medida",
    text: "Entendemos o que você imagina e montamos a proposta só com os itens que fazem sentido, já com o deslocamento incluído.",
  },
  {
    numeral: "III",
    title: "Reserva e planejamento",
    text: "A data é reservada e tudo o que foi combinado fica por escrito, em contrato. Antes do evento, montamos juntos o roteiro dos momentos que não podem faltar.",
  },
  {
    numeral: "IV",
    title: "Entrega",
    text: "Fotos tratadas em galeria online privada e, conforme o pacote, filme e álbum.",
  },
];

const region =
  "Somos de Manoel Ribas, no Paraná, e atendemos toda a região Sul, com deslocamento planejado e já incluído no orçamento. Em cidades próximas, chegamos com folga para o começo do evento; em destinos mais distantes, viagem e hospedagem são combinadas antes e informadas no orçamento.";

export const weddingPage: ServicePageData = {
  path: "/fotografo-de-casamento",
  metaTitle: "Fotógrafo de Casamento em Manoel Ribas e no Paraná",
  metaDescription:
    "Fotógrafo de casamento em Manoel Ribas/PR e região Sul. Fotografia e filmagem com olhar documental e direção artística: emoções reais, retratos elegantes e imagens feitas para atravessar gerações.",
  crumb: "Fotógrafo de Casamento",
  eyebrow: "Casamento · Manoel Ribas/PR e região Sul",
  title: "Fotógrafo de Casamento",
  lead: "Fotografia de casamento com olhar documental e direção artística: emoções reais, retratos elegantes e imagens feitas para atravessar gerações.",
  topic: "Fotógrafo de Casamento",
  portfolioCategory: "Casamentos",
  quickAnswer: `Procurando fotógrafo de casamento em Manoel Ribas/PR e região Sul? A ${site.name} faz a cobertura completa em foto e filme, do making-of à festa, com mais de 700 casamentos no currículo desde 2014. O orçamento é montado sob medida, já com o deslocamento, e sai direto pelo WhatsApp.`,
  included: [
    "Making-of da noiva e do noivo",
    "Cerimônia completa, religiosa ou ao ar livre",
    "Retratos do casal, da família e dos padrinhos",
    "Recepção e festa até o último abraço",
    "Ensaio pré-wedding (opcional)",
    "Galeria online privada e álbum premium, conforme o pacote",
  ],
  sections: [
    {
      title: "Região atendida",
      paragraphs: [region],
    },
    {
      title: "Quanto custa um fotógrafo de casamento?",
      paragraphs: [
        "O valor depende principalmente de quatro pontos: quantas horas de cobertura vocês precisam, quais momentos querem registrar (making-of, cerimônia, festa, pré-wedding), se haverá filmagem junto com as fotos e quais produtos entram no pacote, como o álbum impresso. Para eventos fora de Manoel Ribas, o deslocamento também entra na conta, e já aparece no orçamento, sem surpresa depois.",
        "Pelo WhatsApp a gente monta com vocês o pacote item por item e envia o orçamento.",
      ],
    },
    {
      title: "Fotógrafo e videomaker na mesma equipe",
      paragraphs: [
        "Muitos casais buscam fotógrafo e filmmaker juntos, e faz sentido. Com a mesma equipe, foto e filme conversam entre si, ninguém disputa o mesmo ângulo na cerimônia e o cronograma do dia fica mais simples. Oferecemos fotografia e filmagem, que podem ser contratadas juntas ou separadas.",
      ],
    },
    {
      title: "Como funciona o dia",
      paragraphs: [
        "Antes do casamento, montamos com vocês (e com a assessoria, se houver) o cronograma de fotos: horário do making-of, lista de fotos com a família, momento dos retratos do casal e o melhor horário de luz. No dia, chegamos com antecedência e registramos tudo de forma discreta, para que vocês vivam a festa sem preocupação.",
      ],
    },
    {
      title: "Como escolher o fotógrafo do casamento",
      paragraphs: [
        "Antes de fechar, vale olhar casamentos completos, e não só as melhores fotos, conferir se o estilo combina com vocês e entender exatamente o que o pacote inclui. Também ajuda conversar com calma: o fotógrafo passa o dia inteiro ao lado do casal, e sentir-se à vontade com ele aparece nas fotos.",
      ],
    },
  ],
  faq: [
    {
      question: "Vocês fotografam casamentos em Manoel Ribas/PR e região?",
      answer:
        "Sim. Somos de Manoel Ribas/PR e atendemos casamentos no Paraná e na região Sul. O deslocamento é planejado com antecedência e já vem incluído no orçamento.",
    },
    {
      question: "Com quanto tempo de antecedência devo reservar a data?",
      answer:
        "Assim que a data e o local estiverem definidos. As datas mais procuradas costumam ser reservadas com muitos meses de antecedência.",
    },
    {
      question: "Vocês fazem foto e filmagem no mesmo casamento?",
      answer:
        "Sim. Oferecemos fotografia e filmagem, que podem ser contratadas juntas ou separadas.",
    },
    {
      question: "Como são entregues as fotos do casamento?",
      answer:
        "As fotos tratadas são entregues em galeria online privada, na Área do Cliente, e, conforme o pacote, também em álbum premium.",
    },
  ],
};

export const debutPage: ServicePageData = {
  path: "/fotografo-de-15-anos",
  metaTitle: "Fotógrafo de 15 Anos em Manoel Ribas e Região",
  metaDescription:
    "Fotógrafo de 15 anos em Manoel Ribas/PR e região Sul. Os 15 anos são uma transição mágica e merecem um registro à altura: ensaio, making-of, a entrada, a valsa e cada abraço da festa.",
  crumb: "Fotógrafo de 15 Anos",
  eyebrow: "15 anos · Manoel Ribas/PR e região Sul",
  title: "Fotógrafo de 15 Anos",
  lead: "Os 15 anos são uma transição mágica, e merecem um registro à altura: ensaio, making-of, a entrada, a valsa e cada abraço da festa.",
  topic: "Fotógrafo de 15 Anos",
  portfolioCategory: "15 Anos",
  quickAnswer: `Procurando fotógrafo de 15 anos em Manoel Ribas/PR e região? Fotografamos a festa da debutante com cobertura completa em foto e filme: ensaio pré-debut, making-of da debutante, festa e recepção, com álbum e filme da festa como opções.`,
  included: [
    "Ensaio pré-debut",
    "Making-of da debutante",
    "Festa e recepção completas",
    "Galeria online privada",
    "Álbum e quadro, conforme o pacote",
    "Filme da festa e do ensaio (opcional)",
  ],
  sections: [
    {
      title: "Região atendida",
      paragraphs: [region],
    },
    {
      title: "Foto e filmagem para 15 anos",
      paragraphs: [
        "A festa de 15 anos tem momentos que só acontecem uma vez: a entrada, a troca do sapato, a valsa com o pai, as homenagens. Por isso oferecemos fotografia e filmagem, juntas ou separadas, com filme da festa e do ensaio pré-debut. Montamos o pacote item por item com você pelo WhatsApp.",
      ],
    },
    {
      title: "O ensaio pré-debut",
      paragraphs: [
        "O ensaio antes da festa é o momento da debutante brilhar sem pressa: em estúdio ou em locações externas, com direção para que ela se sinta à vontade. As fotos podem ser usadas no convite, no telão e na decoração da festa, por isso vale fazer o ensaio algumas semanas antes, com tempo para preparar tudo sem correria.",
      ],
    },
    {
      title: "Os momentos que não podem faltar",
      paragraphs: [],
      bullets: [
        "A entrada da debutante e a reação dos pais;",
        "A troca do sapato e a valsa;",
        "As homenagens, os discursos e a cerimônia das velas;",
        "A pista cheia e os amigos reunidos;",
        "Os detalhes da decoração, antes de os convidados chegarem.",
      ],
      closing: [
        "Antes da festa, montamos com a família e o cerimonial o roteiro desses momentos, para que nenhum deles passe sem registro.",
      ],
    },
  ],
  faq: [
    {
      question: "Vocês fotografam festas de 15 anos em Manoel Ribas/PR e região?",
      answer:
        "Sim. Atendemos festas de 15 anos em Manoel Ribas/PR e na região Sul, com fotografia e filmagem e deslocamento incluído no orçamento.",
    },
    {
      question: "O que está incluído na cobertura de 15 anos?",
      answer:
        "Ensaio pré-debut, making-of, festa e recepção, além de opções como álbum, quadro e filme da festa, conforme o pacote escolhido.",
    },
    {
      question: "Fazem filmagem da festa de 15 anos?",
      answer:
        "Sim. Oferecemos filme da festa e do ensaio pré-debut, que podem ser contratados junto com a fotografia ou separadamente.",
    },
  ],
};