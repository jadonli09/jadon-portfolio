import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Marquee } from "@/components/primitives/Marquee";
import { Counter } from "@/components/primitives/Counter";
import { VolcanoPlot } from "@/components/research/VolcanoPlot";
import { PipelineFlow } from "@/components/research/PipelineFlow";
import { AwardsPanel } from "@/components/research/AwardsPanel";
import { ProgramsGrid } from "@/components/research/ProgramsGrid";
import { RESEARCH, AP_FIVES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Research & STEM — Jadon Li",
  description:
    "RNA-seq, differential expression, USABO Honorable Mention, UK Biology Olympiad Silver, ACSEF 3rd — hunting pain mediators in a gout model with a spinal-cord therapeutic insight.",
};

// ── page-local constants ──────────────────────────────────────────────────────

// Marquee items: AP fives + STEM awards + tools — factual
const TICKER_ITEMS = [
  ...AP_FIVES.map((c) => c.replace(" · ", " ✦ ")),
  "USABO · Honorable Mention · 26/50 · Top ~15%",
  "UK Biology Olympiad · Silver · Top 10%",
  "ACSEF · 3rd — Computational Biology · BCOM",
  "RNA-seq in R · DESeq2 · limma · ggplot2",
  "Dr. Shady Younice · Stanford Bioinformatics",
  "youthstemjournal.org · 8 students",
  "MSJ STEM-PAC · Co-President",
  "PRISM · Clinical Trial Representation",
  "Varian TrueBeam · Halcyon",
  "GSEA · GO enrichment · pathway analysis",
  "Spinal cord signal → non-invasive therapeutic targets",
];

// Hero stat pills
const HERO_STATS = [
  { label: "RNA-seq", value: "pipeline" },
  { label: "R / DESeq2", value: "analysis" },
  { label: "ACSEF", value: "3rd place" },
  { label: "USABO", value: "top ~15%" },
  { label: "UK BBO", value: "silver" },
] as const;

// Training callout data (between marquee and project)
const TRAINING_CALLOUT = {
  professor: "Dr. Shady Younice",
  affiliation: "Stanford Bioinformatics",
  format: "Week-long intensive course",
  tools: ["R", "dataframes", "dplyr", "ggplot2"],
  followUp: "Bioinformatics video curriculum — RNA-seq pipeline theory, high-throughput data storage, DE analysis, pathway interpretation",
} as const;

