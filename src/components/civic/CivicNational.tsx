"use client";

import { motion } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Photo } from "@/components/primitives/Photo";
import { CIVIC } from "@/lib/data";
import { EASE } from "@/lib/motion";

type Seat = (typeof CIVIC.national)[number];

/** One national-stage seat — a wire-service card: big stat, masthead title, the brief. */
function SeatCard({ seat }: { seat: Seat }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      className="group relative flex flex-col border border-[var(--line)] bg-[var(--bg)] p-6 transition-colors duration-300 hover:border-[var(--accent)] md:p-8"
      data-cursor-hover
    >
      {/* the stat */}
      <div className="flex items-end gap-3">
        <p className="font-grotesk text-[4.6rem] font-bold leading-none tracking-[-4px] text-[var(--accent)] md:text-[6.5rem] md:tracking-[-6px]">
          {seat.stat.value}
        </p>
        <div className="pb-2 md:pb-3">
          {seat.stat.of && (
            <p className="text-base font-semibold text-[var(--fg)] md:text-lg">{seat.stat.of}</p>
          )}
          <p className="text-sm text-[var(--muted)]">{seat.stat.label}</p>
        </div>
      </div>

      <h3 className="mt-5 font-grotesk text-2xl font-bold uppercase leading-[1] tracking-[-1px] text-[var(--fg)] md:text-3xl">
        {seat.title}
      </h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {seat.org}, {seat.window}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] md:text-[0.95rem]">{seat.body}</p>

      {seat.photo && (
        <figure className="mt-6 border border-[var(--line)] bg-[var(--bg-2)] p-1">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Photo src={seat.photo.src} alt={seat.photo.alt} className="object-cover [filter:grayscale(35%)] transition-[filter] duration-500 group-hover:[filter:grayscale(0%)]" style={{ objectPosition: "50% 35%" }} />
          </div>
          <figcaption className="px-1 pb-0.5 pt-2 text-sm text-[var(--muted)]">{seat.photo.caption}</figcaption>
        </figure>
      )}

      {/* press-red corner */}
      <span aria-hidden className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.article>
  );
}

/**
 * Beyond Fremont — the two national-stage seats of summer 2026: the CommonApp
 * Student Advisory Commission and FIRE's Free Speech Forum. Wire-service
 * cards on the newsprint ground, press red only as an accent.
 */
export function CivicNational() {
  return (
    <section id="national" className="relative scroll-mt-24 border-t border-[var(--line)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        <div className="mb-8 h-[2px] w-10 bg-[var(--accent)] md:mb-12" />

        <Reveal>
          <h2 className="font-grotesk text-3xl font-bold uppercase leading-[0.98] tracking-[-1px] text-[var(--fg)] md:text-6xl md:tracking-[-4px]">
            The national stage.
          </h2>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6" stagger={0.12} delayChildren={0.1}>
          {CIVIC.national.map((seat) => (
            <SeatCard key={seat.id} seat={seat} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
