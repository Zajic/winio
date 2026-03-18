"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createBanner, updateBanner } from "./actions";
import type { Banner } from "@/types/db";

const POZICE_OPTIONS: { value: Banner["pozice"]; label: string }[] = [
  { value: "homepage_top", label: "Homepage nahoře" },
  { value: "homepage_sidebar", label: "Homepage sidebar" },
  { value: "clanek_bottom", label: "Pod článkem" },
  { value: "sidebar_global", label: "Sidebar (globální)" },
];

type Props = { banner?: Banner | null };

export function BannerForm({ banner }: Props) {
  const isEdit = !!banner;

  const [state, formAction, isPending] = useActionState(
    async (_state: { error?: string; id?: string } | null, formData: FormData) => {
      if (isEdit && banner) {
        const result = await updateBanner(banner.id, formData);
        if (result.error) return { error: result.error };
        return null;
      }
      const result = await createBanner(formData);
      if (result.error) return { error: result.error };
      if (result.id) return { id: result.id };
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl" encType="multipart/form-data">
      <div>
        <label htmlFor="nazev" className="block text-sm font-medium text-gray-700 mb-1">
          Název *
        </label>
        <input
          id="nazev"
          name="nazev"
          type="text"
          required
          defaultValue={banner?.nazev}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="typ" className="block text-sm font-medium text-gray-700 mb-1">
          Typ
        </label>
        <select
          id="typ"
          name="typ"
          defaultValue={banner?.typ ?? "vlastni"}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="vlastni">Vlastní</option>
          <option value="reklama">Reklama</option>
        </select>
      </div>
      <div>
        <label htmlFor="obrazek" className="block text-sm font-medium text-gray-700 mb-1">
          Obrázek {isEdit ? "(nechte prázdné pro zachování)" : "*"}
        </label>
        <input
          id="obrazek"
          name="obrazek"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          required={!isEdit}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {isEdit && banner?.obrazek_url && (
          <p className="mt-1 text-sm text-gray-500">
            Aktuální: <img src={banner.obrazek_url} alt="" className="inline-block w-24 h-12 object-cover rounded mt-1" />
          </p>
        )}
      </div>
      <div>
        <label htmlFor="odkaz_url" className="block text-sm font-medium text-gray-700 mb-1">
          Odkaz (URL po kliknutí)
        </label>
        <input
          id="odkaz_url"
          name="odkaz_url"
          type="url"
          defaultValue={banner?.odkaz_url ?? ""}
          placeholder="https://…"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="pozice" className="block text-sm font-medium text-gray-700 mb-1">
          Pozice
        </label>
        <select
          id="pozice"
          name="pozice"
          defaultValue={banner?.pozice ?? "sidebar_global"}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {POZICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="poradi" className="block text-sm font-medium text-gray-700 mb-1">
            Pořadí (číslo)
          </label>
          <input
            id="poradi"
            name="poradi"
            type="number"
            defaultValue={banner?.poradi ?? 0}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="aktivni"
              value="on"
              defaultChecked={banner?.aktivni ?? true}
              className="rounded"
            />
            <span className="text-sm">Aktivní</span>
          </label>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="platnost_od" className="block text-sm font-medium text-gray-700 mb-1">
            Platnost od (volitelné)
          </label>
          <input
            id="platnost_od"
            name="platnost_od"
            type="datetime-local"
            defaultValue={
              banner?.platnost_od
                ? new Date(banner.platnost_od).toISOString().slice(0, 16)
                : ""
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="platnost_do" className="block text-sm font-medium text-gray-700 mb-1">
            Platnost do (volitelné)
          </label>
          <input
            id="platnost_do"
            name="platnost_do"
            type="datetime-local"
            defaultValue={
              banner?.platnost_do
                ? new Date(banner.platnost_do).toISOString().slice(0, 16)
                : ""
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.id && (
        <p className="text-sm text-green-600">
          Banner vytvořen.{" "}
          <Link href={`/admin/bannery/${state.id}`} className="underline">
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
          {isPending ? "Ukládám…" : isEdit ? "Uložit změny" : "Vytvořit banner"}
        </button>
        <Link
          href="/admin/bannery"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Zrušit
        </Link>
      </div>
    </form>
  );
}
