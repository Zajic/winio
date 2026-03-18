import Link from "next/link";

export function WinioLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`}>
      <span
        className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 shadow-glow-sm"
        aria-hidden
      >
        <svg
          viewBox="0 0 32 32"
          className="h-5 w-5 text-winio-navy"
          fill="currentColor"
          aria-hidden
        >
          <path d="M4 24V8l6 10 6-10v16h-4V14L8 24 4 24zm14 0V8h4v8l4-8h4v16h-4V14l-4 8h-4z" />
        </svg>
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-white">
        WINI<span className="text-cyan-400">O</span>
      </span>
    </Link>
  );
}
