"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Counter } from "@/components/primitives/Counter";

/**
 * Broadcast lower-third stat band.
 * Four headline stats rendered as a kinetic horizontal strip — sports-magazine energy.
 * Animated counters trigger on scroll-into-view.
 */

type StatItem =
  | { kind: "counter"; value: number; suffix: string; prefix?: string; label: string }
  | { kind: "text"; value: string; label: string };

const STATS: StatItem[] = [
  { kind: "text", value: "FIRST 5", label: "Opening Lineup" },
  { kind: "text", value: "NCS", label: "Section Champions" },
  { kind: "counter", value: 569, suffix: "k", label: "DouYin Likes" },
  { kind: "text", value: ".500", label: "JV League Record" },
];

function StatCell({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const isLast = index === STATS.length - 1;

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center justify-center px-6 py-8 md:px-10 md:py-10"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Right divider — hidden on last cell */}
      {!isLast && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/4 h-1/2 w-px bg-[var(--accent)] opacity-30"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        />
      )}

      {/* Value */}
      <p
        className="font-anton leading-none text-[var(--fg)]"
        style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)", lineHeight: 1 }}
      >
        {stat.kind === "counter" ? (
          inView ? (
            <Counter to={stat.value} suffix={stat.suffix} prefix={stat.prefix ?? ""} duration={2} />
          ) : (
            <span>0{stat.suffix}</span>
          )
        ) : (
          <span className="text-[var(--accent)]">{stat.value}</span>
        )}
      </p>

      {/* Label */}
      <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)] text-center">
        {stat.label}
      </p>
    </motion.div>
  );
}

export function CourtStatLine() {
  return (
    <div className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--bg-2)]">
      {/* Diagonal scan-line texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(118deg, var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 40px)",
        }}
        aria-hidden
      />

      {/* Orange top rule */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-[2px] bg-[var(--accent)]"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      />

      {/* Eyebrow label */}
      <div className="mx-auto max-w-7xl px-5 pt-6 md:px-9">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--accent)]">
            Career Numbers
          </span>
          <span className="h-px flex-1 bg-[var(--accent)] opacity-20" aria-hidden />
        </div>
      </div>

      {/* Stat cells grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatCell key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Orange bottom rule */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)] opacity-30"
        initial={{ scaleX: 0, originX: 1 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      />
    </div>
  );
}
