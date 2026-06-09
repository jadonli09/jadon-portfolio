import { cn } from "@/lib/cn";

/** Infinite horizontal ticker. Duplicates content for a seamless loop. */
export function Marquee({
  items,
  className,
  sep = "✦",
  reverse = false,
  durationSec = 30,
}: {
  items: string[];
  className?: string;
  sep?: string;
  reverse?: boolean;
  durationSec?: number;
}) {
  const row = (
    <span className="marquee-track" style={{ animationDuration: `${durationSec}s`, animationDirection: reverse ? "reverse" : "normal" }}>
      {[...items, ...items].map((it, i) => (
        <span key={i} className="mx-6 inline-flex items-center gap-6">
          {it}
          <span className="opacity-40">{sep}</span>
        </span>
      ))}
    </span>
  );
  return <div className={cn("relative w-full overflow-hidden", className)} aria-hidden>{row}</div>;
}
