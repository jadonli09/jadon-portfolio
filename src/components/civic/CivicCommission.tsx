"use client";

import { Reveal } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { CIVIC } from "@/lib/data";

/**
 * Pull-quote / sidebar treatment for the Fremont Youth Advisory Commission.
 * Full-bleed red band with large editorial quote styling.
 */
export function CivicCommission() {
  const { commission } = CIVIC;

  return (
    <section className="relative overflow-hidden bg-[var(--accent)] py-16 md:py-24">
      {/* Background texture — diagonal type watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-6 select-none font-anton text-[14rem] uppercase leading-none text-white/[0.06] md:text-[22rem]"
      >
        FYAC
      </span>

      {/* Thin rule top */}
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        <div className="mb-8 flex items-center gap-4 md:mb-12">
          <div className="h-[1px] w-10 bg-white/40" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-white/60">
            Commission
          </span>
        </div>

        <Reveal>
          {/* Stat callout */}
          <div className="mb-6 flex items-end gap-3 md:mb-8">
            <p className="font-anton text-[5rem] leading-none text-white md:text-[8rem]">
              <Counter to={1} suffix="" duration={1.4} className="" />
            </p>
            <div className="pb-3 font-mono text-xs uppercase tracking-widest text-white/70">
              <p>of 13</p>
              <p>commissioners</p>
            </div>
            <div className="ml-auto hidden pb-3 text-right md:block">
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-white/50">
                {commission.window}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Pull-quote headline */}
          <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
            {commission.title}
          </h2>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-6 grid grid-cols-1 gap-8 border-t border-white/20 pt-6 md:mt-8 md:grid-cols-[2fr_1fr] md:gap-12 md:pt-8">
            {/* Detail text */}
            <p className="font-serif-i text-lg italic leading-relaxed text-white/90 md:text-xl">
              &ldquo;{commission.detail}&rdquo;
            </p>

            {/* Stat sidebar */}
            <div className="flex flex-col gap-5 md:border-l md:border-white/20 md:pl-10">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-white/50">
                  Applicants
                </p>
                <p className="mt-1 font-anton text-4xl text-white">~100</p>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-white/50">
                  Open seats
                </p>
                <p className="mt-1 font-anton text-4xl text-white">1</p>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-white/50">
                  Meets
                </p>
                <p className="mt-1 font-mono text-xs text-white/80">
                  1st Monday · monthly
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Thin bottom rule with label */}
        <Reveal delay={0.25}>
          <div className="mt-8 flex items-center gap-4 border-t border-white/20 pt-6 md:mt-12">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-white/50">
              City of Fremont · Youth Advisory Commission · {commission.window}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
