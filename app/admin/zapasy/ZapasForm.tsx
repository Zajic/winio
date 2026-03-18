"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateZapas } from "./actions";
import type { Zapas } from "@/types/db";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

export function ZapasForm({ zapas }: { zapas: Zapas }) {
  const [state, formAction, pending] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      const r = await updateZapas(zapas.id, fd);
      return r.error ? { error: r.error } : null;
    },
    null
  );

  const zacatekLocal = zapas.zacatek_at
    ? new Date(zapas.zacatek_at).toISOString().slice(0, 16)
    : "";

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{state.error}</p>}
      <p className="text-xs text-gray-500">
        External ID (cron): <code className="bg-gray-100 px-1">{zapas.external_id ?? "—"}</code>
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sport *</label>
          <input name="sport" required defaultValue={zapas.sport} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Soutěž</label>
          <input name="soutez" defaultValue={zapas.soutez ?? ""} className={inp} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Domácí *</label>
          <input name="domaci_tym" required defaultValue={zapas.domaci_tym} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hosté *</label>
          <input name="hoste_tym" required defaultValue={zapas.hoste_tym} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Začátek *</label>
        <input name="zacatek_at" type="datetime-local" required defaultValue={zacatekLocal} className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stav</label>
        <select name="stav" defaultValue={zapas.stav} className={inp}>
          <option value="nadchazejici">Nadcházející</option>
          <option value="live">Live</option>
          <option value="ukonceny">Ukončený</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Výsledek (text)</label>
        <input name="vysledek" defaultValue={zapas.vysledek ?? ""} placeholder="2 : 1" className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">SEO náhled</label>
        <textarea name="seo_preview" rows={3} defaultValue={zapas.seo_preview ?? ""} className={inp} />
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={pending} className="rounded bg-gray-800 text-white px-4 py-2 text-sm">
          Uložit
        </button>
        <Link href="/admin/zapasy" className="px-4 py-2 text-sm border rounded">
          Zpět na seznam
        </Link>
        <Link href={`/zapasy/${zapas.id}`} className="px-4 py-2 text-sm text-blue-600" target="_blank">
          Zobrazit na webu →
        </Link>
      </div>
    </form>
  );
}
