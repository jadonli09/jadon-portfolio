"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { RESEARCH } from "@/lib/data";
import { cn } from "@/lib/cn";

// ── page-local detail constants ───────────────────────────────────────────────

const AWARD_ACCENT: Record<string, string> = {
  "Honorable Mention": "var(--fg)",
  "Silver": "#c0c8d8",
  "3rd Place": "var(--accent)",
};

const AWARD_COMMENTARY: Record<
  string,
  { headline: string; sub: string; detail: string }
> = {
  USABO: {
    headline: "Score 26 / 50 — semifinalist cutoff 28. Top ~15% nationally.",
    sub: "Studied via Campbell Biology (the definitive AP / olympiad text) and past practice papers. Two points from the cutoff — the standard is understood and the target is clear.",
    detail:
      "The USABO Open Exam is taken by thousands of strong biology students nationwide; scoring in the top 15% without a dedicated olympiad coach or training program reflects the depth of self-directed study. The 26/50 result sits comfortably in Honorable Mention territory — a springboard, not a ceiling.",
  },
  "UK Biology Olympiad": {
    headline: "Silver — top 10% of the international field.",
    sub: "Taken with no explicit prep — no dedicated study period, no coaching. The score reflects foundational biology depth acquired through coursework and general interest.",
    detail:
      "The BBO draws students from across the UK and internationally; a Silver placing a student in the top decile of that field without targeted preparation is a signal about the baseline, not the ceiling. The exam covers all of A-level biology in a single sitting.",
  },
  "ACSEF — Computational Biology": {
    headline: "3rd place — BCOM category, Alameda County Science & Engineering Fair 2025.",
    sub: "Presented the RNA-seq pipeline and key mediator findings — including the spinal cord signal — to a panel of expert judges in computational biology.",
    detail:
      "ACSEF is the county-level qualifier for the California Science & Engineering Fair (CSEF) and ultimately Intel ISEF. Placing 3rd in the Computational Biology (BCOM) category as a first-time entrant, with a self-built RNA-seq pipeline and a novel therapeutic insight, is a meaningful research result — not a class project.",
  },
};

// Stat bar data for visual context
const USABO_STAT = {
  score: 26,
  cutoff: 28,
  max: 50,
  pct: "~15%", // top percentile
};

// ── component ─────────────────────────────────────────────────────────────────

