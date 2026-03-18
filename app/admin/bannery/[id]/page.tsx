import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BannerForm } from "../BannerForm";
import { DeleteBannerButton } from "../DeleteBannerButton";
import type { Banner } from "@/types/db";

type Props = { params: Promise<{ id: string }> };

export default async function AdminBannerEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: banner, error } = await supabase
    .from("bannery")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !banner) notFound();

  return (
    <div>
      <p className="mb-4">
        <Link href="/admin/bannery" className="text-blue-600 hover:underline">
          ← Zpět na bannery
        </Link>
      </p>
      <h1 className="text-2xl font-semibold mb-6">Upravit banner</h1>
      <BannerForm banner={banner as Banner} />
      <div className="mt-8 pt-6 border-t border-gray-200">
        <DeleteBannerButton id={id} />
      </div>
    </div>
  );
}
