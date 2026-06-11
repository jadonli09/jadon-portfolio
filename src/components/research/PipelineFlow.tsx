"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { RESEARCH } from "@/lib/data";

// ── page-local constants ──────────────────────────────────────────────────────

// The story at a glance — four beats from crystal to clinic.
const FLOW = [
  { abbr: "01", label: "Mouse gout model", note: "MSU crystals · ankle joint" },
  { abbr: "02", label: "RNA-seq", note: "Illumina paired-end · FASTQ" },
  { abbr: "03", label: "DE in R", note: "DESeq2 · padj < 0.05" },
  { abbr: "04", label: "Spinal-cord signal", note: "central sensitisation" },
] as const;

// Full methodology — kept, but tucked behind the disclosure for the curious.
const FULL_STEPS = [
  { abbr: "01", label: "Mouse gout model", detail: "MSU crystal injection · ankle joint" },
  { abbr: "02", label: "Tissue harvest", detail: "joint + spinal cord — the key comparison" },
  { abbr: "03", label: "RNA extraction", detail: "total RNA · RIN ≥ 7" },
  { abbr: "04", label: "RNA-seq", detail: "Illumina paired-end · stored as FASTQ" },
  { abbr: "05", label: "DE in R", detail: "DESeq2 · limma · padj < 0.05, |log₂FC| > 1.5" },
  { abbr: "06", label: "Pain mediators", detail: "NLRP3 · IL-1β · TNF · Ptgs2 · CXCL1/2" },
  { abbr: "07", label: "Spinal-cord signal", detail: "mediators replicated outside the joint" },
  { abbr: "08", label: "Therapeutic window", detail: "non-invasive, systemic intervention routes" },
] as const;

const KEY_FINDINGS = [
  { gene: "S100a9", dir: "up" as const, log2fc: "+4.1", note: "neutrophil chemoattractant (DAMP)" },
  { gene: "Ptgs2 (COX-2)", dir: "up" as const, log2fc: "+2.6", note: "prostaglandin synthesis — classical pain" },
  { gene: "Il1b", dir: "up" as const, log2fc: "+2.0", note: "inflammasome cytokine · NLRP3-dependent" },
  { gene: "Nlrp3", dir: "up" as const, log2fc: "+1.7", note: "urate-crystal sensor — gout-specific" },
  { gene: "Sirt1", dir: "down" as const, log2fc: "−3.0", note: "anti-inflammatory brake, suppressed" },
  { gene: "Socs1", dir: "down" as const, log2fc: "−2.4", note: "JAK/STAT brake — loss amplifies cascade" },
] as const;

// ── component ─────────────────────────────────────────────────────────────────

