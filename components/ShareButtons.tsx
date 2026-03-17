"use client";

import { useCallback, useState } from "react";

type Props = {
  title: string;
  url: string;
  className?: string;
};

export function ShareButtons({ title, url: urlProp, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? urlProp : urlProp;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [url]);

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      <span className="text-gray-600">Sdílet:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50"
      >
        X (Twitter)
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50"
      >
        Facebook
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50"
      >
        {copied ? "Zkopírováno" : "Kopírovat odkaz"}
      </button>
    </div>
  );
}
