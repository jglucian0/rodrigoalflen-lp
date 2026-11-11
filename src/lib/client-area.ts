import type { FaqItem } from "./faq";

export const clientSteps = [
  {
    numeral: "I",
    title: "Receba seu acesso",
    text: "Quando sua galeria fica pronta, nossa equipe envia o seu login e a sua senha — os dois são só números.",
  },
  {
    numeral: "II",
    title: "Entre aqui",
    text: "Digite login e senha no formulário acima. Pode ser pelo celular, tablet ou computador, sem instalar nada.",
  },
  {
    numeral: "III",
    title: "Veja e baixe",
    text: "Você é levado direto para a sua galeria privada, com as fotos em alta resolução para baixar.",
  },
  {
    numeral: "IV",
    title: "Guarde com carinho",
    text: "A galeria fica disponível por 365 dias. Baixe tudo e faça uma cópia de segurança.",
  },
];

export const clientFaq: FaqItem[] = [
  {
    question: "Onde encontro meu login e minha senha?",
    answer:
      "Eles são enviados pela nossa equipe quando a sua galeria fica pronta. Os dois são apenas números. Se não encontrar, use “Esqueci minha senha” para receber o login por e-mail ou chame a gente no WhatsApp.",
  },
  {
    question: 'Digitei certo e aparece "login ou senha incorretos". E agora?',
    answer:
      "Confira se não há espaço ou número trocado — o login e a senha aceitam só números. Se continuar, fale com a gente pelo WhatsApp para verificarmos o seu acesso.",
  },
  {
    question: "Por quanto tempo a galeria fica disponível?",
    answer:
      "Por 365 dias. Recomendamos baixar tudo logo nas primeiras semanas e guardar uma cópia em nuvem.",
  },
  {
    question: "Consigo acessar e baixar pelo celular?",
    answer:
      "Sim. A galeria funciona direto no navegador do celular, sem instalar aplicativo.",
  },
  {
    question: "Posso fazer um álbum ou imprimir depois?",
    answer:
      "Pode. Fale com a gente pelo WhatsApp para conhecer as opções de álbum e impressão.",
  },
];