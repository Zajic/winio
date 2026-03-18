"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createMisto, updateMisto } from "./actions";
import type { Misto, Sazkovka, Kasino } from "@/types/db";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

type Props = {
  misto?: Misto | null;
  sazkovky: Pick<Sazkovka, "id" | "nazev">[];
  kasina: Pick<Kasino, "id" | "nazev">[];
};

export function MistoForm({ misto, sazkovky, kasina }: Props) {
  const isEdit = !!misto;
  const [typ, setTyp] = useState<"pobocka_sazkovky" | "kasino">(
    misto?.typ === "kasino" ? "kasino" : "pobocka_sazkovky"
  );

  const oteviraciDefault =
    misto?.oteviraci_doba != null
      ? typeof misto.oteviraci_doba === "object"
        ? JSON.stringify(misto.oteviraci_doba, null, 2)
        : String(misto.oteviraci_doba)
      : "";

  const [state, formAction, pending] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      if (isEdit && misto) {
        const r = await updateMisto(misto.id, fd);
        return r.error ? { error: r.error } : null;
      }
      const r = await createMisto(fd);
      if (r.error) return { error: r.error };
      if (r.id) window.location.href = `/admin/mista/${r.id}`;
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Typ *</label>
        <select
          name="typ"
          value={typ}
          onChange={(e) => setTyp(e.target.value as typeof typ)}
          className={inp}
        >
          <option value="pobocka_sazkovky">Pobočka sázkovky</option>
          <option value="kasino">Kasino (kamenné)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Název *</label>
        <input name="nazev" required defaultValue={misto?.nazev} className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Adresa</label>
        <input name="adresa" defaultValue={misto?.adresa ?? ""} className={inp} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Zeměpisná šířka (lat)</label>
          <input
            name="lat"
            type="number"
            step="any"
            defaultValue={misto?.lat ?? ""}
            className={inp}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zeměpisná délka (lng)</label>
          <input
            name="lng"
            type="number"
            step="any"
            defaultValue={misto?.lng ?? ""}
            className={inp}
          />
        </div>
      </div>
      {typ === "pobocka_sazkovky" ? (
        <div>
          <label className="block text-sm font-medium mb-1">Sázkovka *</label>
          <select
            name="sazkovka_id"
            required
            defaultValue={misto?.sazkovka_id ?? ""}
            className={inp}
          >
            <option value="">— vyberte —</option>
            {sazkovky.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nazev}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Kasino *</label>
          <select name="kasino_id" required defaultValue={misto?.kasino_id ?? ""} className={inp}>
            <option value="">— vyberte —</option>
            {kasina.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nazev}
              </option>
            ))}
          </select>
        </div>
      )}
      {typ === "kasino" && (
        <input type="hidden" name="sazkovka_id" value="" />
      )}
      {typ === "pobocka_sazkovky" && <input type="hidden" name="kasino_id" value="" />}

      <div>
        <label className="block text-sm font-medium mb-1">Otevírací doba (JSON nebo text)</label>
        <textarea name="oteviraci_doba" rows={4} defaultValue={oteviraciDefault} className={inp} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">External ID (cron/import)</label>
          <input name="external_id" defaultValue={misto?.external_id ?? ""} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zdroj dat</label>
          <input name="zdroj" defaultValue={misto?.zdroj ?? ""} className={inp} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="aktivni" defaultChecked={misto?.aktivni !== false} />
        Aktivní (zobrazit na mapě)
      </label>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={pending} className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          {isEdit ? "Uložit" : "Vytvořit"}
        </button>
        <Link href="/admin/mista" className="px-4 py-2 text-sm border rounded">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
