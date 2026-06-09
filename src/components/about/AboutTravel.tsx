"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { ABOUT } from "@/lib/data";
import { EASE } from "@/lib/motion";

/**
 * Editorial passport / stamp treatment for ABOUT.travel.
 * Warm paper, film motif, quiet — no external map APIs.
 * Each destination is a passport stamp that expands on hover/focus.
 */

/** Simple abstract location glyphs — purely decorative, editorial marks. */
const GLYPHS = ["◎", "△", "◇", "◈"] as const;

/** Short editorial sub-labels per destination. */
const REGION_LABELS = ["China", "Japan", "Taiwan", "Canada"] as const;

export function AboutTravel() {
  const [active, setActive] = useState<number | null>(null);
  const places = ABOUT.travel;

  return (
    <section className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        <Reveal className="mb-12">
          <p className="eyebrow">Passport</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">Places that shaped it</h2>
        </Reveal>

        {/* Passport stamps grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {places.map((entry, i) => {
            const isActive = active === i;
            return (
              <motion.button
                key={entry.place}
                data-cursor-hover
                onHoverStart={() => setActive(i)}
                onHoverEnd={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(isActive ? null : i)}
                aria-expanded={isActive}
                aria-label={`${entry.place}: ${entry.note}`}
                className="group relative flex flex-col items-center justify-between overflow-hidden border border-[var(--line)] bg-[var(--bg)] p-6 text-left transition-colors duration-300 hover:border-[var(--fg)] md:p-8"
                style={{
                  background: isActive
                    ? "color-mix(in srgb, var(--accent-2) 6%, var(--bg))"
                    : undefined,
                }}
              >
                {/* Stamp texture — offset circle ring */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-3 h-16 w-16 rounded-full border border-[var(--line)] opacity-30 transition-opacity duration-500 group-hover:opacity-70"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-5 h-10 w-10 rounded-full border border-[var(--line)] opacity-20 transition-opacity duration-500 group-hover:opacity-50"
                />

                {/* Glyph */}
                <motion.span
                  animate={{ color: isActive ? "var(--accent-2)" : "var(--muted)" }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-2xl"
                >
                  {GLYPHS[i % GLYPHS.length]}
                </motion.span>

                {/* Place name */}
                <div className="mt-4 w-full">
                  <p
                    className="font-display text-xl leading-tight md:text-2xl"
                    style={{ color: isActive ? "var(--accent-2)" : "var(--fg)" }}
                  >
                    {entry.place}
                  </p>
                  <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                    {REGION_LABELS[i % REGION_LABELS.length]}
                  </p>
                </div>

                {/* Note — expands on hover */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isActive ? "auto" : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="w-full overflow-hidden"
                >
                  <p className="mt-4 border-t border-[var(--line)] pt-4 font-serif-i text-sm italic leading-snug text-[var(--muted)]">
                    {entry.note}
                  </p>
                </motion.div>

                {/* Stamp corner mark */}
                <div
                  aria-hidden
                  className="absolute bottom-3 right-3 font-mono text-[0.5rem] uppercase tracking-widest text-[var(--line)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Editorial footnote */}
        <Reveal delay={0.15} className="mt-10">
          <p className="max-w-lg border-l border-[var(--line)] pl-4 font-serif-i text-base italic leading-relaxed text-[var(--muted)]">
            Vancouver was a deliberate trade: spring break over AP grind. He came back energized.
            Xi&apos;an was six weeks of grandparents, street food, and cities within cities.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
