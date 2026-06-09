import type { Variants, Transition } from "motion/react";

/** Shared cinematic easing — a refined custom cubic-bezier used site-wide. */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const baseTransition: Transition = { duration: 0.9, ease: EASE };

/** Reveal upward with a soft blur-in. Pair with whileInView. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

/** Stagger container — children should use `revealUp` or `fade`. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Per-character / per-word reveal for kinetic headlines. */
export const lineWord: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1, ease: EASE } },
};
