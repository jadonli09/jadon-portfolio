"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SENTENCE_DOORS, SENTENCE_TICKER, type SentenceDoor } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

const D = SENTENCE_DOORS;

/** The sentence, tokenized. `after` is punctuation that hugs the previous word. */
type Token = { text?: string; door?: SentenceDoor; after?: string };
const TOKENS: Token[] = [
  { text: "He" },
  { door: D.leads, after: "," },
  { door: D.films, after: "," },
  { door: D.researches, after: "," },
  { door: D.builds, after: "," },
  { door: D.competes },
  { text: "—" },
  { text: "and" },
  { door: D.documents },
  { text: "—" },
  { text: "one" },
  { door: D.person, after: "," },
  { text: "locked" },
  { text: "in." },
];

const DOORS = Object.values(D) as SentenceDoor[];

/**
 * The landing overview: one giant sentence where every bold word is a door
 * into a world. Hover (or first tap) floods the background with that world's
 * photo and opens a stat peek; click (or second tap) enters.
 */
export function SentenceDoors() {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <section
      id="doors"
      className="relative flex min-h-[100svh] scroll-mt-24 items-center overflow-hidden"
      onMouseLeave={() => setActive(null)}
    >
      {/* photo floods, one per door, cross-fading behind the words */}
      {DOORS.map((d) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={d.id}
          src={asset(d.photo)}
          alt=""
          aria-hidden
          loading="eager"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: active === d.word ? (reduce ? 0.14 : 0.26) : 0 }}
        />
      ))}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07070a] via-transparent to-[#07070a]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 md:px-9">
        <p className="eyebrow mb-8 text-[#e8b15a]">Who he is, in one sentence</p>

        <motion.h2
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-18% 0px" }}
          transition={{ staggerChildren: 0.09, delayChildren: 0.1 }}
          className="font-display max-w-5xl text-[2.6rem] leading-[1.32] tracking-tight md:text-[4.3rem] md:leading-[1.3]"
        >
          {TOKENS.map((t, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top [margin-right:0.28em]">
              <motion.span
                variants={{ hidden: { y: "115%" }, show: { y: 0, transition: { duration: 0.7, ease: EASE } } }}
                className="inline-block"
              >
                {t.door ? <Door door={t.door} active={active} setActive={setActive} /> : t.text}
                {t.after}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reduce ? 0 : 1.6, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[#8a8a99]"
        >
          {SENTENCE_TICKER.map((s, i) => (
            <span key={s} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden>·</span>}
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Door({
  door,
  active,
  setActive,
}: {
  door: SentenceDoor;
  active: string | null;
  setActive: (w: string | null) => void;
}) {
  const open = active === door.word;
  return (
    <span className="relative inline-block" onMouseEnter={() => setActive(door.word)}>
      <Link
        href={door.href}
        data-cursor-hover
        className="italic transition-[background-color] duration-200 hover:bg-white/10"
        style={{ color: door.color, borderBottom: `3px solid ${door.accent}` }}
        onClick={(e) => {
          // no-hover device: first tap arms the door, second tap follows the link
          if (!open && window.matchMedia("(hover: none)").matches) {
            e.preventDefault();
            setActive(door.word);
          }
        }}
      >
        {door.word}
      </Link>
      {/* stat peek */}
      <span
        aria-hidden={!open}
        className="pointer-events-none absolute left-1/2 top-[112%] z-20 block w-60 -translate-x-1/2 rounded border border-white/20 bg-[#0e0e14]/95 p-2.5 font-mono text-[0.6rem] not-italic normal-case tracking-wide text-[#f4f1ea] shadow-2xl transition-all duration-300"
        style={{ opacity: open ? 1 : 0, transform: `translateX(-50%) translateY(${open ? 0 : 6}px)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(door.photo)} alt="" className="mb-2 h-20 w-full rounded-sm object-cover" />
        {door.peek}
        <span className="mt-1.5 flex items-center gap-1.5 font-bold" style={{ color: door.color }}>
          enter <ArrowRight className="size-3" />
        </span>
      </span>
    </span>
  );
}
