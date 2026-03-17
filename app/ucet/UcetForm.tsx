"use client";

import { useActionState } from "react";
import { updatePreferences } from "@/app/ucet/actions";
import type { UserPreferences } from "@/types/db";

export function UcetForm({ preferences }: { preferences: UserPreferences | null }) {
  const [state, formAction, isPending] = useActionState(
    async (_state: { error?: string; ok?: boolean } | null, formData: FormData) => {
      const result = await updatePreferences(formData);
      return result ?? null;
    },
    null
  );

  const souhlasNewsletter = preferences?.souhlas_newsletter ?? false;
  const souhlasPripominky = preferences?.souhlas_pripominky ?? true;
  const tymy = (preferences?.oblíbene_tymy ?? []).join(", ");
  const ligy = (preferences?.oblíbene_ligy ?? []).join(", ");

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="souhlas_newsletter"
            defaultChecked={souhlasNewsletter}
            className="rounded"
          />
          <span className="text-sm">Newsletter – přehled zápasů a bonusů (e-mail)</span>
        </label>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="souhlas_pripominky"
            value="on"
            defaultChecked={souhlasPripominky}
            className="rounded"
          />
          <span className="text-sm">Připomínky zápasů – chci dostávat upozornění na vybrané zápasy</span>
        </label>
      </div>
      <div>
        <label htmlFor="tymy" className="block text-sm font-medium text-gray-700 mb-1">
          Oblíbené týmy (oddělené čárkou)
        </label>
        <textarea
          id="tymy"
          name="oblíbene_tymy"
          rows={2}
          defaultValue={tymy}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          placeholder="např. Slavia Praha, Sparta Praha"
        />
      </div>
      <div>
        <label htmlFor="ligy" className="block text-sm font-medium text-gray-700 mb-1">
          Oblíbené ligy / soutěže (oddělené čárkou)
        </label>
        <textarea
          id="ligy"
          name="oblíbene_ligy"
          rows={2}
          defaultValue={ligy}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          placeholder="např. Tipsport extraliga, NHL"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-600">Preference uloženy.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {isPending ? "Ukládám…" : "Uložit preference"}
      </button>
    </form>
  );
}
