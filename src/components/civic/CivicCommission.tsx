"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { asset } from "@/lib/base";
import { CIVIC } from "@/lib/data";

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

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        <div className="mb-8 h-[2px] w-10 bg-[var(--accent)] md:mb-12" />

        <Reveal>
          {/* Stat callout */}
          <div className="mb-6 flex items-end gap-3 md:mb-8">
            <p className="font-grotesk text-[5rem] font-bold leading-none tracking-[-4px] text-[var(--accent)] md:text-[8rem] md:tracking-[-8px]">
              <Counter to={1} suffix="" duration={1.4} className="" />
            </p>
            <div className="pb-3 md:pb-5">
              <p className="text-base font-semibold text-[var(--fg)] md:text-lg">of ~13 commissioners</p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{commission.window}</p>
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
          <div className="mt-6 grid grid-cols-1 gap-8 border-t border-[var(--line)] pt-6 md:mt-8 md:grid-cols-[1fr_auto] md:items-start md:gap-12 md:pt-8">
            {/* Detail text */}
            <div>
              <p className="font-serif-i text-lg italic leading-relaxed text-[var(--fg)] opacity-90 md:text-xl">
                &ldquo;{commission.detail}&rdquo;
              </p>

              {/* Official record link */}
              <a
                href={commission.url}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group mt-8 inline-flex items-center gap-3 border border-[var(--fg)] px-5 py-3 text-base font-medium text-[var(--fg)] transition-colors duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              >
                The commission on fremont.gov
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Off-the-record reel — tilted field clip beside the official record */}
            <div className="md:w-[230px]">
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
                <div className="absolute inset-x-0 bottom-0 bg-[var(--fg)]/85 px-2.5 py-2">
                  <p className="truncate text-sm font-medium leading-snug text-[var(--bg)]">
                    {CIVIC.commission.reel.caption}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-[var(--bg)]/75">
                    {CIVIC.commission.reel.likes} likes, {CIVIC.commission.reel.comments} comments
                    <br />
                    {CIVIC.commission.reel.date}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
