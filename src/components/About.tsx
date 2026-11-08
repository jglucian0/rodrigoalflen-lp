import Placeholder from "./ui/Placeholder";
import Image from "next/image";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export default function About() {
  return (
    <section className="section about">
      <div className="container about__grid">
        <Reveal className="about__media">
          <div className="about__panel" aria-hidden />
          <div className="arch about__arch">
            <Image
              src="/RodrigoESuelenAbout.webp"
              alt="Rodrigo e Suellen, fotógrafos em Manoel Ribas/PR"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <span className="about__badge">
            <small>Desde</small>
            <b>16 · 10 · 2014</b>
          </span>
        </Reveal>

        <Reveal className="about__content" delay={120}>
          <SectionHeading
            eyebrow="A história por trás das lentes"
            title={
              <>
                De Manoel Ribas para o mundo, <br />
                <em>através das lentes</em>
              </>
            }
          />

          <p className="about__dropcap">
            Minha história na fotografia começou de forma simples, mas sempre
            guiada pelo desejo de eternizar emoções. Nascido em Manoel Ribas,
            PR, percebi desde cedo que os instantes mais preciosos da vida
            mereciam ser guardados. Foi assim que, em 16 de outubro de 2014, dei
            meus primeiros passos oficiais registrando sentimentos através das
            lentes.
          </p>
          <p>
            A paixão pela arte visual me transformou, mas o capítulo mais bonito
            dessa jornada foi escrito ao lado da Suellen. Em 2018, demos um
            passo inesquecível e noivamos. A partir daquele momento, ela se
            tornou não apenas minha companheira de vida, mas também minha maior
            inspiração.
          </p>
          <p>
            Hoje, nossa caminhada é feita lado a lado. Dividimos os dias entre o
            aprofundamento constante nos estudos e as sessões fotográficas.
            Trabalhar ao lado de quem se ama traz uma sensibilidade única para o
            olhar; juntos, buscamos unir técnica e empatia, transformando a
            nossa própria cumplicidade na base do nosso trabalho.
          </p>
          <p>
            Cada evento que cobrimos se torna uma extensão da nossa própria
            história. Acreditamos que a fotografia é a herança visual de uma
            família, um legado contínuo que atravessa gerações e preserva o amor
            intacto contra o tempo.
          </p>

          <blockquote className="about__quote">
            <p>
              Sou grato a Deus, à minha esposa Suellen e a cada pessoa que nos
              confia o privilégio de eternizar seus momentos mais
              significativos.
            </p>
          </blockquote>
          <p className="about__sign">Rodrigo Alflen</p>
        </Reveal>
      </div>
    </section>
  );
}
