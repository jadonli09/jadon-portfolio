"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { RevealGroup } from "@/components/primitives/Reveal";
import { DashedGrid } from "@/components/ui/dashed-grid";
import { CIVIC } from "@/lib/data";
import { revealUp } from "@/lib/motion";

/** Poster-style stats band: flat secondary tiles, oversized tracking-tight counters. */
export function CivicMetricsBand() {
  return (
    <section className="relative overflow-hidden pb-4 pt-6 md:pb-6 md:pt-8">
      <DashedGrid fade="center" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <RevealGroup
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          stagger={0.07}
          delayChildren={0.1}
        >
          {CIVIC.metrics.map((m) => (
            <motion.div
              key={m.label}
              variants={revealUp}
              tabIndex={0}
              className="group relative overflow-hidden bg-secondary p-6 outline-none md:p-8"
            >
              <p className="font-grotesk text-4xl font-bold leading-none tracking-[-2px] text-[var(--fg)] sm:text-5xl sm:tracking-[-3px] md:text-6xl md:tracking-[-4px]">
                <Counter to={m.value} suffix={m.suffix} duration={1.6} />
              </p>
              <p className="mt-3 text-base font-semibold leading-tight text-[var(--fg)] [overflow-wrap:anywhere]">
                {m.label}
              </p>
              {/* the detail slides up over the card on hover / tap */}
              <p className="absolute inset-0 flex translate-y-full items-center overflow-hidden bg-[var(--accent)] p-4 text-sm leading-snug text-white sm:p-6 sm:text-base transition-[translate] duration-500 ease-[var(--ease-cine)] group-hover:translate-y-0 group-focus:translate-y-0 md:p-8 md:text-lg">
                {m.note}
              </p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
