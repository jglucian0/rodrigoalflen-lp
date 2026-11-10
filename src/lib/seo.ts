import type { Metadata, Viewport } from "next";
import { SITE_URL, site } from "./site";
import { faqItems } from "./faq";

const DESCRIPTION =
  "Fotógrafo em Manoel Ribas/PR com olhar artístico para momentos únicos. Cobertura de eventos, ensaios fotográficos e retratos na região do Paraná.";
const SHORT_DESCRIPTION =
  "Fotógrafo em Manoel Ribas/PR. Transformo momentos em memórias eternas através da fotografia.";
const TITLE = "Rodrigo Alflen Fotografia | Casamentos, Ensaios e Eventos";
const OG_IMAGE =
  "https://live.staticflickr.com/65535/55645653673_8297c4e604_b.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: site.name }],
  alternates: { canonical: SITE_URL + "/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    url: SITE_URL + "/",
    siteName: site.name,
    locale: "pt_BR",
    title: TITLE,
    description: SHORT_DESCRIPTION,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3E2A1F",
};

export const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Photographer",
    name: site.name,
    url: SITE_URL,
    telephone: "+5516981275977",
    email: site.email,
    foundingDate: "2012-10-21",
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Carlos",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    sameAs: Object.values(site.socials),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];