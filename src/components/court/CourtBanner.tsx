"use client";

import { motion } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { PebbleGrain, SeamArcs } from "@/components/court/BallMotifs";

/** Full-bleed championship banner — the "retire the jersey" moment. */
export function CourtBanner() {
  const stats = [
    { to: 1, suffix: "st", label: "In School History" },
    { to: 1, suffix: "st", label: "In District History" },
    { to: 6, suffix: "", label: "Seasons, AAU to Varsity" },
    { to: 3, suffix: "×", label: "Weekly Varsity Practices" },
  ] as const;

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

      {/* Pebbled leather grain — this section IS the ball */}
      <PebbleGrain className="text-black opacity-[0.10]" size={8} />

      {/* Giant seam channels sweeping across the leather */}
      <div className="pointer-events-none absolute -right-[18%] -top-[40%] w-[75%] opacity-[0.10] text-black" aria-hidden>
        <SeamArcs strokeWidth={3} />
      </div>
      <div className="pointer-events-none absolute -bottom-[55%] -left-[22%] w-[65%] opacity-[0.08] text-black" aria-hidden>
        <SeamArcs strokeWidth={3} />
      </div>

      {/* Leather sheen — radial light like a ball under gym lights */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 32% 18%, rgba(255,255,255,0.14) 0%, transparent 55%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        {/* Section heading */}
        <Reveal>
          <h2 className="font-anton text-[clamp(3rem,11vw,9rem)] uppercase leading-none tracking-tight text-white">
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
                <Counter to={s.to} suffix={s.suffix} duration={1.8} />
              </p>
              <p className="mt-3 font-grotesk text-sm font-medium leading-snug text-white/85 md:text-base">
                {s.label}
              </p>
            </div>
          ))}
        </RevealGroup>

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
