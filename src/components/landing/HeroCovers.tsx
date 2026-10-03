"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HERO_COVERS, PROFILE, SENTENCE_DOORS } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

/**
 * The landing hero: one sentence on the left, a fanned stack of "LOCKED IN"
 * covers on the right. Each word deals its world's cover; left alone, the
 * stack cycles, and the active word's underline is the timer.
 * Covers with a `cut` put the subject in front of the masthead. Clicking
 * either card peeking out behind the top one deals it forward.
 * Desktop splits the screen in half: the sentence left, the stack right.
 */

const DUR = 4200;
const N = HERO_COVERS.length;
const COVERS = HERO_COVERS.map((c) => ({ ...c, d: SENTENCE_DOORS[c.door] }));

/** Sentence text for each cover, in order: name, five verbs, the tail. */
const WORDS = COVERS.map((c, i) =>
  i === 0 ? "Jadon Li" : i === N - 1 ? `${c.d.word}.` : i === N - 2 ? c.d.word : `${c.d.word},`,
);

/** Fan position → transform. 0 is the top cover; the rest tuck in behind it. */
const FAN = [
  { transform: "none", filter: "brightness(1)", opacity: 1 },
  { transform: "translateX(-14%) rotate(-5deg) scale(0.95)", filter: "brightness(0.5)", opacity: 1 },
  { transform: "translateX(-25%) rotate(-9deg) scale(0.9)", filter: "brightness(0.32)", opacity: 1 },
  { transform: "translateX(-30%) rotate(-11deg) scale(0.86)", filter: "brightness(0.3)", opacity: 0 },
];
const LEAVING = { transform: "translateX(72%) rotate(14deg)", filter: "brightness(1)", opacity: 0 };

