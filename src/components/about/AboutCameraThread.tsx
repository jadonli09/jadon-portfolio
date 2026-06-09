"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { ABOUT } from "@/lib/data";

type Thread = { title: string; body: string };

const DRONE_SHOTS = [
  { src: "/img/droneshot1.jpg", label: "Aerial · I" },
  { src: "/img/droneshot2.jpg", label: "Aerial · II" },
  { src: "/img/droneshot3.jpg", label: "Aerial · III" },
  { src: "/img/droneshot4.jpg", label: "Aerial · IV" },
  { src: "/img/droneshot5.jpg", label: "Aerial · V" },
] as const;

/**
 * The Camera thread card — replaces the plain text card with a horizontal
 * film-strip of drone shots. Each frame is 4:3, greyscale→color on hover.
 * Scrolls left/right via drag or click on the arrows.
 */
export function AboutCameraThread({
  thread,
  index,
}: {
  thread: Thread;
  index: number;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /** Snap-scroll one frame left/right. */
  function scroll(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 160, behavior: "smooth" });
  }

  return (
    <Reveal
      className="group relative bg-[var(--bg)] transition-colors hover:bg-[var(--bg-2)] md:col-span-1"
      delay={index * 0.05}
    >
      {/* Header row */}
      <div className="flex items-baseline justify-between px-8 pt-8 md:px-12 md:pt-12">
        <h3 className="font-display text-2xl md:text-3xl">{thread.title}</h3>
        <span className="font-mono text-xs text-[var(--muted)]">0{index + 1}</span>
      </div>

      {/* Body */}
      <p className="mt-4 max-w-md px-8 text-[var(--muted)] md:px-12">{thread.body}</p>

      {/* Film-strip */}
      <div className="relative mt-6">
        {/* Film-perforations top edge */}
        <div
          aria-hidden
          className="pointer-events-none mb-1.5 flex gap-1 overflow-hidden px-8 md:px-12"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-2.5 shrink-0 rounded-sm bg-[var(--line)]"
            />
          ))}
        </div>

        {/* Scrollable strip */}
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-8 pb-4 scrollbar-none md:px-12"
          style={{ scrollbarWidth: "none" }}
        >
          {DRONE_SHOTS.map((shot, i) => (
            <motion.div
              key={shot.src}
              className="relative w-36 shrink-0 snap-start overflow-hidden"
              style={{ aspectRatio: "4 / 3" }}
              data-cursor-hover
              onHoverStart={() => setActive(i)}
              onHoverEnd={() => setActive(null)}
              whileHover={reduced ? {} : { scale: 1.03 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Photo
                src={shot.src}
                alt={shot.label}
                className={cn(
                  "h-full w-full object-cover",
                  "transition-[filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  active === i ? "grayscale-0" : "grayscale"
                )}
              />

              {/* Caption on hover */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-[var(--fg)]/90 px-2 py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-mono text-[0.52rem] uppercase tracking-widest text-[var(--bg)]">
                  {shot.label}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Film-perforations bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none mt-1.5 flex gap-1 overflow-hidden px-8 md:px-12"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-2.5 shrink-0 rounded-sm bg-[var(--line)]"
            />
          ))}
        </div>
      </div>

      {/* Scroll nudge buttons */}
      <div className="flex items-center justify-end gap-2 px-8 pt-3 md:px-12">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => scroll(dir)}
            aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
            className="flex h-6 w-6 items-center justify-center border border-[var(--line)] font-mono text-[0.7rem] text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
          >
            {dir === -1 ? "‹" : "›"}
          </button>
        ))}
      </div>

      {/* Gear progression timeline */}
      <div className="px-8 pb-8 pt-6 md:px-12 md:pb-12">
        <p className="mb-4 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
          Gear progression · FAA Part 107
        </p>
        <div className="relative flex items-start gap-0">
          {/* connecting rule */}
          <div
            aria-hidden
            className="absolute left-[9px] top-[9px] h-px w-[calc(100%-18px)] bg-[var(--line)]"
          />
          {ABOUT.gear.map((item, i) => (
            <GearStop key={item.name} item={item} index={i} total={ABOUT.gear.length} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function GearStop({
  item,
  index,
  total,
}: {
  item: { name: string; note: string };
  index: number;
  total: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isLast = index === total - 1;

  return (
    <div
      className="relative flex flex-1 flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
    >
      {/* dot */}
      <motion.div
        animate={{ scale: hovered ? 1.5 : 1, background: hovered ? "var(--accent-2)" : isLast ? "var(--fg)" : "color-mix(in srgb, var(--fg) 40%, transparent)" }}
        transition={{ duration: 0.25, ease: EASE }}
        className="relative z-10 h-[18px] w-[18px] rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--fg)_40%,transparent)]"
      />
      {/* name */}
      <p
        className="mt-2 text-center font-mono text-[0.58rem] uppercase tracking-widest leading-snug transition-colors duration-200"
        style={{ color: hovered ? "var(--fg)" : "var(--muted)" }}
      >
        {item.name}
      </p>
      {/* note — shows on hover */}
      <motion.p
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}
        className="mt-1 max-w-[5rem] text-center font-serif-i text-[0.62rem] italic leading-tight text-[var(--muted)]"
      >
        {item.note}
      </motion.p>
    </div>
  );
}
