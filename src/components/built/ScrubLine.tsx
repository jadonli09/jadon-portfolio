"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   ScrubLine — a headline that lights up word by word as you scroll it in.

   Apple's signature statement-line move. Not a scroll *trigger*: the words are
   bound to scroll position, so scrolling back up unlights them. The reader is
   scrubbing the sentence, and that reversibility is the whole reason it feels
   like an object rather than a canned animation.

   Purpose: explanation. It paces a long statement so it is read as a sentence
   instead of skimmed as a block — which is exactly what was wrong with the
   paragraphs this replaced.

   Rationed on purpose. Used on the page's few statement lines; a page where
   every heading does this is a page where none of them mean anything.
   ──────────────────────────────────────────────────────────────────── */

export function ScrubLine({
  text,
  className,
  /** Words after this fraction of the phrase stay muted — the "second half"
   *  of a two-tone Apple headline. Omit for a single-tone line. */
  muteFrom,
  /** The type step this line sits on. A chapter's tagline is a subcaption
   *  under the product's name now, not the statement line it used to be. */
  baseClass = "t-title",
  style,
}: {
  text: string;
  className?: string;
  muteFrom?: number;
  baseClass?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();

  /**
   * The scrub is measured against the LINE's own travel, not the section's:
   * from the line sitting near the bottom of the viewport to it reaching the
   * upper third. That is a fixed ~two-thirds of a screen of scroll whatever
   * the section's height — anchoring to `end` instead made the range as long
   * as the section, so on a tall chapter the sentence lit before the reader
   * had even reached it.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.3"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={cn(baseClass, className)} style={style}>
      {words.map((w, i) => (
        <Word
          key={`${w}-${i}`}
          word={w}
          index={i}
          total={words.length}
          progress={scrollYProgress}
          muted={muteFrom !== undefined && i >= Math.floor(words.length * muteFrom)}
          reduce={!!reduce}
        />
      ))}
    </p>
  );
}

function Word({
  word,
  index,
  total,
  progress,
  muted,
  reduce,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  muted: boolean;
  reduce: boolean;
}) {
  // Each word owns a slice of the scroll, and the slices overlap so the
  // sentence washes in rather than ticking word by word like a stopwatch.
  const start = (index / total) * 0.75;
  const end = start + 0.4 / total + 0.12;

  // On a white page an unlit word is grey, not invisible: 0.22 of #1d1d1f is
  // still legible, so the sentence can be read ahead of the scrub instead of
  // being withheld until you scroll for it.
  const lit = muted ? 0.45 : 1;
  const opacity = useTransform(progress, [start, end], [0.22, lit]);

  return (
    <>
      <motion.span
        className="inline-block"
        style={reduce ? { opacity: lit } : { opacity }}
      >
        {word}
      </motion.span>
      {index < total - 1 ? " " : null}
    </>
  );
}
