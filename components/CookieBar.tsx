"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";
const STORAGE_KEY_AT = "cookie_consent_at";

export function CookieBar() {
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setShowBar(true);
  }, []);

  const save = (value: "accepted" | "rejected") => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, value);
    localStorage.setItem(STORAGE_KEY_AT, new Date().toISOString());
    setShowBar(false);
  };

  if (!showBar) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-winio-border bg-winio-navy-light/95 p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md"
      role="dialog"
      aria-label="Souhlas s cookies"
    >
      <div className="container mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-300">
          Používáme cookies pro fungování webu a s vaším souhlasem pro analýzu
          návštěvnosti. Detaily a možnost volby:{" "}
          <Link
            href="/ochrana-osobnich-udaju"
            className="font-medium text-cyan-400 underline hover:text-cyan-300"
          >
            Ochrana osobních údajů
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => save("accepted")}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 px-4 py-2 text-sm font-semibold text-winio-navy hover:opacity-95"
          >
            Souhlasím
          </button>
          <button
            type="button"
            onClick={() => save("rejected")}
            className="rounded-lg border border-winio-border px-4 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          >
            Odmítnout
          </button>
        </div>
      </div>
    </div>
  );
}
