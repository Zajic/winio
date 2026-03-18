import Link from "next/link";
import { OperatorForm } from "../../OperatorForm";

export default function NovyOperatorPage() {
  return (
    <div>
      <Link href="/admin/loterie/operatori" className="text-sm text-blue-600 hover:underline">
        ← Operátoři
      </Link>
      <h1 className="text-2xl font-semibold my-6">Nový operátor</h1>
      <OperatorForm />
    </div>
  );
}
