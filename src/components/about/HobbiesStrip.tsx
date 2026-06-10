"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { EASE } from "@/lib/motion";

/**
 * HobbiesStrip — a light "Also true" section with a playful editorial
 * badge-row listing real hobbies from the ASB deck.
 * Warm-paper palette, quiet restraint, small and charming.
 */

type Hobby = {
  label: string;
  note?: string;
  muted?: boolean; // slightly de-emphasised (the "not a fan" ones)
};

const HOBBIES: Hobby[] = [
  { label: "Skiing" },
  { label: "Swimming" },
  { label: "Running" },
  { label: "Hiking" },
  { label: "Ping Pong" },
  { label: "Almost all exercises", note: "burpees and squats 👎", muted: true },
  { label: "Power nap champion", note: "don't sleep on the power of naps" },
];

function HobbyBadge({ h, index }: { h: Hobby; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.055 }}
      className="relative"
    >
      <button
        data-cursor-hover
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={h.note ? `${h.label}: ${h.note}` : h.label}
        className={[
          "group relative inline-flex flex-col items-start gap-1 border px-4 py-2.5 text-left",
          "transition-colors duration-300",
          h.muted
            ? "border-[var(--line)] bg-[var(--bg-2)] text-[var(--muted)]"
            : "border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_5%,var(--bg))]",
        ].join(" ")}
      >
        <span
          className={[
            "font-display text-base leading-none md:text-lg",
            h.muted ? "line-through decoration-[var(--muted)] decoration-[1.5px]" : "",
          ].join(" ")}
        >
          {h.label}
        </span>

        {/* Tooltip note — slides in below */}
        {h.note && (
          <motion.span
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
            transition={{ duration: 0.22, ease: EASE }}
            aria-hidden={!hovered}
            className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]"
          >
            {h.note}
          </motion.span>
        )}
      </button>
    </motion.div>
  );
}

export function HobbiesStrip() {
  return (
    <section className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-9 md:py-24">
        <Reveal className="mb-8">
          <p className="eyebrow">Also true</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            Outside the worlds
          </h2>
        </Reveal>

        {/* Badge row — wraps naturally */}
        <div className="flex flex-wrap gap-3">
          {HOBBIES.map((h, i) => (
            <HobbyBadge key={h.label} h={h} index={i} />
          ))}
        </div>

        {/* Power nap pull-quote */}
        <Reveal delay={0.25} className="mt-10">
          <blockquote className="max-w-md border-l-2 border-[var(--accent-2)] pl-4">
            <p className="font-serif-i text-base italic leading-relaxed text-[var(--muted)] md:text-lg">
              &ldquo;Don&apos;t be sleeping on the power of naps.&rdquo;
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--line)]">
              — JL, ASB President & Power-Nap Champion
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
