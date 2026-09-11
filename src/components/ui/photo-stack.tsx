"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type StackPhoto = { src: string; alt: string; caption: string };

/**
 * Hero-04 stacked offset photo cards, made interactive: cards rest in the
 * signature diagonal pile and fan out on hover/focus, revealing each caption.
 *
 * `compact` is the version that lives in the rag beside a headline — short
 * enough to sit inside one line of display type without landing on the line
 * below it, so it fans sideways rather than upward.
 */
const SIZES = {
  full: {
    frame: "h-64 w-[22rem] max-w-full md:h-60 md:w-[30rem]",
    card: "left-0 top-12 h-36 w-60",
    rest: (i: number) => ({ x: i * 24, y: -i * 24, rotate: 0, scale: 1 }),
    open: (i: number) => ({ x: i * 88, y: -i * 26, rotate: (i - 1) * 4, scale: 1.02 }),
    caption: "text-[0.55rem]",
  },
  compact: {
    frame: "h-28 w-[21rem]",
    card: "left-0 top-1 h-24 w-36",
    rest: (i: number) => ({ x: i * 15, y: -i * 4, rotate: 0, scale: 1 }),
    open: (i: number) => ({ x: i * 64, y: -i * 3, rotate: (i - 1) * 3, scale: 1.02 }),
    caption: "text-[0.5rem]",
  },
} as const;

export function PhotoStack({
  photos,
  variant = "full",
}: {
  photos: StackPhoto[];
  variant?: keyof typeof SIZES;
}) {
  const [open, setOpen] = useState(false);
  const s = SIZES[variant];

  return (
    <div
      className={cn("relative", s.frame)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      role="group"
      aria-label="Recent work photos"
    >
      {photos.map((p, i) => (
        <motion.div
          key={p.src}
          className={cn(
            "absolute cursor-pointer overflow-hidden rounded-md border bg-[var(--bg-2)] shadow-lg",
            s.card,
          )}
          style={{ zIndex: i }}
          initial={false}
          animate={open ? s.open(i) : s.rest(i)}
          transition={{ duration: 0.55, ease: EASE, delay: i * 0.04 }}
          whileHover={{ scale: 1.06, zIndex: 10 }}
        >
          <img src={p.src} alt={p.alt} className="h-full w-full object-cover" />
          {/* Caption strip, revealed when fanned out */}
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-[var(--fg)]/85 px-2 py-1"
            initial={false}
            animate={{ opacity: open ? 1 : 0, y: open ? 0 : 8 }}
            transition={{ duration: 0.35, ease: EASE, delay: open ? 0.15 + i * 0.05 : 0 }}
          >
            <p
              className={cn(
                "truncate font-mono uppercase tracking-widest text-[var(--bg)]",
                s.caption,
              )}
            >
              {p.caption}
            </p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
