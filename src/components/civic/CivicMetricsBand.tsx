"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { DashedGrid } from "@/components/ui/dashed-grid";
import { CIVIC } from "@/lib/data";
import { revealUp } from "@/lib/motion";

/** Poster-style stats band: flat secondary tiles, oversized tracking-tight counters. */
export function CivicMetricsBand() {
  return (
    <section className="relative overflow-hidden pb-14 pt-8 md:pb-20 md:pt-10">
      <DashedGrid fade="center" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Hero-04 style label row */}
        <Reveal>
          <div className="mb-8 flex items-center gap-2">
            <span className="text-base font-medium tracking-wider md:text-lg">BY THE NUMBERS</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--accent)]">
              / ALL REAL
            </span>
          </div>
        </Reveal>

        <RevealGroup
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          stagger={0.07}
          delayChildren={0.1}
        >
          {CIVIC.metrics.map((m) => (
            <motion.div
              key={m.label}
              variants={revealUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-secondary p-6 md:p-8"
            >
              <p className="font-grotesk text-4xl font-bold leading-none tracking-[-2px] text-[var(--fg)] sm:text-5xl sm:tracking-[-3px] md:text-6xl md:tracking-[-4px]">
                <Counter to={m.value} suffix={m.suffix} duration={1.6} />
              </p>
              <p className="mt-3 text-sm font-semibold uppercase leading-tight tracking-wide text-[var(--fg)]">
                / {m.label}
              </p>
              <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)]">
                {m.note}
              </p>
              {/* Underline draw on hover */}
              <div className="mt-4 h-[2px] w-0 bg-[var(--accent)] transition-all duration-500 ease-[var(--ease-cine)] group-hover:w-full" />
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
