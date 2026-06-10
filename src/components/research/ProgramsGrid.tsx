"use client";

import type React from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Photo } from "@/components/primitives/Photo";
import { Counter } from "@/components/primitives/Counter";
import { RESEARCH } from "@/lib/data";
import { cn } from "@/lib/cn";

// ── page-local detail constants ───────────────────────────────────────────────

const STEM_PAC_DETAIL = {
  full_name: "STEM Projects and Competitions",
  origin:
    "Rebranded from HOSA — which Jadon founded as a 10th-grade officer — after losing the CTE advisor needed to maintain HOSA's formal affiliation.",
  co_pres: "Co-President with Ashley Kang",
  officers: 3,
  pipeline: [
    {
      step: "Weekly posts",
      detail: "Sharing upcoming competitions, conferences, and deadlines across all STEM disciplines",
    },
    {
      step: "Bi-weekly workshops",
      detail: "Help students start and develop projects — idea generation, methodology, write-ups",
    },
    {
      step: "Staged entry",
      detail: "Guide students to smaller-scale competitions first, building experience before big-award events like ACSEF or olympiads",
    },
    {
      step: "External competitions",
      detail: "ACSEF (county → CSEF → ISEF), biology / STEM olympiads, regional research fairs",
    },
  ],
  community: [
    {
      event: "Egg Drop",
      stat: "12 teams",
      note: "Partnered with Leadership Activities — community glue, not the point",
    },
    {
      event: "Iron Chef",
      stat: "23 contestants",
      note: "Partnered with Leadership Activities for student engagement",
    },
  ],
  mission:
    "The egg drop and iron chef keep students walking through the door. The science fair pipeline is what they stay for.",
};

const YSJC_TOPICS = [
  {
    fig: "Fig. A",
    title: "Ecosystem Resilience",
    note: "Factors that determine how ecological communities absorb and recover from disturbance — keystone species, trophic cascades, and biodiversity buffers.",
    accent: "var(--accent)",
  },
  {
    fig: "Fig. B",
    title: "Llama-derived Nanobodies",
    note: "The significance of VHH single-domain antibodies — smaller, more stable, and penetrating than conventional antibodies — and their applications in diagnostics and therapeutics.",
    accent: "var(--accent-2)",
  },
];

const PRISM_DETAIL = {
  partner: "Arav",
  problem:
    "Many clinical trials systematically underrepresent Asian, Hispanic, and Black populations — skewing safety and efficacy data and allowing side-effect profiles to go undetected in those groups.",
  mission:
    "Raise awareness of the representation gap and actively connect underrepresented community members to open clinical trials that are looking for participants.",
  approach: "Community outreach + trial matching + educational material on what participation actually involves",
};

// Field notes — smaller-scale but genuinely experienced programs / tours / events
const FIELD_NOTES = [
  {
    id: "varian",
    tag: "Site visit",
    title: "Varian Medical Systems",
    date: "2025",
    body:
      "Toured Varian's radiation-therapy technology campus. Walked through the engineering behind TrueBeam and Halcyon — two linear accelerator platforms that target tumors with sub-millimetre precision while minimizing radiation to surrounding tissue.",
    detail: "TrueBeam · Halcyon · LINAC engineering · radiation oncology workflow",
    accent: "var(--accent)",
  },
  {
    id: "acwd",
    tag: "Private tour",
    title: "ACWD Water Treatment Plant",
    date: "2025",
    body:
      "After winning the ACWD Water Clip Contest (1st place, 100+ contestants), Jadon kept in touch with outreach director Renee Gonzales — who offered a private tour of Fremont's water-treatment facility. He publicized it through his clubs and led 10 people through the plant.",
    detail: "Renee Gonzales · ACWD outreach · treatment process · coagulation → filtration → disinfection",
    accent: "var(--accent)",
  },
  {
    id: "techex",
    tag: "Industry expo",
    title: "TechEx North America 2025",
    date: "2025",
    body:
      "Attended TechEx North America to learn how AI is actively reshaping industry workflows — booth demos, guest speakers, and hands-on product showcases from enterprise AI vendors.",
    detail: "AI in industry · workflow automation · enterprise ML · guest speaker sessions",
    accent: "var(--accent-2)",
  },
  {
    id: "umass",
    tag: "Upcoming · 6-week residential",
    title: "UMass Research Intensive",
    date: "Summer 2026",
    body:
      "Selected for the UMass pre-college research intensive — a 6-week residential program. The pipeline from ACSEF and club-level STEM work feeds directly into this: the next level of formal bench research.",
    detail: "Residential · 6 weeks · UMass Amherst · scientific research methods",
    accent: "var(--accent-2)",
  },
];

