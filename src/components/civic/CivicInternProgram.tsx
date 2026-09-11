"use client";

import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { Photo } from "@/components/primitives/Photo";
import { CIVIC } from "@/lib/data";
import { revealUp } from "@/lib/motion";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * One program, two summers. The point of the section is the step between them
 * — intern, then one of three leads over a cohort of 36 — so the two years sit
 * side by side with an arrow through the middle and the second card carries
 * the accent. Splitting them into two blocks on the page lost that entirely.
 */
export function CivicInternProgram() {
  const p = CIVIC.internProgram;

  return (
    <section
      id="intern-program"
      className="relative scroll-mt-24 border-t border-[var(--line)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 md:mb-10">
          <div className="h-[2px] w-10 bg-[var(--accent)]" />
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
            {p.org}
          </span>
          <div className="ml-auto font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            {p.window}
          </div>
        </div>

        <Reveal>
          <h2 className="font-grotesk text-3xl font-bold uppercase leading-[0.98] tracking-[-1px] text-[var(--fg)] md:text-6xl md:tracking-[-4px]">
            {p.title}
          </h2>
          <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-[var(--muted)] md:text-lg">
            {p.lede}
          </p>
        </Reveal>

        {/* The step up, as a step. */}
        <RevealGroup
          className="relative mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6"
          stagger={0.12}
          delayChildren={0.05}
        >
          {p.years.map((y, i) => {
            const lead = i === 1;
            return (
              <motion.article
                key={y.year}
                variants={revealUp}
                className={cn(
                  "relative flex flex-col border p-7 transition-colors duration-300 md:p-9",
                  lead
                    ? "border-[var(--accent)] bg-secondary"
                    : "border-[var(--line)] bg-[var(--bg)]",
                )}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-grotesk text-2xl font-bold tracking-[-1px] text-[var(--muted)]">
                    {y.year}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[0.78rem] uppercase tracking-[0.22em]",
                      lead ? "text-[var(--accent)]" : "text-[var(--muted)]",
                    )}
                  >
                    {y.role}
                  </span>
                </div>

                <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[var(--fg)]">
                  {y.body}
                </p>

                <div className="mt-auto flex items-end gap-3 pt-8">
                  <p
                    className={cn(
                      "font-grotesk text-[3.6rem] font-bold leading-[0.8] tracking-[-3px] md:text-[4.6rem] md:tracking-[-4px]",
                      lead ? "text-[var(--accent)]" : "text-[var(--fg)]",
                    )}
                  >
                    <Counter to={y.stat.value} duration={1.3} />
                  </p>
                  <div className="pb-1.5">
                    <p className="font-mono text-[0.8rem] uppercase tracking-[0.16em] text-[var(--fg)]">
                      {y.stat.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      {y.stat.note}
                    </p>
                  </div>
                </div>

                {/* The arrow rides the seam between the two cards. */}
                {i === 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-6 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--bg)] text-[var(--accent)] md:flex"
                  >
                    <ArrowRight className="size-4" />
                  </span>
                ) : null}
              </motion.article>
            );
          })}
        </RevealGroup>

        <div className="mt-6 grid gap-4 md:mt-6 md:grid-cols-[1.55fr_1fr] md:gap-6">
          {p.photos.map((photo) => (
            <figure key={photo.src} className="group m-0">
              <div className="relative aspect-[3/2] w-full overflow-hidden border border-[var(--line)] bg-[var(--bg-2)]">
                <Photo
                  src={photo.src}
                  alt={photo.alt}
                  className="[filter:grayscale(30%)] transition-[transform,filter] duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.03] group-hover:[filter:grayscale(0%)]"
                />
              </div>
              <figcaption className="mt-3 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
