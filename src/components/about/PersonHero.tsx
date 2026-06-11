"use client";

import { motion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { EASE } from "@/lib/motion";
import { LoopArrow, Scribble, Sparkle } from "@/components/about/Doodles";

/**
 * Scrapbook hero — huge ink headline, marker-highlighted intro,
 * and a taped black-and-white portrait print. Doodles draw on load.
 */
export function PersonHero() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 md:px-9 md:pb-28 md:pt-44">
      {/* ghost watermark, like "MRB BOOKS" in the reference */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-[58%] select-none font-anton text-[22vw] uppercase leading-none text-[var(--fg)] opacity-[0.045]"
      >
        Jadon Li
      </span>

      <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-[1.15fr_0.85fr] md:gap-10">
        {/* ── text column ── */}
        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-block border border-[var(--fg)] bg-[var(--bg)] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.3em]"
          >
            06 — The Person
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
            className="mt-7 font-anton text-[4.2rem] uppercase leading-[0.92] tracking-tight md:text-[7.5rem]"
          >
            Hello,
            <br />
            I&apos;m Jadon<span className="text-[var(--accent)]">.</span>
          </motion.h1>

          {/* scribble under the name */}
          <Scribble className="mt-2 w-44 md:w-64" delay={0.9} />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className="mt-9 max-w-xl text-lg leading-relaxed text-[var(--fg)] md:text-xl"
          >
            The rest of the site is the résumé. This page is the person —
            the one who plays ball, cooks feasts for friends, flies cameras,{" "}
            writes it all down, and{" "}
            <span className="marker font-semibold">runs up a mountain every birthday.</span>
          </motion.p>

          {/* handwritten aside */}
          <motion.p
            initial={{ opacity: 0, rotate: -4 }}
            animate={{ opacity: 1, rotate: -2 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            className="font-hand mt-6 max-w-sm text-2xl leading-tight text-[var(--muted)]"
          >
            &ldquo;documenting the grind is the job — this is everything off the clock&rdquo;
          </motion.p>

          {/* scroll chip, like the reference's black square */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12 flex items-center gap-4"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-[var(--fg)] text-[var(--bg)]">
              ↓
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--muted)]">
              Scroll down
            </span>
            <LoopArrow className="hidden w-20 -scale-x-100 md:block" delay={1.1} />
          </motion.div>
        </div>

        {/* ── portrait column ── */}
        <motion.div
          initial={{ opacity: 0, y: 26, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 1.5 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          className="relative mx-auto w-[260px] md:mt-10 md:w-[320px]"
        >
          <div className="polaroid relative p-3 pb-12">
            <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" />
            <div className="overflow-hidden" style={{ aspectRatio: "3 / 4" }} data-cursor-hover>
              <Photo
                src="/img/headshot1.jpg"
                alt="Jadon Li"
                priority
                className="h-full w-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
                style={{ objectPosition: "13% 0%" }}
              />
            </div>
            <p className="font-hand absolute bottom-3 left-4 text-xl text-[var(--fg)]">
              Jadon · Fremont, CA
            </p>
            <p className="absolute bottom-4 right-4 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
              est. 2009
            </p>
          </div>

          {/* sticker bits around the print */}
          <span aria-hidden className="absolute -left-6 -bottom-5 h-7 w-7 rotate-12 bg-[var(--accent)]" />
          <span aria-hidden className="absolute -right-4 top-16 h-4 w-4 -rotate-6 border-2 border-[var(--fg)]" />
          <Sparkle className="absolute -right-9 -top-7 w-8" delay={1.2} />
        </motion.div>
      </div>
    </section>
  );
}
