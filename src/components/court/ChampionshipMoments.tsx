"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { BallIcon } from "@/components/court/BallMotifs";
import { COURT } from "@/lib/data";
import { ExternalLink } from "lucide-react";

/** A strip of athletic tape pinning the clipping to the gym wall. */
function Tape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-6 w-20 bg-white/30 shadow-[0_1px_3px_rgba(0,0,0,0.25)] backdrop-blur-[1px] ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0 6px, rgba(255,255,255,0.12) 6px 7px)",
      }}
    />
  );
}

/**
 * The Mercury News story as a newsprint clipping taped up in the gym.
 * Typographic — headline, deck and box score; the whole clipping links out.
 */
function PressClipping() {
  const p = COURT.press;
  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      className="group relative block bg-[#f4efe3] px-6 py-7 text-[#1c1a16] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] md:px-8 md:py-9"
      initial={{ rotate: -1.4 }}
      whileHover={{ rotate: 0, y: -4 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`${p.outlet}: ${p.headline} — read the full story`}
    >
      {/* Newsprint grain */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 3px, rgba(28,26,22,0.025) 3px 4px), radial-gradient(circle at 1px 1px, rgba(28,26,22,0.05) 0.5px, transparent 1px)",
          backgroundSize: "auto, 4px 4px",
        }}
      />

      {/* Tape at the corners */}
      <Tape className="-top-3 left-6 -rotate-6" />
      <Tape className="-top-3 right-6 rotate-6" />

      {/* Masthead row */}
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#1c1a16] pb-2">
        {/* Fraunces referenced directly — the .font-display helper can't resolve
            its var under @theme inline, which silently falls back to sans. */}
        <span
          className="whitespace-nowrap text-xs font-black uppercase tracking-[0.08em] sm:text-sm md:text-base"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          {p.outlet}
        </span>
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#6b6557]">
          {p.section} · {p.date}
        </span>
      </div>

      {/* Headline */}
      <h3
        className="mt-4 text-2xl font-bold leading-[1.05] tracking-tight md:text-[2rem]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        {p.headline}
      </h3>

      {/* Deck */}
      <p className="mt-3 font-grotesk text-sm leading-relaxed text-[#46412f]">
        {p.deck}
      </p>

      {/* Box score strip */}
      <div className="mt-5 flex items-stretch border-y border-[#1c1a16]/30 font-mono text-[0.62rem] uppercase tracking-[0.14em]">
        <div className="flex items-center gap-3 py-2 pr-4">
          <span className="font-bold">MSJ</span>
          <span className="font-anton text-xl tracking-normal">{p.score.msj}</span>
        </div>
        <span className="my-2 w-px bg-[#1c1a16]/30" aria-hidden />
        <div className="flex items-center gap-3 px-4 py-2">
          <span>{p.score.oppName}</span>
          <span className="font-anton text-xl tracking-normal text-[#6b6557]">{p.score.opp}</span>
        </div>
        <span className="my-2 ml-auto hidden items-center text-[#6b6557] sm:flex">
          {p.score.venue}
        </span>
      </div>

      {/* Byline + link */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="font-grotesk text-xs italic text-[#6b6557]">By {p.byline}</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#b3400f] transition-colors duration-300 group-hover:text-[#1c1a16]">
          Read the full story
          <ExternalLink className="size-3" />
        </span>
      </div>
    </motion.a>
  );
}

/**
 * Championship moments as rafter banners.
 * A steel rafter beam runs across the gym ceiling; the mayor + city photos
 * hang from it as pennant-cut title banners that sway gently. (The game-action
 * strip moved into the career timeline, embedded era by era.)
 */

