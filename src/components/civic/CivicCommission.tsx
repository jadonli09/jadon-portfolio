"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight, Play } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { asset } from "@/lib/base";
import { CIVIC } from "@/lib/data";
import { EASE } from "@/lib/motion";

const COMMISSION_FACTS = [
  { label: "Applicants", val: "~100", note: "for 1 open seat" },
  { label: "Commissioners", val: "~13", note: "total seated" },
  { label: "Meets", val: "Monthly", note: "1st Monday · council-style" },
  { label: "Focus", val: "Youth issues", note: "mental-wellness workshops" },
] as const;

/**
 * Fremont Youth Advisory Commission — quiet civic-record treatment on the
 * newsprint secondary tone; press red appears only as an accent.
 */
export function CivicCommission() {
  const { commission } = CIVIC;

  return (
    <section className="relative overflow-hidden bg-secondary py-16 md:py-24">
      {/* Background texture — drifting type watermark */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-6 select-none font-grotesk font-bold tracking-[-0.06em] text-[14rem] uppercase leading-none text-[var(--fg)]/[0.04] md:text-[22rem]"
        animate={{ x: [0, -28, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        FYAC
      </motion.span>
      {/* Secondary watermark — bottom left */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-6 select-none font-grotesk font-bold text-[8rem] uppercase leading-none text-[var(--fg)]/[0.03] md:text-[12rem]"
      >
        13
      </span>

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        {/* Label row */}
        <div className="mb-8 flex items-center gap-4 md:mb-12">
          <div className="h-[2px] w-10 bg-[var(--accent)]" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Civic Commission
          </span>
          <div className="ml-auto font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">
            {commission.window}
          </div>
        </div>

        <Reveal>
          {/* Stat callout */}
          <div className="mb-6 flex items-end gap-3 md:mb-8">
            <p className="font-grotesk text-[5rem] font-bold leading-none tracking-[-4px] text-[var(--accent)] md:text-[8rem] md:tracking-[-8px]">
              <Counter to={1} suffix="" duration={1.4} className="" />
            </p>
            <div className="pb-3 md:pb-5">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--fg)]">of ~13</p>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--fg)]">commissioners</p>
              <p className="mt-1 font-mono text-[0.6rem] text-[var(--muted)]">selected from ~100 applicants</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          {/* Pull-quote headline — poster grotesk */}
          <h2 className="font-grotesk text-3xl font-bold uppercase leading-[0.98] tracking-[-1px] text-[var(--fg)] md:text-6xl md:tracking-[-4px]">
            {commission.title}
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-6 grid grid-cols-1 gap-8 border-t border-[var(--line)] pt-6 md:mt-8 md:grid-cols-[1.5fr_auto_1fr] md:items-start md:gap-10 md:pt-8">
            {/* Detail text */}
            <div>
              <p className="font-serif-i text-lg italic leading-relaxed text-[var(--fg)] opacity-90 md:text-xl">
                &ldquo;{commission.detail}&rdquo;
              </p>

              <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                One of approximately 13 commissioners selected from a pool of around 100 applicants
                for a single open seat. The role spans planning youth-issue events — including
                mental-wellness workshops — and participating in formal council-style sessions that
                meet the first Monday of every month. Civic governance, not just civic content.
              </p>

              {/* Pull-quote accent line */}
              <div className="mt-6 border-l-2 border-[var(--accent)] pl-5">
                <p className="font-serif-i text-base italic text-[var(--fg)] opacity-85">
                  &ldquo;Civic governance, not just civic content.&rdquo;
                </p>
              </div>

              {/* Official record link */}
              <a
                href={commission.url}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group mt-8 inline-flex items-center gap-3 border border-[var(--fg)] px-5 py-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--fg)] transition-colors duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              >
                The commission on fremont.gov
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Off-the-record reel — tilted field clip beside the official record */}
            <div className="md:w-[230px]">
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                  Off the record
                </span>
                <ArrowDownRight className="size-3.5 text-[var(--accent)]" />
              </div>
              <a
                href={CIVIC.commission.reel.url}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group relative mx-auto block w-full max-w-[220px] -rotate-2 overflow-hidden rounded-md border shadow-lg transition-transform duration-500 ease-[var(--ease-cine)] hover:-translate-y-1.5 hover:rotate-0"
                style={{ aspectRatio: "9 / 16" }}
              >
                <img
                  src={asset(CIVIC.commission.reel.poster)}
                  alt={`@li_locked.in reel — ${CIVIC.commission.reel.caption}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.05]"
                />
                {/* Play glyph */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--fg)]/70 backdrop-blur-sm transition-transform duration-500 ease-[var(--ease-cine)] group-hover:scale-110">
                    <Play className="ml-0.5 h-5 w-5 fill-[var(--bg)] text-[var(--bg)]" />
                  </span>
                </span>
                {/* Caption strip with real stats */}
                <div className="absolute inset-x-0 bottom-0 bg-[var(--fg)]/85 px-2.5 py-1.5">
                  <p className="truncate font-mono text-[0.56rem] uppercase tracking-widest text-[var(--bg)]">
                    {CIVIC.commission.reel.caption}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.52rem] uppercase tracking-widest text-[var(--bg)]/70">
                    {CIVIC.commission.reel.likes} likes · {CIVIC.commission.reel.comments} comments ·{" "}
                    {CIVIC.commission.reel.date}
                  </p>
                </div>
              </a>
            </div>

            {/* Stat sidebar — 4 facts (the official record) */}
            <div className="flex h-fit flex-col gap-0 border border-[var(--line)] bg-[var(--bg)]">
              {COMMISSION_FACTS.map((f, i) => (
                <div
                  key={f.label}
                  className={`px-5 py-5 ${i !== COMMISSION_FACTS.length - 1 ? "border-b border-[var(--line)]" : ""}`}
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                    / {f.label}
                  </p>
                  <p className="mt-1 font-grotesk text-2xl font-bold tracking-[-1px] text-[var(--fg)] md:text-3xl">
                    {f.val}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">
                    {f.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Thin bottom rule with label */}
        <Reveal delay={0.22}>
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-6 md:mt-12">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              City of Fremont&nbsp;·&nbsp;Youth Advisory Commission&nbsp;·&nbsp;{commission.window}
            </p>
            <motion.div
              className="ml-auto h-px bg-[var(--accent)]"
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