// ── page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  return (
    <World id="research">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] pt-36 md:pt-48">
        {/* Full bleed decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30 md:opacity-40"
          aria-hidden
        >
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1440 800"
          >
            <defs>
              <pattern id="research-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#34e0c4" strokeWidth="0.4" opacity="0.4" />
              </pattern>
              <radialGradient id="rg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34e0c4" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#34e0c4" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#research-grid)" />
            <ellipse cx="1100" cy="400" rx="500" ry="450" fill="url(#rg)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-24 md:grid-cols-2 md:gap-16 md:px-9">
          {/* Left: copy */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="eyebrow">02 — Research &amp; STEM</p>
            </Reveal>

            <KineticHeadline
              as="h1"
              text="Reading the genome of pain."
              delay={0.1}
              className="mt-6 font-display text-[2.8rem] leading-[0.95] tracking-tight md:text-[4.4rem] lg:text-[5.5rem]"
            />

            <Reveal delay={0.25} className="mt-8 max-w-md">
              <p className="font-mono text-sm leading-relaxed text-[var(--muted)] md:text-base">
                {RESEARCH.intro}
              </p>
            </Reveal>

            {/* Stat pills */}
            <Reveal delay={0.35} className="mt-10 flex flex-wrap gap-3">
              {HERO_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 rounded border border-[var(--line)] bg-[var(--bg-2)] px-4 py-2"
                >
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
                    {s.label}
                  </span>
                  <span className="h-3.5 w-px bg-[var(--line)]" />
                  <span
                    className="font-mono text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--accent)" }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </Reveal>

            {/* Classes list */}
            <Reveal delay={0.45} className="mt-8">
              <p className="eyebrow mb-2">Coursework &amp; track</p>
              <ul className="flex flex-col gap-1.5">
                {RESEARCH.classes.map((c) => (
                  <li key={c} className="flex items-center gap-2 font-mono text-xs text-[var(--muted)]">
                    <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Right: volcano plot */}
          <Reveal delay={0.15} className="flex flex-col justify-center">
            <div className="relative rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-4 md:p-6">
              <div className="absolute left-4 top-3 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
                differential expression
              </div>
              <div className="absolute right-4 top-3 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
                mouse gout model
              </div>

              <VolcanoPlot className="mt-4" />

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-6 border-t border-[var(--line)] pt-4">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#ff5da2]" />
                  <span className="font-mono text-[0.65rem] text-[var(--muted)]">upregulated</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#34e0c4]" />
                  <span className="font-mono text-[0.65rem] text-[var(--muted)]">downregulated</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#3a5068]" />
                  <span className="font-mono text-[0.65rem] text-[var(--muted)]">ns</span>
                </div>
              </div>
            </div>

            {/* Quick legend for key labeled genes */}
            <Reveal delay={0.3} className="mt-4">
              <div
                className="rounded border px-4 py-3"
                style={{ borderColor: "rgba(52,224,196,0.2)", background: "rgba(52,224,196,0.04)" }}
              >
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-2">
                  Hover significant points to explore
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {["S100a9", "Nfkb1", "Il1b", "Ptgs2", "Dusp1", "Sirt1"].map((g) => (
                    <span key={g} className="font-mono text-[0.65rem] text-[var(--fg)]">{g}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </Reveal>
        </div>
      </section>

      {/* ── MARQUEE BAND ──────────────────────────────────────── */}
      <div className="border-y border-[var(--line)] py-4">
        <Marquee
          items={TICKER_ITEMS}
          durationSec={60}
          sep="·"
          className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]"
        />
      </div>

      {/* ── TRAINING CALLOUT ──────────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-9 md:py-24">
          <Reveal>
            <p className="eyebrow mb-8">How it started — training</p>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            {/* Left: professor + format */}
            <Reveal delay={0.05}>
              <div className="space-y-6">
                {/* Professor card */}
                <div
                  className="rounded-lg border p-6"
                  style={{ borderColor: "rgba(255,93,162,0.3)", background: "rgba(255,93,162,0.04)" }}
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest mb-3" style={{ color: "#ff5da2" }}>
                    Instructor
                  </p>
                  <p className="font-display text-2xl md:text-3xl">{TRAINING_CALLOUT.professor}</p>
                  <p className="mt-1 font-mono text-sm text-[var(--muted)]">{TRAINING_CALLOUT.affiliation}</p>
                  <p className="mt-4 font-mono text-xs leading-relaxed text-[var(--muted)]">
                    {TRAINING_CALLOUT.format} covering R syntax, dataframe manipulation, and data visualisation with ggplot2 — the grammar-of-graphics library used in production bioinformatics.
                  </p>
                </div>

                {/* Tool list */}
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-3">
                    Tools learned
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRAINING_CALLOUT.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-[var(--line)] bg-[var(--bg-2)] px-3 py-1.5 font-mono text-xs text-[var(--fg)]"
                      >
                        {t}
                      </span>
                    ))}
                    {["DESeq2", "limma", "GSEA", "GO enrichment"].map((t) => (
                      <span
                        key={t}
                        className="rounded border border-[var(--line)] bg-[var(--bg-2)] px-3 py-1.5 font-mono text-xs text-[var(--muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: follow-up curriculum */}
            <Reveal delay={0.1}>
              <div className="space-y-6">
                <div className="rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-6">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-4">
                    Phase 2 — bioinformatics video curriculum
                  </p>
                  <p className="font-mono text-sm leading-relaxed text-[var(--muted)]">
                    {TRAINING_CALLOUT.followUp}
                  </p>
                </div>

                {/* Vertical curriculum ladder */}
                <div className="space-y-0 divide-y divide-[var(--line)] rounded border border-[var(--line)] overflow-hidden">
                  {[
                    "How RNA-seq machines work — Illumina sequencing-by-synthesis",
                    "How high-throughput sequencers store data — FASTQ format",
                    "Read alignment and count matrices — STAR / HISAT2 → featureCounts",
                    "Differential expression analysis in R — DESeq2 statistical model",
                    "Making the right plots — MA plots, heatmaps, volcano plots in ggplot2",
                    "Pathway analysis — GSEA, GO enrichment, interpreting gene sets",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-[var(--bg)] transition-colors">
                      <span
                        className="mt-0.5 shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.3em]"
                        style={{ color: "var(--accent)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-mono text-xs leading-relaxed text-[var(--muted)]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── THE PROJECT ────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-32">
          <PipelineFlow />
        </div>
      </section>

      {/* ── AWARDS ─────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-32">
          <AwardsPanel />
        </div>
      </section>

      {/* ── PROGRAMS / TEACHING ────────────────────────────────── */}
      <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-32">
          <ProgramsGrid />
        </div>
      </section>

      {/* ── AGGREGATE STATS ────────────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-9 md:py-24">
          <Reveal className="mb-12">
            <p className="eyebrow">By the numbers</p>
          </Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
            {[
              { value: 1, suffix: " week", label: "R training — Dr. Younice", prefix: "" },
              { value: 8, suffix: "", label: "YSJC students · Biology dept", prefix: "" },
              { value: 26, suffix: "/50", label: "USABO Open score", prefix: "" },
              { value: 10, suffix: "%", label: "UK BBO Silver tier — top", prefix: "top " },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center gap-2 bg-[var(--bg)] py-12 px-4"
              >
                <span
                  className="font-mono text-4xl font-black md:text-5xl"
                  style={{ color: "var(--accent)" }}
                >
                  <Counter to={s.value} suffix={s.suffix} prefix={s.prefix} duration={1.6} />
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING STATEMENT ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-28 text-center md:px-9 md:py-40">
        <Reveal>
          <p className="eyebrow mb-8">The pursuit</p>
        </Reveal>
        <KineticHeadline
          as="h2"
          text="The bench is where the questions get serious."
          delay={0.1}
          className="font-display text-[2.2rem] leading-[1.05] tracking-tight md:text-[3.8rem]"
        />
        <Reveal delay={0.3} className="mt-8">
          <p className="mx-auto max-w-xl font-mono text-sm leading-relaxed text-[var(--muted)]">
            Every p-value below 0.05, every pathway that lights up, every gene found
            in a tissue it shouldn&apos;t be in — they&apos;re evidence of a process that
            started with curiosity and became precision. The spinal cord finding isn&apos;t
            just a data point; it&apos;s a direction.
          </p>
        </Reveal>

        {/* Decorative teal line */}
        <Reveal delay={0.4} className="mt-12 flex justify-center">
          <div
            className="h-px w-24"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
          />
        </Reveal>
      </section>

      <Footer current="research" />
    </World>
  );
}
