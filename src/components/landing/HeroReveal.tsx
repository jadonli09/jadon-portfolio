"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SENTENCE_DOORS } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

/**
 * Landing hero, "blurred paragraph" take. Four short leads are sharp; the
 * rest of the paragraph sits blurred around them. Each pill is a button:
 * pressing it brings the clause after it into focus (flashing the world's
 * colour, then settling), and that clause may hold the next pill. Once a
 * pill has been opened it becomes a link into its world. Hovering a pill
 * fades its cover photo in behind the text. The counter tracks how much of
 * the paragraph is open.
 */

type DoorKey = keyof typeof SENTENCE_DOORS;
type Pill = { pill: string; label: string; door: DoorKey; img: string };
type Piece = string | Pill;
/** A clause of the paragraph. `after` is the pill that opens it; leads have none. */
type Clause = { id: string; after?: string; parts: Piece[] };

const p = (pill: string, label: string, door: DoorKey, img: string): Pill => ({ pill, label, door, img });

const PILLS = {
  jadon: p("jadon", "Jadon", "person", "/img/covers/person.jpg"),
  peak: p("peak", "Mission Peak", "person", "/img/missionpeak2026-1.jpg"),
  asb: p("asb", "ASB President", "leads", "/img/covers/leads.jpg"),
  mayor: p("mayor", "the Mayor", "films", "/img/covers/films.jpg"),
  red: p("red", "red", "researches", "/img/covers/researches.jpg"),
  build: p("build", "build", "builds", "/img/covers/builds.jpg"),
  ncs: p("ncs", "NCS", "competes", "/img/covers/competes.jpg"),
  locked: p("locked", "@li_locked.in", "documents", "/img/covers/documents.jpg"),
};
const ALL_PILLS = Object.values(PILLS);

/** The paragraph, in reading order. Every fact here comes from data.ts. */
const CLAUSES: Clause[] = [
  { id: "l1", parts: ["Hey, I'm ", PILLS.jadon] },
  { id: "c1", after: "jadon", parts: [" Li, a senior at Mission San Jose High in Fremont. Every birthday since I was twelve, I run ", PILLS.peak] },
  { id: "c2", after: "peak", parts: [" alone. I've journaled since eighth grade, and I cook feasts with designed menus for my friends."] },
  { id: "l2", parts: [" I'm the ", PILLS.asb] },
  { id: "c3", after: "asb", parts: [", after three years as class president. I also film for ", PILLS.mayor] },
  { id: "c4", after: "mayor", parts: [" of Fremont: civic stories like Voices of Fremont that pull 20k+ views a video."] },
  { id: "l3", parts: [" In a lab, I made a fungus glow ", PILLS.red] },
  { id: "c5", after: "red", parts: [", six weeks at UMass Amherst after placing 3rd in comp bio at ACSEF. When I'm not at the bench, I ", PILLS.build] },
  { id: "c6", after: "build", parts: [": AcornPrep, an AP study app 500+ students use and the #1 result on Google, then NotebookLI."] },
  { id: "l4", parts: [" On the court, I started for our first ", PILLS.ncs] },
  { id: "c7", after: "ncs", parts: [" title in school history. And I document all of it on ", PILLS.locked] },
  { id: "c8", after: "locked", parts: [": 100 reels, 2.3M plays and counting."] },
];

/** how long a freshly opened clause keeps its world colour */
const FLASH_MS = 1600;

