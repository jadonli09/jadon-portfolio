"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { ABOUT } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { FlagDoodle, MountainDoodle, Scribble } from "@/components/about/Doodles";

/**
 * The Mission Peak birthday tradition — a hand-drawn ridgeline chart of every
 * climb (higher point = faster ascent) plus a summit polaroid for each year.
 *
 * Summit photos: drop each year's photo into /public/img and register it
 * below — any year without an entry renders a dashed placeholder print.
 */
const SUMMIT_PHOTOS: Partial<Record<string, { src: string; alt: string }>> = {
  "2021": { src: "/img/missionpeak-2021.jpg", alt: "Mission Peak summit, 2021 — the first climb, at twelve" },
  "2022": { src: "/img/missionpeak2022.jpg", alt: "Mission Peak summit, 2022 — ten minutes faster" },
  "2023": { src: "/img/missionpeak2023.jpg", alt: "Mission Peak summit, 2023 — by the summit tree" },
  "2024": { src: "/img/missionpeak2024.jpg", alt: "Mission Peak summit, 2024 — the sub-48 climb, at the summit pole" },
  "2025": { src: "/img/missionpeak2025.jpg", alt: "Mission Peak summit, 2025 — the PR climb" },
  "2026": { src: "/img/missionpeak2026-1.jpg", alt: "Mission Peak summit, 2026 — the sunrise climb" },
};

const climbs = ABOUT.missionPeak.climbs;
const BIRTH_YEAR = 2009;

/* chart geometry — faster climb = higher point on the ridge */
const W = 600;
const H = 220;
const PAD_X = 44;
const TOP = 34;
const BOTTOM = 178;
const secs = climbs.map((c) => c.seconds);
const fastest = Math.min(...secs);
const slowest = Math.max(...secs);
const px = (i: number) => PAD_X + (i * (W - PAD_X * 2)) / (climbs.length - 1);
const py = (s: number) => TOP + ((s - fastest) / (slowest - fastest)) * (BOTTOM - TOP);

const ridgePath = climbs
  .map((c, i) => `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(c.seconds).toFixed(1)}`)
  .join(" ");

