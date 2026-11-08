import { services } from "@/lib/services";
import Placeholder from "./ui/Placeholder";
import { ArrowRightIcon } from "./ui/Icons";
import SectionHeading from "./ui/SectionHeading";

export default function Services() {
  return (
    <section id="servicos" className="section services">
      <div className="container">
        <SectionHeading
          eyebrow="O que fazemos"
          title={
            <>
              Serviços <em>exclusivos</em>
            </>
          }
          description="Uma experiência personalizada, adaptada a cada cliente, para criar registros únicos e autênticos."
        />

        <div className="services__grid">
          <ol className="services__list">
            {services.map((service) => (
              <li key={service.number}>
                <a href={service.href} className="service">
                  <span className="service__number">{service.number}</span>
                  <span className="service__title">{service.title}</span>
                  <span className="service__desc">{service.description}</span>
                  <span className="service__arrow">
                    <ArrowRightIcon width={12} height={12} />
                  </span>
                </a>
              </li>
            ))}
          </ol>

          <div className="arch services__arch" aria-hidden>
            <Placeholder alt="" ratio="portrait" tone={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
