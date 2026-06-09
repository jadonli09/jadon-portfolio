"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ABOUT } from "@/lib/data";
import { EASE } from "@/lib/motion";

const climbs = ABOUT.missionPeak.climbs;
const secs = climbs.map((c) => c.seconds);
const min = Math.min(...secs);
const max = Math.max(...secs);
// taller bar = faster climb (PR is tallest)
const heightPct = (s: number) => 22 + ((max - s) / (max - min)) * 78;

export function MissionPeak() {
  const prIndex = climbs.findIndex((c) => c.pr);
  const [active, setActive] = useState(prIndex);
  const current = climbs[active];

  return (
    <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
      {/* readout */}
      <div>
        <p className="eyebrow">Birthday ascent · {current.year}</p>
        <div className="mt-3 flex items-end gap-3">
          <motion.span
            key={current.time}
            initial={{ y: 18, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-display text-[4.5rem] leading-none tabular-nums md:text-[7rem]"
            style={{ color: current.pr ? "var(--accent-2)" : "var(--fg)" }}
          >
            {current.time}
          </motion.span>
          <span className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">min&apos;sec</span>
        </div>
        <p className="mt-4 max-w-sm text-[var(--muted)]">
          {current.pr ? "Personal record — the fastest ascent." : current.note ? `The ${current.note}.` : "A solo run to the summit, every birthday."}
        </p>
        <p className="mt-6 max-w-sm border-l border-[var(--line)] pl-4 font-serif-i text-lg italic">
          {ABOUT.missionPeak.ritual}
        </p>
      </div>

      {/* interactive chart */}
      <div>
        <div className="flex h-64 items-end gap-3 md:h-80 md:gap-5" role="group" aria-label="Mission Peak climb times by year">
          {climbs.map((c, i) => (
            <button
              key={c.year}
              data-cursor-hover
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`${c.year}: ${c.time}`}
              className="group relative flex h-full flex-1 flex-col justify-end"
            >
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${heightPct(c.seconds)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
                className="w-full rounded-t-sm"
                style={{
                  background: c.pr ? "var(--accent-2)" : active === i ? "var(--accent)" : "color-mix(in srgb, var(--fg) 22%, transparent)",
                  outline: active === i ? "1px solid var(--fg)" : "none",
                  outlineOffset: 2,
                }}
              />
              <span
                className="mt-3 block text-center font-mono text-[0.65rem] uppercase tracking-widest transition-colors"
                style={{ color: active === i ? "var(--fg)" : "var(--muted)" }}
              >
                {c.year}
              </span>
              {c.pr && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent-2)]">
                  PR
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">
          Hover the years — taller is faster. Journaled since 8th grade.
        </p>
      </div>
    </div>
  );
}
