"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { SCORES, AP_FIVES } from "@/lib/data";
import { cn } from "@/lib/cn";

/* ── AP 5 medallion — bright metallic-gold on ivory ──────────── */

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
        {/* Medallion disc — bright metallic gold on light background */}
        <div
          className="relative flex size-14 items-center justify-center rounded-full border-2 md:size-16"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #f7e589 0%, #d4a820 45%, #a87d10 80%, #7a5c08 100%)",
            borderColor: hovered ? "#b07c1e" : "#d4a820",
            boxShadow: hovered
              ? "0 6px 20px rgba(176,124,30,0.45), 0 2px 6px rgba(176,124,30,0.25), inset 0 1px 3px rgba(255,255,255,0.6)"
              : "0 4px 14px rgba(176,124,30,0.25), inset 0 1px 2px rgba(255,255,255,0.45)",
          }}
        >
          {/* The "5" — dark text on bright gold */}
          <span
            className="font-display text-2xl font-bold leading-none md:text-3xl"
            style={{ color: "#3a2800", textShadow: "0 1px 2px rgba(255,255,255,0.4)" }}
          >
            5
          </span>

          {/* Specular highlight ring */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(140deg, rgba(255,255,255,0.45) 0%, transparent 45%)",
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
            className="pointer-events-none absolute left-1/2 top-[-3rem] z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--line)] bg-[#fffdf7] px-3 py-1.5"
            style={{ boxShadow: "0 4px 16px rgba(34,28,16,0.12)" }}
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

/* ── SAT sub-score bars ────────────────────────────────────────── */

function SubScoreBar({ label, value, max = 800 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </span>
      <div
        className="relative h-1.5 flex-1 rounded-full"
        style={{ background: "rgba(34,28,16,0.08)" }}
      >
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

/* ── Score card ────────────────────────────────────────────────── */

function ScoreCard({
  score,
  primary,
  className,
}: {
  score: (typeof SCORES)[number];
  primary?: boolean;
  className?: string;
}) {
  const numVal = Number(score.value);

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-4 rounded-xl p-5 md:p-6",
        primary
          ? "border-2 border-[var(--accent)]"
          : "border border-[var(--line)]",
        className,
      )}
      style={{
        background: primary ? "#fffdf7" : "#fffdf7",
        boxShadow: primary
          ? "0 10px 30px rgba(34,28,16,0.08), 0 2px 8px rgba(176,124,30,0.12)"
          : "0 4px 16px rgba(34,28,16,0.05)",
      }}
    >
      {primary && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "radial-gradient(ellipse at 15% 15%, rgba(176,124,30,0.06) 0%, transparent 55%)",
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

/* ── Main export ─────────────────────────────────────────────── */

export function ScoreBoard() {
  return (
    <section className="border-b border-[var(--line)]" style={{ background: "rgba(239,232,216,0.4)" }}>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">
        {/* Header */}
        <RevealGroup className="mb-10">
          <Reveal>
            <p className="eyebrow">Standardized Scores</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-3 font-display text-[2rem] leading-[0.95] tracking-tight md:text-[3rem]">
              The numbers.
            </h2>
          </Reveal>
        </RevealGroup>

        {/* Scores + AP medallions, all in one place: SAT anchors the left and
            spans both rows; PSAT/ACT sit top-right; the six AP fives tuck into
            a panel directly underneath them. */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* SAT — primary, left column, full height */}
          <Reveal className="md:row-span-2">
            <ScoreCard score={SCORES.find((s) => s.label === "SAT")!} primary className="md:h-full" />
          </Reveal>

          {/* PSAT + ACT — top-right */}
          {SCORES.filter((s) => s.label !== "SAT").map((score, i) => (
            <Reveal key={score.label} delay={0.1 + i * 0.08}>
              <ScoreCard score={score} className="md:h-full" />
            </Reveal>
          ))}

          {/* AP fives — one row, directly underneath PSAT/ACT */}
          <Reveal delay={0.25} className="md:col-span-2">
            <div
              className="flex h-full flex-col gap-4 rounded-xl border border-[var(--line)] p-5 md:p-6"
              style={{ background: "#fffdf7", boxShadow: "0 4px 16px rgba(34,28,16,0.05)" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="eyebrow">AP Exam Scores</p>
                <p className="font-mono text-[0.56rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  six fives · 5/5 · hover for subject
                </p>
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-4 md:gap-x-7">
                {AP_FIVES.map((exam) => (
                  <ApMedallion key={exam} exam={exam} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
