"use client";

import { motion } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { RESEARCH } from "@/lib/data";

const PIPELINE_STEPS = [
  { label: "Mouse gout model", detail: "MSU crystal injection", abbr: "01" },
  { label: "RNA extraction", detail: "Total RNA isolation", abbr: "02" },
  { label: "RNA-seq", detail: "Illumina paired-end", abbr: "03" },
  { label: "DE in R", detail: "DESeq2 · limma", abbr: "04" },
  { label: "Pathway analysis", detail: "GSEA · GO enrichment", abbr: "05" },
  { label: "Pain mediators", detail: "Target identification", abbr: "06" },
];

export function PipelineFlow() {
  return (
    <div className="space-y-16">
      {/* Pipeline header */}
      <Reveal>
        <p className="eyebrow mb-2">{RESEARCH.project.method}</p>
        <h2 className="font-display text-3xl leading-tight md:text-5xl">
          {RESEARCH.project.title}
        </h2>
      </Reveal>

      {/* Summary */}
      <Reveal delay={0.1}>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
          {RESEARCH.project.summary}
        </p>
      </Reveal>

      {/* Horizontal pipeline — scrolls on mobile */}
      <div className="overflow-x-auto pb-4">
        <RevealGroup className="flex min-w-max items-stretch gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <Reveal key={step.abbr} delay={i * 0.07} className="flex items-stretch">
              {/* Step card */}
              <div className="group relative flex min-w-[130px] flex-col justify-between border border-[var(--line)] bg-[var(--bg-2)] p-5 transition-all duration-300 hover:border-[var(--accent)] hover:bg-[#0d1a2a]">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                  {step.abbr}
                </span>
                <div className="mt-4">
                  <p className="font-mono text-sm font-semibold leading-snug text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {step.label}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.68rem] text-[var(--muted)]">
                    {step.detail}
                  </p>
                </div>
                {/* accent dot */}
                <div className="mt-4 size-1.5 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Connector arrow — not after last */}
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="flex items-center px-0">
                  <motion.div
                    className="flex h-full items-center"
                    initial={{ opacity: 0, x: -4 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
                  >
                    {/* Arrow connector */}
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                      <line x1="0" y1="12" x2="24" y2="12" stroke="var(--line)" strokeWidth="1.5" />
                      <polyline points="18,6 26,12 18,18" stroke="var(--accent)" strokeWidth="1.5" fill="none" opacity="0.7" />
                    </svg>
                  </motion.div>
                </div>
              )}
            </Reveal>
          ))}
        </RevealGroup>
      </div>

      {/* Result callout */}
      <Reveal delay={0.3}>
        <div className="relative overflow-hidden rounded-lg border border-[var(--accent)] bg-[var(--bg-2)] p-8 md:p-12">
          {/* Background accent glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-5"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, #34e0c4, transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="eyebrow mb-4">Result</p>
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
              <span
                className="font-mono text-5xl font-black md:text-7xl"
                style={{ color: "var(--accent)" }}
              >
                3rd
              </span>
              <div>
                <p className="font-display text-xl leading-snug md:text-3xl">
                  Computational Biology
                </p>
                <p className="mt-1 font-mono text-sm text-[var(--muted)]">
                  BCOM · Alameda County Science &amp; Engineering Fair 2025
                </p>
              </div>
            </div>
            <div className="mt-6 border-t border-[var(--line)] pt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                Full citation
              </p>
              <p className="mt-2 font-mono text-sm text-[var(--fg)]">
                {RESEARCH.project.result}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