export function HeroCovers() {
  const reduce = useReducedMotion();
  const [cur, setCur] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  /** a word is hovered: its cover holds and its underline sits full */
  const [held, setHeld] = useState(false);
  const remaining = useRef(DUR);
  const startedAt = useRef(0);
  const swiped = useRef(false);
  const swipeX = useRef<number | null>(null);

  const curRef = useRef(0);
  const show = useCallback((n: number) => {
    if (curRef.current === n) return;
    setLeaving(curRef.current);
    curRef.current = n;
    remaining.current = DUR;
    setCur(n);
  }, []);

  // clear the flying-off cover once it has left
  useEffect(() => {
    if (leaving === null) return;
    const t = setTimeout(() => setLeaving(null), 750);
    return () => clearTimeout(t);
  }, [leaving]);

  // auto-advance; pausing banks the time left so the underline and the timer agree
  useEffect(() => {
    if (paused || reduce) return;
    startedAt.current = Date.now();
    const t = setTimeout(() => show((cur + 1) % N), remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
    };
  }, [cur, paused, reduce, show]);

  const color = COVERS[cur].d.color;

  return (
    <section className="relative w-full overflow-hidden bg-[#120e0c] pb-12 pt-24 lg:grid lg:h-[100svh] lg:min-h-[680px] lg:grid-cols-2 lg:items-center lg:pb-0 lg:pt-16">
      {/* tint of the active world, one layer per cover so it can crossfade */}
      {COVERS.map((c, i) => (
        <div
          key={c.door}
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-[900ms]"
          style={{
            opacity: i === cur ? 1 : 0,
            background: `radial-gradient(70% 85% at 76% 48%, ${c.d.color}40, transparent 70%)`,
          }}
        />
      ))}

      {/* THE SENTENCE */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: EASE }}
        onMouseLeave={() => {
          if (!held) return;
          remaining.current = DUR;
          setHeld(false);
          setPaused(false);
        }}
        className="relative z-[2] px-6 lg:pl-[5.5vw] lg:pr-[2vw]"
      >
        <h1 className="font-serif text-[clamp(2.1rem,8.6vw,3.2rem)] leading-[1.12] tracking-[-0.005em] text-[#8a8178] md:text-[3.6rem] lg:text-[min(5.5vw,10svh)] lg:leading-[1.08]">
          {COVERS.map((c, i) => {
            const on = i === cur;
            return (
              <span key={c.door}>
                {i === N - 1 ? " and " : i > 0 ? " " : ""}
                <Link
                  href={c.d.href}
                  onMouseEnter={() => {
                    show(i);
                    setHeld(true);
                    setPaused(true);
                  }}
                  onFocus={() => show(i)}
                  className={`relative inline-block whitespace-nowrap transition-colors duration-300 hover:text-[#f4efe6] ${
                    i === 0
                      ? "mr-[0.08em] font-anton text-[1.32em] leading-none text-[#f4efe6]"
                      : "italic"
                  }`}
                  style={on ? { color } : undefined}
                >
                  {WORDS[i]}
                  {on && (
                    <span
                      key={`bar-${cur}`}
                      aria-hidden
                      className="absolute bottom-[0.02em] left-0 h-[0.055em] w-full origin-left rounded-full"
                      style={{
                        background: color,
                        animation: reduce || held ? "none" : `cover-fill ${DUR}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                        transform: reduce || held ? "scaleX(1)" : undefined,
                      }}
                    />
                  )}
                </Link>
              </span>
            );
          })}
        </h1>
        <p className="mt-8 text-center text-[0.95rem] leading-relaxed text-[#a59c92] lg:mt-10 lg:text-left lg:text-xl">
          {PROFILE.school}, {PROFILE.gradeNote} · {PROFILE.city}
        </p>
      </motion.div>

      {/* THE STACK */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
        className="relative z-[1] mx-auto mt-10 w-[min(68vw,46svh)] translate-x-[8%] lg:mt-0 lg:w-[min(31vw,60svh)] lg:translate-x-[10%]"
        style={{ aspectRatio: "3 / 4", containerType: "inline-size" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={(e) => {
          swipeX.current = e.clientX;
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          if (swipeX.current === null) return;
          const dx = e.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 30) {
            swiped.current = true;
            show((cur + (dx < 0 ? 1 : N - 1)) % N);
          }
        }}
        onClickCapture={(e) => {
          if (swiped.current) {
            e.preventDefault();
            swiped.current = false;
          }
        }}
      >
        {COVERS.map((c, i) => {
          const pos = (i - cur + N) % N;
          const isLeaving = i === leaving;
          const look = isLeaving ? LEAVING : FAN[Math.min(pos, FAN.length - 1)];
          return (
            <Link
              key={c.door}
              href={c.d.href}
              tabIndex={pos === 0 ? 0 : -1}
              onClick={(e) => {
                // a card peeking out of the fan deals itself to the top instead of navigating
                if (pos === 0) return;
                e.preventDefault();
                show(i);
              }}
              aria-hidden={pos !== 0}
              draggable={false}
              className="group absolute inset-0 select-none overflow-hidden rounded-[0.4cqw] bg-black shadow-[0_2.4cqw_6cqw_rgba(0,0,0,0.55)]"
              style={{
                ...look,
                zIndex: isLeaving ? N + 1 : N - pos,
                transformOrigin: "50% 100%",
                pointerEvents: pos <= 2 && !isLeaving ? "auto" : "none",
                transition: reduce
                  ? "opacity 0.3s"
                  : "transform 0.75s cubic-bezier(0.22,1,0.36,1), filter 0.75s, opacity 0.75s",
              }}
            >
              {/* L0 — the photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(c.img)}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.32), transparent 30%)" }}
              />
              {/* L1 — the masthead */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-[2.6cqw] text-center font-anton text-[23.5cqw] leading-[0.9] tracking-[-0.005em]"
                style={{ color: c.d.color }}
              >
                LOCKED IN
              </div>
              {/* L2 — the subject, in front of the masthead */}
              {c.cut && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={asset(c.cut)}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {/* L3 — the cover lines */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.82))" }}
              />
              <div className="absolute inset-x-[6cqw] bottom-[6cqw] text-white">
                <p className="text-balance font-anton text-[10cqw] uppercase leading-[0.95] [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
                  {c.line}
                </p>
                <p className="mt-[2cqw] text-balance text-[max(14px,4.3cqw)] font-medium leading-snug text-white/90">
                  {c.sub}
                </p>
                <span
                  className="mt-[3.5cqw] inline-flex h-12 items-center rounded-full px-5 text-base font-semibold text-white transition-[opacity,translate] duration-300 md:translate-y-1.5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100"
                  style={{ background: c.d.accent }}
                >
                  {c.cta} →
                </span>
              </div>
            </Link>
          );
        })}
      </motion.div>

    </section>
  );
}
