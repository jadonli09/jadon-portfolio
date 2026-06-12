"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { Magnetic } from "@/components/primitives/Magnetic";
import { LOCKED, PROFILE } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

/** Season palette — the five chapter accents of the timeline below. */
const SEASON_GRADIENT =
  "linear-gradient(92deg, #ffb43d 0%, #ff7a3d 34%, #ff3d81 66%, #b48cff 100%)";

/** Ambient glow orbs — summer gold + dawn violet, blurred, cinematic. */
function GlowOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Gold glow — top left (where the year begins) */}
      <div
        className="absolute -left-40 -top-20 h-[600px] w-[600px] rounded-full opacity-[0.11]"
        style={{
          background: "radial-gradient(circle, #ffb43d 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      {/* Dawn-violet glow — top right (where it is now) */}
      <div
        className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full opacity-[0.09]"
        style={{
          background: "radial-gradient(circle, #b48cff 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

/** Diagonal reels grid pattern — faint background art direction */
function ReelGridPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.025]" aria-hidden>
      <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="reel-grid" x="0" y="0" width="72" height="128" patternUnits="userSpaceOnUse">
            <rect x="4" y="4" width="64" height="120" rx="4" fill="none" stroke="var(--accent)" strokeWidth="1" />
            <rect x="14" y="12" width="44" height="8" rx="1" fill="var(--accent)" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#reel-grid)" />
      </svg>
    </div>
  );
}

export function LockedHero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden pt-36 md:pt-48"
    >
      {/* Ambient glows */}
      <GlowOrbs />

      {/* Reel grid background art */}
      <ReelGridPattern />

      {/* Top accent line — the year's seasons, left to right */}
      <motion.div
        className="absolute left-0 top-0 h-[2px]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", background: SEASON_GRADIENT }}
        aria-hidden
      />

      {/* Giant watermark "07" */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-[-1vw] top-[8%] font-anton leading-none text-[var(--fg)] opacity-[0.03]"
        style={{ fontSize: "clamp(12rem, 40vw, 38rem)" }}
      >
        07
      </span>

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-5 md:px-9"
        style={{ y: parallaxY, opacity: parallaxOpacity }}
      >
        {/* Eyebrow */}
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <span className="eyebrow text-[#ffb43d]">07 — The Pursuit</span>
            <span
              className="h-px flex-1 opacity-30"
              style={{ background: SEASON_GRADIENT }}
              aria-hidden
            />
            <span className="eyebrow">{PROFILE.links.instagramHandle}</span>
          </div>
        </Reveal>

        {/* Main headline — word-by-word kinetic */}
        <h1 className="sr-only">One year, documented. Still locked in.</h1>
        <KineticHeadline
          as="div"
          text="One year,"
          className="font-anton display-xl block uppercase text-[var(--fg)]"
          delay={0.05}
        />
        {/* Wrapper div provides the responsive font-size without adding style prop to KineticHeadline.
            The word sweeps through the five chapter accents — the year compressed into one line. */}
        <div
          style={{
            fontSize: "clamp(3.8rem, 16vw, 14rem)",
            lineHeight: 0.88,
            background: SEASON_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          <KineticHeadline
            as="div"
            text="documented."
            className="font-anton block uppercase leading-none"
            delay={0.2}
          />
        </div>
        <div style={{ fontSize: "clamp(2.5rem, 10vw, 9rem)", lineHeight: 0.95 }}>
          <KineticHeadline
            as="div"
            text="still locked in."
            className="font-anton block uppercase leading-none text-[#b48cff] opacity-75"
            delay={0.35}
          />
        </div>

        {/* Intro copy */}
        <Reveal delay={0.6}>
          <p className="mt-8 max-w-lg font-grotesk text-base leading-relaxed text-[var(--muted)] md:text-lg lg:mt-10">
            {LOCKED.intro}
          </p>
        </Reveal>

        {/* Metrics counters */}
        <Reveal delay={0.8}>
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-8 md:mt-14 md:grid-cols-4 md:gap-10">
            {LOCKED.metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <p
                  className="font-anton leading-none text-[var(--fg)]"
                  style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
                >
                  <Counter
                    to={m.value}
                    suffix={m.suffix}
                    decimals={"decimals" in m ? m.decimals : undefined}
                    duration={2.0}
                  />
                </p>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Handle CTA */}
        <Reveal delay={1.0}>
          <div className="mt-10 md:mt-12">
            <Magnetic strength={0.35}>
              <a
                href={PROFILE.links.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group inline-flex items-center gap-3 border border-[var(--accent)] px-6 py-3 font-mono text-sm uppercase tracking-[0.2em] text-[var(--accent)] transition-all duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg)]"
              >
                {PROFILE.links.instagramHandle}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </motion.div>

      {/* Bottom gradient */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent"
        aria-hidden
      />
    </section>
  );
}
