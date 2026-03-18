"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createHra, updateHra } from "./actions";
import type { Hra, Kasino } from "@/types/db";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

type Props = { hra?: Hra | null; kasina: Kasino[]; vybraneKasinoIds: string[] };

export function HraForm({ hra, kasina, vybraneKasinoIds }: Props) {
  const isEdit = !!hra;
  const selected = new Set(vybraneKasinoIds);
  const [state, formAction, pending] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      if (isEdit && hra) {
        const r = await updateHra(hra.id, fd);
        return r.error ? { error: r.error } : null;
      }
      const r = await createHra(fd);
      if (r.error) return { error: r.error };
      if (r.id) window.location.href = `/admin/hry/${r.id}`;
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
          <input name="nazev" required defaultValue={hra?.nazev} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required defaultValue={hra?.slug} className={`${inp} font-mono`} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Typ</label>
        <select name="typ" defaultValue={hra?.typ ?? "automat"} className={inp}>
          <option value="automat">Automat</option>
          <option value="ruleta">Ruleta</option>
          <option value="stolni_hra">Stolní hra</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Popis</label>
        <textarea name="popis" rows={3} defaultValue={hra?.popis ?? ""} className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Obrázek URL</label>
        <input name="obrazek_url" type="url" defaultValue={hra?.obrazek_url ?? ""} className={inp} />
      </div>
      <fieldset className="border rounded-lg p-4">
        <legend className="text-sm font-medium px-1">Kde hrát (kasina)</legend>
        <div className="grid sm:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
          {kasina.map((k) => (
            <label key={k.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="kasino_ids" value={k.id} defaultChecked={selected.has(k.id)} />
              {k.nazev}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={pending} className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          {isEdit ? "Uložit" : "Vytvořit"}
        </button>
        <Link href="/admin/hry" className="px-4 py-2 text-sm border rounded">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
