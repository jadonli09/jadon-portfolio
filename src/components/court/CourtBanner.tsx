"use client";

import { motion } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { COURT } from "@/lib/data";

/** Full-bleed championship banner — the "retire the jersey" moment. */
export function CourtBanner() {
  const stats = [
    { to: 1, suffix: "st", label: "In School History", prefix: "", note: "Never done before" },
    { to: 1, suffix: "st", label: "In District History", prefix: "", note: "Fremont + FUSD" },
    { to: 5, suffix: "", label: "Starters — First Five", prefix: "#", note: "Opening lineup" },
    { to: 569, suffix: "k", label: "DouYin Likes", prefix: "", note: "China · 网红 moment" },
  ] as const;

  const lowerStats = [
    { label: ".500", sub: "JV League Record" },
    { label: "6", sub: "Seasons (AAU → Varsity)" },
    { label: "3×", sub: "Weekly Varsity Practices" },
    { label: "2026", sub: "NCS Title Year" },
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--accent)] py-20 md:py-28">
      {/* Giant ghosted text background */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden
      >
        <span className="font-anton whitespace-nowrap text-[30vw] leading-none tracking-tight text-black opacity-[0.08]">
          NCS
        </span>
      </div>

      {/* Diagonal scan-line texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(118deg, #000 0px, #000 1px, transparent 1px, transparent 18px)",
        }}
        aria-hidden
      />

      {/* Vertical rule lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-y-0 border-r border-black"
            style={{ left: `${i * 25}%` }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        {/* Label */}
        <Reveal>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-black/60">
            {COURT.banner.title} · {COURT.banner.year}
          </span>
        </Reveal>

        {/* Section heading */}
        <Reveal delay={0.1}>
          <h2 className="mt-3 font-anton text-[clamp(3rem,11vw,9rem)] uppercase leading-none tracking-tight text-white">
            By the Numbers
          </h2>
        </Reveal>

        {/* Primary stats grid — 4 big counters */}
        <RevealGroup
          className="mt-12 grid grid-cols-2 gap-px border border-black/20 bg-black/20 md:mt-16 md:grid-cols-4"
          stagger={0.07}
          delayChildren={0.2}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative bg-[var(--accent)] px-6 py-8 transition-colors duration-300 hover:bg-orange-600 md:px-8 md:py-10"
              data-cursor-hover
            >
              {/* Hover: white corner mark */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-0 top-0 h-0.5 w-8 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-60"
              />
              <p className="font-anton text-[2.8rem] leading-none text-white md:text-[4rem]">
                <Counter to={s.to} suffix={s.suffix} prefix={s.prefix} duration={1.8} />
              </p>
              <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-widest text-white/75">
                {s.label}
              </p>
              <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-widest text-black/50">
                {s.note}
              </p>
            </div>
          ))}
        </RevealGroup>

        {/* Secondary stat row — smaller, text-based */}
        <RevealGroup
          className="mt-px grid grid-cols-2 gap-px border-x border-b border-black/20 bg-black/20 md:grid-cols-4"
          stagger={0.05}
          delayChildren={0.5}
        >
          {lowerStats.map((s) => (
            <div
              key={s.label}
              className="bg-black/15 px-6 py-4 md:px-8"
            >
              <p className="font-anton text-2xl leading-none text-white/90 md:text-3xl">
                {s.label}
              </p>
              <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-widest text-white/60">
                {s.sub}
              </p>
            </div>
          ))}
        </RevealGroup>

        {/* Sub-copy */}
        <Reveal delay={0.5}>
          <p className="mt-10 max-w-2xl font-grotesk text-base leading-relaxed text-black/70 md:text-lg">
            {COURT.banner.sub}
          </p>
        </Reveal>

        {/* Animated line expansion */}
        <motion.div
          className="mt-10 h-[2px] bg-white/40"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        />
      </div>
    </section>
  );
}
