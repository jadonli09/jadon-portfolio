"use client";

import { Reveal } from "@/components/primitives/Reveal";
import { ReelTile } from "@/components/lockedin/ReelTile";
import { LOCKED } from "@/lib/data";

/**
 * Year two — the feed keeps going. Two real reels from summer 2026, embedded
 * live so their dates and counts come straight from Instagram (nothing typed in).
 */
export function LockedYearTwo() {
  return (
    <section id="year-two" className="relative scroll-mt-24 border-t border-[var(--line)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        <Reveal>
          <h2 className="font-grotesk text-4xl font-bold leading-[0.95] tracking-tight text-[var(--fg)] md:text-6xl">
            Still posting<span className="text-[var(--accent)]">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Year two, summer 2026: a fungal-genetics lab, a pitch competition, a case for showing up to city hall — and one AP-score reaction that got away from him. Embedded live: the dates and counts are Instagram&rsquo;s, not ours.
          </p>
        </Reveal>

        <div className="mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {LOCKED.yearTwo.map((r, i) => (
            <div key={r.code}>
              <p className="mb-3 font-grotesk text-sm leading-snug text-[var(--muted)] md:text-base">
                {r.label}
              </p>
              <ReelTile code={r.code} url={r.url} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
