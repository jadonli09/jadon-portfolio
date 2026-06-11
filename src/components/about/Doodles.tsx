"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Hand-drawn SVG doodle kit for the scrapbook About page.
 * Every mark draws itself (pathLength) when scrolled into view.
 * Decorative only — all aria-hidden.
 */

type DoodleProps = {
  className?: string;
  /** Stroke colour — defaults to the world accent (signal orange). */
  stroke?: string;
  delay?: number;
};

function useDraw(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: { pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 1.1, ease: "easeInOut" as const, delay },
  };
}

const strokeStyle = (stroke?: string) => ({
  stroke: stroke ?? "var(--accent)",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** Wobbly underline scribble — two overlapping passes, like a marker. */
export function Scribble({ className, stroke, delay = 0 }: DoodleProps) {
  const draw = useDraw(delay);
  return (
    <svg aria-hidden viewBox="0 0 220 24" className={cn("overflow-visible", className)}>
      <motion.path
        {...draw}
        d="M4 14 C 40 8, 80 18, 118 12 S 190 8, 216 13 M14 19 C 60 14, 120 22, 204 17"
        strokeWidth={3.4}
        style={strokeStyle(stroke)}
      />
    </svg>
  );
}

/** Loopy curl arrow (reference image's signature squiggle). */
export function LoopArrow({ className, stroke, delay = 0 }: DoodleProps) {
  const draw = useDraw(delay);
  return (
    <svg aria-hidden viewBox="0 0 120 90" className={cn("overflow-visible", className)}>
      <motion.path
        {...draw}
        d="M6 12 C 38 2, 64 18, 56 36 C 49 51, 26 48, 30 33 C 34 19, 64 20, 80 36 C 92 48, 98 60, 102 74 M93 64 l9 11 11 -7"
        strokeWidth={2.6}
        style={strokeStyle(stroke)}
      />
    </svg>
  );
}

/** Rough ellipse for circling a word — drawn in one nervous pass. */
export function CircleScribble({ className, stroke, delay = 0 }: DoodleProps) {
  const draw = useDraw(delay);
  return (
    <svg aria-hidden viewBox="0 0 200 70" className={cn("overflow-visible", className)}>
      <motion.path
        {...draw}
        d="M100 8 C 158 4, 196 18, 193 36 C 190 56, 138 66, 88 63 C 38 60, 6 48, 9 31 C 12 14, 60 5, 118 7"
        strokeWidth={2.8}
        style={strokeStyle(stroke)}
      />
    </svg>
  );
}

/** Four-point hand-drawn sparkle / asterisk. */
export function Sparkle({ className, stroke, delay = 0 }: DoodleProps) {
  const draw = useDraw(delay);
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={cn("overflow-visible", className)}>
      <motion.path
        {...draw}
        d="M20 3 L20 16 M20 24 L20 37 M3 20 L16 20 M24 20 L37 20"
        strokeWidth={3}
        style={strokeStyle(stroke)}
      />
    </svg>
  );
}

/** Long flowing thread — the orange string that wanders across the reference. */
export function Thread({ className, stroke, delay = 0 }: DoodleProps) {
  const draw = useDraw(delay);
  return (
    <svg aria-hidden viewBox="0 0 600 160" className={cn("overflow-visible", className)} preserveAspectRatio="none">
      <motion.path
        {...draw}
        d="M2 30 C 90 110, 150 -20, 240 60 C 300 115, 320 140, 396 96 C 450 64, 430 10, 380 26 C 340 40, 380 96, 470 88 C 530 82, 560 60, 598 40"
        strokeWidth={2}
        style={strokeStyle(stroke)}
        transition={{ duration: 2, ease: "easeInOut", delay }}
      />
    </svg>
  );
}

/** Tiny hand-drawn mountain — used on empty summit-photo slots. */
export function MountainDoodle({ className, stroke, delay = 0 }: DoodleProps) {
  const draw = useDraw(delay);
  return (
    <svg aria-hidden viewBox="0 0 80 48" className={cn("overflow-visible", className)}>
      <motion.path
        {...draw}
        d="M4 44 L26 12 L36 26 L50 4 L76 44 M44 14 L50 8 L56 15"
        strokeWidth={2.6}
        style={strokeStyle(stroke)}
      />
    </svg>
  );
}

/** Hand-drawn summit flag for the PR year. */
export function FlagDoodle({ className, stroke, delay = 0 }: DoodleProps) {
  const draw = useDraw(delay);
  return (
    <svg aria-hidden viewBox="0 0 36 44" className={cn("overflow-visible", className)}>
      <motion.path
        {...draw}
        d="M8 42 C 9 28, 9 14, 8 4 M8 5 C 18 1, 24 9, 33 5 C 32 11, 32 14, 33 19 C 24 23, 17 15, 8 19"
        strokeWidth={2.4}
        style={strokeStyle(stroke)}
      />
    </svg>
  );
}
