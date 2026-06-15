"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type ChannelRowProps = {
  index: string;
  label: string;
  handle: string;
  href: string;
  icon: React.ReactNode;
  /** Whether to open in new tab. False = mailto, stays same tab. */
  external?: boolean;
};

/**
 * A large magnetic channel row with a fill-sweep hover effect.
 * Uses spring motion values for the fill overlay and text color transitions.
 * The magnetic pull is applied to the outer wrapper div (not the anchor)
 * to avoid ref type conflicts with motion.a.
 */
export function ChannelRow({
  index,
  label,
  handle,
  href,
  icon,
  external = true,
}: ChannelRowProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Magnetic pull on wrapper
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 16, mass: 0.35 });
  const sy = useSpring(my, { stiffness: 180, damping: 16, mass: 0.35 });

  // Fill sweep: 0 → 100 (represents percentage of row filled)
  const fillW = useMotionValue(0);
  const springFill = useSpring(fillW, { stiffness: 120, damping: 20 });
  const fillPercent = useTransform(springFill, (v) => `${v}%`);
  const textColor = useTransform(springFill, [0, 55], ["var(--fg)", "#07070a"]);
  const mutedColor = useTransform(springFill, [0, 55], ["var(--muted)", "rgba(7,7,10,0.55)"]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.22);
  }

  function onEnter() {
    fillW.set(100);
  }

  function onLeave() {
    fillW.set(0);
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="group relative"
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        data-cursor-hover
        className={cn(
          "relative flex w-full items-center overflow-hidden border-b border-[var(--line)] first:border-t",
          "px-3 py-4 md:px-4 md:py-6",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
        )}
      >
        {/* Fill sweep overlay */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0"
          style={{
            width: fillPercent,
            background: "linear-gradient(105deg, var(--accent) 0%, var(--accent-2) 100%)",
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex w-full items-center gap-4 md:gap-6">
          {/* Index */}
          <motion.span
            className="w-7 shrink-0 font-mono text-[0.62rem] uppercase tracking-widest"
            style={{ color: mutedColor }}
          >
            {index}
          </motion.span>

          {/* Icon circle */}
          <motion.span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)]"
            style={{ color: textColor }}
          >
            {icon}
          </motion.span>

          {/* Channel label — big editorial type */}
          <motion.span
            className="font-display text-2xl leading-none md:text-4xl lg:text-5xl"
            style={{ color: textColor }}
          >
            {label}
          </motion.span>

          {/* Handle — visible md+ */}
          <motion.span
            className="ml-3 hidden font-mono text-xs tracking-wide md:inline"
            style={{ color: mutedColor }}
          >
            {handle}
          </motion.span>

          {/* Arrow */}
          <motion.span
            className="ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ color: textColor }}
          >
            <ArrowUpRight className="size-5 md:size-7" />
          </motion.span>
        </span>
      </a>
    </motion.div>
  );
}
