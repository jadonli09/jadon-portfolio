"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { CIVIC } from "@/lib/data";
import { EASE } from "@/lib/motion";

const COMMISSION_FACTS = [
  { label: "Applicants", val: "~100", note: "for 1 open seat" },
  { label: "Commissioners", val: "~13", note: "total seated" },
  { label: "Meets", val: "Monthly", note: "1st Monday · council-style" },
  { label: "Focus", val: "Youth issues", note: "mental-wellness workshops" },
] as const;

/**
 * Pull-quote / sidebar treatment for the Fremont Youth Advisory Commission.
 * Full-bleed red band with large editorial quote styling.
 * Enriched with deeper application + role detail.
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
      {/* Secondary watermark — bottom left */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-6 select-none font-anton text-[8rem] uppercase leading-none text-white/[0.04] md:text-[12rem]"
      >
        13
      </span>

      <div className="mx-auto max-w-7xl px-5 md:px-9">
        {/* Label row */}
        <div className="mb-8 flex items-center gap-4 md:mb-12">
          <div className="h-[1px] w-10 bg-white/40" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-white/60">
            Civic Commission
          </span>
          <div className="ml-auto font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
            {commission.window}
          </div>
        </div>

        <Reveal>
          {/* Stat callout */}
          <div className="mb-6 flex items-end gap-3 md:mb-8">
            <p className="font-anton text-[5rem] leading-none text-white md:text-[8rem]">
              <Counter to={1} suffix="" duration={1.4} className="" />
            </p>
            <div className="pb-3 md:pb-5">
              <p className="font-mono text-xs uppercase tracking-widest text-white/70">of ~13</p>
              <p className="font-mono text-xs uppercase tracking-widest text-white/70">commissioners</p>
              <p className="mt-1 font-mono text-[0.6rem] text-white/50">selected from ~100 applicants</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          {/* Pull-quote headline */}
          <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
            {commission.title}
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-6 grid grid-cols-1 gap-8 border-t border-white/20 pt-6 md:mt-8 md:grid-cols-[2fr_1fr] md:gap-12 md:pt-8">
            {/* Detail text */}
            <div>
              <p className="font-serif-i text-lg italic leading-relaxed text-white/90 md:text-xl">
                &ldquo;{commission.detail}&rdquo;
              </p>

              <p className="mt-5 text-sm leading-relaxed text-white/75">
                One of approximately 13 commissioners selected from a pool of around 100 applicants
                for a single open seat. The role spans planning youth-issue events — including
                mental-wellness workshops — and participating in formal council-style sessions that
                meet the first Monday of every month. Civic governance, not just civic content.
              </p>

              {/* Pull-quote accent line */}
              <div className="mt-6 border-l-2 border-white/30 pl-5">
                <p className="font-serif-i text-base italic text-white/80">
                  &ldquo;Civic governance, not just civic content.&rdquo;
                </p>
              </div>
            </div>

            {/* Stat sidebar — 4 facts */}
            <div className="flex flex-col gap-0 border border-white/20 md:border-l-0 md:border-l md:border-white/20">
              {COMMISSION_FACTS.map((f, i) => (
                <div
                  key={f.label}
                  className={`px-5 py-5 ${i !== COMMISSION_FACTS.length - 1 ? "border-b border-white/20" : ""}`}
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-white/50">
                    {f.label}
                  </p>
                  <p className="mt-1 font-anton text-3xl text-white">{f.val}</p>
                  <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-widest text-white/50">
                    {f.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Thin bottom rule with label */}
        <Reveal delay={0.22}>
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/20 pt-6 md:mt-12">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-white/50">
              City of Fremont&nbsp;·&nbsp;Youth Advisory Commission&nbsp;·&nbsp;{commission.window}
            </p>
            <motion.div
              className="ml-auto h-px bg-white/20"
              style={{ width: "4rem" }}
              initial={{ scaleX: 0, originX: 1 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
