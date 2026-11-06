"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SENTENCE_DOORS } from "@/lib/data";
import { EASE } from "@/lib/motion";

/**
 * Landing hero, "blurred paragraph" take. Four short leads are sharp; the
 * rest of the paragraph sits blurred around them. Each pill is a button:
 * pressing it brings the clause after it into focus (flashing the world's
 * colour, then settling), and that clause may hold the next pill. Once a
 * pill has been opened it becomes a link into its world. Opening a pill
 * calls `onPill`, which the covers hero uses to deal that world's card.
 * The counter tracks how much of the paragraph is open.
 */

export type DoorKey = keyof typeof SENTENCE_DOORS;
type Pill = { pill: string; label: string; door: DoorKey };
/** `{ em }` is set in italics (species names). */
type Piece = string | { em: string } | Pill;
/** A clause of the paragraph. `after` is the pill that opens it; leads have none. */
type Clause = { id: string; after?: string; parts: Piece[] };

const p = (pill: string, label: string, door: DoorKey): Pill => ({ pill, label, door });

/** One pill per world, so every card in the stack has a way in. */
const PILLS = {
  jadon: p("jadon", "Jadon", "person"),
  asb: p("asb", "ASB President", "leads"),
  mayor: p("mayor", "lead intern", "films"),
  red: p("red", "red", "researches"),
  build: p("build", "AcornPrep", "builds"),
  locked: p("locked", "@li_locked.in", "documents"),
  ncs: p("ncs", "NCS title", "competes"),
};
const ALL_PILLS = Object.values(PILLS);

/**
 * The paragraph, in reading order: who, school, the lab and the builds, the
 * camera. Each run opens on a sharp lead (no `after`).
 */
const CLAUSES: Clause[] = [
  { id: "l1", parts: ["Hey, I'm ", PILLS.jadon] },
  { id: "c1", after: "jadon", parts: [" Li, a senior at Mission San Jose. I love cooking for my friends, climbing Mission Peak, and running at sunset."] },
  { id: "l2", parts: [" I serve as ", PILLS.asb] },
  { id: "c2", after: "asb", parts: [" after three years as elected class president, and started on our school's first ", PILLS.ncs] },
  { id: "c3", after: "ncs", parts: [" team."] },
  { id: "l3", parts: [" I engineered a human pathogen to glow ", PILLS.red] },
  { id: "c4", after: "red", parts: [" at UMass Amherst, tagging clinical ", { em: "Fusarium oxysporum" }, " with mRFP to study how it interacts with its host. I also turned my eleven AP exams into ", PILLS.build] },
  { id: "c5", after: "build", parts: [", a study app with 2,000+ users."] },
  { id: "l4", parts: [" I document the whole pursuit on ", PILLS.locked] },
  { id: "c6", after: "locked", parts: [" (2.3M plays), and as the Mayor of Fremont's ", PILLS.mayor] },
  { id: "c7", after: "mayor", parts: [", I lead civic engagement initiatives and film my city's stories."] },
];

/** how long a freshly opened clause keeps its world colour */
const FLASH_MS = 1600;

export function RevealParagraph({ onPill }: { onPill?: (door: DoorKey) => void }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [fresh, setFresh] = useState<string | null>(null);
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
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: EASE }}
        className="font-grotesk text-[clamp(1.2rem,5vw,1.6rem)] font-medium leading-[1.5] md:text-[1.75rem] lg:text-[min(1.75vw,3.5svh)] tracking-[-0.012em] text-[#f4efe6]"
      >
        {CLAUSES.map((c) => {
          const sharp = isSharp(c);
          const flash = fresh !== null && c.after === fresh;
          const color = c.after ? SENTENCE_DOORS[PILLS[c.after as keyof typeof PILLS].door].color : undefined;
          let word = 0;
          return (
            <span key={c.id}>
              {c.parts.map((part, k) => {
                if (typeof part === "string" || "em" in part) {
                  const text = typeof part === "string" ? part : part.em;
                  const italic = typeof part !== "string";
                  // split on spaces so the focus can sweep left to right, word by word
                  return text.split(/(\s+)/).map((w, j) => {
                    if (!w) return null;
                    if (/^\s+$/.test(w)) return <Fragment key={`${k}-${j}`}>{w}</Fragment>;
                    const d = word++;
                    return (
                      <span
                        key={`${k}-${j}`}
                        className={`transition-[filter,opacity,color] ease-out ${italic ? "italic" : ""}`}
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
                if (used) {
                  return (
                    <Link
                      key={part.pill}
                      href={door.href}
                      data-pill={part.pill}
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
                    onClick={(e) => {
                      reveal(part.pill, e.detail === 0);
                      onPill?.(part.door);
                    }}
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
      </motion.div>
      <p aria-live="polite" className="mt-6 font-grotesk text-base tabular-nums text-[#a59c92] lg:mt-8 lg:text-lg">
        <span className="sr-only">Opened </span>
        {open.size}/{ALL_PILLS.length}
      </p>
    </div>
  );
}
