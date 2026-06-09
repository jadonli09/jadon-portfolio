"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { RevealGroup, Reveal } from "@/components/primitives/Reveal";
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

/** Individual timeline node card with hover state. */
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

  return (
    <motion.li
      ref={ref}
      className={cn(
        "relative flex flex-col gap-0 md:flex-row",
        index % 2 === 0 ? "md:flex-row" : "md:flex-row"
      )}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Vertical connector line */}
      <div className="absolute left-5 top-0 flex h-full flex-col items-center md:left-1/2 md:-translate-x-1/2">
        <motion.div
          className={cn(
            "h-full w-px",
            isChampion ? "bg-[var(--accent)]" : "bg-[var(--line)]"
          )}
          initial={{ scaleY: 0, originY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.12 + 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        {isLast && (
          <div className={cn("mt-1 h-2 w-2 rounded-full", isChampion ? "bg-[var(--accent)]" : "bg-[var(--muted)]")} />
        )}
      </div>

      {/* Period label — left or right based on index */}
      <div className="w-10 shrink-0 md:w-1/2 md:pr-10 md:text-right">
        <div className="pl-14 md:pl-0">
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

      {/* Node dot */}
      <div className="absolute left-3.5 top-1 z-10 md:relative md:left-auto md:top-auto md:flex md:w-0 md:items-start md:justify-center">
        <motion.div
          className={cn(
            "h-3 w-3 rounded-full border-2 transition-colors duration-300",
            isChampion
              ? "border-[var(--accent)] bg-[var(--accent)]"
              : hovered
              ? "border-[var(--accent)] bg-[var(--accent)]"
              : "border-[var(--muted)] bg-[var(--bg)]"
          )}
          whileHover={{ scale: 1.5 }}
        />
      </div>

      {/* Card content */}
      <div className="w-full pl-14 pb-10 md:w-1/2 md:pl-10 md:pb-12">
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
          whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* Accent top bar on hover */}
          <motion.div
            className="absolute left-0 top-0 h-0.5 w-full bg-[var(--accent)]"
            initial={{ scaleX: isChampion ? 1 : 0, originX: 0 }}
            animate={{ scaleX: hovered || isChampion ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden
          />

          <div className="px-6 py-6 md:px-8 md:py-8">
            {/* Role */}
            <p
              className={cn(
                "font-anton text-xl uppercase leading-tight tracking-wide md:text-2xl",
                isChampion ? "text-[var(--accent)]" : "text-[var(--fg)]"
              )}
            >
              {item.role}
            </p>

            {/* Note */}
            <p className="mt-2 font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
              {item.note}
            </p>

            {/* Champion badge */}
            {isChampion && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-none border border-[var(--accent)] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--accent)]">
                  NCS Title · School &amp; District First
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.li>
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
              on the court, condensed.
            </p>
            {/* Three-point arc motif */}
            <ThreePointArc className="mt-6 w-48 text-[var(--accent)] opacity-50" />
          </div>
        </Reveal>
      </div>

      {/* Timeline list */}
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
    </section>
  );
}
