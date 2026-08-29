"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { SlotPhoto } from "@/components/leadership/SlotPhoto";
import { LEADERSHIP } from "@/lib/data";

/* On the world's asphalt: gold type, white prints. */
const INK = "var(--fg)";
const INK_SOFT = "var(--muted)";
const GOLD_DEEP = "var(--accent)";
const OXBLOOD = "var(--accent)";
const PRINT_INK = "#1a140d";

const DANCE_CARD = [
  { n: "I", label: "Non-alcoholic drink bar", note: "Mocktails mixed on the spot — people were gutted when it ran out." },
  { n: "II", label: "Game tables, borrowed", note: "Poker & roulette lent by MPPFA's fundraising lead. Acquired, not purchased." },
  { n: "III", label: "Gym-floor mat", note: "Lent by Newark Memorial — protected the floor for the night." },
  { n: "IV", label: "Student-interest poll", note: "The data that convinced a wary administration." },
];

/** Winter Ball polaroids — from the night itself. */
const POLAROIDS = [
  { src: "/img/winterball-1.jpg", caption: "the floor, mid-night", rotate: -3.5 },
  { src: "/img/winterball-2.jpg", caption: "the drink bar", rotate: 2.5 },
  { src: "/img/winterball-4.jpg", caption: "mocktails, made on the spot", rotate: -2 },
  { src: "/img/winterball-3.jpg", caption: "game tables", rotate: 1.5 },
];

function Polaroid({
  src,
  caption,
  rotate,
  index,
}: {
  src: string;
  caption: string;
  rotate: number;
  index: number;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24, rotate: rotate * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ rotate: 0, y: -8, transition: { duration: 0.35 } }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[220px] shrink-0 bg-white p-2 pb-2.5"
      style={{ boxShadow: "0 16px 34px rgba(0,0,0,0.55)" }}
      data-cursor-hover
    >
      {/* Tape strip */}
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 z-10 block h-5 w-16 -translate-x-1/2 -rotate-2"
        style={{ background: "rgba(212,175,106,0.4)", backdropFilter: "blur(1px)" }}
      />
      <div className="relative aspect-square overflow-hidden bg-[#ece1c8]">
        <SlotPhoto src={src} alt={`Winter Ball — ${caption}`} monogram="WB" note="photo en route" tone="paper" />
      </div>
      <figcaption className="font-hand mt-2 text-center text-lg leading-none" style={{ color: PRINT_INK }}>
        {caption}
      </figcaption>
    </motion.figure>
  );
}

/**
 * WinterBall — the page's full inversion: an ivory invitation-paper section
 * set in serif (Fraunces / Instrument), with a roman-numeral dance card,
 * a foil-stamp attendance badge, and tilted polaroid photo slots.
 * Deliberately nothing like the Anton-and-asphalt sections around it.
 */
export function WinterBall() {
  const { winterBall } = LEADERSHIP;

  return (
    <section
      className="relative mt-14 overflow-hidden md:mt-20"
      aria-labelledby="winter-ball-title"
    >
      <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-9 md:py-16">
        {/* Left: title + programme · Right: prints, from the top */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-12">
          {/* The dance card */}
          <div>
            <Reveal>
              <h2
                id="winter-ball-title"
                className="font-display font-semibold leading-[0.95] tracking-tight"
                style={{ color: INK, fontSize: "clamp(2.6rem, 6vw, 4.8rem)" }}
              >
                Winter&nbsp;Ball
              </h2>
              <p className="mt-3 max-w-md font-serif-i text-base italic leading-relaxed md:text-lg" style={{ color: INK_SOFT }}>
                {winterBall.date} — the first since before COVID; no precedent, no playbook.
              </p>
              <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: GOLD_DEEP }}>
                Programme of the evening
              </p>
            </Reveal>
            <RevealGroup className="mt-5" stagger={0.07} delayChildren={0.05}>
              {DANCE_CARD.map((d) => (
                <motion.div
                  key={d.label}
                  variants={{
                    hidden: { opacity: 0, x: -14 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="flex items-baseline gap-5 py-2.5"
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <span className="w-8 shrink-0 text-right font-display text-base font-semibold" style={{ color: OXBLOOD }}>
                    {d.n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold leading-snug md:text-xl" style={{ color: INK }}>
                      {d.label}
                    </p>
                    <p className="mt-0.5 font-serif-i text-sm italic leading-relaxed" style={{ color: INK_SOFT }}>
                      {d.note}
                    </p>
                  </div>
                </motion.div>
              ))}
            </RevealGroup>
          <Reveal delay={0.2}>
            <div className="mt-6 flex justify-center md:justify-start">
              <a
                href="https://www.instagram.com/reel/DVPv0z0ke0b/"
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group inline-flex items-center gap-3 px-7 py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-all duration-300"
                style={{ border: `2px solid ${OXBLOOD}`, color: OXBLOOD }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.color = "#0c0a08";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = OXBLOOD;
                }}
              >
                <span aria-hidden>▶</span>
                Watch the night — @li_locked.in
              </a>
            </div>
          </Reveal>
          </div>

          {/* Stamp + polaroids */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {POLAROIDS.map((p, i) => (
                <div key={p.src} className="flex justify-center">
                  <Polaroid src={p.src} caption={p.caption} rotate={p.rotate} index={i} />
                </div>
              ))}
            </div>
            {/* Wax-seal attendance stamp — pinned over the top-right print */}
            <div className="absolute -right-3 -top-6 z-10 md:-right-6 md:-top-8">
              <Reveal delay={0.1}>
                <div
                  className="relative flex h-32 w-32 -rotate-6 flex-col items-center justify-center rounded-full md:h-36 md:w-36"
                  style={{ border: `3px double ${OXBLOOD}`, color: OXBLOOD, background: "var(--bg-2)", boxShadow: "0 10px 24px rgba(0,0,0,0.5)" }}
                >
                  <span aria-hidden className="absolute inset-2 rounded-full" style={{ border: `1px solid ${OXBLOOD}` }} />
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.3em]">Attendance</p>
                  <p className="font-anton text-4xl leading-none md:text-5xl">
                    <Counter to={350} duration={2} />
                  </p>
                  <p className="mt-1 font-mono text-[0.5rem] uppercase tracking-[0.3em]">students</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
