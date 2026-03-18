"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPoradna, updatePoradna } from "./actions";
import type { Poradna } from "@/types/db";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

export function PoradnaForm({ polozka }: { polozka?: Poradna | null }) {
  const isEdit = !!polozka;
  const [state, formAction, pending] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      if (isEdit && polozka) {
        const r = await updatePoradna(polozka.id, fd);
        return r.error ? { error: r.error } : null;
      }
      const r = await createPoradna(fd);
      if (r.error) return { error: r.error };
      if (r.id) window.location.href = `/admin/poradna/${r.id}`;
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Titulek *</label>
        <input name="titul" required defaultValue={polozka?.titul} className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Slug *</label>
        <input name="slug" required defaultValue={polozka?.slug} className={`${inp} font-mono`} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Kategorie</label>
        <select name="kategorie" defaultValue={polozka?.kategorie ?? "faq"} className={inp}>
          <option value="faq">FAQ</option>
          <option value="adiktologie">Adiktologie</option>
          <option value="pomoc">Pomoc</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Pořadí (číslo)</label>
        <input
          name="razeni"
          type="number"
          defaultValue={polozka?.razeni ?? 0}
          className="w-32 border rounded px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tělo (HTML)</label>
        <textarea name="telo" rows={12} defaultValue={polozka?.telo ?? ""} className={inp} />
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={pending} className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          {isEdit ? "Uložit" : "Vytvořit"}
        </button>
        <Link href="/admin/poradna" className="px-4 py-2 text-sm border rounded">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
