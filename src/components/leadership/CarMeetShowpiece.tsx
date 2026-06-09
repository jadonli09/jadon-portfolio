"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
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

/** Compact stat card for the grid below the collage. */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="group relative flex flex-col justify-end border border-[var(--line)] bg-[var(--bg-2)] p-4 transition-colors duration-500 hover:border-[var(--accent)] md:p-5">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <p className="font-anton text-[1.6rem] leading-none text-[var(--fg)] md:text-[2.2rem]">
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </p>
    </div>
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
    <section
      className="relative mx-auto mt-20 max-w-7xl px-5 md:mt-32 md:px-9"
      aria-labelledby="car-meet-title"
    >
      {/* Section header */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
          <div className="flex items-baseline gap-5">
            <span className="eyebrow text-[var(--accent)]">Notable Event</span>
            <span className="eyebrow text-[var(--muted)]">·</span>
            <span className="eyebrow text-[var(--muted)]">{carMeet.date}</span>
          </div>
          <span className="eyebrow text-[var(--accent)]">@msjmeets</span>
        </div>
      </Reveal>

      {/* Title */}
      <div className="mt-5 md:mt-6" id="car-meet-title">
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

            {/* 4-stat grid */}
            <div className="grid grid-cols-2 gap-px bg-[var(--line)] sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
              {carMeet.stats.map((s) => (
                <StatCard key={s.label} value={s.value} label={s.label} />
              ))}
            </div>

            {/* Pagani callout — pull-quote */}
            <div className="border-l-2 border-[var(--accent)] py-2 pl-5">
              <p className="font-anton text-[1.8rem] uppercase leading-tight text-[var(--fg)] md:text-[2.6rem]">
                One Pagani.
              </p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
                $3.5M — the centrepiece
              </p>
            </div>

            {/* Tag badges */}
            <div className="flex flex-wrap gap-2">
              {[
                "Media lead",
                "City Council + Mayor",
                "6-person core team",
                "@msjmeets",
                "Door-knocked the neighborhood",
              ].map((tag) => (
                <span
                  key={tag}
                  className="border border-[var(--line)] px-3 py-1 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right: photo collage */}
        <Reveal delay={0.2}>
          <CarMeetCollage />
        </Reveal>
      </div>

      {/* Animated counters strip */}
      <div className="mt-10 border-t border-[var(--line)] pt-8 md:mt-14 md:pt-10">
        <Reveal>
          <p className="eyebrow mb-6 text-[var(--accent)]">By the numbers</p>
        </Reveal>

        <RevealGroup
          className="grid grid-cols-2 divide-x divide-[var(--line)] border border-[var(--line)] sm:grid-cols-3 md:grid-cols-5"
          stagger={0.05}
          delayChildren={0.05}
        >
          {/* $35M+ */}
          <div className="group relative px-4 py-6 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-8">
            <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="font-anton text-[1.8rem] leading-none text-[var(--accent)] md:text-[2.5rem]">
              <Counter to={35} prefix="$" suffix="M+" duration={2} />
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              Cars on lot
            </p>
          </div>
          {/* 60+ Cars */}
          <div className="group relative px-4 py-6 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-8">
            <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="font-anton text-[1.8rem] leading-none text-[var(--fg)] md:text-[2.5rem]">
              <Counter to={60} suffix="+" duration={1.6} />
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              Cars
            </p>
          </div>
          {/* $3.5M Pagani */}
          <div className="group relative px-4 py-6 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-8">
            <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="font-anton text-[1.8rem] leading-none text-[var(--accent)] md:text-[2.5rem]">
              $3.5M
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              One Pagani
            </p>
          </div>
          {/* ~200 Attendees */}
          <div className="group relative px-4 py-6 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-8">
            <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="font-anton text-[1.8rem] leading-none text-[var(--fg)] md:text-[2.5rem]">
              <Counter to={200} prefix="~" duration={1.8} />
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              Attendees
            </p>
          </div>
          {/* 32K families */}
          <div className="group relative px-4 py-6 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-8">
            <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="font-anton text-[1.8rem] leading-none text-[var(--fg)] md:text-[2.5rem]">
              <Counter to={32} suffix="K" duration={1.5} />
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              FUSD families emailed
            </p>
          </div>
        </RevealGroup>
      </div>

      {/* Bottom gold rule */}
      <motion.div
        className="mt-12 h-px bg-gradient-to-r from-[var(--accent)] to-transparent opacity-30 md:mt-16"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
    </section>
  );
}
