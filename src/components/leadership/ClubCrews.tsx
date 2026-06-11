"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { SlotPhoto } from "@/components/leadership/SlotPhoto";
import { LEADERSHIP } from "@/lib/data";

type Crew = (typeof LEADERSHIP.crews)[number];

const TILTS = [-2.2, 1.6, -1.2];
const TAPE_TILTS = [-4, 3, -2];

/** One pinned scrapbook card: polaroid photo slot + handwritten notes. */
function CrewCard({ crew, index }: { crew: Crew; index: number }) {
  const tilt = TILTS[index % TILTS.length];
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, rotate: tilt * 2.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ rotate: 0, y: -10, transition: { duration: 0.35 } }}
      transition={{ duration: 0.75, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[330px] bg-[#f6eed9] p-4 pb-5 md:max-w-[350px]"
      style={{ boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}
      data-cursor-hover
    >
      {/* Tape strip */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 z-10 block h-6 w-24 -translate-x-1/2"
        style={{
          background: "rgba(212,175,106,0.45)",
          transform: `translateX(-50%) rotate(${TAPE_TILTS[index % TAPE_TILTS.length]}deg)`,
        }}
      />

      {/* Officer-team photo slot */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ece1c8]">
        <SlotPhoto
          src={crew.photo}
          alt={crew.photoAlt}
          monogram={crew.monogram}
          note="officer photo en route"
          tone="paper"
        />
      </div>

      {/* Handwritten club name + role badge */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-hand text-3xl leading-none text-[#1a140d]">{crew.club}</p>
          <p className="font-hand mt-1 text-lg leading-none text-[#6e1f2a]">{crew.arc}</p>
        </div>
        <span className="shrink-0 -rotate-3 border-2 border-[#6e1f2a] px-2 py-1 font-mono text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#6e1f2a]">
          {crew.role}
        </span>
      </div>

      {/* Blurb — typed index-card note */}
      <p className="mt-3 border-t border-dashed border-[rgba(26,20,13,0.25)] pt-3 font-mono text-[0.7rem] leading-relaxed text-[rgba(26,20,13,0.75)]">
        {crew.blurb}
      </p>

      {/* Stat sticker */}
      <div className="mt-3 inline-flex rotate-1 items-baseline gap-2 bg-[#1a140d] px-3 py-1.5">
        <span className="font-anton text-xl leading-none text-[var(--accent)]">{crew.stat.value}</span>
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#f6eed9]">
          {crew.stat.label}
        </span>
      </div>
    </motion.article>
  );
}

/**
 * ClubCrews — "The Crews": the club officer teams as a scrapbook wall.
 * Handwritten Caveat headline, pinned paper cards, photo slots per club.
 * The only section on the page that's allowed to be messy on purpose.
 */
export function ClubCrews() {
  return (
    <section className="relative mx-auto mt-20 max-w-7xl px-5 md:mt-32 md:px-9" aria-labelledby="club-crews-heading">
      {/* Corkboard-ish dotted backdrop, very faint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(212,175,106,0.12) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative">
        {/* Handwritten header — breaks the Anton pattern entirely */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-[var(--muted)]">
                The clubs · officer teams
              </p>
              <h2 id="club-crews-heading" className="font-hand mt-2 text-6xl leading-none text-[var(--accent)] md:text-8xl">
                the crews
              </h2>
            </div>
            <p className="max-w-xs font-serif-i text-sm italic leading-relaxed text-[var(--fg)] opacity-70 md:text-base">
              titles are one line on a slate — these are the people he runs things with.
            </p>
          </div>
        </Reveal>

        {/* Pinned cards */}
        <div className="mt-12 flex flex-wrap items-start justify-center gap-8 md:mt-16 md:gap-12 lg:justify-between">
          {LEADERSHIP.crews.map((crew, i) => (
            <CrewCard key={crew.club} crew={crew} index={i} />
          ))}
        </div>

        {/* Hand-scrawled footnote */}
        <Reveal delay={0.2}>
          <p className="font-hand mt-12 text-center text-2xl text-[var(--muted)] md:text-3xl">
            president ×2, vice president ×1 — and counting
          </p>
        </Reveal>
      </div>
    </section>
  );
}
