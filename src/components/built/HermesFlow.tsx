"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { asset } from "@/lib/base";
import { EASE_OUT } from "@/lib/fluid";
import { RUN_STATS } from "@/lib/demos/hermes";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   HermesFlow — the nightly job, drawn as the job.

   Hermes has no interface. Its whole surface is one story a day, so a
   screenshot of the output explains the output and nothing about the machine.
   This is the machine: four stages, and a line that runs through them once as
   you arrive.

   Why this one gets to animate, when most of the page does not:

     frequency  rare — a section of a portfolio, read once
     purpose    EXPLANATION. The line travelling from stage to stage is the
                claim the section is making: that this runs start to finish,
                by itself, every weekday. A static diagram states it; the
                travelling line demonstrates it.
     speed      explanatory tier, so the ~2s run is inside budget
     function   a diagram, not data being read — motion helps rather than
                getting in the way of something you are trying to use

   It runs ONCE and stops lit. A pipeline that loops forever would say the
   opposite of what it is here to say, and would keep moving on a page nobody
   is looking at any more.
   ──────────────────────────────────────────────────────────────────── */

const STAGES = [
  {
    n: "01",
    title: "Add the accounts",
    detail: `${RUN_STATS.clubsProcessed} club, ASB, class and team handles go on the watchlist.`,
  },
  {
    n: "02",
    title: "Scrape",
    detail: "Every new post from every one of them, every weekday.",
  },
  {
    n: "03",
    title: "Extract to a sheet",
    detail: "Claude pulls out the room, the time and what is actually on.",
  },
  {
    n: "04",
    title: "Calendar, then a story",
    detail: "The day lands on the calendar and becomes a story for @msjclubs.",
  },
];

/** Time the line spends crossing one stage. Four of these is the whole run. */
const STEP_MS = 520;

export function HermesFlow({ shot }: { shot: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();

  // -1 is "not started"; the last index is "finished, everything lit".
  const [step, setStep] = useState(-1);

  /*
    Reduced motion still gets the diagram, just not the journey — it is derived
    rather than set, so the run never starts and there is no state write on
    mount to cascade a second render out of.
  */
  const reached = reduce ? STAGES.length - 1 : step;

  useEffect(() => {
    if (!inView || reduce) return;
    const timers = STAGES.map((_, i) =>
      window.setTimeout(() => setStep(i), i * STEP_MS),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduce]);

  const progress = (reached + 1) / STAGES.length;

  return (
    <div ref={ref} className="mt-10">
      <p className="t-label">How it runs</p>

      <div className="relative mt-6">
        {/*
          The rail. One line, drawn once, scaled from its left edge — the
          cheapest possible way to move a full-width element, and the only
          property here that touches the compositor.
        */}
        <div
          aria-hidden
          className="absolute left-0 top-[0.72rem] hidden h-px w-full bg-[var(--line)] lg:block"
        />
        <motion.div
          aria-hidden
          className="absolute left-0 top-[0.72rem] hidden h-px w-full origin-left bg-[var(--accent)] lg:block"
          initial={{ transform: "scaleX(0)" }}
          animate={{ transform: `scaleX(${progress})` }}
          transition={{ duration: STEP_MS / 1000, ease: EASE_OUT }}
        />

        <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {STAGES.map((s, i) => {
            const lit = i <= reached;
            return (
              <motion.li
                key={s.n}
                className="relative"
                // Unlit stages recede rather than hide: the shape of the whole
                // pipeline is legible from the first frame, and only the
                // progress through it is what changes.
                animate={{ opacity: lit ? 1 : 0.35 }}
                transition={{ duration: 0.24, ease: EASE_OUT }}
              >
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 hidden size-[0.55rem] rounded-full ring-4 ring-white transition-colors duration-200 ease-[var(--ease-out)] lg:block",
                    lit ? "bg-[var(--accent)]" : "bg-[var(--line-2)]",
                  )}
                  style={{ marginTop: "0.45rem" }}
                />
                <p className="t-label mt-0 lg:mt-5">
                  {s.n} · {s.title}
                </p>
                <p className="t-small mt-2 max-w-[22rem] text-[0.9rem] leading-snug">
                  {s.detail}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* ── What comes out the end ── */}
      <div className="mt-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[15rem_1fr] md:gap-12">
        <motion.div
          className="mx-auto w-full max-w-[15rem] md:mx-0"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={
            reached >= STAGES.length - 1
              ? { opacity: 1, transform: "translateY(0px)" }
              : { opacity: 0, transform: "translateY(12px)" }
          }
          // Arrives as the line finishes, so the artifact is the pipeline's
          // result rather than something that was always sitting there.
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          <div className="relative w-full" style={{ aspectRatio: "9/16" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(shot)}
              alt="A Hermes daily schedule story as posted to @msjclubs"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full rounded-xl object-contain [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.04))_drop-shadow(0_18px_40px_rgba(0,0,0,0.16))]"
            />
          </div>
        </motion.div>

        <div>
          <p className="t-label text-[var(--accent)]">The output</p>
          <p className="t-title mt-3 max-w-2xl">
            One clean schedule story to @msjclubs, every weekday.
          </p>
        </div>
      </div>
    </div>
  );
}
