import type { Metadata } from "next";
import AuthShell from "@/components/cliente/AuthShell";
import ForgotPasswordForm from "@/components/cliente/ForgotPasswordForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Recuperar acesso | ${site.name}`,
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      crumb="Recuperar senha"
      eyebrow="Recuperar acesso"
      title={
        <>
          Esqueceu sua <em>senha?</em>
        </>
      }
      lead="Informe o e-mail cadastrado. Enviaremos um link para criar uma nova senha e também o seu login, caso tenha esquecido."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