export function MissionPeakTradition() {
  const prIndex = climbs.findIndex((c) => c.pr);
  const [active, setActive] = useState(prIndex);
  const current = climbs[active];

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        {/* ── header ── */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="inline-block bg-[var(--fg)] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--bg)]">
              The tradition
            </p>
            <h2 className="mt-5 font-anton text-4xl uppercase leading-[0.95] tracking-tight md:text-7xl">
              Mission Peak,
              <br />
              every birthday<span className="text-[var(--accent)]">.</span>
            </h2>
            <Scribble className="mt-3 w-52" />
          </div>
          <p className="font-hand max-w-xs rotate-[-1.5deg] text-2xl leading-tight text-[var(--muted)]">
            a solo run to the summit every January 2nd since turning twelve — then it all goes in the journal
          </p>
        </div>

        {/* ── ridgeline chart + readout ── */}
        <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          {/* readout */}
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--muted)]">
              Climb № {active + 1} · age {Number(current.year) - BIRTH_YEAR}
            </p>
            <motion.p
              key={current.time}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mt-2 font-anton text-[4.6rem] leading-none tabular-nums md:text-[6.5rem]"
              style={{ color: current.pr ? "var(--accent)" : "var(--fg)" }}
            >
              {current.time}
            </motion.p>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
              bottom → summit · min&apos;sec
            </p>
            <motion.p
              key={current.year}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="font-hand mt-5 max-w-sm text-2xl leading-tight text-[var(--fg)]"
            >
              {current.note ?? "a solo run to the summit"}
              {current.pr && <span className="ml-2 text-[var(--accent)]">← the PR!</span>}
            </motion.p>
          </div>

          {/* the ridge */}
          <div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full overflow-visible"
              role="img"
              aria-label="Mission Peak climb times by year — a higher point on the ridge is a faster ascent"
            >
              {/* ground fill under the ridge */}
              <motion.path
                d={`${ridgePath} L ${px(climbs.length - 1)} ${H - 8} L ${px(0)} ${H - 8} Z`}
                fill="var(--accent)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.07 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6 }}
              />
              {/* the hand-drawn ridgeline */}
              <motion.path
                d={ridgePath}
                fill="none"
                stroke="var(--fg)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              {/* PR flag */}
              <foreignObject x={px(prIndex) - 4} y={py(climbs[prIndex].seconds) - 44} width={40} height={48}>
                <FlagDoodle className="w-9" delay={1.6} />
              </foreignObject>

              {climbs.map((c, i) => {
                const isActive = active === i;
                return (
                  <g key={c.year}>
                    {/* year marker */}
                    <motion.circle
                      cx={px(i)}
                      cy={py(c.seconds)}
                      r={isActive ? 9 : 6.5}
                      fill={c.pr ? "var(--accent)" : isActive ? "var(--fg)" : "var(--bg)"}
                      stroke="var(--fg)"
                      strokeWidth={2.4}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.25 * i + 0.3 }}
                      style={{ transformOrigin: `${px(i)}px ${py(c.seconds)}px` }}
                    />
                    {/* time label above the active dot */}
                    {isActive && (
                      <text
                        x={px(i)}
                        y={py(c.seconds) - 18}
                        textAnchor="middle"
                        className="font-mono"
                        style={{ fontSize: 13, fill: "var(--fg)", fontVariantNumeric: "tabular-nums" }}
                      >
                        {c.time}
                      </text>
                    )}
                    {/* invisible fat hit area */}
                    <circle
                      cx={px(i)}
                      cy={py(c.seconds)}
                      r={26}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setActive(i)}
                      data-cursor-hover
                    />
                    {/* year axis label */}
                    <text
                      x={px(i)}
                      y={H}
                      textAnchor="middle"
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.14em",
                        fill: isActive ? "var(--fg)" : "var(--muted)",
                      }}
                    >
                      {c.year}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.26em] text-[var(--muted)]">
              Higher on the ridge = faster ascent · tap a year
            </p>
          </div>
        </div>

        {/* ── summit polaroids, one per year ── */}
        <div className="mt-20">
          <div className="mb-8 flex items-baseline gap-4">
            <h3 className="font-anton text-2xl uppercase tracking-tight md:text-3xl">
              From the summit
            </h3>
            <p className="font-hand text-xl text-[var(--muted)]">one frame per year</p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {climbs.map((c, i) => {
              const photo = SUMMIT_PHOTOS[c.year];
              const isActive = active === i;
              return (
                <motion.button
                  key={c.year}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-label={`${c.year} summit — ${c.time}`}
                  data-cursor-hover
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ rotate: 0, y: -6 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}
                  style={{ rotate: i % 2 === 0 ? -2 : 2 }}
                  className="polaroid relative p-2 pb-9 text-left"
                >
                  <span className="tape -top-2.5 left-1/2 w-14 -translate-x-1/2 rotate-[-5deg]" />

                  <div className="relative overflow-hidden bg-[var(--bg-2)]" style={{ aspectRatio: "1 / 1" }}>
                    {photo ? (
                      <Photo
                        src={photo.src}
                        alt={photo.alt}
                        className={[
                          "h-full w-full object-cover transition-[filter] duration-500",
                          isActive ? "grayscale-0" : "grayscale",
                        ].join(" ")}
                      />
                    ) : (
                      /* placeholder print — waiting on this year's photo */
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-[var(--muted)] p-2">
                        <MountainDoodle className="w-12" stroke="var(--muted)" delay={i * 0.1} />
                        <p className="font-hand text-center text-base leading-tight text-[var(--muted)]">
                          summit photo
                          <br />
                          coming soon
                        </p>
                      </div>
                    )}
                    {c.pr && (
                      <span className="absolute right-1.5 top-1.5 bg-[var(--accent)] px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-widest text-white">
                        PR
                      </span>
                    )}
                  </div>

                  <span className="font-hand absolute bottom-2 left-3 text-lg leading-none text-[var(--fg)]">
                    {c.year} · {c.time}
                  </span>
                  <span
                    className="absolute bottom-3 right-3 h-2 w-2 rounded-full"
                    style={{ background: isActive ? "var(--accent)" : "var(--line)" }}
                  />
                </motion.button>
              );
            })}
          </div>

          <p className="mt-8 max-w-md border-l-2 border-[var(--accent)] pl-4 font-mono text-[0.62rem] uppercase tracking-[0.24em] leading-relaxed text-[var(--muted)]">
            Six climbs and counting — the 2027 frame gets taken the morning he turns eighteen.
          </p>
        </div>
      </div>
    </section>
  );
}
