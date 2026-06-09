"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { TROPHIES, AP_FIVES } from "@/lib/data";

/* ── Decorative gold shimmer ring ─────────────────────────── */

function GoldShimmer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Radial gold vignette */}
      <div
        className="absolute -right-[20%] -top-[30%] h-[120vh] w-[80vw] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse at center, #e7c873 0%, #c8a24a 30%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Subtle scan lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.025]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        <defs>
          <pattern id="hero-scanlines" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1440" height="1" fill="#e7c873" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-scanlines)" />
      </svg>

      {/* Animated gold arc */}
      <svg
        className="absolute right-0 top-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.ellipse
          cx="1100"
          cy="200"
          rx="500"
          ry="400"
          stroke="#e7c873"
          strokeWidth="0.8"
          fill="none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.ellipse
          cx="1100"
          cy="200"
          rx="320"
          ry="260"
          stroke="#c8a24a"
          strokeWidth="0.5"
          fill="none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}

/* ── Hero section ─────────────────────────────────────────── */

export function AchievementsHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  const totalAwards = TROPHIES.length;
  const totalFives = AP_FIVES.length;

  return (
    <section ref={ref} className="relative min-h-[90vh] overflow-hidden pt-36 md:pt-48">
      <GoldShimmer />

      <motion.div style={{ y }} className="relative z-10 mx-auto max-w-7xl px-5 pb-24 md:px-9">
        {/* Eyebrow */}
        <Reveal>
          <p className="eyebrow" style={{ color: "var(--accent)" }}>
            Trophy Case
          </p>
        </Reveal>

        {/* Kinetic headline */}
        <KineticHeadline
          as="h1"
          text="Receipts."
          delay={0.08}
          className="mt-5 font-display display-xl"
        />

        {/* Deck copy */}
        <Reveal delay={0.3} className="mt-8 max-w-lg">
          <p className="font-mono text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Every score, every medal, every title —{" "}
            <span style={{ color: "var(--fg)" }}>documented</span>. Not a
            brag sheet. A record.
          </p>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={0.45} className="mt-12 flex flex-wrap gap-5">
          {[
            { value: totalAwards.toString(), label: "Trophies & awards" },
            { value: totalFives.toString(), label: "AP fives" },
            { value: "1530", label: "SAT score" },
            { value: "29", label: "ACT — 8th grade" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 border-l border-[var(--line)] pl-4"
            >
              <span
                className="font-mono text-2xl font-bold leading-none md:text-3xl"
                style={{ color: "var(--accent)" }}
              >
                {stat.value}
              </span>
              <span className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>

        {/* Thin gold divider */}
        <Reveal delay={0.55} className="mt-14">
          <div
            className="h-px w-32"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-2), transparent)",
            }}
          />
        </Reveal>
      </motion.div>
    </section>
  );
}
