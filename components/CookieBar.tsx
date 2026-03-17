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
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg"
      role="dialog"
      aria-label="Souhlas s cookies"
    >
      <div className="container mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          Používáme cookies pro fungování webu a s vaším souhlasem pro analýzu
          návštěvnosti. Detaily a možnost volby:{" "}
          <Link
            href="/ochrana-osobnich-udaju"
            className="font-medium underline"
          >
            Ochrana osobních údajů
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => save("accepted")}
            className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
          >
            Souhlasím
          </button>
          <button
            type="button"
            onClick={() => save("rejected")}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Odmítnout
          </button>
        </div>
      </div>
    </div>
  );
}
