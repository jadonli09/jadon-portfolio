"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FUS_IMAGES, FUS_PROTOCOL, FUS_WHY } from "../lab/content";
import { Photo } from "@/components/primitives/Photo";
import { aspectFrom } from "../sections/Section";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** FUS_PROTOCOL.step -> FUS_WHY key. Step I's reasoning is about the linearization it ends on. */
const WHY_FOR: Record<string, keyof typeof FUS_WHY> = {
  plasmid_extraction: "linearize",
  protoplast_generation: "protoplast",
  peg_transformation: "peg",
  selection: "hygromycin",
};

/** Every step has its own panel on the poster, so every step shows it. */
const FIGURE_FOR: Record<string, keyof typeof FUS_IMAGES> = {
  plasmid_extraction: "extraction",
  protoplast_generation: "protoplast",
  peg_transformation: "transformation",
  selection: "selection",
};

/**
 * Four steps, one at a time — the poster's own diagram for each, and the one
 * line saying why the step has to exist. The method text is in the diagram; it
 * does not need repeating underneath.
 */
export function ProtocolRun() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const step = FUS_PROTOCOL[active];
  const why = FUS_WHY[WHY_FOR[step.step]];
  const fig = FUS_IMAGES[FIGURE_FOR[step.step]];

  function onKeyDown(e: React.KeyboardEvent) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + FUS_PROTOCOL.length) % FUS_PROTOCOL.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Protocol steps"
        onKeyDown={onKeyDown}
        className="relative grid grid-cols-2 gap-px bg-[var(--line)] sm:grid-cols-4"
      >
        {FUS_PROTOCOL.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.step}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`protocol-tab-${i}`}
              aria-selected={on}
              aria-controls="protocol-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "group relative flex min-h-[6rem] flex-col items-start gap-2 px-5 py-5 text-left transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]",
                on ? "bg-[var(--bg-3)]" : "bg-[var(--bg-2)] hover:bg-[var(--bg-3)]",
              )}
            >
              <span
                className={cn(
                  "font-serif text-[1.7rem] leading-none transition-colors",
                  on ? "text-[var(--accent)]" : "text-[var(--muted)] group-hover:text-[var(--fg)]",
                )}
              >
                {s.n}
              </span>
              <span
                className={cn(
                  "text-[1.02rem] leading-[1.35] transition-colors",
                  on ? "text-[var(--fg)]" : "text-[var(--muted)] group-hover:text-[var(--fg)]",
                )}
              >
                {s.title}
              </span>
              {on ? (
                <motion.span
                  layoutId="protocol-marker"
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]"
                  transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="protocol-panel"
        aria-labelledby={`protocol-tab-${active}`}
        className="border border-t-0 border-[var(--line)] bg-[var(--bg-2)] p-5 sm:p-7"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.step}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <figure className="m-0 border border-[var(--line)]">
              <div className="relative w-full bg-white" style={aspectFrom(fig.dims)}>
                <Photo src={fig.src} alt={fig.alt} className="object-contain" />
              </div>
            </figure>
            {why ? (
              <p className="mt-6 max-w-[64ch] border-l-2 border-[var(--accent)] pl-5 text-[1.06rem] leading-[1.65] text-[var(--fg)]">
                {why}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
