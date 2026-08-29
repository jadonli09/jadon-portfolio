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
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-[var(--accent)]">
            ● REC — Year two · Summer 2026
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 font-grotesk text-4xl font-bold leading-[0.95] tracking-tight text-[var(--fg)] md:text-6xl">
            Still posting<span className="text-[var(--accent)]">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Year two opened on the East Coast — an AP-score reaction that went viral, and a music video shot with friends from across the world at UMass. Embedded live: the dates and counts are Instagram&rsquo;s, not ours.
          </p>
        </Reveal>

        <div className="mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {LOCKED.yearTwo.map((r, i) => (
            <div key={r.code}>
              <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                {String(i + 1).padStart(2, "0")} — {r.label}
              </p>
              <ReelTile code={r.code} url={r.url} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
