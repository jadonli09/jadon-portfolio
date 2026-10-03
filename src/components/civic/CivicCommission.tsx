"use client";

import { ArrowUpRight } from "lucide-react";
import { ClipCard } from "@/components/civic/ClipCard";
import { Reveal } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { CIVIC } from "@/lib/data";

/**
 * Fremont Youth Advisory Commission — quiet civic-record treatment on the
 * newsprint secondary tone; press red appears only as an accent.
 */
export function CivicCommission() {
  const { commission } = CIVIC;

  return (
    <section className="relative overflow-hidden bg-secondary py-16 md:py-24">
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

            {/* The commission, on camera */}
            <div className="md:w-[230px]">
              <ClipCard
                href={CIVIC.commission.reel.url}
                poster={CIVIC.commission.reel.poster}
                title={CIVIC.commission.reel.caption}
                meta={`${CIVIC.commission.reel.likes} likes, ${CIVIC.commission.reel.date}`}
                className="mx-auto max-w-[220px]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
