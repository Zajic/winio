"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteKasino } from "./actions";

export function DeleteKasinoButton({ id }: { id: string }) {
  const router = useRouter();
  const [p, start] = useTransition();
  return (
    <button
      type="button"
      disabled={p}
      onClick={() => {
        if (!confirm("Smazat kasino?")) return;
        start(async () => {
          const r = await deleteKasino(id);
          if (r.error) alert(r.error);
          else router.push("/admin/kasina");
        });
      }}
      className="text-sm text-red-600 border rounded px-3 py-1.5 hover:bg-red-50"
    >
      {p ? "Mažu…" : "Smazat"}
    </button>
  );
}
