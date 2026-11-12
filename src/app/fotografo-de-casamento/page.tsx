import type { Metadata } from "next";
import ServicePage from "@/components/servicos/ServicePage";
import { weddingPage } from "@/lib/service-pages";
import { site } from "@/lib/site";
import { testimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: `${weddingPage.metaTitle} | ${site.name}`,
  description: weddingPage.metaDescription,
  alternates: { canonical: weddingPage.path },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: weddingPage.metaTitle,
    description: weddingPage.metaDescription,
    url: weddingPage.path,
  },
};

export default function WeddingPage() {
  return <ServicePage data={weddingPage} testimonial={testimonials[1]} />;
}
