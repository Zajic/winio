"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createKasino, updateKasino } from "./actions";
import type { Kasino } from "@/types/db";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

export function KasinoForm({ kasino }: { kasino?: Kasino | null }) {
  const isEdit = !!kasino;
  const [state, formAction, pending] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      if (isEdit && kasino) {
        const r = await updateKasino(kasino.id, fd);
        return r.error ? { error: r.error } : null;
      }
      const r = await createKasino(fd);
      if (r.error) return { error: r.error };
      if (r.id) window.location.href = `/admin/kasina/${r.id}`;
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
          <input name="nazev" required defaultValue={kasino?.nazev} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required defaultValue={kasino?.slug} className={`${inp} font-mono`} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Affiliate URL</label>
        <input name="affiliate_url" type="url" defaultValue={kasino?.affiliate_url ?? ""} className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Popis</label>
        <textarea name="popis" rows={3} defaultValue={kasino?.popis ?? ""} className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Licence</label>
        <input name="licence" defaultValue={kasino?.licence ?? ""} className={inp} />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="aktivni" defaultChecked={kasino?.aktivni !== false} />
          Aktivní
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="placene_umisteni" defaultChecked={kasino?.placene_umisteni} />
          Placené umístění
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={pending} className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          {isEdit ? "Uložit" : "Vytvořit"}
        </button>
        <Link href="/admin/kasina" className="px-4 py-2 text-sm border rounded">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
