import type { Metadata } from "next";
import ServicePage from "@/components/servicos/ServicePage";
import { debutPage } from "@/lib/service-pages";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${debutPage.metaTitle} | ${site.name}`,
  description: debutPage.metaDescription,
  alternates: { canonical: debutPage.path },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: debutPage.metaTitle,
    description: debutPage.metaDescription,
    url: debutPage.path,
  },
};

export default function DebutPage() {
  return <ServicePage data={debutPage} />;
}
