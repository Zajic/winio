"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteHra } from "./actions";

export function DeleteHraButton({ id }: { id: string }) {
  const router = useRouter();
  const [p, start] = useTransition();
  return (
    <button
      type="button"
      disabled={p}
      onClick={() => {
        if (!confirm("Smazat hru?")) return;
        start(async () => {
          const r = await deleteHra(id);
          if (r.error) alert(r.error);
          else router.push("/admin/hry");
        });
      }}
      className="text-sm text-red-600 border rounded px-3 py-1.5"
    >
      Smazat hru
    </button>
  );
}
