import type { ReactNode } from "react";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import {
  jsonLd,
  metadata as seoMetadata,
  viewport as seoViewport,
} from "@/lib/seo";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--nf-display",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--nf-sans",
  display: "swap",
});

const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--nf-script",
  display: "swap",
});

export const metadata = seoMetadata;
export const viewport = seoViewport;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} ${script.variable}`}
    >
      <body id="topo">
        {/* <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a> */}
        {children}
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </body>
    </html>
  );
}
