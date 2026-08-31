"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Zap, Users, BookOpen, Hash } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Magnetic } from "@/components/primitives/Magnetic";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Photo } from "@/components/primitives/Photo";
import { Develop } from "@/components/built/Develop";
import { LiveEmbed } from "@/components/built/LiveEmbed";
import { DecodeText, StatValue } from "@/components/built/MissionFX";
import { PROJECTS } from "@/lib/data";

const acorn = PROJECTS.find((p) => p.name === "AcornPrep")!;

const STAT_ICONS = [Users, BookOpen, Hash, Zap];

/** A single telemetry stat block */
function StatBlock({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const Icon = STAT_ICONS[index % STAT_ICONS.length];
  return (
    <motion.div
      className="flex flex-col gap-2 border-l-[1.5px] border-[var(--accent)] pl-5"
      variants={{
        hidden: { opacity: 0, x: -12 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      <Icon className="size-4 text-[var(--accent)]" />
      <p className="mission-display text-[2.4rem] text-[var(--fg)]">
        <StatValue value={value} />
      </p>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </p>
    </motion.div>
  );
}

/** Stack chip — square-cornered manifest tag */
function StackChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-[var(--line)] bg-[var(--bg)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
      {label}
    </span>
  );
}

/** Archival photo card with a corner classification tag */
function ArchivePhoto({
  src,
  alt,
  caption,
  tag,
}: {
  src: string;
  alt: string;
  caption: string;
  tag: string;
}) {
  return (
    <TiltCard max={4} className="group">
      <div className="relative overflow-hidden border border-[var(--line)] bg-[var(--bg-2)]">
        {/* 4:3 aspect container — the frame itself carries the halftone screen */}
        <div className="archival-frame w-full" style={{ paddingBottom: "75%" }}>
          <div className="absolute inset-0">
            <Photo
              src={src}
              alt={alt}
              className="archival transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)",
              }}
            />
          </div>
        </div>

        {/* Inline caption over gradient */}
        <div className="absolute inset-x-0 bottom-0 px-4 py-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-white/75">
            {caption}
          </p>
        </div>

        {/* Classification tag */}
        <span className="absolute right-0 top-0 border-b border-l border-[var(--line)] bg-black/80 px-2 py-1 font-mono text-[0.5rem] uppercase tracking-[0.2em] text-[var(--accent)]">
          {tag}
        </span>
      </div>
    </TiltCard>
  );
}

export function AcornFlagship() {
  return (
    <section className="relative border-b border-[var(--line)]">
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">
        {/* Section eyebrow */}
        <Reveal>
          <div className="mb-10 flex items-center gap-4">
            <span className="eyebrow text-[var(--accent)]">Mission 01 — Flagship</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
            <span className="eyebrow">01 / 05</span>
          </div>
        </Reveal>

        {/* ── Header: designation + tagline + body ── */}
        <div className="max-w-3xl">
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border-[1.5px] border-[var(--fg)] text-[var(--fg)]">
                <Zap className="size-5" />
              </div>
              <span className="mission-display text-2xl">{acorn.name}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mission-display text-[2.4rem] md:text-[3.6rem]">
              <DecodeText text={acorn.tagline} duration={1.1} />
            </h2>
          </Reveal>

          <Reveal delay={0.2} className="mt-6">
            <p className="text-sm leading-[1.9] text-[var(--muted)] md:text-base">
              {acorn.body}
            </p>
          </Reveal>
        </div>

        {/* ── Full-width landscape transmission — the entire AcornPrep hero ── */}
        <Reveal delay={0.15} className="mt-14">
          <div className="frame-brackets">
            <Develop>
              <LiveEmbed
                url={acorn.url}
                domain={acorn.domain}
                title={acorn.name}
                screenshot={acorn.shot}
                aspect="1280/800"
              />
            </Develop>
          </div>

          {/* Sub-caption */}
          <div className="mt-4 flex items-center gap-3 px-2">
            <motion.span
              className="size-2 bg-[var(--accent)]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
              Live transmission — {acorn.domain}
            </span>
          </div>
        </Reveal>

        {/* ── Stats + stack + CTA ── */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <RevealGroup
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-2"
            stagger={0.08}
            delayChildren={0.1}
          >
            {acorn.stats.map((s, i) => (
              <StatBlock key={s.label} value={s.value} label={s.label} index={i} />
            ))}
          </RevealGroup>

          <div className="flex flex-col justify-center">
            <Reveal delay={0.2}>
              <p className="eyebrow mb-3">Stack</p>
              <div className="flex flex-wrap gap-2">
                {acorn.stack.map((s) => (
                  <StackChip key={s} label={s} />
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3} className="mt-10">
              <Magnetic strength={0.3}>
                <a
                  href={acorn.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-hover
                  className="btn-fill"
                >
                  Visit {acorn.domain} <ArrowUpRight className="size-3.5" />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        {/* Endorsement strip */}
        <Reveal delay={0.3} className="mt-16 border-t border-[var(--line)] pt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-6 items-center justify-center border border-[var(--accent)] text-[0.5rem] font-bold text-[var(--accent)]">
                ✓
              </div>
              <p className="font-mono text-xs text-[var(--muted)]">
                Endorsed by 4 AP teachers · Partner: Pradyun Kanuparthi · Released 04/11/2026
              </p>
            </div>
            <p className="font-mono text-xs text-[var(--muted)]">100 users in first 24 hours</p>
          </div>
        </Reveal>

        {/* ── Behind the Build ─────────────────────────────────── */}
        <Reveal delay={0.35} className="mt-16">
          <p className="eyebrow mb-6">Behind the build</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ArchivePhoto
              src="/img/acornprep-cofounders.jpg"
              alt="Jadon Li and Pradyun Kanuparthi, AcornPrep co-founders"
              caption="Fig. 01 — The co-founders, Jadon Li & Pradyun Kanuparthi"
              tag="Crew"
            />
            <ArchivePhoto
              src="/img/acornprep-presentation-promptengineering.jpg"
              alt="Presenting AcornPrep at the Google Gemini developer meetup"
              caption="Fig. 02 — Presenting at the Google Gemini developer meetup"
              tag="Live"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
