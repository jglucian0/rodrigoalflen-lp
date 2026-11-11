import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface AuthShellProps {
  crumb: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  children: ReactNode;
}

/** Moldura das telas de acesso (recuperar e redefinir senha) */
export default function AuthShell({
  crumb,
  eyebrow,
  title,
  lead,
  children,
}: AuthShellProps) {
  return (
    <>
      <Header />
      <main id="conteudo" className="auth">
        <div className="auth__wrap">
          <nav className="legal-crumbs" aria-label="Você está em">
            <Link href="/">Início</Link>
            <span aria-hidden>/</span>
            <Link href="/cliente">Área do Cliente</Link>
            <span aria-hidden>/</span>
            <span aria-current="page">{crumb}</span>
          </nav>

          <span className="eyebrow">{eyebrow}</span>
          <h1 className="section-title">{title}</h1>
          {lead && <p className="auth__lead">{lead}</p>}

          <div className="auth__card">
            <div className="auth__frame">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
