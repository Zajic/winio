"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createSazkovka, updateSazkovka } from "./actions";
import type { Sazkovka } from "@/types/db";

const inp = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

type Props = { sazkovka?: Sazkovka | null };

export function SazkovkaForm({ sazkovka }: Props) {
  const isEdit = !!sazkovka;
  const [state, formAction, pending] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      if (isEdit && sazkovka) {
        const r = await updateSazkovka(sazkovka.id, fd);
        return r.error ? { error: r.error } : null;
      }
      const r = await createSazkovka(fd);
      if (r.error) return { error: r.error };
      if (r.id) window.location.href = `/admin/sazkovky/${r.id}`;
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{state.error}</p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Název *</label>
          <input name="nazev" required defaultValue={sazkovka?.nazev} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required defaultValue={sazkovka?.slug} className={`${inp} font-mono`} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Affiliate URL registrace</label>
        <input
          name="affiliate_url_registrace"
          type="url"
          defaultValue={sazkovka?.affiliate_url_registrace ?? ""}
          className={inp}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Affiliate param</label>
        <input name="affiliate_param" defaultValue={sazkovka?.affiliate_param ?? ""} className={inp} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Popis</label>
        <textarea name="popis" rows={3} defaultValue={sazkovka?.popis ?? ""} className={inp} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Logo URL</label>
          <input name="logo_url" type="url" defaultValue={sazkovka?.logo_url ?? ""} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Licence</label>
          <input name="licence" defaultValue={sazkovka?.licence ?? ""} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Odds API external_id</label>
        <input
          name="external_id"
          placeholder="např. bet365"
          defaultValue={sazkovka?.external_id ?? ""}
          className={inp}
        />
        <p className="text-xs text-gray-500 mt-1">Mapování pro cron kurzů.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bonus úvod</label>
          <input name="bonus_uvodni" defaultValue={sazkovka?.bonus_uvodni ?? ""} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Freebet</label>
          <input name="freebet" defaultValue={sazkovka?.freebet ?? ""} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bonus popis</label>
        <textarea name="bonus_popis" rows={2} defaultValue={sazkovka?.bonus_popis ?? ""} className={inp} />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="aktivni" defaultChecked={sazkovka?.aktivni !== false} />
          Aktivní
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="placene_umisteni" defaultChecked={sazkovka?.placene_umisteni} />
          Placené umístění
        </label>
        <div className="flex items-center gap-2">
          <label className="text-sm">Pořadí</label>
          <input
            name="poradi_zobrazeni"
            type="number"
            defaultValue={sazkovka?.poradi_zobrazeni ?? 0}
            className="w-24 border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gray-800 text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {isEdit ? "Uložit" : "Vytvořit"}
        </button>
        <Link href="/admin/sazkovky" className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
          Zrušit
        </Link>
      </div>
    </form>
  );
}

