import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthShell from "@/components/cliente/AuthShell";
import ResetPasswordForm from "@/components/cliente/ResetPasswordForm";
import { getResetTokenInfo } from "@/lib/auth/password-reset";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Nova senha | ${site.name}`,
  robots: { index: false, follow: false },
  referrer: "no-referrer", // o token na URL não vaza para outros sites
};

type Props = {
  searchParams: Promise<{ token?: string | string[] }>;
};

async function ResetGate({ searchParams }: Props) {
  const { token } = await searchParams;
  const value = typeof token === "string" && token.length <= 200 ? token : null;
  const info = value ? await getResetTokenInfo(value) : null;

  if (!value || !info) {
    return (
      <div className="auth__ok">
        <h2>Link inválido</h2>
        <p>Este link já foi usado ou expirou. Peça um novo para continuar.</p>
        <Link
          href="/cliente/recuperar-senha"
          className="btn btn--dark"
          style={{ marginTop: 20 }}
        >
          Pedir novo link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={value} role={info.role} />;
}

export default function ResetPasswordPage({ searchParams }: Props) {
  return (
    <AuthShell
      crumb="Nova senha"
      eyebrow="Recuperar acesso"
      title={
        <>
          Criar <em>nova senha</em>
        </>
      }
    >
      <Suspense
        fallback={
          <p className="auth__hint" aria-busy="true">
            Verificando link…
          </p>
        }
      >
        <ResetGate searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
