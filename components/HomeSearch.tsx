"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (t) router.push(`/zapasy?q=${encodeURIComponent(t)}`);
    else router.push("/zapasy");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl flex gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Hledat zápas, tým nebo soutěž…"
        className="flex-1 rounded-xl border border-winio-border bg-winio-card/80 px-5 py-3.5 text-sm text-white placeholder:text-winio-muted focus:border-winio-cyan/50 focus:outline-none focus:ring-2 focus:ring-winio-cyan/20 transition-shadow"
        autoComplete="off"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-winio-cyan px-8 py-3.5 text-sm font-semibold text-winio-navy shadow-glow-sm hover:bg-cyan-300 transition-colors"
      >
        Hledat
      </button>
    </form>
  );
}
