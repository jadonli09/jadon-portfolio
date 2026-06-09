"use client";

import { motion } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { RESEARCH } from "@/lib/data";

// ── page-local constants ──────────────────────────────────────────────────────

const TRAINING_STEPS = [
  {
    abbr: "T1",
    label: "R Language",
    detail: "Dr. Shady Younice · Stanford bioinformatics",
    note: "Week-long intensive — dataframes, dplyr, tidyverse fundamentals",
  },
  {
    abbr: "T2",
    label: "ggplot2",
    detail: "Visualization layer",
    note: "Grammar of graphics · publication-ready plots · colour theory in R",
  },
  {
    abbr: "T3",
    label: "RNA-seq theory",
    detail: "Bioinformatics video curriculum",
    note: "How high-throughput sequencers store data · FASTQ → alignment → counts",
  },
  {
    abbr: "T4",
    label: "DE analysis",
    detail: "DESeq2 · limma · edgeR",
    note: "Negative-binomial modelling · normalisation · FDR correction",
  },
  {
    abbr: "T5",
    label: "Pathway / GSEA",
    detail: "GO enrichment",
    note: "Identifying biologically coherent gene sets from ranked DE lists",
  },
];

const EXPERIMENT_STEPS = [
  { abbr: "01", label: "Mouse gout model", detail: "MSU crystal injection · ankle joint", note: "Monosodium urate crystals induce inflammatory arthritis in vivo" },
  { abbr: "02", label: "Tissue harvest", detail: "Joint + spinal cord", note: "Harvested from inflamed and non-localized regions — key comparison" },
  { abbr: "03", label: "RNA extraction", detail: "Total RNA isolation", note: "Quality checked (RIN ≥ 7) before library prep" },
  { abbr: "04", label: "RNA-seq", detail: "Illumina paired-end", note: "High-throughput sequencing · raw reads stored as FASTQ" },
  { abbr: "05", label: "DE in R", detail: "DESeq2 · limma", note: "Differentially expressed genes at padj < 0.05, |log₂FC| > 1.5" },
  { abbr: "06", label: "Pain mediators", detail: "Target identification", note: "NLRP3, IL-1β, TNF, Ptgs2, CXCL1/2 — canonical + novel" },
  { abbr: "07", label: "Spinal cord signal", detail: "Non-localized regions", note: "Key mediators replicated outside the joint → central sensitisation" },
  { abbr: "08", label: "Therapeutic targets", detail: "Non-invasive therapy window", note: "Spinal signatures suggest systemic / non-invasive intervention routes" },
];

const KEY_FINDINGS = [
  {
    gene: "Ptgs2 (COX-2)",
    dir: "up" as const,
    log2fc: "+2.6",
    sig: "p < 0.001",
    note: "Prostaglandin synthesis — classical pain signal",
  },
  {
    gene: "Il1b",
    dir: "up" as const,
    log2fc: "+2.0",
    sig: "p < 0.001",
    note: "Inflammasome-activated cytokine; NLRP3-dependent",
  },
  {
    gene: "S100a9",
    dir: "up" as const,
    log2fc: "+4.1",
    sig: "p < 0.001",
    note: "Damage-associated molecular pattern; neutrophil chemoattractant",
  },
  {
    gene: "Nlrp3",
    dir: "up" as const,
    log2fc: "+1.7",
    sig: "p < 0.01",
    note: "Inflammasome sensor — gout-specific urate crystal recognition",
  },
  {
    gene: "Sirt1",
    dir: "down" as const,
    log2fc: "−3.0",
    sig: "p < 0.001",
    note: "Anti-inflammatory deacetylase — suppressed in inflamed tissue",
  },
  {
    gene: "Socs1",
    dir: "down" as const,
    log2fc: "−2.4",
    sig: "p < 0.001",
    note: "JAK/STAT brake protein — loss amplifies cytokine cascade",
  },
];

// ── component ─────────────────────────────────────────────────────────────────