export function PipelineFlow() {
  const [open, setOpen] = useState(false);

  // The ⌘K command "open methodology" expands this from anywhere on the page.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("lab:open-methodology", onOpen);
    return () => window.removeEventListener("lab:open-methodology", onOpen);
  }, []);

  return (
    <Reveal>
      <div className="glass relative overflow-hidden rounded-3xl p-7 md:p-11">
        {/* faint coral wash in the corner — the project's warm tell */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%)" }}
          aria-hidden
        />

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <h3 className="font-display text-[clamp(1.6rem,3.3vw,2.4rem)] leading-[1.06] tracking-tight text-[var(--fg)]">
              {RESEARCH.project.title}
            </h3>
            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              {RESEARCH.project.method}
            </p>
          </div>

          {/* 3rd-place badge */}
          <div className="glass-2 flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-6 py-4">
            <span className="font-mono text-4xl font-black leading-none md:text-5xl" style={{ color: "var(--accent)" }}>
              3rd
            </span>
            <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
              Computational Bio
            </p>
          </div>
        </div>

        {/* ── Lead insight — the one thing to remember ─────────── */}
        <p className="relative mt-8 max-w-3xl text-[1.05rem] leading-relaxed text-[var(--muted)] md:mt-10 md:text-[1.2rem]">
          Ran RNA-seq on a mouse gout model in R to surface the genes that drive the
          pain. The pivotal result: key inflammatory mediators showed up not just at
          the joint but in{" "}
          <span className="font-semibold text-[var(--fg)]">non-localized tissue including the spinal cord</span>{" "}
          — a signature of{" "}
          <span className="font-semibold text-[var(--fg)]">central sensitisation</span> that
          opens a window for non-invasive, systemic treatment upstream of the joint.
        </p>

        {/* ── Pipeline band — four beats, crystal to clinic ────── */}
        <div className="relative mt-10 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4">
          {FLOW.map((s, i) => (
            <motion.div
              key={s.abbr}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-2 group rounded-xl p-4 transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_9%,transparent)]"
            >
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>
                {s.abbr}
              </span>
              <p className="mt-3 font-mono text-[0.82rem] font-semibold leading-snug text-[var(--fg)]">
                {s.label}
              </p>
              <p className="mt-1.5 font-mono text-[0.62rem] leading-snug text-[var(--muted)]">
                {s.note}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Disclosure: full methodology for the curious ─────── */}
        <div className="relative mt-12 border-t border-[var(--line)] pt-7">
          <button
            data-cursor-hover
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="group flex w-full items-center justify-between gap-4 text-left"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]">
              {open ? "Hide methodology" : "Methodology & key mediators"}
            </span>
            <motion.span
              className="font-mono text-[var(--muted)] text-xs"
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              ▾
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid gap-8 pt-7 md:grid-cols-[1fr_1fr]">
                  {/* Full 8-step pipeline */}
                  <div>
                    <p className="eyebrow mb-4">Full pipeline</p>
                    <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)]">
                      {FULL_STEPS.map((step) => (
                        <div
                          key={step.abbr}
                          className="flex items-start gap-3 bg-[var(--bg-2)] px-4 py-2.5"
                        >
                          <span className="mt-px shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[var(--muted)]">
                            {step.abbr}
                          </span>
                          <div>
                            <p className="font-mono text-[0.72rem] font-semibold text-[var(--fg)]">{step.label}</p>
                            <p className="font-mono text-[0.6rem] text-[var(--muted)]">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected mediators */}
                  <div>
                    <p className="eyebrow mb-4">Selected mediators</p>
                    <div className="overflow-hidden rounded-lg border border-[var(--line)] divide-y divide-[var(--line)]">
                      {KEY_FINDINGS.map((f) => (
                        <div key={f.gene} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5">
                          <div className="min-w-0">
                            <p
                              className="font-mono text-[0.72rem] font-semibold"
                              style={{ color: f.dir === "up" ? "var(--accent-2)" : "var(--accent)" }}
                            >
                              {f.gene}
                            </p>
                            <p className="font-mono text-[0.58rem] text-[var(--muted)]">{f.note}</p>
                          </div>
                          <span
                            className="font-mono text-[0.7rem] font-bold tabular-nums"
                            style={{ color: f.dir === "up" ? "var(--accent-2)" : "var(--accent)" }}
                          >
                            {f.log2fc}
                          </span>
                        </div>
                      ))}
                      <div className="px-4 py-2">
                        <p className="font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)]">
                          log₂(FC) · illustrative values · padj threshold 0.05
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Training note — points back to the training section */}
                <p className="mt-6 font-mono text-[0.7rem] leading-relaxed text-[var(--muted)]">
                  Built on the R + bioinformatics training above (Dr. Shady Younice, Stanford):
                  RNA-seq theory, DESeq2 modelling, and GSEA / GO pathway interpretation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Citation ─────────────────────────────────────────── */}
        <p className="relative mt-7 font-mono text-[0.7rem] leading-relaxed text-[var(--muted)]">
          {RESEARCH.project.result}
        </p>
      </div>
    </Reveal>
  );
}
