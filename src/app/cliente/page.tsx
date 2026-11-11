import type { Metadata } from "next";
import ClientHero from "@/components/cliente/ClientHero";
import ClientTips from "@/components/cliente/ClientTips";
import Faq from "@/components/Faq";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Process from "@/components/Process";
import SmoothAnchors from "@/components/SmoothAnchors";
import { clientFaq, clientSteps } from "@/lib/client-area";
import { getHeroSlides } from "@/lib/hero-images";
import { site, whatsappLink } from "@/lib/site";
import { Suspense } from "react";
import LoggedInRedirect from "@/components/cliente/LoggedInRedirect";

export const metadata: Metadata = {
  title: `Área do Cliente | ${site.name}`,
  description: `Acesse sua galeria privada da ${site.name}: veja e baixe suas fotos em alta resolução, pelo celular ou computador.`,
  alternates: { canonical: "/cliente" },
  robots: { index: true, follow: true },
};

export default async function ClientPage() {
  const slides = await getHeroSlides();

  return (
    <>
      <Header />
      <SmoothAnchors />

      <main id="conteudo">
        <Suspense fallback={null}>
          <LoggedInRedirect />
        </Suspense>

        <ClientHero slides={slides} />

        <Process
          id="como-acessar"
          eyebrow="Passo a passo"
          title={
            <>
              Como acessar <em>sua galeria</em>
            </>
          }
          steps={clientSteps}
        />

        <ClientTips />

        <Faq
          items={clientFaq}
          multiple
          lead={
            <>
              Não encontrou a resposta?{" "}
              <a href={whatsappLink()} className="link-underline">
                Chame no WhatsApp
              </a>
              .
            </>
          }
        />
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
