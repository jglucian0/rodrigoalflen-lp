import { processSteps } from "@/lib/site";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export default function Process() {
  return (
    <section className="section process" aria-labelledby="como-funciona">
      <div className="container">
        <SectionHeading
          eyebrow="Como funciona"
          title={
            <>
              Da primeira conversa <em>ao álbum</em>
            </>
          }
          id="como-funciona"
        />

        <ol className="process__list">
          {processSteps.map((step, i) => (
            <li key={step.numeral}>
              <Reveal delay={i * 90} className="step">
                <span className="step__numeral">{step.numeral}</span>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__text">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
