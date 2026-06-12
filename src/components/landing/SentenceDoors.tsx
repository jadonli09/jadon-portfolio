"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SENTENCE_DOORS, SENTENCE_TICKER, type SentenceDoor } from "@/lib/data";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { BoardLabel, useBoard } from "@/components/landing/BoardSurface";

const D = SENTENCE_DOORS;

/** The sentence, tokenized. `after` is punctuation that hugs the previous word. */
type Token = { text?: string; door?: SentenceDoor; rot?: number; after?: string };
const TOKENS: Token[] = [
  { text: "He" },
  { door: D.leads, rot: -2.2, after: "," },
  { door: D.films, rot: 1.7, after: "," },
  { door: D.researches, rot: -1.2, after: "," },
  { door: D.builds, rot: 2, after: "," },
  { door: D.competes, rot: -1.7 },
  { text: "—" },
  { text: "and" },
  { door: D.documents, rot: 1.1 },
  { text: "—" },
  { text: "one" },
  { door: D.person, rot: -2.1, after: "," },
  { text: "locked" },
  { text: "in." },
];

const DOORS = Object.values(D) as SentenceDoor[];

/**
 * The landing overview: one giant sentence pinned to the evidence board.
 * Every door word is a physically pinned paper tag — pin head, paper, tilt,
 * arrow — with a red thread running down to its evidence on the record.
 * Hover (or first tap) floods the background with that world's photo and
 * opens a stat peek; click (or second tap) enters.
 */
export function SentenceDoors() {
  const { activeWorld, setActiveWorld, registerSource } = useBoard();
  const reduce = useReducedMotion();
  // The token masks clip during the slide-up reveal, then release so the
  // stat peeks (absolutely positioned below each word) can escape them.
  const [revealed, setRevealed] = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <section
      id="doors"
      className="relative flex min-h-[68svh] scroll-mt-24 items-center overflow-hidden md:min-h-[76svh]"
      onMouseLeave={() => setActiveWorld(null)}
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
          style={{ opacity: activeWorld === d.id ? (reduce ? 0.14 : 0.26) : 0 }}
        />
      ))}
      {/* flood melts into the board above and below, only while a photo shows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: activeWorld ? 1 : 0,
          background: "linear-gradient(to bottom, #08080c, transparent 32%, transparent 68%, #08080c)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 md:px-9 md:py-20">
        <div className="mb-9">
          <BoardLabel>Who he is · in one sentence</BoardLabel>
        </div>

        <div className="lg:grid lg:grid-cols-[7fr_4fr] lg:items-center lg:gap-14">
          <div>
        <motion.h2
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-18% 0px" }}
          transition={{ staggerChildren: 0.09, delayChildren: 0.1 }}
          onViewportEnter={() => {
            if (!revealTimer.current) revealTimer.current = setTimeout(() => setRevealed(true), 2400);
          }}
          onAnimationComplete={() => setRevealed(true)}
          className="font-display max-w-5xl text-[2.6rem] leading-[1.52] tracking-tight md:text-[4.1rem] md:leading-[1.46] lg:max-w-none lg:text-[3.3rem] lg:leading-[1.5] xl:text-[3.7rem] xl:leading-[1.48]"
        >
          {TOKENS.map((t, i) => (
            <span
              key={i}
              ref={(el) => {
                if (t.door) registerSource(t.door.id, el);
              }}
              className={cn(
                "inline-block pb-[0.14em] pt-[0.26em] align-top [margin-right:0.28em]",
                revealed || reduce ? "overflow-visible" : "overflow-hidden",
              )}
            >
              <motion.span
                variants={{ hidden: { y: "115%" }, show: { y: 0, transition: { duration: 0.7, ease: EASE } } }}
                className="inline-block"
              >
                {t.door ? <Door door={t.door} rot={t.rot ?? 0} /> : t.text}
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
          className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[#8a8a99]"
        >
          {SENTENCE_TICKER.map((s, i) => (
            <span key={s} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden>·</span>}
              {s}
            </span>
          ))}
        </motion.div>
          </div>

          {/* the case card — hover a word, read what it means */}
          <div className="hidden lg:block">
            <DoorCard door={DOORS.find((d) => d.id === activeWorld) ?? null} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Right-column dossier: explains the hovered verb, and is itself the door. */