export function HeroReveal() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [fresh, setFresh] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  const reveal = (id: string, keyboard: boolean) => {
    setOpen((s) => new Set(s).add(id));
    // the button is replaced by a link; keep a keyboard user's place on it
    if (keyboard)
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>(`[data-pill="${id}"]`)?.focus({ preventScroll: true }),
      );
    setFresh(id);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFresh(null), FLASH_MS);
  };

  const isSharp = (c: Clause) => !c.after || open.has(c.after);

  return (
    <section className="relative flex h-[100svh] min-h-[620px] w-full items-center justify-center overflow-hidden bg-[#0d0b0a] px-4 sm:px-8">
      {/* the photo behind the hovered pill */}
      {ALL_PILLS.map((pl) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={pl.pill}
          src={asset(pl.img)}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-700"
          style={{ opacity: hover === pl.pill ? 0.2 : 0, filter: "blur(2px)" }}
        />
      ))}
      {/* vignette, so the edges stay dark whatever is behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(75% 70% at 50% 50%, transparent 30%, rgba(13,11,10,0.92) 100%)" }}
      />
      {/* film grain */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09] mix-blend-overlay">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* how much of the paragraph is open */}
      <p
        aria-live="polite"
        className="absolute right-5 top-24 z-[2] font-grotesk text-base tabular-nums text-[#f4efe6]/70 sm:right-8"
      >
        <span className="sr-only">Opened </span>
        {open.size}/{ALL_PILLS.length}
      </p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: EASE }}
        onMouseLeave={() => setHover(null)}
        className="relative z-[1] max-w-[58rem] text-center font-grotesk text-[clamp(1.25rem,min(2.3vw,4.2svh),2.1rem)] font-medium leading-[1.45] tracking-[-0.012em] text-[#f4efe6]"
      >
        {CLAUSES.map((c) => {
          const sharp = isSharp(c);
          const flash = fresh !== null && c.after === fresh;
          const color = c.after ? SENTENCE_DOORS[PILLS[c.after as keyof typeof PILLS].door].color : undefined;
          let word = 0;
          return (
            <span key={c.id}>
              {c.parts.map((part, k) => {
                if (typeof part === "string") {
                  // split on spaces so the focus can sweep left to right, word by word
                  return part.split(/(\s+)/).map((w, j) => {
                    if (!w) return null;
                    if (/^\s+$/.test(w)) return <Fragment key={`${k}-${j}`}>{w}</Fragment>;
                    const d = word++;
                    return (
                      <span
                        key={`${k}-${j}`}
                        className="transition-[filter,opacity,color] ease-out"
                        style={{
                          filter: sharp ? "blur(0px)" : "blur(7px)",
                          opacity: sharp ? 1 : 0.55,
                          color: flash ? color : undefined,
                          transitionDuration: reduce ? "0ms" : sharp && !flash ? "600ms, 600ms, 900ms" : "600ms",
                          transitionDelay: reduce || !sharp || !flash ? "0ms" : `${d * 28}ms`,
                        }}
                      >
                        {w}
                      </span>
                    );
                  });
                }
                const used = open.has(part.pill);
                const door = SENTENCE_DOORS[part.door];
                const pillClass =
                  "mx-[0.08em] inline-flex h-[1.18em] translate-y-[-0.06em] items-center rounded-full border-[0.055em] px-[0.42em] align-middle text-[0.8em] uppercase leading-none tracking-[0.01em] transition-[background-color,border-color,color,filter,opacity] duration-300";
                const hoverProps = {
                  onMouseEnter: () => setHover(part.pill),
                  onMouseLeave: () => setHover((h) => (h === part.pill ? null : h)),
                  onFocus: () => setHover(part.pill),
                  onBlur: () => setHover((h) => (h === part.pill ? null : h)),
                };
                if (used) {
                  return (
                    <Link
                      key={part.pill}
                      href={door.href}
                      data-pill={part.pill}
                      {...hoverProps}
                      className={`${pillClass} border-transparent bg-[#f4efe6]/20 text-[#f4efe6] hover:bg-[var(--pill)] hover:text-[#0d0b0a]`}
                      style={{ ["--pill" as string]: door.color }}
                      aria-label={`${part.label}: ${door.cta}`}
                    >
                      {part.label}
                      <span aria-hidden className="ml-[0.25em] text-[0.85em]">→</span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={part.pill}
                    type="button"
                    disabled={!sharp}
                    tabIndex={sharp ? 0 : -1}
                    aria-expanded={false}
                    onClick={(e) => reveal(part.pill, e.detail === 0)}
                    {...hoverProps}
                    className={`${pillClass} cursor-pointer border-current hover:border-[var(--pill)] hover:bg-[var(--pill)] hover:text-[#0d0b0a] disabled:cursor-default`}
                    style={{
                      ["--pill" as string]: door.color,
                      filter: sharp ? "blur(0px)" : "blur(7px)",
                      opacity: sharp ? 1 : 0.55,
                      color: flash ? color : undefined,
                    }}
                  >
                    {part.label}
                  </button>
                );
              })}
            </span>
          );
        })}
      </motion.p>
    </section>
  );
}
