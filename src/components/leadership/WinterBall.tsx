"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { SlotPhoto } from "@/components/leadership/SlotPhoto";
import { LEADERSHIP } from "@/lib/data";

/* Ink + paper palette, local to this section (it inverts the world theme). */
const INK = "#1a140d";
const INK_SOFT = "rgba(26,20,13,0.62)";
const GOLD_DEEP = "#9a7432";
const OXBLOOD = "#6e1f2a";

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
      className="relative w-[200px] shrink-0 bg-white p-2.5 pb-3 md:w-[240px]"
      style={{ boxShadow: "0 14px 30px rgba(26,20,13,0.28)" }}
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
      <figcaption className="font-hand mt-2 text-center text-lg leading-none" style={{ color: INK }}>
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
      className="relative mt-20 overflow-hidden md:mt-32"
      style={{ background: "linear-gradient(180deg, #f6eed9 0%, #efe3c8 100%)" }}
      aria-labelledby="winter-ball-title"
    >
      {/* Paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(26,20,13,0.025) 0 1px, transparent 1px 3px)",
        }}
      />
      {/* Deckled top + bottom edges */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[var(--bg)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 96% 30%, 90% 90%, 84% 20%, 77% 80%, 70% 25%, 63% 95%, 55% 30%, 48% 85%, 41% 15%, 34% 75%, 27% 30%, 20% 90%, 13% 25%, 6% 80%, 0 20%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-28">
        {/* Letterhead */}
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.4em]" style={{ color: GOLD_DEEP }}>
              Mission San Jose High School · {winterBall.date}
            </p>
            <div aria-hidden className="mt-4 flex items-center gap-3" style={{ color: GOLD_DEEP }}>
              <span className="block h-px w-16" style={{ background: GOLD_DEEP }} />
              <span className="text-xs">❦</span>
              <span className="block h-px w-16" style={{ background: GOLD_DEEP }} />
            </div>
            <p className="mt-5 font-serif-i text-lg italic" style={{ color: INK_SOFT }}>
              You are cordially invited to
            </p>
            <h2
              id="winter-ball-title"
              className="font-display mt-2 font-semibold leading-[0.95] tracking-tight"
              style={{ color: INK, fontSize: "clamp(3.2rem, 9vw, 7.5rem)" }}
            >
              Winter&nbsp;Ball
            </h2>
            <p className="mt-4 max-w-xl font-serif-i text-base italic leading-relaxed md:text-lg" style={{ color: INK_SOFT }}>
              the first since before COVID — no precedent, no playbook
            </p>
          </div>
        </Reveal>

        {/* Body: dance card left · stamp + story right */}
        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-[1.1fr_1fr] md:gap-16">
          {/* The dance card */}
          <div>
            <Reveal>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: GOLD_DEEP }}>
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
                  className="flex items-baseline gap-5 py-3.5"
                  style={{ borderBottom: "1px solid rgba(26,20,13,0.14)" }}
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
          </div>

          {/* Foil stamp + story */}
          <div className="flex flex-col items-center gap-10 md:items-start">
            <Reveal delay={0.1}>
              {/* Wax-seal attendance stamp */}
              <div
                className="relative flex h-44 w-44 -rotate-6 flex-col items-center justify-center rounded-full md:h-52 md:w-52"
                style={{ border: `3px double ${OXBLOOD}`, color: OXBLOOD }}
              >
                <span
                  aria-hidden
                  className="absolute inset-2 rounded-full"
                  style={{ border: `1px solid ${OXBLOOD}` }}
                />
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.3em]">Attendance</p>
                <p className="font-anton text-6xl leading-none md:text-7xl">
                  <Counter to={350} duration={2} />
                </p>
                <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.3em]">students · admitted</p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="max-w-md text-base leading-relaxed md:text-[1.05rem]" style={{ color: "rgba(26,20,13,0.8)" }}>
                {winterBall.body}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Polaroid strip — photo slots */}
        <div className="relative mt-16 md:mt-20">
          <Reveal>
            <p className="font-hand text-center text-2xl md:text-3xl" style={{ color: GOLD_DEEP }}>
              from the night —
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap items-start justify-center gap-6 md:gap-10">
            {POLAROIDS.map((p, i) => (
              <div key={p.src} className="relative">
                <Polaroid src={p.src} caption={p.caption} rotate={p.rotate} index={i} />
              </div>
            ))}
          </div>

          {/* The night, on film — li_locked.in reel */}
          <Reveal delay={0.2}>
            <div className="mt-12 flex justify-center">
              <a
                href="https://www.instagram.com/reel/DVPv0z0ke0b/"
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group inline-flex items-center gap-3 px-7 py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-all duration-300"
                style={{ border: `2px solid ${OXBLOOD}`, color: OXBLOOD }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = OXBLOOD;
                  e.currentTarget.style.color = "#f6eed9";
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
      </div>
    </section>
  );
}
