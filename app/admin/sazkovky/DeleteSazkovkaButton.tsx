"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSazkovka } from "./actions";

export function DeleteSazkovkaButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Smazat sázkovku? (může selhat, pokud existují závislosti.)")) return;
        start(async () => {
          const r = await deleteSazkovka(id);
          if (r.error) alert(r.error);
          else router.push("/admin/sazkovky");
        });
      }}
      className="text-sm text-red-600 border border-red-200 rounded px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Mažu…" : "Smazat sázkovku"}
    </button>
  );
}
