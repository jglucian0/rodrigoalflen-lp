import type { ReactNode } from "react";
import {
  BookOpenIcon,
  CloudUploadIcon,
  HourglassIcon,
  UsersIcon,
} from "../ui/Icons";
import SectionHeading from "../ui/SectionHeading";

const tips: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <CloudUploadIcon />,
    title: "Faça backup em dois lugares",
    text: "Guarde as fotos no computador e em uma nuvem (Google Drive, iCloud, OneDrive). Celular perdido não pode levar suas memórias junto.",
  },
  {
    icon: <HourglassIcon />,
    title: "Não deixe para depois",
    text: "A galeria fica no ar por 365 dias. Marque um lembrete e baixe tudo nas primeiras semanas.",
  },
  {
    icon: <UsersIcon />,
    title: "Compartilhe com a família",
    text: "Envie as favoritas para quem esteve com você — e marque a gente no Instagram, vamos amar ver!",
  },
  {
    icon: <BookOpenIcon />,
    title: "Imprima suas favoritas",
    text: "Fotos na tela emocionam, mas um álbum ou um quadro na parede é outra sensação. Pergunte sobre as opções de álbum.",
  },
];

export default function ClientTips() {
  return (
    <section className="section cl-tips">
      <div className="container cl-tips__grid">
        <SectionHeading
          eyebrow="Dicas"
          title={
            <>
              Para suas fotos <em>durarem para sempre</em>
            </>
          }
          description="Pequenos cuidados que fazem toda a diferença depois que a galeria chega."
        />

        <ul className="cl-tips__cards">
          {tips.map((tip) => (
            <li key={tip.title} className="cl-tip">
              <span className="cl-tip__ico" aria-hidden>
                {tip.icon}
              </span>
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
