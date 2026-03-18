"use client";

type Item = { text: string; href?: string };

export function HomeTicker({ items }: { items: Item[] }) {
  if (items.length === 0) return null;
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-winio-border bg-winio-deep/80 py-2 text-xs text-winio-subtle">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((it, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-2 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-winio-cyan/60" aria-hidden />
            {it.href ? (
              <a href={it.href} className="hover:text-winio-cyan transition-colors">
                {it.text}
              </a>
            ) : (
              <span>{it.text}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