function DoorCard({ door }: { door: SentenceDoor | null }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex min-h-[460px] items-center">
      <AnimatePresence mode="wait" initial={false}>
        {door ? (
          <motion.div
            key={door.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 1.2 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, rotate: 0, transition: { duration: 0.16 } }}
            transition={{ duration: 0.28, ease: EASE }}
            className="w-full"
          >
            <Link href={door.href} data-cursor-hover className="group block bg-[#f6f1e4] p-3 pb-5 shadow-[0_22px_50px_rgba(0,0,0,0.7)]">
              <span
                aria-hidden
                className="absolute -top-1.5 left-1/2 z-10 size-3 -translate-x-1/2 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.8)]"
                style={{ background: "radial-gradient(circle at 35% 30%, #f0d48a, #8a6312)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(door.photo)} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="px-1.5">
                <p className="mt-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em]" style={{ color: door.accent }}>
                  {door.num} · {door.kicker}
                </p>
                <h3 className="font-display mt-2 text-[1.55rem] leading-[1.12] tracking-tight text-[#1d1b16] xl:text-[1.8rem]">
                  {door.title}
                </h3>
                <p className="font-display mt-3 text-[0.95rem] leading-relaxed text-[#3d3a33]">{door.lede}</p>
                <p className="mt-3.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#8a8273]">{door.peek}</p>
                <span
                  className="mt-4 flex items-center gap-1.5 font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] transition-transform duration-300 group-hover:translate-x-1.5"
                  style={{ color: door.accent }}
                >
                  {door.cta} <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.14 } }}
            transition={{ duration: 0.3 }}
            className="w-full border-2 border-dashed border-white/15 px-8 py-14 text-center"
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[#8a8a99]">The seven doors</p>
            <p className="font-display mt-4 text-xl leading-relaxed text-[#cfcfd8]">
              Hover any pinned word —<br />
              this card shows the world behind it.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2.5">
              {DOORS.map((d) => (
                <span key={d.id} aria-hidden className="size-2 rounded-full" style={{ background: d.color }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Door({ door, rot }: { door: SentenceDoor; rot: number }) {
  const { activeWorld, setActiveWorld } = useBoard();
  const open = activeWorld === door.id;
  // keep the peek card inside the viewport for words near the screen edges
  const peekRef = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const el = peekRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      const pad = 10;
      if (r.left < pad) setShift((s) => s + (pad - r.left));
      else if (r.right > window.innerWidth - pad) setShift((s) => s + (window.innerWidth - pad - r.right));
    });
    return () => cancelAnimationFrame(id);
  }, [open]);
  return (
    <Link
      href={door.href}
      data-cursor-hover
      className="relative inline-block not-italic"
      onMouseEnter={() => setActiveWorld(door.id)}
      onClick={(e) => {
        // no-hover device: first tap arms the door, second tap follows the link
        if (!open && window.matchMedia("(hover: none)").matches) {
          e.preventDefault();
          setActiveWorld(door.id);
        }
      }}
    >
      {/* the pinned paper tag */}
      <motion.span
        className="relative inline-block bg-[#f6f1e4] px-[0.2em] pb-[0.05em] italic"
        style={{ color: door.accent }}
        animate={{
          rotate: open ? 0 : rot,
          y: open ? -4 : 0,
          scale: open ? 1.04 : 1,
          boxShadow: open ? "0 16px 36px rgba(0,0,0,0.72)" : "0 8px 20px rgba(0,0,0,0.55)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {/* gold pin */}
        <span
          aria-hidden
          className="absolute -top-[0.14em] left-1/2 z-10 size-[0.2em] -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{ background: "radial-gradient(circle at 35% 30%, #f0d48a, #8a6312)" }}
        />
        {/* mobile-only thread stub (the real threads are desktop SVG) */}
        <span
          aria-hidden
          className="absolute -top-[0.06em] left-1/2 h-[0.55em] w-[1.5px] origin-top rotate-[16deg] bg-[#c43e2c]/80 md:hidden"
        />
        {door.word}
        <span aria-hidden className="not-italic" style={{ fontSize: "0.5em", verticalAlign: "0.55em" }}>
          {" "}↗
        </span>
      </motion.span>

      {/* stat peek — a small pinned card under the word */}
      <span
        ref={peekRef}
        aria-hidden={!open}
        className="pointer-events-none absolute left-1/2 top-[118%] z-20 block w-60 -translate-x-1/2 rounded-[2px] border border-white/20 bg-[#0e0e14]/95 p-2.5 font-mono text-[0.6rem] not-italic normal-case tracking-wide text-[#f4f1ea] shadow-2xl transition-all duration-300 lg:hidden"
        style={{ opacity: open ? 1 : 0, transform: `translateX(calc(-50% + ${shift}px)) translateY(${open ? 0 : 6}px)` }}
      >
        <span
          className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{ background: "radial-gradient(circle at 35% 30%, #f0d48a, #8a6312)" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(door.photo)} alt="" className="mb-2 h-20 w-full rounded-sm object-cover" />
        <span className="font-display block text-[0.95rem] font-bold leading-tight">{door.title}</span>
        <span className="font-display mt-1 block text-[0.74rem] leading-snug">{door.desc}</span>
        <span className="mt-1.5 block text-[0.55rem] text-[#9a9aa8]">{door.peek}</span>
        <span className="mt-1.5 flex items-center gap-1.5 font-bold" style={{ color: door.color }}>
          enter <ArrowRight className="size-3" />
        </span>
      </span>
    </Link>
  );
}
