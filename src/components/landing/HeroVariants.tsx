"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SENTENCE_DOORS, type SentenceDoor } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

/**
 * Alternative heroes under review — pick one with `/?hero=facets|editorial|reel`.
 * Each one shows the seven worlds up front instead of a rotating role line.
 */

const DOORS = Object.values(SENTENCE_DOORS) as SentenceDoor[];
/** Verb shown for each world, capitalised for display. */
const verb = (d: SentenceDoor) => (d.id === "lockedin" ? "Documents" : d.id === "about" ? "Lives" : d.word[0].toUpperCase() + d.word.slice(1));

/* ─────────────────────────── A · FACETS ─────────────────────────── */

/** Seven photo slices across the screen; hovering one opens it up. */
export function HeroFacets() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="relative h-[100svh] min-h-[520px] w-full overflow-hidden bg-[#07070a]">
      <div className="absolute inset-0 flex flex-col md:flex-row" onMouseLeave={() => setActive(null)}>
        {DOORS.map((d, i) => {
          const on = active === i;
          return (
            <Link
              key={d.id}
              href={d.href}
              data-cursor-hover
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group relative min-h-0 min-w-0 overflow-hidden outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ flexGrow: on ? 4 : 1, flexBasis: 0 }}
            >
              <motion.img
                src={asset(d.photo)}
                alt=""
                initial={{ scale: 1.25, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08 * i, duration: 1.2, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700"
                style={{ filter: on ? "none" : "grayscale(0.9) brightness(0.42)" }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-1 transition-opacity duration-500"
                style={{ background: d.color, opacity: on ? 1 : 0 }}
              />
              <span
                className="absolute bottom-6 left-5 whitespace-nowrap font-display text-3xl text-white transition-[opacity,translate] duration-500 md:text-5xl"
                style={{ opacity: on ? 1 : 0, translate: on ? "0 0" : "0 16px" }}
              >
                {verb(d)}.
              </span>
            </Link>
          );
        })}
      </div>
      <h1 className="pointer-events-none absolute inset-x-0 top-1/2 z-[2] -translate-y-1/2 text-center font-anton text-[min(19vw,30svh)] leading-none tracking-tight text-white [text-shadow:0_6px_40px_rgba(0,0,0,0.55)]">
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "-0.01em" }}
          transition={{ delay: 0.5, duration: 1.4, ease: EASE }}
        >
          JADON LI
        </motion.span>
      </h1>
    </section>
  );
}

/* ───────────────────────── B · EDITORIAL ───────────────────────── */

/** Paper page: the name and seven verbs on the left, one photo that answers on the right. */
export function HeroEditorial() {
  const [i, setI] = useState(0);
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    if (hovering) return;
    const id = setInterval(() => setI((p) => (p + 1) % DOORS.length), 2600);
    return () => clearInterval(id);
  }, [hovering]);
  const d = DOORS[i];

  return (
    <section className="relative grid min-h-[100svh] w-full grid-cols-1 bg-[#f1ece2] text-[#121214] md:grid-cols-[1.05fr_1fr]">
      <div className="flex flex-col justify-end px-6 pb-10 pt-28 md:px-12 md:pb-14">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE }}
          className="font-anton text-[min(21vw,24svh)] leading-[0.82] tracking-tight"
        >
          JADON
          <br />
          LI
        </motion.h1>
        <ul
          className="mt-8 flex flex-wrap gap-x-5 gap-y-1 md:mt-10"
          onMouseLeave={() => setHovering(false)}
        >
          {DOORS.map((door, k) => (
            <li key={door.id}>
              <Link
                href={door.href}
                data-cursor-hover
                onMouseEnter={() => {
                  setHovering(true);
                  setI(k);
                }}
                className="font-display text-2xl transition-colors duration-300 md:text-4xl"
                style={{ color: k === i ? door.accent : "rgba(18,18,20,0.32)" }}
              >
                {verb(door)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative h-[52svh] overflow-hidden md:h-auto">
        <AnimatePresence initial={false}>
          <motion.img
            key={d.id}
            src={asset(d.photo)}
            alt=""
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute bottom-6 left-6 right-6 max-w-md text-lg leading-snug text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.6)] md:bottom-10 md:left-10"
          >
            {d.desc}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────────────────────── C · REEL ─────────────────────────── */

const REEL_MS = 3200;

/** Full-bleed reel through the seven worlds, story-style segments along the bottom. */
export function HeroReel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setI((p) => (p + 1) % DOORS.length), REEL_MS);
    return () => clearTimeout(id);
  }, [i]);
  const d = DOORS[i];

  return (
    <section className="relative h-[100svh] min-h-[520px] w-full overflow-hidden bg-[#07070a]">
      <AnimatePresence initial={false}>
        <motion.img
          key={d.id}
          src={asset(d.photo)}
          alt=""
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9 }, scale: { duration: REEL_MS / 1000 + 1, ease: "linear" } }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,7,10,0.15),rgba(7,7,10,0.7))]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="font-anton text-[min(20vw,28svh)] leading-[0.85] tracking-tight [text-shadow:0_8px_40px_rgba(0,0,0,0.45)]">
          JADON LI
        </h1>
        <div className="mt-4 font-display text-3xl leading-tight md:text-5xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={d.id}
              initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -14, opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="block"
              style={{ color: d.color }}
            >
              {verb(d)}.
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-x-5 bottom-8 flex gap-2 md:inset-x-12">
        {DOORS.map((door, k) => (
          <button
            key={door.id}
            type="button"
            aria-label={verb(door)}
            data-cursor-hover
            onClick={() => setI(k)}
            className="group h-8 flex-1"
          >
            <span className="relative block h-1 overflow-hidden rounded-full bg-white/25 transition-[height] group-hover:h-1.5">
              <span
                key={k === i ? `on-${i}` : "off"}
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={
                  k < i
                    ? { width: "100%" }
                    : k === i
                      ? { width: "100%", animation: `reel-fill ${REEL_MS}ms linear both` }
                      : { width: 0 }
                }
              />
            </span>
          </button>
        ))}
      </div>
      <style>{`@keyframes reel-fill { from { width: 0 } to { width: 100% } }`}</style>
    </section>
  );
}
