import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Marquee } from "@/components/primitives/Marquee";
import { VolcanoPlot } from "@/components/research/VolcanoPlot";
import { PipelineFlow } from "@/components/research/PipelineFlow";
import { AwardsPanel } from "@/components/research/AwardsPanel";
import { ProgramsGrid } from "@/components/research/ProgramsGrid";
import { RESEARCH, AP_FIVES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Research & STEM — Jadon Li",
  description:
    "RNA-seq, differential expression, USABO, UK Biology Olympiad — hunting pain mediators in a gout model.",
};

// Marquee items: AP fives + STEM awards + classes — factual
const TICKER_ITEMS = [
  ...AP_FIVES.map((c) => c.replace(" · ", " ✦ ")),
  "USABO · Honorable Mention",
  "UK Bio Olympiad · Silver",
  "ACSEF · 3rd — Comp Bio",
  "RNA-seq in R",
  "DESeq2 · limma · GSEA",
  "youthstemjournal.org",
];

export default function ResearchPage() {
  return (
    <World id="research">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] pt-36 md:pt-48">
        {/* Full bleed volcano plot — sits behind content */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30 md:opacity-40"
          aria-hidden
        >
          {/* Decorative teal grid overlay */}
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
            {/* Radial glow behind volcano plot area */}
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
              {[
                { label: "RNA-seq", value: "pipeline" },
                { label: "R / DESeq2", value: "analysis" },
                { label: "ACSEF", value: "3rd place" },
              ].map((s) => (
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
                    <span className="size-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Right: volcano plot */}
          <Reveal delay={0.15} className="flex flex-col justify-center">
            <div className="relative rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-4 md:p-6">
              {/* Corner labels */}
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
          </Reveal>
        </div>
      </section>

      {/* ── MARQUEE BAND ──────────────────────────────────────── */}
      <div className="border-y border-[var(--line)] py-4">
        <Marquee
          items={TICKER_ITEMS}
          durationSec={45}
          sep="·"
          className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]"
        />
      </div>

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
            Every number on a gel, every p-value below 0.05, every pathway that
            lights up — they&apos;re evidence of a process that started with
            curiosity and became precision.
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
