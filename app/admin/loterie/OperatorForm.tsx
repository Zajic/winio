"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createLoterieOperator, updateLoterieOperator } from "./actions";
import type { LoterieOperator } from "@/types/db";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

export function OperatorForm({ op }: { op?: LoterieOperator | null }) {
  const isEdit = !!op;
  const [state, formAction, pending] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      if (isEdit && op) {
        const r = await updateLoterieOperator(op.id, fd);
        return r.error ? { error: r.error } : null;
      }
      const r = await createLoterieOperator(fd);
      if (r.error) return { error: r.error };
      if (r.id) window.location.href = `/admin/loterie/operatori/${r.id}`;
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{state.error}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Název *</label>
          <input name="nazev" required defaultValue={op?.nazev} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required defaultValue={op?.slug} className={`${inp} font-mono`} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Popis</label>
        <textarea name="popis" rows={4} defaultValue={op?.popis ?? ""} className={inp} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Licence</label>
          <input name="licence" defaultValue={op?.licence ?? ""} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Web URL</label>
          <input name="web_url" type="url" defaultValue={op?.web_url ?? ""} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Logo URL</label>
        <input name="logo_url" type="url" defaultValue={op?.logo_url ?? ""} className={inp} />
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="aktivni" defaultChecked={op?.aktivni !== false} />
          Aktivní
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm">Pořadí</span>
          <input
            name="poradi"
            type="number"
            defaultValue={op?.poradi ?? 0}
            className="w-24 border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={pending} className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          {isEdit ? "Uložit" : "Vytvořit"}
        </button>
        <Link href="/admin/loterie/operatori" className="px-4 py-2 text-sm border rounded">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
