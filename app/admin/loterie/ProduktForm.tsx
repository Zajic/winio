"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createLoterieProdukt, updateLoterieProdukt } from "./actions";
import type { LoterieOperator, LoterieProdukt } from "@/types/db";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

type Props = {
  operatori: Pick<LoterieOperator, "id" | "nazev">[];
  produkt?: LoterieProdukt | null;
  defaultOperatorId?: string;
};

export function ProduktForm({ operatori, produkt, defaultOperatorId }: Props) {
  const isEdit = !!produkt;
  const [state, formAction, pending] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      if (isEdit && produkt) {
        const r = await updateLoterieProdukt(produkt.id, fd);
        return r.error ? { error: r.error } : null;
      }
      const r = await createLoterieProdukt(fd);
      if (r.error) return { error: r.error };
      if (r.id) window.location.href = `/admin/loterie/produkty/${r.id}`;
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Operátor *</label>
        <select
          name="operator_id"
          required
          defaultValue={produkt?.operator_id ?? defaultOperatorId ?? ""}
          className={inp}
        >
          <option value="">—</option>
          {operatori.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nazev}
            </option>
          ))}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Název hry *</label>
          <input name="nazev" required defaultValue={produkt?.nazev} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required defaultValue={produkt?.slug} className={`${inp} font-mono`} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Typ</label>
        <select name="typ" defaultValue={produkt?.typ ?? "cislovana"} className={inp}>
          <option value="cislovana">Číselná loterie</option>
          <option value="stiraci">Stírací</option>
          <option value="jine">Jiné</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Popis</label>
        <textarea name="popis" rows={2} defaultValue={produkt?.popis ?? ""} className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL oficiálních výsledků</label>
        <input
          name="oficialni_vysledky_url"
          type="url"
          defaultValue={produkt?.oficialni_vysledky_url ?? ""}
          className={inp}
        />
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="aktivni" defaultChecked={produkt?.aktivni !== false} />
          Aktivní
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm">Pořadí</span>
          <input
            name="poradi"
            type="number"
            defaultValue={produkt?.poradi ?? 0}
            className="w-24 border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={pending} className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          {isEdit ? "Uložit" : "Vytvořit"}
        </button>
        <Link href="/admin/loterie/produkty" className="px-4 py-2 text-sm border rounded">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
