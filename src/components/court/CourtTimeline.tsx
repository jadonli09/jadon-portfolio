"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { COURT } from "@/lib/data";
import { cn } from "@/lib/cn";

/** Three-point arc SVG decoration for section heading. */
function ThreePointArc({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
      aria-hidden
    >
      {/* Three-point arc */}
      <path
        d="M 10 130 A 120 120 0 0 1 250 130"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity="0.6"
      />
      {/* Key */}
      <rect x="95" y="60" width="70" height="70" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {/* FT circle (half) */}
      <path d="M 95 60 A 35 35 0 0 1 165 60" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      {/* Basket */}
      <circle cx="130" cy="120" r="7" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

/** Per-node icon accent pulled from period. */
function NodeIcon({ role }: { role: string }) {
  if (role === "NCS Champion") {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
        <path d="M10 2l2.4 4.9L18 7.6l-4 3.9.94 5.5L10 14.5 5.06 17l.94-5.5L2 7.6l5.6-.7L10 2z"
          fill="var(--accent)" />
      </svg>
    );
  }
  if (role.includes("Co-Captain")) {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Individual timeline node card with hover state.
 *  On desktop the layout alternates left/right for visual rhythm.
 */
function TimelineNode({
  item,
  index,
  isLast,
}: {
  item: (typeof COURT.timeline)[number];
  index: number;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const isChampion = item.role === "NCS Champion";
  const isEven = index % 2 === 0;

  return (
    <motion.li
      ref={ref}
      className="relative grid grid-cols-[2.5rem_1fr] gap-0 md:grid-cols-[1fr_3rem_1fr]"
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Desktop: left content column (even) or spacer (odd) ── */}
      <div className="hidden md:block">
        {isEven ? (
          <div className="flex h-full items-start justify-end pr-8 pt-1">
            {/* Period label */}
            <div className="text-right">
              <span
                className={cn(
                  "font-mono text-xs uppercase tracking-widest",
                  isChampion ? "text-[var(--accent)]" : "text-[var(--muted)]"
                )}
              >
                {item.period}
              </span>
            </div>
          </div>
        ) : (
          // Odd: the card is on the right; this column holds the period label
          <div className="pr-8 pb-10 pt-1">
            <motion.div
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              data-cursor-hover
              className={cn(
                "group relative overflow-hidden border transition-colors duration-300",
                isChampion
                  ? "border-[var(--accent)] bg-[var(--bg-2)]"
                  : "border-[var(--line)] bg-[var(--bg-2)]",
                "hover:border-[var(--accent)]"
              )}
              whileHover={{ y: -3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
            >
              <NodeCard item={item} hovered={hovered} isChampion={isChampion} />
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Centre spine column ── */}
      <div className="relative flex flex-col items-center">
        {/* Dot */}
        <motion.div
          className={cn(
            "relative z-10 mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-300",
            isChampion
              ? "border-[var(--accent)] bg-[var(--accent)]"
              : hovered
              ? "border-[var(--accent)] bg-[var(--accent)]"
              : "border-[var(--muted)] bg-[var(--bg)]"
          )}
          whileHover={{ scale: 1.4 }}
        >
          <NodeIcon role={item.role} />
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <motion.div
            className={cn(
              "mt-1 flex-1 w-px",
              isChampion ? "bg-[var(--accent)]" : "bg-[var(--line)]"
            )}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </div>

      {/* ── Desktop: right content column (odd) or period (even) ── */}
      <div className="hidden md:block">
        {!isEven ? (
          <div className="flex h-full items-start pl-8 pt-1">
            <span
              className={cn(
                "font-mono text-xs uppercase tracking-widest",
                isChampion ? "text-[var(--accent)]" : "text-[var(--muted)]"
              )}
            >
              {item.period}
            </span>
          </div>
        ) : (
          <div className="pl-8 pb-10 pt-1">
            <motion.div
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              data-cursor-hover
              className={cn(
                "group relative overflow-hidden border transition-colors duration-300",
                isChampion
                  ? "border-[var(--accent)] bg-[var(--bg-2)]"
                  : "border-[var(--line)] bg-[var(--bg-2)]",
                "hover:border-[var(--accent)]"
              )}
              whileHover={{ y: -3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
            >
              <NodeCard item={item} hovered={hovered} isChampion={isChampion} />
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Mobile: full-width card (always on the right of the spine) ── */}
      <div className="pb-10 pl-5 pt-1 md:hidden">
        {/* Period label */}
        <span
          className={cn(
            "mb-2 block font-mono text-xs uppercase tracking-widest",
            isChampion ? "text-[var(--accent)]" : "text-[var(--muted)]"
          )}
        >
          {item.period}
        </span>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          data-cursor-hover
          className={cn(
            "group relative overflow-hidden border transition-colors duration-300",
            isChampion
              ? "border-[var(--accent)] bg-[var(--bg-2)]"
              : "border-[var(--line)] bg-[var(--bg-2)]",
            "hover:border-[var(--accent)]"
          )}
          whileHover={{ y: -3 }}
        >
          <NodeCard item={item} hovered={hovered} isChampion={isChampion} />
        </motion.div>
      </div>
    </motion.li>
  );
}

/** Inner card content — role headline + note + optional badge. */
function NodeCard({
  item,
  hovered,
  isChampion,
}: {
  item: (typeof COURT.timeline)[number];
  hovered: boolean;
  isChampion: boolean;
}) {
  return (
    <>
      {/* Accent top bar */}
      <motion.div
        className="absolute left-0 top-0 h-0.5 w-full bg-[var(--accent)]"
        initial={{ scaleX: isChampion ? 1 : 0, originX: 0 }}
        animate={{ scaleX: hovered || isChampion ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden
      />

      {/* Diagonal energy line on champion card */}
      {isChampion && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(118deg, var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 28px)",
          }}
          aria-hidden
        />
      )}

      <div className="px-6 py-6 md:px-7 md:py-7">
        {/* Role */}
        <p
          className={cn(
            "font-anton text-xl uppercase leading-tight tracking-wide md:text-2xl",
            isChampion ? "text-[var(--accent)]" : "text-[var(--fg)]"
          )}
        >
          {item.role}
        </p>

        {/* Note — full text, given room to breathe */}
        <p className="mt-3 font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-[0.95rem]">
          {item.note}
        </p>

        {/* Tags row */}
        <div className="mt-4 flex flex-wrap gap-2">
          {isChampion && (
            <div className="inline-flex items-center gap-1.5 border border-[var(--accent)] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--accent)]">
                NCS Title · School &amp; District First
              </span>
            </div>
          )}
          {item.role === "JV Co-Captain" && (
            <div className="inline-flex items-center gap-1.5 border border-[var(--muted)] px-3 py-1">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                .500 League Record
              </span>
            </div>
          )}
          {item.role === "AAU Basketball" && (
            <div className="inline-flex items-center gap-1.5 border border-[var(--muted)] px-3 py-1">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Hopkins A-Team · 8th Grade
              </span>
            </div>
          )}
          {item.role === "Varsity Summer League" && (
            <div className="inline-flex items-center gap-1.5 border border-orange-400/50 px-3 py-1">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-orange-400">
                3 Tournaments · Bay Club
              </span>
            </div>
          )}
          {item.role.includes("Varsity · started") && (
            <div className="inline-flex items-center gap-1.5 border border-orange-400/50 px-3 py-1">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-orange-400">
                Bench Energy = Team Synergy
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function CourtTimeline() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-28">
      {/* Section header */}
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 md:mb-20">
        <Reveal>
          <div>
            <span className="eyebrow text-[var(--accent)]">The Journey</span>
            <h2 className="mt-3 font-anton text-[clamp(2.4rem,8vw,5.5rem)] uppercase leading-none tracking-tight text-[var(--fg)]">
              Career<br />Timeline
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-col justify-end md:pb-2">
            <p className="font-grotesk text-base leading-relaxed text-[var(--muted)] md:text-lg">
              From grade-school AAU hardwood to an NCS Championship stage — a decade of grind
              on the court, condensed. A broken arm in 7th grade. A Hopkins A-team spot in 8th.
              JV dinners that turned teammates into a unit. A bench seat that taught him more
              than the starting lineup.
            </p>
            {/* Three-point arc motif */}
            <ThreePointArc className="mt-6 w-48 text-[var(--accent)] opacity-50" />
          </div>
        </Reveal>
      </div>

      {/* ── Timeline list ── */}
      <ul className="relative">
        {COURT.timeline.map((item, i) => (
          <TimelineNode
            key={item.role}
            item={item}
            index={i}
            isLast={i === COURT.timeline.length - 1}
          />
        ))}
      </ul>

      {/* Bottom rule */}
      <motion.div
        className="mt-8 h-px bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-transparent opacity-30"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      />
    </section>
  );
}
