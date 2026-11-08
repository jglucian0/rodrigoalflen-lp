import { awards } from "@/lib/site";

/** Repetições da lista dentro de cada grupo (garante cobrir telas largas) */
const REPEAT = 3;

export default function AwardsMarquee() {
  const items = Array.from({ length: REPEAT }).flatMap(() => [...awards]);

  return (
    <div className="marquee" aria-label="Prêmios e reconhecimentos">
      <div className="marquee__track">
        {[0, 1].map((group) => (
          // O 2º grupo é só cópia visual: escondido de leitores de tela
          <ul key={group} className="marquee__group" aria-hidden={group === 1}>
            {items.map((item, i) => (
              <li
                key={`${group}-${i}`}
                className="marquee__item"
                aria-hidden={i >= awards.length}
              >
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
