"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLoterieOperator } from "./actions";

export function DeleteOperatorButton({ id }: { id: string }) {
  const router = useRouter();
  const [p, start] = useTransition();
  return (
    <button
      type="button"
      disabled={p}
      onClick={() => {
        if (!confirm("Smazat operátora včetně všech produktů a tahů?")) return;
        start(async () => {
          const r = await deleteLoterieOperator(id);
          if (r.error) alert(r.error);
          else router.push("/admin/loterie/operatori");
        });
      }}
      className="text-sm text-red-600 border rounded px-3 py-1.5"
    >
      Smazat operátora
    </button>
  );
}