// ── SVG icons (inline, no external deps) ─────────────────────────────────────

const PROGRAM_ICONS: Record<string, React.ReactNode> = {
  "Youth STEM Journal Club": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="5" width="18" height="22" rx="2" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="8" y1="11" x2="18" y2="11" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
      <line x1="8" y1="15" x2="18" y2="15" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
      <line x1="8" y1="19" x2="14" y2="19" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="6" fill="var(--bg-2)" stroke="var(--accent-2)" strokeWidth="1.4" />
      <text x="24" y="28" textAnchor="middle" fontSize="7" fill="var(--accent-2)" fontFamily="monospace">★</text>
    </svg>
  ),
  "PRISM": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon points="16,4 28,24 4,24" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
      <line x1="16" y1="4" x2="16" y2="24" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <line x1="10" y1="14" x2="22" y2="14" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <circle cx="16" cy="26" r="2" fill="var(--accent-2)" opacity="0.8" />
    </svg>
  ),
  "MSJ STEM-PAC": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
      <circle cx="16" cy="16" r="6" stroke="var(--accent)" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="16" cy="16" r="2" fill="var(--accent-2)" />
      <line x1="16" y1="5" x2="16" y2="9" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="16" y1="23" x2="16" y2="27" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="5" y1="16" x2="9" y2="16" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="23" y1="16" x2="27" y2="16" stroke="var(--accent)" strokeWidth="1.4" />
    </svg>
  ),
  "UMass Research Intensive": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="5" y="8" width="22" height="16" rx="2" stroke="var(--accent)" strokeWidth="1.4" fill="none" />
      <line x1="12" y1="8" x2="12" y2="24" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <line x1="20" y1="8" x2="20" y2="24" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <circle cx="16" cy="5" r="2.5" stroke="var(--accent-2)" strokeWidth="1.2" fill="none" />
      <line x1="16" y1="7.5" x2="16" y2="8" stroke="var(--accent-2)" strokeWidth="1.2" />
    </svg>
  ),
};

// ── component ─────────────────────────────────────────────────────────────────