export function PipelineFlow() {
  return (
    <div className="space-y-24">

      {/* ── Section header ────────────────────────────────────── */}
      <Reveal>
        <p className="eyebrow mb-2">{RESEARCH.project.method}</p>
        <h2 className="font-display text-3xl leading-tight md:text-5xl">
          {RESEARCH.project.title}
        </h2>
      </Reveal>

      {/* ── Training pipeline ─────────────────────────────────── */}
      <div>
        <Reveal>
          <div className="mb-8 flex items-center gap-4">
            <p className="eyebrow">Training pipeline</p>
            <div className="h-px flex-1 bg-[var(--line)]" />
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              Dr. Shady Younice · Stanford Bioinformatics
            </span>
          </div>
        </Reveal>

        {/* Horizontal training steps */}
        <div className="overflow-x-auto pb-4">
          <RevealGroup className="flex min-w-max items-stretch gap-0">
            {TRAINING_STEPS.map((step, i) => (
              <Reveal key={step.abbr} delay={i * 0.06} className="flex items-stretch">
                <div className="group relative flex min-w-[160px] max-w-[200px] flex-col border border-[var(--line)] bg-[var(--bg)] p-5 transition-all duration-300 hover:border-[#ff5da2]/50 hover:bg-[#0d1a2a]">
                  <span
                    className="font-mono text-[0.55rem] uppercase tracking-[0.3em]"
                    style={{ color: "rgba(255,93,162,0.6)" }}
                  >
                    {step.abbr}
                  </span>
                  <p className="mt-3 font-mono text-sm font-semibold leading-snug text-[var(--fg)] transition-colors group-hover:text-[#ff5da2]">
                    {step.label}
                  </p>
                  <p className="mt-1 font-mono text-[0.65rem] text-[var(--muted)]">{step.detail}</p>
                  <p className="mt-3 font-mono text-[0.6rem] leading-relaxed text-[var(--muted)] opacity-70">
                    {step.note}
                  </p>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-[#ff5da2] transition-all duration-500 group-hover:w-full" />
                </div>

                {i < TRAINING_STEPS.length - 1 && (
                  <div className="flex items-center px-0">
                    <motion.div
                      className="flex h-full items-center"
                      initial={{ opacity: 0, x: -4 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
                    >
                      <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                        <line x1="0" y1="12" x2="20" y2="12" stroke="var(--line)" strokeWidth="1.2" />
                        <polyline points="14,6 22,12 14,18" stroke="#ff5da2" strokeWidth="1.2" fill="none" opacity="0.5" />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </Reveal>
            ))}

            {/* Terminal arrow into experiment */}
            <div className="flex items-center px-0">
              <motion.div
                className="flex h-full items-center"
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.35 }}
              >
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                  <line x1="0" y1="12" x2="32" y2="12" stroke="var(--line)" strokeWidth="1.2" strokeDasharray="4,3" />
                  <polyline points="26,6 34,12 26,18" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
                </svg>
              </motion.div>
            </div>

            {/* Divider badge */}
            <div className="flex items-center">
              <div
                className="rounded border px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest"
                style={{
                  borderColor: "rgba(52,224,196,0.35)",
                  color: "var(--accent)",
                  background: "rgba(52,224,196,0.05)",
                }}
              >
                Applied →
              </div>
            </div>
          </RevealGroup>
        </div>
      </div>

      {/* ── Experiment pipeline ───────────────────────────────── */}
      <div>
        <Reveal>
          <div className="mb-8 flex items-center gap-4">
            <p className="eyebrow">Experiment pipeline</p>
            <div className="h-px flex-1 bg-[var(--line)]" />
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              ACSEF 2025 · BCOM
            </span>
          </div>
        </Reveal>

        <div className="overflow-x-auto pb-4">
          <RevealGroup className="flex min-w-max items-stretch gap-0">
            {EXPERIMENT_STEPS.map((step, i) => (
              <Reveal key={step.abbr} delay={i * 0.055} className="flex items-stretch">
                <div className="group relative flex min-w-[140px] max-w-[180px] flex-col border border-[var(--line)] bg-[var(--bg-2)] p-5 transition-all duration-300 hover:border-[var(--accent)] hover:bg-[#0d1a2a]">
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                    {step.abbr}
                  </span>
                  <p className="mt-3 font-mono text-sm font-semibold leading-snug text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                    {step.label}
                  </p>
                  <p className="mt-1 font-mono text-[0.65rem] text-[var(--muted)]">{step.detail}</p>
                  <p className="mt-3 font-mono text-[0.6rem] leading-relaxed text-[var(--muted)] opacity-70">
                    {step.note}
                  </p>
                  {/* Accent dot */}
                  <div className="mt-4 size-1.5 rounded-full bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-[var(--accent)] transition-all duration-500 group-hover:w-full" />
                </div>

                {i < EXPERIMENT_STEPS.length - 1 && (
                  <div className="flex items-center px-0">
                    <motion.div
                      className="flex h-full items-center"
                      initial={{ opacity: 0, x: -4 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.055, duration: 0.35 }}
                    >
                      <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                        <line x1="0" y1="12" x2="20" y2="12" stroke="var(--line)" strokeWidth="1.2" />
                        <polyline points="14,6 22,12 14,18" stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity="0.65" />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>

      {/* ── Summary + key finding prose ──────────────────────── */}
      <Reveal delay={0.1}>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="eyebrow mb-4">What we found</p>
            <p className="text-base leading-relaxed text-[var(--muted)]">
              {RESEARCH.project.summary}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              Critically, key pain mediators — including inflammatory cytokines and
              prostaglandin-synthesis genes — were elevated not only at the joint site
              but in{" "}
              <span className="font-semibold text-[var(--fg)]">
                non-localized regions including the spinal cord
              </span>
              , a finding consistent with{" "}
              <span className="font-semibold text-[var(--fg)]">central sensitisation</span>. This
              opens a window for non-invasive, systemic therapeutic targets — modulating
              the neuroinflammatory cascade upstream of peripheral joint damage.
            </p>
          </div>

          {/* Key mediators mini table */}
          <div>
            <p className="eyebrow mb-4">Selected mediators</p>
            <div className="divide-y divide-[var(--line)] rounded border border-[var(--line)] overflow-hidden">
              {KEY_FINDINGS.map((f) => (
                <div key={f.gene} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3">
                  <div>
                    <p
                      className="font-mono text-xs font-semibold"
                      style={{ color: f.dir === "up" ? "#ff5da2" : "var(--accent)" }}
                    >
                      {f.gene}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.6rem] text-[var(--muted)]">{f.note}</p>
                  </div>
                  <span
                    className="font-mono text-[0.65rem] font-bold tabular-nums"
                    style={{ color: f.dir === "up" ? "#ff5da2" : "var(--accent)" }}
                  >
                    {f.log2fc}
                  </span>
                  <span className="font-mono text-[0.55rem] text-[var(--muted)]">{f.sig}</span>
                </div>
              ))}
              <div className="px-4 py-2">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
                  log₂(FC) · illustrative values · padj threshold 0.05
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Spinal cord insight callout ────────────────────────── */}
      <Reveal delay={0.15}>
        <div
          className="relative overflow-hidden rounded-lg border p-8 md:p-12"
          style={{ borderColor: "rgba(52,224,196,0.4)" }}
        >
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-6"
            style={{ background: "radial-gradient(ellipse at 20% 50%, #34e0c4, transparent 70%)" }}
          />

          {/* Accent bracket */}
          <div
            className="absolute left-0 top-0 h-full w-1 opacity-60"
            style={{ background: "linear-gradient(180deg, var(--accent), transparent)" }}
          />

          <div className="relative grid gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow mb-4" style={{ color: "var(--accent)" }}>
                Key insight — spinal cord signal
              </p>
              <p className="font-display text-xl leading-snug md:text-2xl">
                Pain mediators in non-localized tissue suggest new routes to treatment.
              </p>
              <p className="mt-4 font-mono text-sm leading-relaxed text-[var(--muted)]">
                Finding the same inflammatory signature in spinal cord tissue — away from
                the joint — points to a central sensitisation mechanism. This is clinically
                significant: it suggests that therapeutic targets need not be confined to
                the inflamed joint, opening the door to{" "}
                <span className="text-[var(--fg)]">non-invasive, systemic interventions</span>{" "}
                that act on the nervous system before pain becomes chronic.
              </p>
            </div>

            {/* Side stat */}
            <div className="flex flex-col items-center justify-center gap-1 rounded border border-[var(--line)] bg-[var(--bg)] px-8 py-6">
              <span
                className="font-mono text-5xl font-black md:text-6xl"
                style={{ color: "var(--accent)" }}
              >
                3rd
              </span>
              <p className="font-mono text-xs text-center text-[var(--muted)]">
                BCOM · Computational Biology
              </p>
              <p className="font-mono text-[0.6rem] text-center text-[var(--muted)] opacity-70">
                ACSEF 2025
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Result citation ───────────────────────────────────── */}
      <Reveal delay={0.2}>
        <div className="border-t border-[var(--line)] pt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Full citation</p>
          <p className="mt-2 font-mono text-sm text-[var(--fg)]">{RESEARCH.project.result}</p>
        </div>
      </Reveal>
    </div>
  );
}