function RafterBolt({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute size-1.5 rounded-full bg-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${className}`}
    />
  );
}

function ChampionshipBanner({
  src,
  alt,
  title,
  sub,
  year,
  drop,
  delay,
  swayDelay,
}: {
  src: string;
  alt: string;
  title: string;
  sub: string;
  year: string;
  /** String length from the rafter, in rem. */
  drop: number;
  delay: number;
  swayDelay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={delay}>
      <div className="relative flex flex-col items-center">
        {/* Hanging strings */}
        <div aria-hidden className="flex w-[72%] justify-between" style={{ height: `${drop}rem` }}>
          <span className="h-full w-px bg-gradient-to-b from-white/25 to-white/10" />
          <span className="h-full w-px bg-gradient-to-b from-white/25 to-white/10" />
        </div>

        {/* The banner — pennant cut, slow sway from the rod */}
        <motion.div
          className="relative w-full"
          style={{ transformOrigin: `50% -${drop}rem` }}
          animate={{ rotate: [-0.7, 0.7] }}
          transition={{ duration: 5.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: swayDelay }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          data-cursor-hover
        >
          <div
            className="relative overflow-hidden border-x-2 border-t-2 border-[var(--accent)] bg-[var(--bg-2)]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%)" }}
          >
            {/* Sleeve band over the rod */}
            <div className="flex items-center justify-between bg-[var(--accent)] px-4 py-2">
              <span className="font-anton text-sm uppercase tracking-wide text-black md:text-base">
                {title}
              </span>
              <BallIcon className="size-4" seam="#3a1505" />
            </div>

            {/* Photo */}
            <div className="relative aspect-[4/3]">
              <motion.div
                className="absolute inset-0"
                animate={{ filter: hovered ? "grayscale(0%)" : "grayscale(55%)", scale: hovered ? 1.04 : 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Photo src={src} alt={alt} className="object-cover" />
              </motion.div>
              {/* Orange duotone wash */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(160deg, rgba(255,91,31,0.28) 0%, transparent 60%)",
                  mixBlendMode: "screen",
                }}
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                aria-hidden
              />
              {/* Caption scrim */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
                style={{ background: "linear-gradient(to top, rgba(11,11,12,0.9) 0%, transparent 100%)" }}
                aria-hidden
              />
              <p className="absolute inset-x-0 bottom-0 px-4 pb-3 font-mono text-[0.58rem] uppercase tracking-widest text-white/80">
                {sub}
              </p>
            </div>

            {/* Pennant point — the year */}
            <div className="relative bg-[var(--bg-2)] pb-12 pt-4 text-center md:pb-14">
              <span className="font-anton text-3xl uppercase leading-none text-[var(--accent)] md:text-4xl">
                {year}
              </span>
              {/* Stitch line along the pennant edge */}
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full opacity-40" aria-hidden>
                <path d="M 2 2 L 2 12 L 50 27 L 98 12 L 98 2" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" fill="none" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </Reveal>
  );
}

export function ChampionshipMoments() {
  return (
    <section
      className="relative mt-20 overflow-hidden md:mt-28"
      aria-label="Championship moments — banners raised to the rafters"
    >
      <div className="mx-auto max-w-7xl px-5 pt-16 md:px-9 md:pt-20">
        {/* Section header */}
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-[var(--line)] pb-4">
            <span className="eyebrow text-[var(--accent)]">Raised to the Rafters</span>
            <span className="eyebrow hidden text-[var(--muted)] sm:block">NCS · 2026</span>
          </div>
        </Reveal>

        <div className="mt-5 md:mt-6">
          <KineticHeadline
            as="h2"
            text="Beyond the Final Buzzer."
            className="font-anton text-[2.2rem] uppercase leading-none tracking-tight text-[var(--fg)] md:text-[4rem]"
            delay={0.05}
          />
        </div>

        {/* ── The rafter beam ── */}
        <div className="relative mt-12 md:mt-16">
          <div className="relative h-4 border-y border-black/60 bg-[#1b1b1f] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.8)]">
            <RafterBolt className="left-[6%] top-1/2 -translate-y-1/2" />
            <RafterBolt className="left-[30%] top-1/2 -translate-y-1/2" />
            <RafterBolt className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <RafterBolt className="right-[30%] top-1/2 -translate-y-1/2" />
            <RafterBolt className="right-[6%] top-1/2 -translate-y-1/2" />
          </div>

          {/* Banners hanging at staggered drops */}
          <div className="grid grid-cols-1 gap-10 px-2 sm:grid-cols-2 md:gap-16 md:px-10">
            <ChampionshipBanner
              src="/img/ncs-champs-with-mayor.jpg"
              alt="NCS Champion MSJ Varsity Basketball team with the Mayor"
              title="NCS Champions"
              sub="Recognized by the Mayor · City of Fremont"
              year="2026"
              drop={2.5}
              delay={0.1}
              swayDelay={0}
            />
            <ChampionshipBanner
              src="/img/ncs-champs-recognized-by-city.jpg"
              alt="NCS Champions recognized by the City of Fremont"
              title="District First"
              sub="City of Fremont recognition ceremony"
              year="2026"
              drop={5}
              delay={0.25}
              swayDelay={1.6}
            />
          </div>
        </div>

        {/* Beneath the banners: the pull-quote + the morning paper */}
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 items-center gap-10 md:mt-20 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <Reveal delay={0.1}>
            <div className="border-l-4 border-[var(--accent)] pl-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                First title in school &amp; district history
              </p>
              <p className="mt-1 font-anton text-lg uppercase leading-tight text-[var(--fg)] md:text-xl">
                NCS Section Champions · 2026 — hanging in the gym forever.
              </p>
              <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
                And the morning paper said it best →
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="px-2 pt-4 md:px-0">
              <PressClipping />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom divider */}
      <motion.div
        className="mt-14 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent md:mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        aria-hidden
      />
    </section>
  );
}
