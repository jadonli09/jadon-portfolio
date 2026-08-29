"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Photo } from "@/components/primitives/Photo";
import { LEADERSHIP } from "@/lib/data";

/** Single photo tile with hover caption and grayscale→color reveal. */
function PhotoTile({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`group relative overflow-hidden border border-[rgba(212,175,106,0.2)] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
    >
      {/* Photo — grayscale until hovered */}
      <motion.div
        className="absolute inset-0"
        animate={{ filter: hovered ? "grayscale(0%)" : "grayscale(80%)" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <Photo src={src} alt={alt} className="object-cover" />
      </motion.div>

      {/* Gold gradient scrim — bottom fade always */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: "linear-gradient(to top, rgba(12,10,8,0.85) 0%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Caption — slides up on hover */}
      <motion.div
        className="absolute inset-x-0 bottom-0 px-3 pb-3"
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: hovered ? 0 : 6, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
          {caption}
        </p>
      </motion.div>

      {/* Gold corner accent on hover */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px w-10 bg-[var(--accent)]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

/**
 * Collage of carmeet1–4.
 * carmeet1 (yellow McLaren) is the hero — full height, left.
 * carmeet2–4 stack on the right.
 */
function CarMeetCollage() {
  return (
    <div className="relative flex h-full min-h-[380px] gap-2 md:min-h-[440px]">
      {/* Left: hero McLaren — tall */}
      <PhotoTile
        src="/img/carmeet1.jpg"
        alt="Yellow McLaren front-on at the MSJ Car Meet"
        caption="MSJ Car Meet · @msjmeets"
        className="w-[58%] flex-shrink-0"
      />

      {/* Right: three stacked frames */}
      <div className="flex flex-1 flex-col gap-2">
        <PhotoTile
          src="/img/carmeet2.jpg"
          alt="Cars lined up in the lot at the MSJ Car Meet"
          caption="60+ cars on the lot"
          className="flex-1"
        />
        <PhotoTile
          src="/img/carmeet3.jpg"
          alt="Crowd and cars at the MSJ Car Meet event"
          caption="~200 attendees"
          className="flex-1"
        />
        <PhotoTile
          src="/img/carmeet4.jpg"
          alt="Event atmosphere at MSJ Car Meet"
          caption="Nov 8, 2025"
          className="flex-1"
        />
      </div>

      {/* Floating "first in MSJ history" badge */}
      <div className="absolute -right-2 -top-2 z-10 border border-[var(--accent)] bg-[var(--bg)] px-3 py-1.5 shadow-lg">
        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)]">
          First in MSJ History
        </p>
      </div>
    </div>
  );
}

/** License-plate stat chip — stamped metal look, screw dots in the corners. */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="group relative flex flex-col items-center justify-center rounded-md px-4 py-5 text-center transition-transform duration-300 hover:-translate-y-1 md:px-5"
      style={{
        background: "linear-gradient(180deg, #1b1610 0%, #120e09 100%)",
        border: "2px solid rgba(212,175,106,0.55)",
        boxShadow: "inset 0 0 0 1px rgba(12,10,8,0.9), inset 0 0 0 3px rgba(212,175,106,0.18), 0 6px 14px rgba(0,0,0,0.4)",
      }}
    >
      {/* Corner screws */}
      {["left-1.5 top-1.5", "right-1.5 top-1.5", "left-1.5 bottom-1.5", "right-1.5 bottom-1.5"].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute ${pos} block h-1.5 w-1.5 rounded-full`}
          style={{ background: "rgba(212,175,106,0.5)", boxShadow: "inset 0 0 1px #000" }}
        />
      ))}
      <p className="font-anton text-[1.6rem] leading-none tracking-wide text-[var(--accent)] md:text-[2.2rem]">
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[var(--muted)]">
        {label}
      </p>
    </div>
  );
}

/** Diagonal hazard-stripe divider — pit-lane texture. */
function HazardStripe() {
  return (
    <div
      aria-hidden
      className="h-2.5 w-full"
      style={{
        background:
          "repeating-linear-gradient(-45deg, rgba(212,175,106,0.75) 0 14px, transparent 14px 28px)",
      }}
    />
  );
}

/**
 * CarMeetShowpiece — demoted to a notable-event section.
 * Strong and dramatic, but deliberately smaller than the old full-bleed hero.
 * Lives after Winter Ball in the page order.
 */
export function CarMeetShowpiece() {
  const { carMeet } = LEADERSHIP;

  return (
    <section className="relative mt-20 md:mt-32" aria-labelledby="car-meet-title">
      {/* Pit-board header — full-bleed oxblood band between hazard stripes */}
      <Reveal>
        <div>
          <HazardStripe />
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 md:px-9"
            style={{ background: "var(--accent-2)" }}
          >
            <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#f5ecd8]">
              Notable event · {carMeet.date}
            </span>
            <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#f5ecd8]">
              @msjmeets
            </span>
          </div>
          <HazardStripe />
        </div>
      </Reveal>

      <div className="mx-auto max-w-7xl px-5 md:px-9">
      {/* Title */}
      <div className="mt-8 md:mt-10" id="car-meet-title">
        <KineticHeadline
          as="h2"
          text="MSJ Car Meet."
          className="font-anton text-[2.8rem] uppercase leading-none tracking-tight text-[var(--fg)] md:text-[5rem]"
          delay={0.05}
        />
      </div>

      {/* Pitch line */}
      <Reveal delay={0.2}>
        <p className="mt-4 max-w-2xl font-serif-i text-base italic text-[var(--fg)] opacity-80 md:text-lg">
          {carMeet.pitch}
        </p>
      </Reveal>

      {/* Two-column layout: body left, collage right */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-[1fr_1.1fr] md:gap-12">
        {/* Left: body + stat grid + tags */}
        <Reveal delay={0.1}>
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-[var(--fg)] opacity-[0.85] md:text-base">
              {carMeet.body}
            </p>

            {/* stat grid */}
            <div className="grid grid-cols-2 gap-px bg-[var(--line)] sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5">
              {carMeet.stats.map((s) => (
                <StatCard key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right: photo collage */}
        <Reveal delay={0.2}>
          <CarMeetCollage />
        </Reveal>
      </div>

      {/* Bottom gold rule */}
      <motion.div
        className="mt-12 h-px bg-gradient-to-r from-[var(--accent)] to-transparent opacity-30 md:mt-16"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
      </div>
    </section>
  );
}
