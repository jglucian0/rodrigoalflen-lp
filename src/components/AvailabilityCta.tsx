import Image from "next/image";
import { WHATSAPP_AVAILABILITY_MESSAGE, whatsappLink } from "@/lib/site";
import Reveal from "./ui/Reveal";
import { WhatsappIcon } from "./ui/Icons";

export default function AvailabilityCta() {
  return (
    <section
      className="cta"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Imagem decorativa de fundo */}
      <Image
        src="/banner-cta.webp"
        alt="" // alt vazio por ser puramente decorativa (melhor para acessibilidade)
        fill
        style={{
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.15, // Ajuste este valor (0.0 a 1.0) para definir a transparência
          zIndex: 0,
        }}
        quality={80}
      />

      {/* Conteúdo encapsulado com zIndex para garantir que renderize acima da imagem */}
      <div
        className="container cta__inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Reveal>
          <h2 className="cta__title">
            <span className="cta__script">sua data</span>
            Está <em>disponível?</em>
          </h2>
          <p className="cta__lead">
            As melhores datas se esgotam rapidamente. Verifique agora a
            disponibilidade e garanta o registro perfeito desse momento.
          </p>
          <a
            href={whatsappLink(WHATSAPP_AVAILABILITY_MESSAGE)}
            className="btn btn--cream"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappIcon />
            Verificar disponibilidade
          </a>
        </Reveal>
      </div>
    </section>
  );
}
