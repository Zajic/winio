"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLoterieProdukt } from "./actions";

export function DeleteProduktButton({ id }: { id: string }) {
  const router = useRouter();
  const [p, start] = useTransition();
  return (
    <button
      type="button"
      disabled={p}
      onClick={() => {
        if (!confirm("Smazat produkt a všechny jeho tahy?")) return;
        start(async () => {
          const r = await deleteLoterieProdukt(id);
          if (r.error) alert(r.error);
          else router.push("/admin/loterie/produkty");
        });
      }}
      className="text-sm text-red-600 border rounded px-3 py-1.5"
    >
      Smazat produkt
    </button>
  );
}
