"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBanner } from "./actions";

export function DeleteBannerButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Opravdu smazat banner?")) return;
    startTransition(async () => {
      const result = await deleteBanner(id);
      if (result?.error) {
        alert(result.error);
        return;
      }
      router.push("/admin/bannery");
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? "Mažu…" : "Smazat banner"}
    </button>
  );
}
