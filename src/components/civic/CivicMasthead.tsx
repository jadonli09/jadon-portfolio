"use client";

import { motion } from "motion/react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { CIVIC, PROFILE } from "@/lib/data";

/** Local masthead detail constants — all real. */
const MASTHEAD_BEATS = [
  { label: "Podcast", note: "Voices of Fremont · Director" },
  { label: "Video", note: "Mayor's official videographer · paid" },
  { label: "Op-Ed", note: "San Mateo Daily Journal · SBAI" },
  { label: "Campaign", note: "HG Nguyen D7 · Social Media" },
  { label: "Commission", note: "Fremont Youth Advisory Commission" },
  { label: "Video Series", note: "Fremont Stories · co-creator" },
] as const;

/** Broadsheet-style hero masthead for the Civic & Storytelling world. */
export function CivicMasthead() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-0 pt-36 md:px-9 md:pt-48">
      {/* Broadsheet rule + dateline row */}
      <Reveal>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="eyebrow">
            Ampersand&nbsp;Media&nbsp;·&nbsp;Fremont,&nbsp;CA&nbsp;·&nbsp;Est.&nbsp;2025
          </span>
          <span className="eyebrow hidden sm:block">Vol.&nbsp;I &nbsp;&nbsp;No.&nbsp;01</span>
        </div>
        {/* Thick top rule */}
        <div className="h-[3px] w-full bg-[var(--fg)]" />
        <div className="mt-[3px] h-[1px] w-full bg-[var(--fg)]" />
      </Reveal>

      {/* Main headline */}
      <div className="mt-6 md:mt-8">
        <KineticHeadline
          as="h1"
          text="A City, Documented."
          className="font-anton display-xl w-full uppercase tracking-tight"
          delay={0.1}
        />
      </div>

      {/* Sub-deck row — intro text + masthead logo block */}
      <div className="mt-6 grid grid-cols-1 gap-8 border-t border-[var(--line)] pt-6 md:mt-8 md:grid-cols-[1fr_auto] md:gap-12 md:pt-8">
        <Reveal delay={0.25}>
          <p className="font-serif-i max-w-2xl text-xl italic leading-snug text-[var(--fg)] opacity-90 md:text-2xl">
            {CIVIC.intro}
          </p>
        </Reveal>

        {/* Masthead monogram block */}
        <Reveal delay={0.35}>
          <div className="hidden md:flex md:flex-col md:items-end md:justify-end">
            <div className="border border-[var(--fg)] px-5 py-3 text-right">
              <p className="font-anton text-4xl uppercase leading-none tracking-widest text-[var(--accent)]">
                &amp;
              </p>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                Ampersand&nbsp;Media
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Red rule */}
      <motion.div
        className="mt-6 h-[2px] bg-[var(--accent)] md:mt-8"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Byline row */}
      <Reveal delay={0.5}>
        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="eyebrow">
            By&nbsp;{PROFILE.name}&nbsp;·&nbsp;{PROFILE.links.instagramHandle}&nbsp;·&nbsp;Mission&nbsp;San&nbsp;Jose&nbsp;H.S.
          </span>
          <span className="eyebrow">Civic&nbsp;Video&nbsp;·&nbsp;Podcast&nbsp;·&nbsp;Op-Ed&nbsp;·&nbsp;Campaign</span>
        </div>
      </Reveal>

      {/* Section index — broadsheet-style beats strip */}
      <Reveal delay={0.6}>
        <div className="mt-6 grid grid-cols-2 gap-0 border border-[var(--line)] sm:grid-cols-3 md:grid-cols-6 md:mt-8">
          {MASTHEAD_BEATS.map((beat, i) => (
            <div
              key={beat.label}
              className={`px-4 py-4 ${i < MASTHEAD_BEATS.length - 1 ? "border-b border-[var(--line)] sm:border-b-0 sm:border-r" : ""} ${i === 1 || i === 3 ? "sm:border-r-0 md:border-r" : ""}`}
            >
              <p className="font-mono text-[0.56rem] uppercase tracking-widest text-[var(--accent)]">
                {beat.label}
              </p>
              <p className="mt-1 font-mono text-[0.6rem] leading-snug text-[var(--muted)]">
                {beat.note}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
