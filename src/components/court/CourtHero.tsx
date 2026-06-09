"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { Photo } from "@/components/primitives/Photo";
import { COURT, PROFILE } from "@/lib/data";
import { cn } from "@/lib/cn";

/** Diagonal court-line SVG (half-court key + three-point arc motif). */
function CourtLineSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
      aria-hidden
    >
      {/* Three-point arc */}
      <path
        d="M 60 440 A 200 200 0 0 1 420 440"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="6 5"
        opacity="0.35"
      />
      {/* Key / paint box */}
      <rect x="175" y="280" width="130" height="160" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* Free-throw circle */}
      <circle cx="240" cy="280" r="48" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      {/* Basket circle */}
      <circle cx="240" cy="420" r="12" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {/* Center line mark */}
      <line x1="60" y1="440" x2="420" y2="440" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

/** Large blurred diagonal number watermark. */
function WatermarkNumber({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none select-none font-anton leading-none",
        "text-[var(--fg)] opacity-[0.03]",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Background repeating diagonal "NCS CHAMPIONS 2026" ticker text. */
function BackgroundTicker() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const phrase = "NCS CHAMPIONS 2026";
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="mx-8 whitespace-nowrap">
      {phrase}
    </span>
  ));

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex flex-col justify-center overflow-hidden opacity-[0.04]"
    >
      {[0, 1, 2, 3].map((row) => (
        <div
          key={row}
          className="flex font-anton text-[3.5rem] uppercase leading-none text-[var(--accent)]"
          style={{
            transform: "rotate(-4deg)",
            ...(reduced
              ? {}
              : {
                  animation: `marquee 28s linear infinite`,
                  animationDirection: row % 2 === 0 ? "normal" : "reverse",
                }),
          }}
        >
          {items}
          {items}
        </div>
      ))}
    </div>
  );
}

export function CourtHero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  // Photo parallax — drifts slower than foreground text
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden pt-36 md:pt-48"
    >
      {/* ── Full-bleed NCS Champions photo — parallax background ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: photoY }}
        data-cursor-hover
      >
        {/* Taller than 100% so parallax has room to shift without showing gaps */}
        <Photo
          src="/img/ncs-champions.jpg"
          alt="MSJ Varsity Basketball — NCS Section Champions 2026"
          priority
          className="object-top"
          sizes="100vw"
        />
        {/* Duotone orange overlay — bleeds the image into the court brand */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,91,31,0.35) 0%, rgba(11,11,12,0.0) 50%)",
            mixBlendMode: "multiply",
          }}
          aria-hidden
        />
        {/* Dark scrim — ensures all type is legible */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11,11,12,0.97) 0%, rgba(11,11,12,0.70) 35%, rgba(11,11,12,0.30) 70%, rgba(11,11,12,0.15) 100%)",
          }}
          aria-hidden
        />
        {/* Right-side fade so the year watermark stays readable */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
          style={{
            background:
              "linear-gradient(to left, rgba(11,11,12,0.80) 0%, transparent 100%)",
          }}
          aria-hidden
        />
      </motion.div>

      {/* Background diagonal ticker */}
      <BackgroundTicker />

      {/* Court lines — decorative, bottom-anchored */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[520px] translate-x-1/4 translate-y-1/4 opacity-30 text-[var(--line)] md:w-[640px]">
        <CourtLineSVG />
      </div>

      {/* Giant watermark year */}
      <WatermarkNumber className="absolute right-[-2vw] top-[12%] text-[38vw]">
        26
      </WatermarkNumber>

      {/* Diagonal orange accent slash */}
      <motion.div
        className="absolute left-0 top-0 h-[3px] bg-[var(--accent)]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%" }}
        aria-hidden
      />

      {/* Main content — sits above the photo */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-5 md:px-9"
        style={{ y: parallaxY, opacity: parallaxOpacity }}
      >
        {/* Eyebrow */}
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <span className="eyebrow text-[var(--accent)]">05 — The Court</span>
            <span className="h-px flex-1 bg-[var(--accent)] opacity-30" aria-hidden />
            <span className="eyebrow">{PROFILE.school}</span>
          </div>
        </Reveal>

        {/* Championship headline */}
        <div className="relative">
          <KineticHeadline
            as="h1"
            text="NCS"
            className="font-anton display-xl block w-full uppercase leading-none tracking-[-0.02em] text-[var(--fg)]"
            delay={0.05}
          />

          {/* CHAMPIONS in orange — massive */}
          <div
            className="relative -mt-4 md:-mt-6"
            style={{ fontSize: "clamp(3.8rem, 16vw, 14rem)", lineHeight: 0.88 }}
          >
            <KineticHeadline
              as="h1"
              text="CHAMPIONS"
              className="font-anton block leading-none tracking-[-0.02em] text-[var(--accent)]"
              delay={0.12}
            />
          </div>

          {/* Year — huge standalone */}
          <motion.div
            className="mt-2 md:mt-4"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="font-anton text-[var(--accent-2)] opacity-60"
              style={{ fontSize: "clamp(2rem, 8vw, 6.5rem)", lineHeight: 1, letterSpacing: "0.1em" }}
            >
              {COURT.banner.year}
            </span>
          </motion.div>
        </div>

        {/* "First in school and district history" bold callout */}
        <Reveal delay={0.6}>
          <div className="mt-8 max-w-3xl border-l-4 border-[var(--accent)] pl-6 md:mt-12">
            <p className="font-anton text-xl uppercase leading-tight tracking-wide text-[var(--fg)] md:text-3xl lg:text-4xl">
              {COURT.banner.sub}
            </p>
          </div>
        </Reveal>

        {/* Intro tagline */}
        <Reveal delay={0.75}>
          <p className="mt-6 font-grotesk text-base leading-relaxed text-[var(--muted)] md:text-lg lg:max-w-lg">
            {COURT.intro}
          </p>
        </Reveal>

        {/* Orange divider */}
        <motion.div
          className="mt-10 h-[2px] bg-[var(--accent)] md:mt-14"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        />

        {/* Stats row */}
        <Reveal delay={0.85}>
          <div className="mt-6 flex flex-wrap gap-8 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-[var(--muted)] md:mt-8 md:gap-12">
            <span>
              Varsity Basketball&nbsp;<span className="text-[var(--fg)]">MSJ</span>
            </span>
            <span>
              NCS&nbsp;<span className="text-[var(--fg)]">Section Champions</span>
            </span>
            <span>
              Started&nbsp;<span className="text-[var(--fg)]">First Five</span>
            </span>
            <span>
              First in&nbsp;<span className="text-[var(--fg)]">District History</span>
            </span>
          </div>
        </Reveal>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent"
        aria-hidden
      />
    </section>
  );
}
