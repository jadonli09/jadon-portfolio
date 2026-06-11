"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Counter } from "@/components/primitives/Counter";

/**
 * Gym scoreboard. The career-numbers band styled as the box hanging over
 * every high-school court: bezelled housing, corner bolts, side vents,
 * glowing LED digits, a blinking FINAL lamp and a lit BONUS dot.
 */

type StatItem =
  | { kind: "counter"; value: number; suffix: string; prefix?: string; label: string }
  | { kind: "text"; value: string; label: string };

const STATS: StatItem[] = [
  { kind: "text", value: "FIRST 5", label: "Opening Lineup" },
  { kind: "text", value: "NCS", label: "Section Champions" },
  { kind: "counter", value: 569, suffix: "K", label: "DouYin Likes" },
  { kind: "text", value: ".500", label: "JV League Record" },
];

/** Glowing LED text — the scoreboard bulb look. */
const LED_GLOW: React.CSSProperties = {
  textShadow: "0 0 6px rgba(255,91,31,0.9), 0 0 22px rgba(255,91,31,0.45)",
};

function Bolt({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute size-2 rounded-full border border-black/60 bg-[#2a2a2e] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] ${className}`}
    />
  );
}

function StatCell({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const isLast = index === STATS.length - 1;

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center justify-center px-4 py-7 md:px-8 md:py-9"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      {/* Cell divider — scoreboard module seam */}
      {!isLast && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-[15%] hidden h-[70%] w-px bg-black sm:block"
          style={{ boxShadow: "1px 0 0 rgba(255,255,255,0.05)" }}
        />
      )}

      {/* LED value */}
      <p
        className="font-anton leading-none text-[var(--accent)]"
        style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", lineHeight: 1, ...LED_GLOW }}
      >
        {stat.kind === "counter" ? (
          inView ? (
            <Counter to={stat.value} suffix={stat.suffix} prefix={stat.prefix ?? ""} duration={2} />
          ) : (
            <span>0{stat.suffix}</span>
          )
        ) : (
          stat.value
        )}
      </p>

      {/* Engraved label plate */}
      <p className="mt-3 border border-white/10 bg-black/40 px-2.5 py-1 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/70">
        {stat.label}
      </p>
    </motion.div>
  );
}

export function CourtStatLine() {
  return (
    <section className="relative bg-[#0a0a0b] px-5 py-12 md:px-9 md:py-16" aria-label="Career numbers scoreboard">
      <div className="relative mx-auto max-w-5xl">
        {/* Hanging chains */}
        <div aria-hidden className="absolute -top-12 left-[12%] hidden h-12 w-px bg-gradient-to-b from-transparent to-white/20 md:block" />
        <div aria-hidden className="absolute -top-12 right-[12%] hidden h-12 w-px bg-gradient-to-b from-transparent to-white/20 md:block" />

        {/* Housing */}
        <div className="relative border-[6px] border-[#1d1d21] bg-[#0d0d10] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <Bolt className="left-2 top-2" />
          <Bolt className="right-2 top-2" />
          <Bolt className="bottom-2 left-2" />
          <Bolt className="bottom-2 right-2" />

          {/* Side vents */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-6 left-3 hidden w-1.5 opacity-50 md:block"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #26262b 0 2px, transparent 2px 7px)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-6 right-3 hidden w-1.5 opacity-50 md:block"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #26262b 0 2px, transparent 2px 7px)" }}
          />

          {/* Header strip */}
          <div className="flex items-center justify-between border-b border-black bg-[#101014] px-5 py-2.5 md:px-10">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-white/55">
              Mission San Jose — Warriors
            </span>
            <span className="inline-flex items-center gap-2">
              <motion.span
                className="size-1.5 rounded-full bg-[var(--accent)]"
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 1.3, repeat: Infinity }}
                aria-hidden
              />
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.3em] text-[var(--accent)]" style={LED_GLOW}>
                Final
              </span>
            </span>
          </div>

          {/* LED stat modules */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <StatCell key={stat.label} stat={stat} index={i} />
            ))}
          </div>

          {/* Footer strip */}
          <div className="flex items-center justify-between border-t border-black bg-[#101014] px-5 py-2 md:px-10">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-white/45">
              NCS Championship · 2026
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.28em] text-white/45">
              Bonus
              <span className="size-1.5 rounded-full bg-[var(--accent)]" style={{ boxShadow: "0 0 8px rgba(255,91,31,0.9)" }} aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
