"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { RESEARCH } from "@/lib/data";
import { cn } from "@/lib/cn";

// Medal-style colour mapping
const AWARD_ACCENT: Record<string, string> = {
  "Honorable Mention": "var(--fg)",
  "Silver": "#c0c8d8",
  "3rd Place": "var(--accent)",
};

// Detail commentary for each award
const AWARD_COMMENTARY: Record<string, { headline: string; sub: string }> = {
  "USABO": {
    headline: "Score 26 of 50 — cutoff to Open Exam was 28.",
    sub: "Two points separated honorable mention from semifinalist. The gap is noted, the standard is understood.",
  },
  "UK Biology Olympiad": {
    headline: "Silver — Top 10% nationally.",
    sub: "International field, single-sitting exam across all of A-level biology.",
  },
  "ACSEF — Computational Biology": {
    headline: "3rd place — Alameda County fair, BCOM category.",
    sub: "RNA-seq pipeline in R, presented to a panel of judges in computational biology.",
  },
};

export function AwardsPanel() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      <Reveal>
        <p className="eyebrow mb-2">Competitions</p>
        <h2 className="font-display text-3xl leading-tight md:text-5xl">Awards</h2>
      </Reveal>

      {/* Awards table */}
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
                <div className="grid grid-cols-[1fr_auto] items-start gap-6 px-6 md:grid-cols-[auto_1fr_auto_auto] md:items-center">
                  {/* Year */}
                  <span className="hidden font-mono text-xs text-[var(--muted)] md:block">
                    {award.year}
                  </span>

                  {/* Name */}
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
                      <div className="mt-4 border-t border-[var(--line)] px-6 pt-4 pb-2">
                        <p className="font-mono text-sm text-[var(--fg)]">
                          {commentary.headline}
                        </p>
                        <p className="mt-2 font-mono text-xs leading-relaxed text-[var(--muted)]">
                          {commentary.sub}
                        </p>
                        {/* Special USABO near-miss bar */}
                        {award.name === "USABO" && (
                          <div className="mt-5">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">Score</span>
                              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">Cutoff</span>
                            </div>
                            <div className="relative h-2 w-full rounded-full bg-[var(--line)] overflow-hidden">
                              {/* Score bar */}
                              <motion.div
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ background: "var(--accent)" }}
                                initial={{ width: "0%" }}
                                animate={{ width: "52%" }} // 26/50
                                transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                              />
                              {/* Cutoff marker */}
                              <div
                                className="absolute inset-y-0 w-px bg-[var(--accent-2)]"
                                style={{ left: "56%" }} // 28/50
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="font-mono text-[0.65rem] text-[var(--accent)]">26</span>
                              <span className="font-mono text-[0.65rem] text-[var(--muted)]">/ 50</span>
                              <span className="font-mono text-[0.65rem]" style={{ color: "var(--accent-2)" }}>
                                cutoff: 28
                              </span>
                            </div>
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
    </div>
  );
}
