"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteClanek } from "./actions";

export function DeleteClanekButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Opravdu smazat článek?")) return;
    startTransition(async () => {
      const result = await deleteClanek(id);
      if (result?.error) {
        alert(result.error);
        return;
      }
      router.push("/admin/clanky");
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? "Mažu…" : "Smazat článek"}
    </button>
  );
}
