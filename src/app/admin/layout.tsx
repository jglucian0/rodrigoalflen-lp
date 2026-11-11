import type { Metadata } from "next";
import type { ReactNode } from "react";

// Área restrita: fora do Google e sem rastros em redes sociais
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
