"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { ABOUT } from "@/lib/data";
import { EASE } from "@/lib/motion";

const climbs = ABOUT.missionPeak.climbs;
const secs = climbs.map((c) => c.seconds);
const min = Math.min(...secs);
const max = Math.max(...secs);
// taller bar = faster climb (PR is tallest)
const heightPct = (s: number) => 22 + ((max - s) / (max - min)) * 78;

/** Summit photo gallery — three photos with editorial parallax offset. */
function SummitGallery() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-20, 20]);
  const y2 = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-10, 30]);

  return (
    <div ref={ref} className="relative hidden h-64 lg:flex lg:h-80 lg:gap-3">
      {/* Photo 1 — missionpeak2025, left, slightly lower */}
      <motion.div
        style={{ y: y1 }}
        className="relative w-[32%] overflow-hidden"
        data-cursor-hover
      >
        <Photo
          src="/img/missionpeak2025.jpg"
          alt="Mission Peak summit, 2025"
          className="h-full w-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--fg)]/80 px-2 py-1">
          <p className="font-mono text-[0.52rem] uppercase tracking-widest text-[var(--bg)]">
            Summit · 2025
          </p>
        </div>
      </motion.div>

      {/* Photo 2 — missionpeak2026-1, centre, tallest */}
      <motion.div
        style={{ y: y2 }}
        className="relative w-[40%] overflow-hidden"
        data-cursor-hover
      >
        <Photo
          src="/img/missionpeak2026-1.jpg"
          alt="Mission Peak summit, 2026"
          className="h-full w-full object-cover transition-[filter] duration-700"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--fg)]/80 px-2 py-1">
          <p className="font-mono text-[0.52rem] uppercase tracking-widest text-[var(--bg)]">
            Summit · 2026
          </p>
        </div>
      </motion.div>

      {/* Photo 3 — missionpeak2026-2, right */}
      <motion.div
        style={{ y: y3 }}
        className="relative w-[28%] overflow-hidden"
        data-cursor-hover
      >
        <Photo
          src="/img/missionpeak2026-2.jpg"
          alt="Mission Peak, 2026 — second frame"
          className="h-full w-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--fg)]/80 px-2 py-1">
          <p className="font-mono text-[0.52rem] uppercase tracking-widest text-[var(--bg)]">
            The view
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function MissionPeak() {
  const prIndex = climbs.findIndex((c) => c.pr);
  const [active, setActive] = useState(prIndex);
  const current = climbs[active];

  return (
    <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
      {/* readout */}
      <div>
        <p className="eyebrow">Age {current.year}</p>
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

        {/* Climb note — the per-ascent story beat */}
        <motion.p
          key={current.note ?? current.time}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="mt-4 max-w-sm font-serif-i text-lg italic leading-snug text-[var(--fg)]"
        >
          {current.note ?? "A solo run to the summit, every birthday."}
          {current.pr && (
            <span className="ml-2 font-sans not-italic font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent-2)]">
              PR
            </span>
          )}
        </motion.p>

        <p className="mt-6 max-w-sm border-l border-[var(--line)] pl-4 font-mono text-[0.68rem] uppercase tracking-widest text-[var(--muted)]">
          {ABOUT.missionPeak.ritual}
        </p>
      </div>

      {/* interactive chart */}
      <div>
        <div className="flex h-64 items-end gap-3 md:h-80 md:gap-5" role="group" aria-label="Mission Peak climb times by age">
          {climbs.map((c, i) => (
            <button
              key={c.year}
              data-cursor-hover
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`Age ${c.year}: ${c.time}`}
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
              {/* Tooltip on active — shows time */}
              {active === i && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.58rem] tabular-nums text-[var(--fg)]"
                >
                  {c.time}
                </motion.span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">
          Hover each age — taller bar is a faster ascent. Journaled since 8th grade.
        </p>
      </div>

      {/* Summit photo gallery — spans full width below the chart */}
      <div className="md:col-span-2 mt-10 border-t border-[var(--line)] pt-10">
        <p className="eyebrow mb-5">At the top</p>
        <SummitGallery />
      </div>
    </div>
  );
}
