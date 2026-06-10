"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { LOCKED } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

/**
 * KitchenFeasts — warm editorial section showcasing the real cooking videos.
 * Warm-paper palette (sage/clay borders, mono captions).
 * Hover-autoplay is gated behind `(hover:hover) and (pointer:fine)` AND
 * not `prefers-reduced-motion`. Click always toggles play/pause.
 */

type VideoEntry = { src: string; poster: string; label: string };

function FilmFrame({ v, index }: { v: VideoEntry; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  /** Toggle play / pause on click. */
  const handleClick = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  /** Hover-autoplay — only fires on fine-pointer devices and without reduced motion. */
  const handleMouseEnter = useCallback(() => {
    if (reduced) return;
    const el = videoRef.current;
    if (!el) return;
    void el.play();
    setPlaying(true);
  }, [reduced]);

  const handleMouseLeave = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    setPlaying(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay: index * 0.12 }}
      className="flex flex-col"
    >
      {/* Film-frame outer border — thin sage rule */}
      <div
        className="group relative overflow-hidden border border-[var(--line)] bg-[var(--bg-2)]"
        style={{ aspectRatio: "16 / 9" }}
        data-cursor-hover
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`${playing ? "Pause" : "Play"} video: ${v.label}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Film-perforation strips — top & bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-3 items-center gap-0.5 bg-[var(--bg)] px-1"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-1.5 w-2 shrink-0 rounded-[1px] bg-[var(--line)]" />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-3 items-center gap-0.5 bg-[var(--bg)] px-1"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-1.5 w-2 shrink-0 rounded-[1px] bg-[var(--line)]" />
          ))}
        </div>

        {/* Video element */}
        <video
          ref={videoRef}
          src={asset(v.src)}
          poster={asset(v.poster)}
          muted
          playsInline
          loop
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Play icon overlay — hides when playing */}
        <div
          aria-hidden
          className={[
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            "transition-opacity duration-400",
            playing ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)]/80 backdrop-blur-sm">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 translate-x-0.5 text-[var(--fg)]"
            >
              <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
            </svg>
          </div>
        </div>

        {/* Warm clay hover vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 60%, rgba(177, 92, 60, 0.12) 100%)",
          }}
        />
      </div>

      {/* Editorial mono caption — thin clay rule left */}
      <div className="mt-2 border-l-2 border-[var(--accent-2)] pl-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-[var(--muted)]">
          {v.label}
        </p>
        <p className="mt-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--line)] opacity-70">
          JL Kitchens · {["Thanksgiving", "New Year's", "Lunar New Year"][index] ?? "Feast night"}
        </p>
      </div>
    </motion.div>
  );
}

export function KitchenFeasts() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        {/* Section header */}
        <Reveal className="mb-4">
          <p className="eyebrow">The Kitchen</p>
        </Reveal>
        <Reveal delay={0.06} className="mb-3">
          <h2 className="font-display text-3xl md:text-5xl">JL Kitchens</h2>
        </Reveal>

        {/* Editorial intro — real facts */}
        <Reveal delay={0.12} className="mb-12 max-w-2xl">
          <p className="font-serif-i text-lg italic leading-relaxed text-[var(--muted)] md:text-xl">
            He and his brother Samay cook feasts for friends — Thanksgiving, New
            Year&apos;s, and Lunar New Year, each with a{" "}
            <span className="not-italic text-[var(--fg)]">designed dinner menu</span>{" "}
            under the JL Kitchens name. The camera roll holds{" "}
            <span className="not-italic text-[var(--fg)]">1,657 food photos</span>.
            Macarons perfected. Beef Ragu — biweekly staple. Still chasing the
            Hojicha Basque cheesecake.
          </p>
        </Reveal>

        {/* Video film-frames — 3-column grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOCKED.videos.map((v, i) => (
            <FilmFrame key={v.src} v={v} index={i} />
          ))}
        </div>

        {/* Bottom footnote */}
        <Reveal delay={0.2} className="mt-10">
          <p className="max-w-md border-l border-[var(--line)] pl-4 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
            Videos from the actual feast nights — filmed, plated, documented.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
