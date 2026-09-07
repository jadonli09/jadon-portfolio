"use client";

import { motion, type Variants } from "motion/react";
import { EASE_OUT } from "@/lib/fluid";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   Rise — the built world's scroll-in.

   Purpose: preventing a jarring change. A section arriving all at once, fully
   formed, reads as a repaint; a short lift tells the reader it is new.

   Deliberately cheaper and quieter than the site-wide `Reveal`: transform and
   opacity only (no blur filter — that repaints every frame), 480ms rather than
   900ms, and a 12px lift rather than 28px. At this size the motion is felt,
   not watched.

   Reduced motion needs no branch here: the root `MotionConfig` runs with
   `reducedMotion="user"`, which drops the transform and keeps the fade — which
   is exactly the gentler equivalent, not "no feedback".
   ──────────────────────────────────────────────────────────────────── */

export const rise: Variants = {
  hidden: { opacity: 0, transform: "translateY(12px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.48, ease: EASE_OUT },
  },
};

type RiseProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span" | "p";
  id?: string;
};

export function Rise({ children, className, delay = 0, as = "div", id }: RiseProps) {
  const Comp = motion[as];
  return (
    <Comp
      id={id}
      className={className}
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * Stagger container. 55ms between children — inside the 30–80ms band where a
 * list reads as arriving in order rather than as a queue you wait out.
 */
export function RiseGroup({
  children,
  className,
  stagger = 0.055,
  delayChildren = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: "div" | "ul";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={cn(className)}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-6% 0px" }}
    >
      {children}
    </Comp>
  );
}

/** A child of `RiseGroup`. Inherits the parent's stagger timing. */
export function RiseItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={rise}>
      {children}
    </Comp>
  );
}
