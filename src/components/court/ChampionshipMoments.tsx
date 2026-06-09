"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { TiltCard } from "@/components/primitives/TiltCard";

/**
 * A "the moment" photo with hover-reveal caption.
 * Uses grayscale-to-color on hover for sports-mag energy.
 */
function MomentPhoto({
  src,
  alt,
  caption,
  sub,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  sub?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`group relative overflow-hidden border border-[var(--line)] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
    >
      {/* Photo — grayscale → color → slight orange tint on hover */}
      <motion.div
        className="absolute inset-0"
        animate={{
          filter: hovered ? "grayscale(0%)" : "grayscale(60%)",
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Photo src={src} alt={alt} className="object-cover" />
      </motion.div>

      {/* Orange duotone overlay — fades in on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,91,31,0.28) 0%, transparent 60%)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        aria-hidden
      />

      {/* Bottom gradient scrim */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            "linear-gradient(to top, rgba(11,11,12,0.92) 0%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Caption — slides up on hover */}
      <motion.div
        className="absolute inset-x-0 bottom-0 px-4 pb-4"
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-grotesk text-sm font-semibold leading-tight text-[var(--fg)]">
          {caption}
        </p>
        {sub && (
          <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">
            {sub}
          </p>
        )}
      </motion.div>

      {/* Orange corner accent */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px w-14 bg-[var(--accent)]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-14 w-px bg-[var(--accent)]"
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.04 }}
      />
    </div>
  );
}

/** Horizontal sports-motion strip — game action photos that fly past. */
function GamePhotoStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stripRef,
    offset: ["start end", "end start"],
  });
  // Strip drifts rightward as you scroll down
  const stripX = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  const GAME_PHOTOS: { src: string; alt: string; label: string }[] = [
    { src: "/img/var-bbal1.jpg", alt: "MSJ Varsity Basketball game action", label: "Varsity" },
    { src: "/img/var-bbal2.jpg", alt: "MSJ Varsity Basketball — second shot", label: "Varsity" },
    { src: "/img/jv-bbal.jpg", alt: "MSJ JV Basketball game", label: "JV Program" },
    { src: "/img/frosh-bbal.jpg", alt: "MSJ Freshman Basketball game", label: "Frosh Program" },
  ];

  return (
    <div ref={stripRef} className="relative overflow-hidden">
      <motion.div
        style={{ x: stripX }}
        className="flex gap-2 md:gap-3"
      >
        {GAME_PHOTOS.map((p, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] w-[160px] flex-shrink-0 overflow-hidden border border-[var(--line)] md:w-[200px]"
            data-cursor-hover
          >
            <Photo src={p.src} alt={p.alt} className="object-cover" />
            {/* Motion-blur diagonal overlay — kinetic energy */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(118deg, rgba(255,91,31,0.18) 0%, transparent 45%)",
              }}
              aria-hidden
            />
            {/* Label */}
            <div className="absolute inset-x-0 bottom-0 border-t border-[var(--accent)] bg-[var(--bg)]/80 px-2 py-1.5">
              <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)]">
                {p.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Left/right edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-20"
        style={{ background: "linear-gradient(to right, var(--bg) 0%, transparent 100%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-20"
        style={{ background: "linear-gradient(to left, var(--bg) 0%, transparent 100%)" }}
        aria-hidden
      />
    </div>
  );
}

/**
 * The Championship Moments section.
 * Layout:
 *   • Section header + "The Moment" label
 *   • Two tall "the moment" photos: ncs-champs-with-mayor + ncs-champs-recognized-by-city
 *     (TiltCard treatment, overlapping layout on desktop)
 *   • Below: game-action horizontal strip (var + jv + frosh)
 */
export function ChampionshipMoments() {
  return (
    <section
      className="relative mt-20 overflow-hidden md:mt-28"
      aria-label="Championship moments — mayor recognition, city ceremony, game action"
    >
      {/* Top orange rule */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-[2px] bg-[var(--accent)]"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-5 pt-16 md:px-9 md:pt-20">
        {/* Section header */}
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-[var(--line)] pb-4">
            <span className="eyebrow text-[var(--accent)]">The Moment</span>
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

        {/* ── "The Moment" photos — asymmetric overlapping layout ── */}
        <div className="relative mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-[1.2fr_0.85fr] md:gap-6">
          {/* Primary: Mayor photo — large, TiltCard */}
          <Reveal delay={0.1}>
            <TiltCard max={5}>
              <MomentPhoto
                src="/img/ncs-champs-with-mayor.jpg"
                alt="NCS Champion MSJ Varsity Basketball team with the Mayor"
                caption="Champions — Recognized by the Mayor"
                sub="City of Fremont · 2026"
                className="aspect-[4/3] w-full"
              />
            </TiltCard>
          </Reveal>

          {/* Secondary: City recognition — shifted down on desktop for asymmetry */}
          <Reveal delay={0.2}>
            <div className="md:mt-12">
              <TiltCard max={5}>
                <MomentPhoto
                  src="/img/ncs-champs-recognized-by-city.jpg"
                  alt="NCS Champions recognized by the City of Fremont"
                  caption="City of Fremont Recognition"
                  sub="First in district history · 2026"
                  className="aspect-[4/3] w-full"
                />
              </TiltCard>

              {/* Pull-quote beneath the secondary photo */}
              <div className="mt-4 border-l-4 border-[var(--accent)] pl-4">
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                  First title in school &amp; district history
                </p>
                <p className="mt-1 font-anton text-lg uppercase leading-tight text-[var(--fg)] md:text-xl">
                  NCS Section Champions · 2026
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Game action strip ── */}
      <div className="mt-14 md:mt-20">
        <Reveal>
          <div className="mx-auto mb-5 max-w-7xl px-5 md:px-9">
            <span className="eyebrow text-[var(--muted)]">
              Varsity · JV · Freshman — the full program
            </span>
          </div>
        </Reveal>
        <GamePhotoStrip />
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
