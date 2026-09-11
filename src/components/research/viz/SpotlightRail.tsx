"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type RailItem = { key: string; label: string; note: string };

/**
 * A grid of chips you sweep a cursor across, with the caption beside them.
 *
 * Eight techniques or nine genes, each with its own caption, is a wall of
 * text. One caption at a time is a sentence — and the beam that tracks the
 * cursor across each chip is drawn in the chapter's own accent, so it reads as
 * fluorescence on the Fusarium chapter and as the volcano's up-regulation
 * colour on the gout one.
 *
 * `columns` fixes the chip grid so the set lands on a known number of rows
 * (8 across 4 columns is two rows); the caption then sits in its own column to
 * the right instead of pushing everything below it down.
 */
export function SpotlightRail({
  items,
  label,
  columns = 4,
  mono = true,
}: {
  items: readonly RailItem[];
  /** Names the group for screen readers. */
  label: string;
  columns?: 3 | 4;
  mono?: boolean;
}) {
  const [active, setActive] = useState(items[0]?.key ?? "");
  const reduced = useReducedMotion();
  const current = items.find((i) => i.key === active) ?? items[0];

  return (
    <div className="grid gap-x-10 gap-y-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start">
      <ul
        aria-label={label}
        className={cn(
          "grid list-none gap-2.5 p-0",
          columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {items.map((item) => {
          const on = item.key === active;
          return (
            <li key={item.key} className="min-w-0">
              <button
                type="button"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                onPointerEnter={() => setActive(item.key)}
                onFocus={() => setActive(item.key)}
                aria-pressed={on}
                className={cn(
                  "relative flex h-full w-full items-center overflow-hidden border px-4 py-3 text-left text-[0.95rem] leading-[1.3] transition-colors duration-200",
                  mono && "font-mono",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                  on
                    ? "border-[var(--accent)] text-[var(--fg)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]",
                )}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 transition-opacity duration-200 [background:radial-gradient(110px_circle_at_var(--mx,50%)_var(--my,50%),color-mix(in_srgb,var(--accent)_30%,transparent),transparent_70%)]"
                  style={{ opacity: on ? 1 : 0 }}
                />
                <span className="relative">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="min-h-[3.4rem] border-l-2 border-[var(--accent)] pl-5 lg:mt-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current?.key}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="text-[1.06rem] leading-[1.6] text-[var(--fg)]"
          >
            {current?.note}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
