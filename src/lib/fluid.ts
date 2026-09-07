import type { Transition } from "motion/react";

/* ────────────────────────────────────────────────────────────────────
   Fluid — the motion vocabulary for the built world.

   Apple describes springs with two designer-facing numbers rather than the
   physics triplet: DAMPING RATIO (overshoot; 1.0 settles flat, <1 bounces) and
   RESPONSE (how fast it reaches the target, in seconds — not a duration; a
   spring has none). Motion's `bounce` + `duration` spring API maps onto those
   almost one to one, so the presets below are written in Apple's terms and
   translated once, here.

   House rule: critically damped everywhere by default. Bounce is only ever
   earned by a gesture that carried momentum — a flick, a drag release. A menu
   that merely faded in has no business overshooting.
   ──────────────────────────────────────────────────────────────────── */

/** damping 1.0 · response 0.4 — moving or repositioning something on screen. */
export const SPRING_MOVE: Transition = { type: "spring", bounce: 0, duration: 0.4 };

/** damping 1.0 · response 0.3 — a control responding to a tap. Snappier. */
export const SPRING_SNAP: Transition = { type: "spring", bounce: 0, duration: 0.3 };

/** damping 0.8 · response 0.3 — a sheet or drawer the user dragged. */
export const SPRING_SHEET: Transition = { type: "spring", bounce: 0.2, duration: 0.3 };

/** damping 0.8 · response 0.4 — the landing of a thrown / flicked object. */
export const SPRING_FLICK: Transition = { type: "spring", bounce: 0.2, duration: 0.4 };

/**
 * Strong easings. The built-in CSS/JS `ease-out` is too weak to read as
 * deliberate at UI durations; these are the curves the whole world uses.
 * `ease-in` never appears — it delays the exact moment the user is watching.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/**
 * Where a flick is *going*, not where it was released — the exponential decay
 * iOS actually ships (`v²/2a` from a physics textbook is not it). Snap to the
 * target nearest this point and a small flick throws the deck a long way.
 *
 * @param velocity px/s at release
 * @param decelerationRate 0.998 ≈ normal scroll feel, 0.99 ≈ snappier
 */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary. A hard stop reads as "frozen"; this
 * reads as "responsive, but there is nothing more here."
 *
 * @param overshoot how far past the bound the pointer has dragged
 * @param dimension the size of the thing being dragged (its viewport width)
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/**
 * A short rolling history of pointer positions. Release velocity has to come
 * from the last few moves, not from the single final one — one stray sample at
 * the end of a drag otherwise decides where the whole deck lands.
 */
export class VelocityTracker {
  private samples: { v: number; t: number }[] = [];

  /** Window in ms. Long enough to be stable, short enough to feel like *now*. */
  constructor(private readonly window = 110) {}

  reset(value: number, time = performance.now()) {
    this.samples = [{ v: value, t: time }];
  }

  push(value: number, time = performance.now()) {
    this.samples.push({ v: value, t: time });
    while (this.samples.length > 2 && time - this.samples[0].t > this.window) {
      this.samples.shift();
    }
  }

  /** px/s over the retained window. Zero if the pointer has effectively stopped. */
  velocity(): number {
    if (this.samples.length < 2) return 0;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = last.t - first.t;
    if (dt <= 0) return 0;
    return ((last.v - first.v) / dt) * 1000;
  }
}

/** Movement in px before a drag commits to a direction, so a tap stays a tap. */
export const DRAG_HYSTERESIS = 8;

/** Space left above a section when scrolling to it, so it does not sit flush. */
export const SCROLL_LEAD = 72;

/**
 * The document-absolute top of an element, minus the lead.
 *
 * Not `element.offsetTop`, which Lenis's `scrollTo(el)` uses internally: every
 * section here lives inside `World`, which is `position: relative`, so
 * `offsetTop` is measured from the world rather than from the document and
 * every jump lands short by the world's own offset.
 */
export function scrollTargetFor(el: Element): number {
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - SCROLL_LEAD);
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function isFinePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}
