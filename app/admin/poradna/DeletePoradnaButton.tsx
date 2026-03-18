"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePoradna } from "./actions";

export function DeletePoradnaButton({ id }: { id: string }) {
  const router = useRouter();
  const [p, start] = useTransition();
  return (
    <button
      type="button"
      disabled={p}
      onClick={() => {
        if (!confirm("Smazat stránku poradny?")) return;
        start(async () => {
          const r = await deletePoradna(id);
          if (r.error) alert(r.error);
          else router.push("/admin/poradna");
        });
      }}
      className="text-sm text-red-600 border rounded px-3 py-1.5"
    >
      Smazat
    </button>
  );
}