export function AwardsPanel() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-16">

      {/* ── Section header ────────────────────────────────────── */}
      <Reveal>
        <p className="eyebrow mb-2">Competitions</p>
        <h2 className="font-display text-3xl leading-tight md:text-5xl">Awards &amp; Olympiads</h2>
      </Reveal>

      {/* ── Context blurb ─────────────────────────────────────── */}
      <Reveal delay={0.1}>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-[var(--muted)]">
          Three independent competitions, three strong results — all in a single academic year
          alongside a full AP courseload. The USABO and UK BBO reflect self-directed biology
          depth; ACSEF reflects applied computational research that earned external peer review.
        </p>
      </Reveal>

      {/* ── Awards table ──────────────────────────────────────── */}
      <RevealGroup className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {RESEARCH.awards.map((award, i) => {
          const isOpen = active === award.name;
          const commentary = AWARD_COMMENTARY[award.name];
          const accentColor = AWARD_ACCENT[award.result] ?? "var(--accent)";

          return (
            <Reveal key={award.name} delay={i * 0.06}>
              <button
                data-cursor-hover
                onClick={() => setActive(isOpen ? null : award.name)}
                className={cn(
                  "group w-full py-6 text-left transition-colors",
                  isOpen ? "bg-[var(--bg-2)]" : "hover:bg-[#0c1422]"
                )}
                aria-expanded={isOpen}
              >
                <div className="grid grid-cols-[1fr_auto] items-start gap-6 px-6 md:grid-cols-[72px_1fr_auto_auto] md:items-center">
                  {/* Year */}
                  <span className="hidden font-mono text-xs text-[var(--muted)] md:block">
                    {award.year}
                  </span>

                  {/* Name + note */}
                  <div className="min-w-0">
                    <p className="font-mono text-base font-semibold text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                      {award.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">
                      {award.note}
                    </p>
                  </div>

                  {/* Result badge */}
                  <span
                    className="font-mono text-sm font-black uppercase tracking-wider"
                    style={{ color: accentColor }}
                  >
                    {award.result}
                  </span>

                  {/* Chevron */}
                  <motion.span
                    className="font-mono text-[var(--muted)] text-xs"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    ▾
                  </motion.span>
                </div>

                {/* Expandable detail */}
                <AnimatePresence initial={false}>
                  {isOpen && commentary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 border-t border-[var(--line)] px-6 pt-5 pb-4 space-y-3">
                        <p className="font-mono text-sm font-semibold text-[var(--fg)]">
                          {commentary.headline}
                        </p>
                        <p className="font-mono text-xs leading-relaxed text-[var(--muted)]">
                          {commentary.sub}
                        </p>
                        <p className="font-mono text-[0.7rem] leading-relaxed text-[var(--muted)] opacity-80">
                          {commentary.detail}
                        </p>

                        {/* USABO visualisation */}
                        {award.name === "USABO" && (
                          <div className="mt-6 space-y-3">
                            {/* Score bar */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                                  Score
                                </span>
                                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                                  / {USABO_STAT.max}
                                </span>
                              </div>
                              <div className="relative h-2.5 w-full rounded-full bg-[var(--line)] overflow-hidden">
                                <motion.div
                                  className="absolute inset-y-0 left-0 rounded-full"
                                  style={{ background: "var(--accent)" }}
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${(USABO_STAT.score / USABO_STAT.max) * 100}%` }}
                                  transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                />
                                {/* Cutoff marker */}
                                <div
                                  className="absolute inset-y-0 w-0.5 rounded-full"
                                  style={{
                                    left: `${(USABO_STAT.cutoff / USABO_STAT.max) * 100}%`,
                                    background: "#ff5da2",
                                  }}
                                />
                              </div>
                              <div className="flex justify-between mt-1.5">
                                <span className="font-mono text-[0.65rem]" style={{ color: "var(--accent)" }}>
                                  {USABO_STAT.score} — scored
                                </span>
                                <span className="font-mono text-[0.65rem] text-[var(--muted)]">
                                  50 max
                                </span>
                                <span className="font-mono text-[0.65rem]" style={{ color: "#ff5da2" }}>
                                  {USABO_STAT.cutoff} cutoff
                                </span>
                              </div>
                            </div>

                            {/* Percentile pills */}
                            <div className="flex flex-wrap gap-3">
                              {[
                                { label: "Score", value: "26", unit: "/ 50" },
                                { label: "Rank tier", value: "Top ~15%", unit: "nationally" },
                                { label: "Cutoff", value: "28", unit: "/ 50" },
                                { label: "Prep", value: "Campbell", unit: "+ practice" },
                              ].map((p) => (
                                <div
                                  key={p.label}
                                  className="flex flex-col gap-0.5 rounded border border-[var(--line)] bg-[var(--bg)] px-4 py-3"
                                >
                                  <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
                                    {p.label}
                                  </span>
                                  <span className="font-mono text-sm font-bold text-[var(--fg)]">
                                    {p.value}
                                  </span>
                                  <span className="font-mono text-[0.6rem] text-[var(--muted)]">
                                    {p.unit}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* UK BBO pills */}
                        {award.name === "UK Biology Olympiad" && (
                          <div className="mt-5 flex flex-wrap gap-3">
                            {[
                              { label: "Medal", value: "Silver", unit: "2025" },
                              { label: "Rank tier", value: "Top 10%", unit: "intl. field" },
                              { label: "Prep", value: "None", unit: "explicit" },
                              { label: "Scope", value: "Full A-level", unit: "single sitting" },
                            ].map((p) => (
                              <div
                                key={p.label}
                                className="flex flex-col gap-0.5 rounded border border-[var(--line)] bg-[var(--bg)] px-4 py-3"
                              >
                                <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
                                  {p.label}
                                </span>
                                <span className="font-mono text-sm font-bold" style={{ color: "#c0c8d8" }}>
                                  {p.value}
                                </span>
                                <span className="font-mono text-[0.6rem] text-[var(--muted)]">
                                  {p.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ACSEF pills */}
                        {award.name === "ACSEF — Computational Biology" && (
                          <div className="mt-5 flex flex-wrap gap-3">
                            {[
                              { label: "Place", value: "3rd", unit: "BCOM category" },
                              { label: "Fair", value: "ACSEF", unit: "2025" },
                              { label: "Method", value: "RNA-seq", unit: "DESeq2 · R" },
                              { label: "Key finding", value: "Spinal cord", unit: "signal" },
                            ].map((p) => (
                              <div
                                key={p.label}
                                className="flex flex-col gap-0.5 rounded border border-[var(--line)] bg-[var(--bg)] px-4 py-3"
                              >
                                <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
                                  {p.label}
                                </span>
                                <span
                                  className="font-mono text-sm font-bold"
                                  style={{ color: "var(--accent)" }}
                                >
                                  {p.value}
                                </span>
                                <span className="font-mono text-[0.6rem] text-[var(--muted)]">
                                  {p.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </Reveal>
          );
        })}
      </RevealGroup>

      {/* ── Aggregate stats strip ─────────────────────────────── */}
      <Reveal delay={0.2}>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
          {[
            { value: 26, suffix: "/50", label: "USABO score" },
            { value: 15, suffix: "%", prefix: "top~", label: "Nationally · USABO" },
            { value: 10, suffix: "%", prefix: "top ", label: "UK BBO Silver tier" },
            { value: 3, suffix: "rd", label: "ACSEF · BCOM" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center gap-1.5 bg-[var(--bg-2)] py-8 px-4">
              <span
                className="font-mono text-3xl font-black md:text-4xl"
                style={{ color: "var(--accent)" }}
              >
                <Counter to={s.value} suffix={s.suffix} prefix={s.prefix ?? ""} duration={1.6} />
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] text-center">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
