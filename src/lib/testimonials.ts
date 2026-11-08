/** Vídeo local, em /public/Depoimento (não depende do YouTube) */
export const testimonialVideo = {
  src: "/depoimento/videoDepoimento.mp4",
  poster: "/depoimento/capaDepoimento.webp",
  title: "Casamento · Camila & Fernando",
} as const;

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
  /** Foto de perfil do casal (círculo). Opcional: sem ela, mostra o placeholder. */
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Eu cheguei em casa, primeira coisa que fiz foi colocar na televisão o vídeo... chorei horrores! A edição, a produção de vocês é simplesmente maravilhosa, não tem outra palavra que defina. É muito gostoso ver a forma como vocês trataram com carinho. Muito obrigada por fazer parte desse momento da nossa vida.",
    author: "Camila & Fernando",
    context: "Casamento",
    avatar: "/depoimento/camila_depoimento.webp",
  },
  {
    quote:
      "Rodrigo é simplesmente incrível! As fotos do nosso casamento ficaram ainda mais lindas do que imaginávamos. Cada detalhe foi capturado com muito cuidado e sensibilidade. Profissional nota 10, pessoa nota 1000!",
    author: "Priscila & Lucas",
    context: "Casamento",
    avatar: "/depoimento/priscila_depoimento.webp",
  },
  {
    quote:
      "Muito atencioso desde o inicio com cada detalhe, desde o pré wedding e principalmente no dia do casamento, cuidadoso com cada detalhe que os noivos fizeram, desde a ênfase na cerimônia até o momento de encerrar o atendimento.",
    author: "Julia & Nestor",
    context: "Casamento",
    avatar: "/depoimento/julia_depoimento.webp",
  },
];