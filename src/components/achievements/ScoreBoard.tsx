"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { SCORES, AP_FIVES } from "@/lib/data";
import { cn } from "@/lib/cn";

/* ── AP 5 medallion — bright metallic-gold on ivory ──────────── */

function ApMedallion({ exam }: { exam: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      data-cursor-hover
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      whileHover={{ scale: 1.08, y: -3 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex w-24 flex-col items-center gap-2 focus:outline-none"
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

      {/* Subject below disc */}
      <span className="text-balance text-center text-sm leading-tight text-[var(--muted)]">
        {exam.replace("AP ", "")}
      </span>
    </motion.button>
  );
}

/* ── SAT sub-score bars ────────────────────────────────────────── */

function SubScoreBar({ label, value, max = 800 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-4">
      <span className="w-20 text-sm text-[var(--muted)]">
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
      <span className="font-mono text-sm font-semibold" style={{ color: "var(--accent)" }}>
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
        {/* Test */}
        <h3 className="mb-3 font-display text-xl leading-none">{score.label}</h3>

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
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {score.note}
        </p>

        {/* section sub-score bars (SAT: /800 · ACT: /36) */}
        {"subs" in score && score.subs && (
          <div className="mt-6 flex flex-col gap-3">
            {score.subs.map((sub) => (
              <SubScoreBar key={sub.label} label={sub.label} value={sub.value} max={sub.max} />
            ))}
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
        <Reveal className="mb-10">
          <h2 className="font-display text-[2rem] leading-[0.95] tracking-tight md:text-[3rem]">
            Test scores.
          </h2>
        </Reveal>

        {/* Scores + AP medallions, all in one place: SAT anchors the left and
            spans both rows; ACT/PSAT sit top-right; the eleven AP fives tuck into
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
              <h3 className="font-display text-xl leading-none">AP exams</h3>
              <div className="flex flex-1 flex-wrap items-start gap-x-3 gap-y-5 md:gap-x-4">
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
