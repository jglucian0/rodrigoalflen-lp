import Reveal from "./ui/Reveal";

export default function Manifesto() {
  return (
    <section id="manifesto" className="manifesto">
      <div className="container">
        <Reveal>
          <p className="manifesto__name">Rodrigo Alflen</p>
          <p className="manifesto__text">
            Cada casal tem uma história única. Meu trabalho é <em>revelá-la</em>{" "}
            através de imagens autênticas, que misturam o{" "}
            <em>documental espontâneo</em> com uma direção artística cuidadosa —
            feitas para <em>resistir ao tempo</em>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
