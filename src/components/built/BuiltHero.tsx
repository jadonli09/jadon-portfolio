"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { Marquee } from "@/components/primitives/Marquee";
import { Magnetic } from "@/components/primitives/Magnetic";
import { Photo } from "@/components/primitives/Photo";
import { AcornBurst, CoordsHUD, DustField, StatValue } from "@/components/built/MissionFX";
import { PROJECTS, PROFILE } from "@/lib/data";
import { EASE } from "@/lib/motion";

const MARQUEE_ITEMS = [
  ...PROJECTS.map((p) => p.domain),
  "Next.js · React · TypeScript",
  "AI grading · Automation",
  "Ship it. Then ship the next one.",
  "500+ users",
  "#1 Google result",
  "acornprep.com",
];

const GHOST_LINES = ["AcornPrep", "CueSheet", "Hermes", "Shipped", "500+ Users"];

/** Schematic instrument glyphs — resistor squiggle + two dial gauges. */
function SchematicGlyphs() {
  return (
    <svg
      viewBox="0 0 250 44"
      className="h-9 w-auto text-[var(--fg)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      {/* resistor / waveform squiggle */}
      <path d="M2 14 h10 l8 22 l12 -30 l12 30 l12 -30 l12 30 l8 -22 h10" />
      <path d="M22 6 v5 M40 2 v5 M58 6 v5" strokeWidth="1.2" />
      {/* dial gauge 1 */}
      <circle cx="124" cy="25" r="16" />
      <path d="M124 25 L113 14" stroke="var(--accent)" />
      <path d="M124 5 v4" strokeWidth="1.2" />
      {/* connector */}
      <path d="M140 25 h28" strokeDasharray="3 4" strokeWidth="1.2" />
      {/* dial gauge 2 */}
      <circle cx="184" cy="25" r="16" />
      <path d="M184 25 L195 18" stroke="var(--accent)" />
      <path d="M184 5 v4" strokeWidth="1.2" />
    </svg>
  );
}

/** One masked slide-up line of the display headline. */
function HeadlineLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function BuiltHero() {
  const acorn = PROJECTS.find((p) => p.name === "AcornPrep");
  const heroRef = useRef<HTMLElement>(null);

  return (
    <>
      <section ref={heroRef} className="relative overflow-hidden pt-28 md:pt-36">
        {/* Drifting dust + targeting readout */}
        <DustField className="z-0" />
        <CoordsHUD containerRef={heroRef} />
        {/* Ghost mission type bleeding off the right edge */}
        <div
          className="pointer-events-none absolute right-0 top-24 z-0 hidden translate-x-[34%] flex-col text-right text-[clamp(4rem,9vw,8.5rem)] lg:flex"
          aria-hidden
        >
          {GHOST_LINES.map((line) => (
            <span key={line} className="ghost-line">
              {line}
            </span>
          ))}
        </div>

        {/* AcornPrep acorn, rising out of the bottom-right corner — click it */}
        <motion.div
          className="absolute -bottom-16 -right-10 z-20 size-[15rem] sm:size-[22rem] md:-bottom-16 md:-right-14 md:size-[34rem] xl:size-[38rem]"
          initial={{ opacity: 0, y: 70, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -12 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
        >
          <AcornBurst className="h-full w-full" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-44 md:px-9 md:pb-40">
          {/* Archival photo strip — the mission record */}
          <Reveal>
            <div className="frame-brackets">
              <div className="archival-frame h-40 overflow-hidden md:h-56">
                <Photo
                  src="/img/presenting-acornprep-at-gemini-meetup.jpg"
                  alt="Jadon presenting AcornPrep at the Google Gemini developer meetup"
                  priority
                  className="archival object-cover"
                  style={{ objectPosition: "50% 48%" }}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
              <span>Fig. 03 — Gemini developer meetup</span>
              <span className="hidden items-center gap-2 sm:inline-flex">
                <motion.span
                  className="size-1.5 rounded-full bg-[var(--accent)]"
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                />
                REC · 04/2026
              </span>
            </div>
          </Reveal>

          {/* Instrument glyphs */}
          <Reveal delay={0.15} className="mt-14 md:mt-20">
            <SchematicGlyphs />
          </Reveal>

          {/* Eyebrow */}
          <Reveal delay={0.2} className="mt-8">
            <p className="eyebrow">03 — Things I&apos;ve Built</p>
          </Reveal>

          {/* Display headline */}
          <h1 className="mission-display mt-6 text-[clamp(2.5rem,7.2vw,7rem)]">
            <HeadlineLine delay={0.25}>
              Ship it. <span className="stencil-accent">Then</span>
            </HeadlineLine>
            <HeadlineLine delay={0.37}>Ship the next one.</HeadlineLine>
          </h1>

          {/* Deck */}
          <Reveal delay={0.55} className="mt-9 max-w-md">
            <p className="font-grotesk text-sm leading-[1.9] text-[var(--muted)] md:text-base">
              Real products. Real users. AcornPrep, CueSheet, Hermes — and a
              handful of others. Every one of them launched, logged, and archived
              here. Every one of them shipped or in progress.
            </p>
          </Reveal>

          {/* Buttons — filled + viewfinder brackets */}
          <Reveal delay={0.65} className="mt-12">
            <div className="flex flex-wrap items-center gap-5">
              <Magnetic strength={0.25}>
                <a
                  href={acorn?.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-hover
                  className="btn-fill"
                >
                  Visit AcornPrep
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a
                  href={PROFILE.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-hover
                  className="btn-brackets"
                >
                  View the code <ArrowUpRight className="size-3.5" />
                </a>
              </Magnetic>
            </div>
          </Reveal>

          {/* Telemetry readout */}
          <Reveal delay={0.75} className="mt-16">
            <div className="grid max-w-3xl grid-cols-2 gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-4">
              {[
                { value: "08", label: "Products" },
                { value: "500+", label: "Active users" },
                { value: "#1", label: "Google result" },
                { value: "~$4,000", label: "Profit" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-2 bg-[var(--bg)] px-5 py-5">
                  <p className="mission-display text-3xl text-[var(--fg)]">
                    <StatValue value={s.value} />
                  </p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Marquee band */}
      <div className="relative z-10 border-y border-[var(--line)] bg-[var(--bg)] py-4">
        <Marquee
          items={MARQUEE_ITEMS}
          durationSec={40}
          sep="—"
          className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]"
        />
      </div>
    </>
  );
}
