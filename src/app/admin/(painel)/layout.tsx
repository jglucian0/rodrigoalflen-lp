import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import LogoutButton from "@/components/cliente/LogoutButton";
import { requireAdmin } from "@/lib/auth/guards";
import { site } from "@/lib/site";
export const instant = false;

async function AdminFrame({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="adm">
      <header className="adm__bar">
        <div className="adm__bar-inner">
          <Link href="/admin" className="adm__brand">
            <strong>Painel</strong>
            <span>{site.name}</span>
          </Link>

          <nav className="adm__nav" aria-label="Painel">
            <Link href="/admin">Clientes</Link>
            <Link href="/" target="_blank">
              Ver site
            </Link>
          </nav>

          <div className="adm__user">
            <span>{admin.name}</span>
            <LogoutButton
              redirectTo="/admin/entrar"
              className="btn btn--outline btn--sm"
            />
          </div>
        </div>
      </header>

      <main className="adm__main">{children}</main>
    </div>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="adm" aria-busy="true" />}>
      <AdminFrame>{children}</AdminFrame>
    </Suspense>
  );
}
