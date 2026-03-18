"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMisto } from "./actions";

export function DeleteMistoButton({ id }: { id: string }) {
  const router = useRouter();
  const [p, start] = useTransition();
  return (
    <button
      type="button"
      disabled={p}
      onClick={() => {
        if (!confirm("Smazat místo z mapy?")) return;
        start(async () => {
          const r = await deleteMisto(id);
          if (r.error) alert(r.error);
          else router.push("/admin/mista");
        });
      }}
      className="text-sm text-red-600 border rounded px-3 py-1.5"
    >
      Smazat
    </button>
  );
}
