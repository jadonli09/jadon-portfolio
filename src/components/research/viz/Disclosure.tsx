"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { EASE } from "@/lib/motion";

/**
 * One openable detail. The row is a 72px target with a 20px label, because a
 * thing you are meant to click should look like one.
 */
export function Disclosure({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const id = useId();

  return (
    <div className="border-b border-[var(--line)]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-6 py-6 text-left transition-colors duration-200 hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-[clamp(1.35rem,2.2vw,1.9rem)] leading-[1.2] text-[var(--fg)] transition-colors duration-200 group-hover:text-[var(--accent)]">
            {title}
          </span>
          {hint ? (
            <span className="mt-1.5 block text-[1rem] leading-[1.5] text-[var(--muted)]">
              {hint}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center border border-[var(--line)] text-[var(--muted)] transition-colors duration-200 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
        >
          {open ? <Minus className="size-5" /> : <Plus className="size-5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={id}
            key="body"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-10 pt-1">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
