"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Zap, Users, BookOpen, Hash } from "lucide-react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Magnetic } from "@/components/primitives/Magnetic";
import { LiveEmbed } from "@/components/built/LiveEmbed";
import { PROJECTS } from "@/lib/data";
import { cn } from "@/lib/cn";

const acorn = PROJECTS.find((p) => p.name === "AcornPrep")!;

const STAT_ICONS = [Users, BookOpen, Hash, Zap];

/** A single oversized stat block */
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
      className="flex flex-col gap-2 border-l-2 border-[var(--accent)] pl-5"
      variants={{
        hidden: { opacity: 0, x: -12 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      <Icon className="size-4 text-[var(--accent)] opacity-60" />
      <p
        className="font-mono text-[2.2rem] font-semibold leading-none tracking-tight"
        style={{ color: "var(--accent)" }}
      >
        {value}
      </p>
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </p>
    </motion.div>
  );
}

/** Stack chip */
function StackChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
      {label}
    </span>
  );
}

export function AcornFlagship() {
  return (
    <section className="relative border-b border-[var(--line)]">
      {/* Radial accent glow in background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(124,156,255,0.12) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">
        {/* Section eyebrow */}
        <Reveal>
          <div className="mb-10 flex items-center gap-4">
            <span className="eyebrow text-[var(--accent)]">Flagship</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
            <span className="eyebrow">01 / 05</span>
          </div>
        </Reveal>

        {/* Main grid: copy left, device mockup right */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* ── LEFT: copy ────────────────────── */}
          <div className="flex flex-col justify-center">
            {/* Product logo / name */}
            <Reveal>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-lg text-[var(--bg)]"
                  style={{ background: "var(--accent)" }}
                >
                  <Zap className="size-5" />
                </div>
                <span className="font-display text-xl font-semibold">{acorn.name}</span>
              </div>
            </Reveal>

            <KineticHeadline
              as="h2"
              text={acorn.tagline}
              delay={0.05}
              className="font-display text-[2.2rem] leading-[1.05] tracking-tight md:text-[3rem] lg:text-[3.5rem]"
            />

            <Reveal delay={0.2} className="mt-6">
              <p className="max-w-lg text-base leading-relaxed text-[var(--muted)] md:text-lg">
                {acorn.body}
              </p>
            </Reveal>

            {/* Stats grid */}
            <RevealGroup
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8"
              stagger={0.08}
              delayChildren={0.25}
            >
              {acorn.stats.map((s, i) => (
                <StatBlock key={s.label} value={s.value} label={s.label} index={i} />
              ))}
            </RevealGroup>

            {/* Stack */}
            <Reveal delay={0.4} className="mt-8">
              <p className="eyebrow mb-3">Stack</p>
              <div className="flex flex-wrap gap-2">
                {acorn.stack.map((s) => (
                  <StackChip key={s} label={s} />
                ))}
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.5} className="mt-8">
              <Magnetic strength={0.3}>
                <a
                  href={acorn.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-hover
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-6 py-3",
                    "font-mono text-xs uppercase tracking-widest",
                    "bg-[var(--accent)] text-[var(--bg)] transition-all hover:brightness-110 active:scale-95",
                  )}
                >
                  Visit {acorn.domain} <ArrowUpRight className="size-3.5" />
                </a>
              </Magnetic>
            </Reveal>
          </div>

          {/* ── RIGHT: device mockup ──────────── */}
          <Reveal delay={0.15} className="flex flex-col gap-6">
            {/* Outer glow ring */}
            <div
              className="relative rounded-2xl p-[1px]"
              style={{
                background: "linear-gradient(135deg, rgba(124,156,255,0.3) 0%, rgba(185,255,102,0.15) 100%)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,156,255,0.12)",
              }}
            >
              <LiveEmbed
                url={acorn.url}
                domain={acorn.domain}
                title={acorn.name}
                screenshot={acorn.shot}
                height={560}
                className="rounded-2xl"
              />
            </div>

            {/* Sub-caption */}
            <div className="flex items-center gap-3 px-2">
              <motion.span
                className="size-2 rounded-full bg-[#28c840]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
                Live product — {acorn.domain}
              </span>
            </div>
          </Reveal>
        </div>

        {/* Endorsement strip */}
        <Reveal delay={0.3} className="mt-16 border-t border-[var(--line)] pt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex size-6 items-center justify-center rounded-full text-[0.5rem] font-bold text-[var(--bg)]"
                style={{ background: "var(--accent-2)" }}
              >
                ✓
              </div>
              <p className="font-mono text-xs text-[var(--muted)]">
                Endorsed by 4 AP teachers · Partner: Pradyun Kanuparthi · Released 04/11/2026
              </p>
            </div>
            <p className="font-mono text-xs text-[var(--muted)]">100 users in first 24 hours</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
