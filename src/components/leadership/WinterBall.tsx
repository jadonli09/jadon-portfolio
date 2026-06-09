"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { LEADERSHIP } from "@/lib/data";

const DETAILS = [
  {
    icon: "◎",
    label: "Non-Alcoholic Drink Bar",
    note: "A curated bar station — the centrepiece of the floor.",
  },
  {
    icon: "◈",
    label: "Borrowed PTA Game Tables",
    note: "Poker & roulette — acquired, not purchased. No budget wasted.",
  },
  {
    icon: "⬡",
    label: "Gym-Floor Mat",
    note: "Lent by Newark Memorial — protected the floor for the night.",
  },
  {
    icon: "◇",
    label: "No Precedent",
    note: "First winter ball since before COVID. Built from zero.",
  },
  {
    icon: "◉",
    label: "Student-Interest Poll",
    note: "The data that convinced a wary administration.",
  },
  {
    icon: "⬟",
    label: "Full Night Engineered",
    note: "From concept through cleanup. Every detail owned.",
  },
];

export function WinterBall() {
  const { winterBall } = LEADERSHIP;

  return (
    <section
      className="relative mx-auto mt-20 max-w-7xl px-5 md:mt-32 md:px-9"
      aria-labelledby="winter-ball-title"
    >
      {/* Section header */}
      <Reveal>
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <span className="eyebrow text-[var(--accent)]">Built From Scratch</span>
          <span className="eyebrow text-[var(--muted)]">{winterBall.date}</span>
        </div>
      </Reveal>

      {/* Layout: two columns on desktop */}
      <div className="mt-10 grid grid-cols-1 gap-12 md:mt-14 md:grid-cols-2 md:gap-16 lg:grid-cols-[1fr_420px]">
        {/* Left: headline + body */}
        <div>
          <KineticHeadline
            as="h2"
            text={winterBall.title}
            className="font-anton text-[2.4rem] uppercase leading-[1.0] tracking-tight text-[var(--fg)] md:text-[4.5rem]"
            delay={0.05}
          />

          <Reveal delay={0.2}>
            <p className="mt-6 text-base leading-relaxed text-[var(--fg)] opacity-[0.85] md:mt-8 md:text-lg">
              {winterBall.body}
            </p>
          </Reveal>

          {/* Detail list */}
          <RevealGroup
            className="mt-8 space-y-0 divide-y divide-[var(--line)]"
            stagger={0.06}
            delayChildren={0.1}
          >
            {DETAILS.map((d) => (
              <motion.div
                key={d.label}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="group flex items-start gap-5 py-4 transition-colors duration-300 hover:bg-[var(--bg-2)] md:py-5"
              >
                <span
                  className="mt-0.5 shrink-0 font-mono text-base text-[var(--accent)] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                >
                  {d.icon}
                </span>
                <div>
                  <p className="font-grotesk text-sm font-semibold uppercase tracking-wide text-[var(--fg)]">
                    {d.label}
                  </p>
                  <p className="mt-0.5 font-grotesk text-sm text-[var(--muted)]">{d.note}</p>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>

        {/* Right: dramatic stat panel */}
        <Reveal delay={0.15}>
          <div className="flex flex-col gap-6">
            {/* Main stat card */}
            <div className="relative overflow-hidden border border-[rgba(212,175,106,0.3)] bg-[var(--bg-2)] p-8 md:p-12">
              {/* Gold mesh bg */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(212,175,106,0.06) 0%, transparent 70%)",
                }}
              />

              {/* Corner decorations */}
              <span
                aria-hidden
                className="absolute left-0 top-0 block h-6 w-6 border-l-2 border-t-2 border-[var(--accent)] opacity-40"
              />
              <span
                aria-hidden
                className="absolute bottom-0 right-0 block h-6 w-6 border-b-2 border-r-2 border-[var(--accent)] opacity-40"
              />

              <div className="relative z-10 text-center">
                <p className="eyebrow text-[var(--muted)]">Attendance</p>
                <p className="mt-3 font-anton leading-none text-[var(--accent)]"
                   style={{ fontSize: "clamp(5rem, 14vw, 10rem)" }}>
                  <Counter to={350} duration={2} />
                </p>
                <p className="mt-2 font-mono text-sm uppercase tracking-widest text-[var(--fg)]">
                  {winterBall.stat.label}
                </p>
              </div>
            </div>

            {/* Sub-stat: "First since COVID" badge */}
            <div className="border border-[var(--line)] bg-[var(--bg-2)] p-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                Status
              </p>
              <p className="mt-2 font-display text-2xl font-semibold leading-tight text-[var(--fg)]">
                First Winter Ball Since Before COVID
              </p>
              <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--accent)]">
                No precedent · No playbook · Just work
              </p>
            </div>

            {/* Mood line */}
            <motion.div
              className="h-0.5 w-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-transparent opacity-40"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
