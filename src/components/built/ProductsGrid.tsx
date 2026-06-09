"use client";

import { motion } from "motion/react";
import { ArrowUpRight, GitBranch, Music, Globe, Shirt } from "lucide-react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Magnetic } from "@/components/primitives/Magnetic";
import { LiveEmbed } from "@/components/built/LiveEmbed";
import { PROJECTS } from "@/lib/data";
import { cn } from "@/lib/cn";

type Project = (typeof PROJECTS)[number];

// Exclude AcornPrep — it's handled by AcornFlagship
const OTHER_PROJECTS = PROJECTS.filter((p) => p.name !== "AcornPrep");

/** Icon per project — chosen by name */
const PROJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CueSheet: Music,
  Hermes: GitBranch,
  "Youth STEM Journal": Globe,
  "MSJ Makes": Shirt,
};

/** Renders an icon with an arbitrary color via a wrapping span (avoids style prop type mismatch) */
function ColoredIcon({
  Icon,
  color,
  className,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  className?: string;
}) {
  return (
    <span style={{ color }} className="contents">
      <Icon className={className} />
    </span>
  );
}

/** Accent color variant per project (alternating to avoid monotony) */
const PROJECT_ACCENTS: Record<string, string> = {
  CueSheet: "var(--accent)",
  Hermes: "var(--muted)",
  "Youth STEM Journal": "var(--accent-2)",
  "MSJ Makes": "var(--accent)",
};

/** Stack chip */
function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
      {label}
    </span>
  );
}

/** A stat row pill */
function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-lg font-semibold leading-none" style={{ color: "var(--accent)" }}>
        {value}
      </span>
      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </span>
    </div>
  );
}

/** Embeddable project card — uses LiveEmbed thumbnail + overlay info */
function EmbedCard({ project }: { project: Project }) {
  const Icon = PROJECT_ICONS[project.name] ?? Globe;
  const accent = PROJECT_ACCENTS[project.name] ?? "var(--accent)";

  return (
    <TiltCard max={6} className="h-full">
      <motion.div
        data-cursor-hover
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] transition-all duration-300 hover:border-[color:var(--line)] hover:shadow-[0_0_40px_rgba(124,156,255,0.08)]"
        style={{ "--card-accent": accent } as React.CSSProperties}
        whileHover={{ borderColor: "rgba(124,156,255,0.3)" }}
      >
        {/* Thumbnail embed */}
        <div className="relative overflow-hidden">
          <LiveEmbed
            url={project.url}
            domain={project.domain}
            title={project.name}
            screenshot={project.shot}
            height={200}
            thumbnail
            className="rounded-none border-0 shadow-none"
          />
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg-2)] to-transparent" aria-hidden />
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          {/* Name + icon */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-7 items-center justify-center rounded-md"
              style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)` }}
            >
              <ColoredIcon Icon={Icon} color={accent} className="size-3.5" />
            </div>
            <span className="font-display text-lg font-semibold">{project.name}</span>
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
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors"
              style={{ color: accent }}
            >
              Visit {project.domain} <ArrowUpRight className="size-3.5" />
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/** Non-embeddable project card — clean designed card, no fake screenshot */
function DesignedCard({ project }: { project: Project }) {
  const Icon = PROJECT_ICONS[project.name] ?? GitBranch;
  const accent = PROJECT_ACCENTS[project.name] ?? "var(--muted)";

  return (
    <TiltCard max={6} className="h-full">
      <motion.div
        data-cursor-hover
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] transition-all duration-300"
        whileHover={{ borderColor: "rgba(124,156,255,0.25)" }}
      >
        {/* Top pattern area — decorative */}
        <div
          className="relative h-40 w-full overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${accent} 15%, transparent) 0%, transparent 70%)`,
          }}
        >
          {/* Grid pattern */}
          <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
            <defs>
              <pattern
                id={`grid-${project.name.replace(/\s/g, "-")}`}
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke={accent} strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${project.name.replace(/\s/g, "-")})`} />
          </svg>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex size-16 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              <ColoredIcon Icon={Icon} color={accent} className="size-8" />
            </div>
          </div>

          {/* Status badge */}
          {project.name === "Hermes" && (
            <div className="absolute right-4 top-4">
              <span className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                In progress
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <span className="font-display text-xl font-semibold">{project.name}</span>
            <span
              className="font-mono text-[0.6rem] uppercase tracking-widest"
              style={{ color: accent }}
            >
              {project.domain}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[var(--muted)]">{project.tagline}</p>

          {/* Body */}
          <p className="text-xs leading-relaxed text-[var(--muted)] opacity-75">{project.body}</p>

          {/* Stats */}
          <div className="flex flex-col gap-1.5">
            {project.stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-semibold leading-none" style={{ color: accent }}>
                  {s.value}
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  {s.label}
                </span>
              </div>
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
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:opacity-80"
              style={{ color: accent }}
            >
              View ↗
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
            <p className="eyebrow mb-4">More projects</p>
          </Reveal>
          <KineticHeadline
            as="h2"
            text="Everything else shipping."
            delay={0.05}
            className="font-display text-[2rem] leading-[1.05] tracking-tight md:text-[3.2rem]"
          />
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
              Four more products at various stages — from live tools with active users to something building in the background.
            </p>
          </Reveal>
        </div>

        {/* Grid — 2 cols on md, 2 on lg */}
        <RevealGroup
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
          stagger={0.08}
          delayChildren={0.1}
        >
          {OTHER_PROJECTS.map((project) =>
            project.embeddable ? (
              <EmbedCard key={project.name} project={project} />
            ) : (
              <DesignedCard key={project.name} project={project} />
            ),
          )}
        </RevealGroup>
      </div>
    </section>
  );
}
