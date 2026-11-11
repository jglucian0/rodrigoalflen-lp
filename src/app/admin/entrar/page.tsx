import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getSession } from "@/lib/auth/session";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Painel | ${site.name}`,
  robots: { index: false, follow: false },
};

async function Gate() {
  const session = await getSession();
  if (session?.user.role === "admin") redirect("/admin");
  return <AdminLoginForm />;
}

export default function AdminLoginPage() {
  return (
    <main className="auth auth--bare">
      <div className="auth__wrap">
        <span className="eyebrow">Área restrita</span>
        <h1 className="section-title">
          Painel do <em>administrador</em>
        </h1>

        <div className="auth__card">
          <div className="auth__frame">
            <Suspense
              fallback={
                <p className="auth__hint" aria-busy="true">
                  Carregando…
                </p>
              }
            >
              <Gate />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
