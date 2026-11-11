import Link from "next/link";
import ClientCreateForm from "@/components/admin/ClientCreateForm";
import { requireAdmin } from "@/lib/auth/guards";

export default async function NewClientPage() {
  await requireAdmin();

  return (
    <>
      <div className="adm__head">
        <div>
          <p className="adm__crumb">
            <Link href="/admin">Clientes</Link> / Novo
          </p>
          <h1 className="adm__title">
            Novo <em>cliente</em>
          </h1>
        </div>
      </div>

      <ClientCreateForm />
    </>
  );
}
