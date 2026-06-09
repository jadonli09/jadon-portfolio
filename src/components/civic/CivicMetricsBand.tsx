"use client";

import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { CIVIC } from "@/lib/data";

/** Newspaper-stats band: animated counters behind column rules. */
export function CivicMetricsBand() {
  return (
    <section className="mt-12 border-y-2 border-[var(--fg)] bg-[var(--bg-2)] py-10 md:mt-16 md:py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        {/* Section label */}
        <Reveal>
          <p className="eyebrow mb-6 text-[var(--accent)]">By the numbers</p>
        </Reveal>

        <RevealGroup
          className="grid grid-cols-2 divide-x divide-[var(--line)] border border-[var(--line)] md:grid-cols-4"
          stagger={0.07}
          delayChildren={0.1}
        >
          {CIVIC.metrics.map((m) => (
            <div key={m.label} className="group relative px-5 py-8 md:px-8 md:py-10">
              {/* Accent corner mark */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <p className="font-anton text-[2.8rem] leading-none text-[var(--fg)] md:text-[4rem]">
                <Counter to={m.value} suffix={m.suffix} duration={1.6} />
              </p>
              <p className="mt-2 font-grotesk text-sm font-medium leading-tight text-[var(--fg)]">
                {m.label}
              </p>
              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--accent)]">
                {m.note}
              </p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
