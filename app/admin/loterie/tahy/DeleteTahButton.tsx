"use client";

import { useTransition } from "react";
import { deleteLoterieTah } from "../actions";

export function DeleteTahButton({ id }: { id: string }) {
  const [p, start] = useTransition();
  return (
    <button
      type="button"
      disabled={p}
      onClick={() => {
        if (!confirm("Smazat tah?")) return;
        start(async () => {
          const r = await deleteLoterieTah(id);
          if (r.error) alert(r.error);
          else window.location.reload();
        });
      }}
      className="text-xs text-red-600 hover:underline"
    >
      Smazat
    </button>
  );
}