export function ProgramsGrid() {
  return (
    <div className="space-y-24">

      {/* ── Section header ────────────────────────────────────── */}
      <Reveal>
        <p className="eyebrow mb-2">Teaching · Programs · Outreach</p>
        <h2 className="font-display text-3xl leading-tight md:text-5xl">In the field</h2>
      </Reveal>

      {/* ── STEM-PAC deep-dive ────────────────────────────────── */}
      <Reveal delay={0.05}>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden">
          {/* Header row */}
          <div className="flex items-start justify-between gap-6 border-b border-[var(--line)] p-8 md:p-10">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                {PROGRAM_ICONS["MSJ STEM-PAC"]}
                <div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                    04
                  </span>
                  <p
                    className="font-mono text-xs uppercase tracking-widest"
                    style={{ color: "var(--accent-2)" }}
                  >
                    Co-President · competition pipeline
                  </p>
                </div>
              </div>
              <h3 className="font-display text-2xl md:text-3xl">MSJ STEM-PAC</h3>
              <p className="mt-1 font-mono text-sm text-[var(--muted)]">
                {STEM_PAC_DETAIL.full_name}
              </p>
            </div>
            <div className="shrink-0 hidden md:block">
              <div className="rounded border border-[var(--line)] bg-[var(--bg-2)] px-5 py-3 text-right">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">Leadership</p>
                <p className="font-mono text-base font-bold text-[var(--fg)]">{STEM_PAC_DETAIL.co_pres}</p>
                <p className="font-mono text-xs text-[var(--muted)]">+ {STEM_PAC_DETAIL.officers} officers</p>
              </div>
            </div>
          </div>

          {/* Origin story */}
          <div className="border-b border-[var(--line)] px-8 py-6 md:px-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-2">Origin</p>
            <p className="font-mono text-sm leading-relaxed text-[var(--muted)]">
              {STEM_PAC_DETAIL.origin}
            </p>
          </div>

          {/* Competition pipeline steps */}
          <div className="border-b border-[var(--line)] px-8 py-6 md:px-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-5">
              Competition pipeline
            </p>
            <div className="grid gap-0 divide-y divide-[var(--line)] overflow-hidden rounded border border-[var(--line)]">
              {STEM_PAC_DETAIL.pipeline.map((item, i) => (
                <div key={item.step} className="group flex items-start gap-5 p-5 hover:bg-[var(--bg-2)] transition-colors">
                  <span
                    className="mt-0.5 shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.3em]"
                    style={{ color: "var(--accent)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                      {item.step}
                    </p>
                    <p className="mt-1 font-mono text-xs leading-relaxed text-[var(--muted)]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community glue events */}
          <div className="px-8 py-6 md:px-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-5">
              Community glue — leadership partnerships
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {STEM_PAC_DETAIL.community.map((ev) => (
                <div
                  key={ev.event}
                  className="flex items-center gap-5 rounded border border-[var(--line)] bg-[var(--bg-2)] p-5"
                >
                  <div>
                    <p className="font-mono text-sm font-bold text-[var(--fg)]">{ev.event}</p>
                    <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">{ev.note}</p>
                  </div>
                  <div className="ml-auto shrink-0 text-right">
                    <span
                      className="font-mono text-2xl font-black"
                      style={{ color: "var(--accent)" }}
                    >
                      {ev.stat.split(" ")[0]}
                    </span>
                    <p className="font-mono text-[0.6rem] text-[var(--muted)]">
                      {ev.stat.split(" ").slice(1).join(" ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs italic text-[var(--muted)] opacity-70">
              {STEM_PAC_DETAIL.mission}
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── Programs grid (YSJC + PRISM + UMass) ─────────────── */}
      <div>
        <Reveal className="mb-10">
          <p className="eyebrow">Programs &amp; founding work</p>
        </Reveal>
        <RevealGroup
          className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.1}
          delayChildren={0.05}
        >
          {RESEARCH.programs
            .filter((p) => p.title !== "MSJ STEM-PAC")
            .map((prog, i) => (
              <Reveal key={prog.title} delay={i * 0.07}>
                <TiltCard
                  max={5}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden bg-[var(--bg)] p-8 transition-colors duration-300 hover:bg-[var(--bg-2)]",
                    "md:p-10"
                  )}
                >
                  {/* Number label */}
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                    0{i + 1}
                  </span>

                  {/* Icon */}
                  <div className="mt-5 mb-6">
                    {PROGRAM_ICONS[prog.title] ?? (
                      <div className="size-8 rounded border border-[var(--accent)] opacity-60" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-display text-xl leading-snug transition-colors group-hover:text-[var(--accent)] md:text-2xl">
                      {prog.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--accent-2)]">
                      {prog.role}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                      {prog.detail}
                    </p>
                  </div>

                  {/* ── YSJC showcase extras ── */}
                  {prog.title === "Youth STEM Journal Club" && (
                    <div className="mt-6 space-y-5">
                      {/* Location badge */}
                      <div className="flex items-center gap-2 rounded border border-[var(--line)] bg-[var(--bg-2)] px-3 py-2">
                        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">Venue</span>
                        <span className="h-3 w-px bg-[var(--line)]" />
                        <span className="font-mono text-xs text-[var(--fg)]">Fremont Library · 4 weeks</span>
                      </div>

                      {/* Research topics — figure-captioned */}
                      <div>
                        <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                          Biology department topics
                        </p>
                        <div className="space-y-3">
                          {YSJC_TOPICS.map((topic) => (
                            <div
                              key={topic.fig}
                              className="rounded border bg-[var(--bg)] p-4"
                              style={{ borderColor: `${topic.accent}30` }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className="font-mono text-[0.55rem] uppercase tracking-widest"
                                  style={{ color: topic.accent }}
                                >
                                  {topic.fig}
                                </span>
                                <p className="font-mono text-xs font-semibold text-[var(--fg)]">
                                  {topic.title}
                                </p>
                              </div>
                              <p className="font-mono text-[0.65rem] leading-relaxed text-[var(--muted)]">
                                {topic.note}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Showcase photo — lab-figure treatment */}
                      <div>
                        <div
                          className="relative overflow-hidden rounded"
                          style={{ border: "1px solid var(--line)" }}
                        >
                          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                            <div className="absolute inset-0">
                              <Photo
                                src="/img/ysjc-2025-summer-showcase.jpg"
                                alt="Youth STEM Journal Club 2025 Summer Showcase — students presenting capstone research to parents at Fremont Library"
                                className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                              />
                            </div>
                          </div>
                          <span
                            className="absolute left-0 top-0 font-mono text-[0.55rem] uppercase tracking-[0.2em] px-2 py-1"
                            style={{
                              background: "rgba(244,249,250,0.92)",
                              color: "var(--accent)",
                              borderRight: "1px solid var(--line)",
                              borderBottom: "1px solid var(--line)",
                            }}
                          >
                            Fig. 1
                          </span>
                        </div>
                        <p className="mt-2 font-mono text-[0.6rem] leading-snug text-[var(--muted)]">
                          Summer showcase, 2025 — 8 students · Biology dept · capstone presentations to parents.
                          <span style={{ color: "var(--accent)" }}> ↗ youthstemjournal.org</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── PRISM extras ── */}
                  {prog.title === "PRISM" && (
                    <div className="mt-6 space-y-4">
                      <div className="rounded border border-[var(--line)] bg-[var(--bg-2)] p-4">
                        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-2">
                          The problem
                        </p>
                        <p className="font-mono text-xs leading-relaxed text-[var(--muted)]">
                          {PRISM_DETAIL.problem}
                        </p>
                      </div>
                      <div className="rounded border border-[var(--line)] bg-[var(--bg-2)] p-4">
                        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-2">
                          What we do
                        </p>
                        <p className="font-mono text-xs leading-relaxed text-[var(--muted)]">
                          {PRISM_DETAIL.mission}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 rounded border border-[var(--line)] bg-[var(--bg-2)] px-3 py-2">
                        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">Partner</span>
                        <span className="h-3 w-px bg-[var(--line)]" />
                        <span className="font-mono text-xs text-[var(--fg)]">Arav</span>
                      </div>
                    </div>
                  )}

                  {/* Site link */}
                  {(prog.site.includes(".org") || prog.site.includes(".com")) && (
                    <div className="mt-6 flex items-center gap-1.5">
                      <span className="font-mono text-xs text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                        {prog.site}
                      </span>
                      <ExternalLink className="size-3 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                  )}
                  {!prog.site.includes(".org") && !prog.site.includes(".com") && (
                    <div className="mt-6">
                      <span className="font-mono text-xs text-[var(--muted)]">{prog.site}</span>
                    </div>
                  )}

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-[var(--accent)]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    style={{ transformOrigin: "left" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </TiltCard>
              </Reveal>
            ))}
        </RevealGroup>
      </div>

      {/* ── Field notes ───────────────────────────────────────── */}
      <div>
        <Reveal className="mb-10">
          <div className="flex items-center gap-4">
            <p className="eyebrow">Field notes</p>
            <div className="h-px flex-1 bg-[var(--line)]" />
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              tours · expos · residentials
            </span>
          </div>
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2" stagger={0.08} delayChildren={0.05}>
          {FIELD_NOTES.map((note) => (
            <Reveal key={note.id} delay={0.05}>
              <div
                className="group relative overflow-hidden rounded-lg border bg-[var(--bg-2)] p-7 transition-colors hover:bg-white hover:shadow-[0_8px_24px_rgba(13,36,49,0.08)]"
                style={{ borderColor: "var(--line)" }}
              >
                {/* Accent left border */}
                <div
                  className="absolute left-0 top-0 h-full w-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: note.accent }}
                />

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span
                      className="font-mono text-[0.55rem] uppercase tracking-[0.25em]"
                      style={{ color: note.accent }}
                    >
                      {note.tag}
                    </span>
                    <h4 className="mt-1 font-display text-lg leading-snug transition-colors group-hover:text-[var(--accent)]">
                      {note.title}
                    </h4>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-[var(--muted)]">{note.date}</span>
                </div>

                <p className="font-mono text-xs leading-relaxed text-[var(--muted)] mb-4">
                  {note.body}
                </p>

                {/* Detail tag line */}
                <div
                  className="rounded px-3 py-1.5"
                  style={{ background: "rgba(12,156,134,0.05)", border: "1px solid rgba(12,156,134,0.18)" }}
                >
                  <p className="font-mono text-[0.6rem] text-[var(--muted)]">{note.detail}</p>
                </div>

                {/* Bottom accent */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px"
                  style={{ background: note.accent }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>

      {/* ── Aggregate metrics strip ────────────────────────────── */}
      <Reveal delay={0.15}>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
          {[
            { value: 8, suffix: "", label: "YSJC students · Biology dept" },
            { value: 23, suffix: "", label: "Iron Chef contestants" },
            { value: 12, suffix: "", label: "Egg Drop teams" },
            { value: 10, suffix: "", label: "ACWD tour participants" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center gap-1.5 bg-[var(--bg)] py-8 px-4">
              <span
                className="font-mono text-4xl font-black"
                style={{ color: "var(--accent)" }}
              >
                <Counter to={s.value} suffix={s.suffix} duration={1.4} />
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
