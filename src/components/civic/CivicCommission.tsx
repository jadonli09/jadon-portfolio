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
    <section className="relative overflow-hidden bg-secondary py-14 md:py-20">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 md:grid-cols-[1fr_15rem] md:items-center md:gap-16 md:px-9">
        <div>
          <div className="mb-8 h-[2px] w-10 bg-[var(--accent)]" />

          <Reveal>
            <div className="mb-6 flex items-end gap-3">
              <p className="font-grotesk text-[5rem] font-bold leading-none tracking-[-4px] text-[var(--accent)] md:text-[7rem] md:tracking-[-7px]">
                <Counter to={1} suffix="" duration={1.4} className="" />
              </p>
              <div className="pb-3 md:pb-4">
                <p className="text-base font-semibold text-[var(--fg)] md:text-lg">of ~13 commissioners</p>
                <p className="mt-0.5 text-sm text-[var(--muted)]">{commission.window}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-grotesk text-3xl font-bold uppercase leading-[0.98] tracking-[-1px] text-[var(--fg)] md:text-5xl md:tracking-[-3px]">
              {commission.title}
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-6 max-w-[56ch] border-t border-[var(--line)] pt-6 font-serif-i text-lg italic leading-relaxed text-[var(--fg)] opacity-90 md:text-xl">
              &ldquo;{commission.detail}&rdquo;
            </p>
            <a
              href={commission.url}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="group mt-8 inline-flex h-14 items-center gap-3 border border-[var(--fg)] px-6 text-base font-medium text-[var(--fg)] transition-colors duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
            >
              The commission on fremont.gov
              <ArrowUpRight className="h-4 w-4 transition-[translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        {/* The commission, on camera */}
        <Reveal delay={0.1}>
          <ClipCard
            href={CIVIC.commission.reel.url}
            poster={CIVIC.commission.reel.poster}
            title={CIVIC.commission.reel.caption}
            meta={`${CIVIC.commission.reel.likes} likes, ${CIVIC.commission.reel.date}`}
            className="mx-auto max-w-[240px] md:max-w-none"
          />
        </Reveal>
      </div>
    </section>
  );
}
