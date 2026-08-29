"use client";

import { motion } from "motion/react";
import { ArrowUpRight, GitBranch, Music, Globe, Shirt, BookOpen, Compass } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Magnetic } from "@/components/primitives/Magnetic";
import { LiveEmbed } from "@/components/built/LiveEmbed";
import { DecodeText, StatValue } from "@/components/built/MissionFX";
import { PROJECTS } from "@/lib/data";

type Project = (typeof PROJECTS)[number];

// Exclude AcornPrep — it's handled by AcornFlagship
const OTHER_PROJECTS = PROJECTS.filter((p) => p.name !== "AcornPrep");

/** Icon per project — chosen by name */
const PROJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CueSheet: Music,
  Hermes: GitBranch,
  NotebookLI: BookOpen,
  "jadonli.com": Compass,
  "Youth STEM Journal": Globe,
  "MSJ Makes": Shirt,
};

/** Mission number per card, continuing from the flagship's 01 */
function missionNo(index: number) {
  return String(index + 2).padStart(2, "0");
}

/** Stack chip — square manifest tag */
function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-[var(--line)] bg-[var(--bg)] px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
      {label}
    </span>
  );
}

/** A stat row */
function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="mission-display text-xl text-[var(--fg)]">
        <StatValue value={value} />
      </span>
      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </span>
    </div>
  );
}

/** Mission number stamp in the card corner */
function MissionStamp({ no }: { no: string }) {
  return (
    <span className="pointer-events-none absolute right-0 top-0 z-10 border-b border-l border-[var(--line)] bg-black/80 px-2.5 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-[var(--accent)]">
      M-{no}
    </span>
  );
}

/** Embeddable project card — archival thumbnail + manifest body */
function EmbedCard({ project, no }: { project: Project; no: string }) {
  const Icon = PROJECT_ICONS[project.name] ?? Globe;

  return (
    <TiltCard max={6} className="h-full">
      <motion.div
        data-cursor-hover
        className="group relative flex h-full flex-col overflow-hidden border border-[var(--line)] bg-[var(--bg-2)] transition-colors duration-300 hover:border-[var(--accent)]"
      >
        <MissionStamp no={no} />

        {/* Thumbnail embed — washed archival print */}
        <div className="archival-frame relative overflow-hidden">
          <div className="archival">
            <LiveEmbed
              url={project.url}
              domain={project.domain}
              title={project.name}
              screenshot={project.shot}
              height={200}
              thumbnail
              className="border-0 shadow-none"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-[var(--bg-2)] to-transparent"
            aria-hidden
          />
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          {/* Name + icon */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center border border-[var(--fg)] text-[var(--fg)]">
              <Icon className="size-3.5" />
            </div>
            <span className="mission-display text-xl">{project.name}</span>
          </div>

          {/* Tagline */}
          <p className="text-sm leading-relaxed text-[var(--muted)]">{project.tagline}</p>

          {/* Stats */}
          <div className="flex flex-col gap-1.5">
            {project.stats.map((s) => (
              <StatRow key={s.label} value={s.value} label={s.label} />
            ))}
          </div>

          {/* Stack */}
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.stack.map((s) => (
              <Chip key={s} label={s} />
            ))}
          </div>

          {/* CTA */}
          <Magnetic strength={0.25}>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-hover
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--fg)] transition-opacity hover:opacity-70"
            >
              Visit {project.domain} <ArrowUpRight className="size-3.5" />
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/** Non-embeddable project card — schematic panel, no fake screenshot */
function DesignedCard({ project, no }: { project: Project; no: string }) {
  const Icon = PROJECT_ICONS[project.name] ?? GitBranch;

  return (
    <TiltCard max={6} className="h-full">
      <motion.div
        data-cursor-hover
        className="group relative flex h-full flex-col overflow-hidden border border-[var(--line)] bg-[var(--bg-2)] transition-colors duration-300 hover:border-[var(--accent)]"
      >
        <MissionStamp no={no} />

        {/* Top schematic area — blueprint grid + instrument icon */}
        <div className="relative h-40 w-full overflow-hidden border-b border-[var(--line)]">
          <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
            <defs>
              <pattern
                id={`grid-${project.name.replace(/\s/g, "-")}`}
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--fg)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${project.name.replace(/\s/g, "-")})`} />
          </svg>

          {/* Center icon in a viewfinder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="frame-brackets flex size-16 items-center justify-center bg-[var(--bg)]">
              <Icon className="size-7 text-[var(--fg)]" />
            </div>
          </div>

          {/* Status badge */}
          {project.name === "Hermes" && (
            <div className="absolute left-4 top-4">
              <span className="border border-[var(--accent)] bg-[var(--bg)] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
                In progress
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <span className="mission-display text-xl">{project.name}</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              {project.domain}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[var(--muted)]">{project.tagline}</p>

          {/* Body */}
          <p className="text-xs leading-relaxed text-[var(--muted)] opacity-75">{project.body}</p>

          {/* Stats */}
          <div className="flex flex-col gap-1.5">
            {project.stats.map((s) => (
              <StatRow key={s.label} value={s.value} label={s.label} />
            ))}
          </div>

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Chip key={s} label={s} />
            ))}
          </div>

          {/* CTA */}
          <Magnetic strength={0.25} className="mt-auto">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-hover
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--fg)] transition-opacity hover:opacity-70"
            >
              View <ArrowUpRight className="size-3.5" />
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </TiltCard>
  );
}

export function ProductsGrid() {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">
        {/* Header */}
        <div className="mb-14">
          <Reveal>
            <p className="eyebrow mb-4">Missions 02 — {String(OTHER_PROJECTS.length + 1).padStart(2, "0")}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mission-display text-[2.2rem] md:text-[3.6rem]">
              <DecodeText text="Everything else" />{" "}
              <span className="stencil">
                <DecodeText text="shipping." duration={1.2} />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
              Six more products at various stages — a research-paper reader built mid-lab, live
              tools with active users, something building in the background, and the site you&apos;re
              reading.
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <RevealGroup
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          stagger={0.08}
          delayChildren={0.1}
        >
          {OTHER_PROJECTS.map((project, i) =>
            project.embeddable ? (
              <EmbedCard key={project.name} project={project} no={missionNo(i)} />
            ) : (
              <DesignedCard key={project.name} project={project} no={missionNo(i)} />
            ),
          )}
        </RevealGroup>
      </div>
    </section>
  );
}
