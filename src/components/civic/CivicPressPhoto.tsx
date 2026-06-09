"use client";

import { motion, useReducedMotion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

type Variant = "full-bleed" | "frame";

interface CivicPressPhotoProps {
  src: string;
  alt: string;
  caption: string;
  subCaption?: string;
  variant?: Variant;
  className?: string;
  /** Aspect ratio string e.g. "16 / 9" or "4 / 3" */
  aspect?: string;
  priority?: boolean;
}

/**
 * Documentary press photo component for the Civic page.
 * variant="full-bleed" — edge-to-edge with a scrim caption bar (newsprint style).
 * variant="frame"      — bordered frame with red accent marks (editorial pull-quote).
 */
export function CivicPressPhoto({
  src,
  alt,
  caption,
  subCaption,
  variant = "frame",
  className,
  aspect = "16 / 9",
  priority = false,
}: CivicPressPhotoProps) {
  const reduced = useReducedMotion();

  if (variant === "full-bleed") {
    return (
      <Reveal className={cn("relative w-full overflow-hidden", className)}>
        <motion.div
          className="group relative w-full overflow-hidden"
          style={{ aspectRatio: aspect }}
          data-cursor-hover
          whileHover={reduced ? {} : { scale: 1.012 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Photo */}
          <Photo src={src} alt={alt} priority={priority} className="h-full w-full object-cover" />

          {/* Red duotone tint overlay — subtle, bleeds out on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(192,57,43,0.10) 0%, rgba(192,57,43,0.04) 40%, transparent 70%)",
            }}
          />

          {/* Bottom scrim + caption */}
          <div
            className="absolute bottom-0 left-0 right-0 border-t border-white/20 px-4 py-3 md:px-6 md:py-4"
            style={{ background: "rgba(20,17,13,0.72)", backdropFilter: "blur(2px)" }}
          >
            <div className="flex items-end justify-between gap-4">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-white/80">
                {caption}
              </p>
              {subCaption && (
                <p className="shrink-0 font-mono text-[0.58rem] uppercase tracking-widest text-white/40">
                  {subCaption}
                </p>
              )}
            </div>
          </div>

          {/* Corner registration marks */}
          {(["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r"] as const).map(
            (pos) => (
              <span
                key={pos}
                aria-hidden
                className={`absolute h-4 w-4 border-[var(--accent)] ${pos}`}
              />
            )
          )}
        </motion.div>
      </Reveal>
    );
  }

  /* variant = "frame" */
  return (
    <Reveal className={cn("relative", className)}>
      <div
        className="group relative border border-[var(--line)] bg-[var(--bg-2)]"
        data-cursor-hover
      >
        {/* Red accent top rule */}
        <div className="h-[2px] w-full bg-[var(--accent)]" />

        {/* Photo */}
        <div className="relative overflow-hidden" style={{ aspectRatio: aspect }}>
          <motion.div
            className="h-full w-full"
            whileHover={reduced ? {} : { scale: 1.035 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Photo src={src} alt={alt} priority={priority} className="h-full w-full object-cover" />
          </motion.div>
        </div>

        {/* Caption bar */}
        <div className="border-t border-[var(--line)] px-4 py-2.5 md:px-5 md:py-3">
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">
            {caption}
          </p>
          {subCaption && (
            <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">
              {subCaption}
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}
