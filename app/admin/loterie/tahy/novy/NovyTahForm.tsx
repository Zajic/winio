"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createLoterieTah } from "../../actions";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

type P = {
  id: string;
  nazev: string;
  loterie_operatori: { nazev: string } | null;
};

export function NovyTahForm({ produkty }: { produkty: P[] }) {
  const [state, formAction, pending] = useActionState(
    async (_: { error?: string; ok?: boolean } | null, fd: FormData) => {
      const r = await createLoterieTah(fd);
      if (r.error) return { error: r.error };
      window.location.href = "/admin/loterie/tahy";
      return { ok: true };
    },
    null
  );

  return (
    <>
      {state?.error && <p className="text-sm text-red-600 mb-4">{state.error}</p>}
      <form action={formAction} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1">Produkt *</label>
          <select name="produkt_id" required className={inp}>
            <option value="">— vyberte —</option>
            {produkty.map((p) => {
              const op = Array.isArray(p.loterie_operatori)
                ? p.loterie_operatori[0]
                : p.loterie_operatori;
              return (
                <option key={p.id} value={p.id}>
                  {(op?.nazev ?? "?") + " – " + p.nazev}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Datum a čas losování *</label>
          <input name="datum_losovani" type="datetime-local" required className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Výsledek (text) *</label>
          <textarea
            name="vysledek_text"
            required
            rows={3}
            placeholder="např. 3, 12, 19, 28, 41, 48"
            className={inp}
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
            Uložit tah
          </button>
          <Link href="/admin/loterie/tahy" className="px-4 py-2 text-sm border rounded">
            Zrušit
          </Link>
        </div>
      </form>
    </>
  );
}
