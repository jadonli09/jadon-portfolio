"use client";

import { motion } from "motion/react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { Marquee } from "@/components/primitives/Marquee";
import { PROJECTS } from "@/lib/data";
import { cn } from "@/lib/cn";

const MARQUEE_ITEMS = [
  ...PROJECTS.map((p) => p.domain),
  "Next.js · React · TypeScript",
  "AI grading · Automation",
  "Ship it. Then ship the next one.",
  "500+ users",
  "#1 Google result",
  "acornprep.com",
];

/** Animated grid lines in the hero background */
function HeroGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 700">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(124,156,255,0.06)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="hero-glow" cx="60%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#7c9cff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#7c9cff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-glow-2" cx="30%" cy="80%" r="40%">
            <stop offset="0%" stopColor="#b9ff66" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#b9ff66" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
        <ellipse cx="860" cy="280" rx="600" ry="500" fill="url(#hero-glow)" />
        <ellipse cx="430" cy="560" rx="400" ry="350" fill="url(#hero-glow-2)" />
      </svg>
    </div>
  );
}

/** Floating code label — decorative mono tag */
function CodeLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-[var(--line)] bg-[var(--bg-2)] px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-[var(--muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BuiltHero() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden pt-36 md:pt-48">
        <HeroGrid />

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 md:px-9">
          {/* Eyebrow */}
          <Reveal>
            <p className="eyebrow">03 — Things I&apos;ve Built</p>
          </Reveal>

          {/* Main headline */}
          <div className="mt-8 md:mt-10">
            <KineticHeadline
              as="h1"
              text="Ship it. Then ship the next one."
              delay={0.08}
              className="font-display display-lg max-w-[18ch] leading-[0.95] tracking-tight"
            />
          </div>

          {/* Deck */}
          <Reveal delay={0.3} className="mt-8 max-w-lg">
            <p className="font-grotesk text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Real products. Real users. AcornPrep, CueSheet, Hermes — and a handful of others.
              Every one of them shipped or in progress.
            </p>
          </Reveal>

          {/* Manifest line — mono domains */}
          <Reveal delay={0.4} className="mt-8">
            <div className="flex flex-wrap gap-2">
              {PROJECTS.map((p) => (
                <CodeLabel key={p.name}>
                  <span
                    className="mr-1.5 size-1.5 rounded-full"
                    style={{
                      background: p.embeddable ? "var(--accent-2)" : "var(--muted)",
                      display: "inline-block",
                    }}
                  />
                  {p.domain}
                </CodeLabel>
              ))}
            </div>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={0.5} className="mt-14">
            <div className="grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-8 sm:grid-cols-4">
              {[
                { value: "5", label: "Products" },
                { value: "500+", label: "Active users" },
                { value: "#1", label: "Google result" },
                { value: "~$700", label: "Revenue generated" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <p
                    className="font-mono text-2xl font-semibold leading-none"
                    style={{ color: "var(--accent)" }}
                  >
                    {s.value}
                  </p>
                  <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Decorative accent line */}
          <motion.div
            className="mt-14 h-px"
            style={{
              background: "linear-gradient(90deg, var(--accent), var(--accent-2), transparent)",
            }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </section>

      {/* Marquee band */}
      <div className="border-y border-[var(--line)] py-4">
        <Marquee
          items={MARQUEE_ITEMS}
          durationSec={40}
          sep="·"
          className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]"
        />
      </div>
    </>
  );
}
