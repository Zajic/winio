"use client";

import { useState } from "react";

type Props = { zapasId: string; className?: string };

export function PripomenoutZapasButton({ zapasId, className }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/pripominky", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zapas_id: zapasId }),
      credentials: "same-origin",
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      setStatus("done");
      setMessage("Připomínka nastavena. E-mail dostanete před zápasem (pokud máte souhlas v účtu).");
    } else {
      setStatus("error");
      setMessage(data.error ?? "Nepodařilo se nastavit připomínku.");
    }
  };

  if (status === "done") {
    return <p className="text-sm text-green-600">{message}</p>;
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="rounded border border-gray-600 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
      >
        {status === "loading" ? "Ukládám…" : "Připomeň mi zápas"}
      </button>
      {status === "error" && <p className="mt-1 text-sm text-red-600">{message}</p>}
    </div>
  );
}
