"use client";

import { useActionState } from "react";
import { signIn } from "@/app/auth/actions";

export function PrihlaseniForm() {
  const [state, formAction, isPending] = useActionState(
    async (_state: { error: string } | null, formData: FormData) => {
      const result = await signIn(formData);
      if (result?.error) return { error: result.error };
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {isPending ? "Přihlašuji…" : "Přihlásit"}
      </button>
    </form>
  );
}
