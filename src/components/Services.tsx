import { resolveServiceImage } from "@/lib/service-images";
import { services } from "@/lib/services";
import SectionHeading from "./ui/SectionHeading";
import ServicesDesktop from "./ServicesDesktop";
import ServicesPicker from "./ServicesPicker";

export default function Services() {
  const items = services.map((service) => ({
    ...service,
    image: resolveServiceImage(service.slug),
  }));

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

        {/* Desktop: lista + foto que troca no hover */}
        <ServicesDesktop items={items} />

        {/* Celular/tablet: abas + cartão (o CSS alterna entre os dois) */}
        <ServicesPicker services={services} />
      </div>
    </section>
  );
}
