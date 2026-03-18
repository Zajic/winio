"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createClanek, updateClanek } from "./actions";
import type { Clanky } from "@/types/db";
import type { Sazkovka, Kasino } from "@/types/db";

type Props = {
  sazkovky: Sazkovka[];
  kasina: Kasino[];
  clanek?: Clanky | null;
};

export function ClanekForm({ sazkovky, kasina, clanek }: Props) {
  const isEdit = !!clanek;

  const [state, formAction, isPending] = useActionState(
    async (_state: { error?: string; id?: string } | null, formData: FormData) => {
      if (isEdit && clanek) {
        const result = await updateClanek(clanek.id, formData);
        if (result.error) return { error: result.error };
        return null;
      }
      const result = await createClanek(formData);
      if (result.error) return { error: result.error };
      if (result.id) return { id: result.id };
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="titul" className="block text-sm font-medium text-gray-700 mb-1">
          Titulek *
        </label>
        <input
          id="titul"
          name="titul"
          type="text"
          required
          defaultValue={clanek?.titul}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug (URL) *
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          defaultValue={clanek?.slug}
          placeholder="napr. muj-clanek"
          className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"
        />
      </div>
      <div>
        <label htmlFor="typ" className="block text-sm font-medium text-gray-700 mb-1">
          Typ
        </label>
        <select
          id="typ"
          name="typ"
          defaultValue={clanek?.typ ?? "blog"}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="news">Novinky</option>
          <option value="blog">Blog</option>
          <option value="pr_placeny">Spolupráce (PR)</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 border rounded-lg p-4 bg-gray-50">
        <p className="sm:col-span-2 text-xs text-gray-600">
          U novinek z RSS se vyplní automaticky. Ručně: odkaz na původní článek (kurátorský režim).
        </p>
        <div>
          <label htmlFor="zdroj_nazev" className="block text-sm font-medium text-gray-700 mb-1">
            Název zdroje
          </label>
          <input
            id="zdroj_nazev"
            name="zdroj_nazev"
            defaultValue={clanek?.zdroj_nazev ?? ""}
            placeholder="např. iSport.cz"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="zdroj_url" className="block text-sm font-medium text-gray-700 mb-1">
            URL zdroje
          </label>
          <input
            id="zdroj_url"
            name="zdroj_url"
            type="url"
            defaultValue={clanek?.zdroj_url ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="perex" className="block text-sm font-medium text-gray-700 mb-1">
          Perex
        </label>
        <textarea
          id="perex"
          name="perex"
          rows={2}
          defaultValue={clanek?.perex ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="telo" className="block text-sm font-medium text-gray-700 mb-1">
          Tělo článku (HTML nebo text)
        </label>
        <textarea
          id="telo"
          name="telo"
          rows={12}
          defaultValue={clanek?.telo ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"
        />
      </div>
      <div>
        <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">
          Datum publikace (prázdné = koncept)
        </label>
        <input
          id="published_at"
          name="published_at"
          type="datetime-local"
          defaultValue={
            clanek?.published_at
              ? new Date(clanek.published_at).toISOString().slice(0, 16)
              : ""
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="je_placena_spoluprace"
            defaultChecked={clanek?.je_placena_spoluprace ?? false}
            className="rounded"
          />
          <span className="text-sm">Placená spolupráce (označení u článku)</span>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="affiliate_cta_sazkovka_id" className="block text-sm font-medium text-gray-700 mb-1">
            CTA sázkovka
          </label>
          <select
            id="affiliate_cta_sazkovka_id"
            name="affiliate_cta_sazkovka_id"
            defaultValue={clanek?.affiliate_cta_sazkovka_id ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">—</option>
            {sazkovky.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nazev}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="affiliate_cta_kasino_id" className="block text-sm font-medium text-gray-700 mb-1">
            CTA kasino
          </label>
          <select
            id="affiliate_cta_kasino_id"
            name="affiliate_cta_kasino_id"
            defaultValue={clanek?.affiliate_cta_kasino_id ?? ""}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">—</option>
            {kasina.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nazev}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.id && (
        <p className="text-sm text-green-600">
          Článek vytvořen.{" "}
          <Link href={`/admin/clanky/${state.id}`} className="underline">
            Upravit
          </Link>
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Ukládám…" : isEdit ? "Uložit změny" : "Vytvořit článek"}
        </button>
        <Link
          href="/admin/clanky"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Zrušit
        </Link>
      </div>
    </form>
  );
}
