"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { SCORES, AP_FIVES } from "@/lib/data";
import { cn } from "@/lib/cn";

/* ── AP 5 medallion ───────────────────────────────────────── */

function ApMedallion({ exam }: { exam: string }) {
  const [hovered, setHovered] = useState(false);

  // Shorten subject for the chip face
  const short = exam.replace("AP ", "").split(" ")[0];

  return (
    <div className="relative">
      <motion.button
        data-cursor-hover
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        whileHover={{ scale: 1.08, y: -3 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex flex-col items-center gap-2 focus:outline-none"
        aria-label={`${exam} — AP Score 5`}
      >
        {/* Medallion disc */}
        <div
          className="relative flex size-14 items-center justify-center rounded-full border md:size-16"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #f0d98a, #c8a24a 60%, #8a6520)",
            borderColor: "rgba(231,200,115,0.5)",
            boxShadow: hovered
              ? "0 0 24px rgba(231,200,115,0.35), inset 0 1px 2px rgba(255,255,255,0.3)"
              : "0 2px 12px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.15)",
          }}
        >
          {/* The "5" */}
          <span
            className="font-display text-2xl font-bold leading-none md:text-3xl"
            style={{ color: "#0a0907", textShadow: "0 1px 1px rgba(255,255,255,0.3)" }}
          >
            5
          </span>

          {/* Edge ring */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)",
            }}
            aria-hidden
          />
        </div>

        {/* Exam abbreviation below disc */}
        <span className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
          {short}
        </span>
      </motion.button>

      {/* Full name tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute left-1/2 top-[-3rem] z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5"
          >
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--fg)]">
              {exam}
            </span>
            {/* Arrow */}
            <div
              className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
              style={{ borderTopColor: "var(--line)" }}
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── SAT sub-score bars ────────────────────────────────────── */

function SubScoreBar({ label, value, max = 800 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </span>
      <div className="relative h-px flex-1 bg-[var(--line)]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
          initial={{ width: "0%" }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
      <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>
        {value}
      </span>
    </div>
  );
}

/* ── Score card ────────────────────────────────────────────── */

function ScoreCard({
  score,
  primary,
}: {
  score: (typeof SCORES)[number];
  primary?: boolean;
}) {
  const numVal = Number(score.value);

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-4 rounded-xl border border-[var(--line)] p-5 md:p-6",
        primary
          ? "bg-[var(--bg-2)]"
          : "bg-[var(--bg)]",
      )}
    >
      {primary && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(231,200,115,0.12) 0%, transparent 60%)",
          }}
          aria-hidden
        />
      )}

      <div className="relative">
        {/* Label */}
        <p className="eyebrow mb-3">{score.label}</p>

        {/* Score number */}
        <div
          className={cn(
            "font-mono font-bold leading-none",
            primary ? "text-6xl md:text-8xl" : "text-4xl md:text-5xl",
          )}
          style={{ color: primary ? "var(--accent)" : "var(--fg)" }}
        >
          <Counter to={numVal} duration={primary ? 2.2 : 1.6} />
        </div>

        {/* Note */}
        <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--muted)]">
          {score.note}
        </p>

        {/* SAT sub-score bars */}
        {score.label === "SAT" && (
          <div className="mt-6 flex flex-col gap-3">
            <SubScoreBar label="EBRW" value={740} />
            <SubScoreBar label="Math" value={790} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────── */

export function ScoreBoard() {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">
        {/* Header */}
        <RevealGroup className="mb-12">
          <Reveal>
            <p className="eyebrow">Standardized Scores</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-3 font-display text-[2rem] leading-[0.95] tracking-tight md:text-[3rem]">
              The numbers.
            </h2>
          </Reveal>
        </RevealGroup>

        {/* Score cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {SCORES.map((score, i) => (
            <Reveal key={score.label} delay={i * 0.1}>
              <ScoreCard score={score} primary={score.label === "SAT"} />
            </Reveal>
          ))}
        </div>

        {/* AP Fives section */}
        <div className="mt-16 border-t border-[var(--line)] pt-16">
          <RevealGroup className="mb-10">
            <Reveal>
              <p className="eyebrow">AP Exam Scores</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="mt-3 font-display text-[1.6rem] leading-snug tracking-tight md:text-[2.4rem]">
                Six fives.
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-2 font-mono text-xs leading-relaxed text-[var(--muted)]">
                Hover each medallion for the full subject name.
              </p>
            </Reveal>
          </RevealGroup>

          {/* Medallion row */}
          <Reveal delay={0.15}>
            <div className="flex flex-wrap gap-6 md:gap-8">
              {AP_FIVES.map((exam) => (
                <ApMedallion key={exam} exam={exam} />
              ))}
            </div>
          </Reveal>

          {/* Decorative mono label */}
          <Reveal delay={0.3} className="mt-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
              Score 5 / 5 — highest possible on AP examinations
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
