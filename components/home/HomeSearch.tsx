"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (t) router.push(`/zapasy?q=${encodeURIComponent(t)}`);
    else router.push("/zapasy");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-2xl gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Hledat zápas, tým nebo soutěž…"
        className="min-h-[52px] flex-1 rounded-xl border border-winio-border bg-winio-card/80 px-5 text-slate-100 placeholder:text-slate-500 outline-none ring-cyan-500/30 transition focus:border-cyan-500/50 focus:ring-2"
        aria-label="Vyhledávání"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 px-8 font-semibold text-winio-navy shadow-glow transition hover:opacity-95"
      >
        Hledat
      </button>
    </form>
  );
}
