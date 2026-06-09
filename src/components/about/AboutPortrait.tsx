"use client";

import { motion, useReducedMotion } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { EASE } from "@/lib/motion";

/**
 * Large editorial portrait — warm paper, generous negative space.
 * Sits in the About hero beside the headline text.
 * Subtle grayscale→color reveal on hover; reduced-motion-safe.
 */
export function AboutPortrait() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="relative hidden md:block"
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
    >
      {/* Frame container — portrait aspect */}
      <div
        className="group relative w-[260px] overflow-hidden"
        style={{ aspectRatio: "3 / 4" }}
        data-cursor-hover
      >
        {/* Photo — grayscale by default, color on hover */}
        <motion.div
          className="absolute inset-0"
          animate={reduced ? {} : undefined}
        >
          <Photo
            src="/img/headshot1.jpg"
            alt="Jadon Li"
            priority
            className={[
              "h-full w-full object-cover object-top",
              "transition-[filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "grayscale group-hover:grayscale-0",
            ].join(" ")}
          />
        </motion.div>

        {/* Warm paper tone overlay — fades out on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
          style={{ background: "rgba(236,231,221,0.18)", mixBlendMode: "multiply" }}
        />

        {/* Hover caption — slides up */}
        <div
          className={[
            "absolute bottom-0 left-0 right-0 translate-y-full bg-[var(--fg)]/90 px-4 py-3",
            "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0",
          ].join(" ")}
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--bg)]">
            Jadon Li · Fremont, CA
          </p>
        </div>
      </div>

      {/* Thin editorial rule below */}
      <div className="mt-3 h-px w-full bg-[var(--line)]" />
      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
        Portrait
      </p>
    </motion.div>
  );
}
