"use client";

type Props = { items: string[] };

export function HeaderTicker({ items }: Props) {
  if (items.length === 0) return null;
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-winio-border bg-winio-navy-light/80 py-2 text-xs text-slate-400">
      <div className="animate-ticker flex w-max gap-12 whitespace-nowrap px-4">
        {doubled.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" aria-hidden />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
