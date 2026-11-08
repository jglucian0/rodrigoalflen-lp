import About from "@/components/About";
import AvailabilityCta from "@/components/AvailabilityCta";
import AwardsMarquee from "@/components/AwardsMarquee";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <AwardsMarquee />
        <Manifesto />
        <Services />
        <Portfolio />
        {/* "Sobre" engloba About + Process (o menu continua ativo em "Como funciona") */}
        <div id="sobre">
          <About />
          <Process />
        </div>
        <Testimonials />
        <Faq />
        {/* <BlogPreview /> */}
        <AvailabilityCta />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
