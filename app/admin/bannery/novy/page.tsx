import Link from "next/link";
import { BannerForm } from "../BannerForm";

export default function AdminBannerNovyPage() {
  return (
    <div>
      <p className="mb-4">
        <Link href="/admin/bannery" className="text-blue-600 hover:underline">
          ← Zpět na bannery
        </Link>
      </p>
      <h1 className="text-2xl font-semibold mb-6">Nový banner</h1>
      <BannerForm />
    </div>
  );
}
