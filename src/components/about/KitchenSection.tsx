"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LOCKED } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";
import { Sparkle } from "@/components/about/Doodles";

/**
 * JL Kitchens — the real feast-night videos as taped scrapbook prints.
 * Hover-autoplay only on fine pointers without reduced motion; click
 * always toggles play/pause.
 */

type VideoEntry = { src: string; poster: string; label: string };

const FEASTS = ["Thanksgiving", "New Year's", "Lunar New Year"] as const;
const ROTATIONS = [-1.6, 1.2, -1];

function VideoPrint({ v, index }: { v: VideoEntry; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  const toggle = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  }, []);

  const hoverPlay = useCallback(() => {
    if (reduced) return;
    void videoRef.current?.play();
  }, [reduced]);

  const hoverPause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ rotate: 0, y: -4 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.75, ease: EASE, delay: index * 0.1 }}
      style={{ rotate: ROTATIONS[index % ROTATIONS.length] }}
      className="polaroid relative p-2.5 pb-10"
    >
      <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" />

      <div
        className="group relative overflow-hidden bg-[var(--bg-2)]"
        style={{ aspectRatio: "9 / 16" }}
        data-cursor-hover
        onClick={toggle}
        onMouseEnter={hoverPlay}
        onMouseLeave={hoverPause}
        role="button"
        tabIndex={0}
        aria-label={`${playing ? "Pause" : "Play"} video: ${v.label}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
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

        {/* play sticker — hides while playing */}
        <div
          aria-hidden
          className={[
            "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            playing ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <div className="flex h-11 w-11 items-center justify-center bg-[var(--accent)] shadow-[3px_3px_0_rgba(23,21,17,0.3)]">
            <svg viewBox="0 0 16 16" fill="#fff" className="h-4 w-4 translate-x-0.5">
              <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
            </svg>
          </div>
        </div>
      </div>

      <p className="font-hand absolute bottom-2 left-4 text-xl text-[var(--fg)]">{v.label}</p>
      <p className="absolute bottom-3.5 right-4 font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)]">
        {FEASTS[index] ?? "feast night"}
      </p>
    </motion.div>
  );
}

export function KitchenSection() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        <div className="mb-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="relative">
            <p className="inline-block bg-[var(--fg)] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--bg)]">
              JL Kitchens
            </p>
            <h2 className="mt-5 font-anton text-4xl uppercase leading-[0.95] tracking-tight md:text-6xl">
              Feast nights<span className="text-[var(--accent)]">.</span>
            </h2>
            <Sparkle className="absolute -right-2 top-0 hidden w-7 md:block" delay={0.4} />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)]">
              Biweekly cooking with Samay — an outlet from rigorous courses,{" "}
              <span className="marker text-[var(--fg)]">immersed in sound, taste, and smell</span>.
              Designed dinner menus for Thanksgiving, New Year&apos;s, and Lunar New Year.
            </p>
          </div>
          <ul className="font-hand space-y-1 text-2xl leading-tight text-[var(--muted)] md:text-right">
            <li>macarons — perfected ✓</li>
            <li>beef ragu — on rotation ✓</li>
            <li className="text-[var(--accent)]">hojicha basque cheesecake — soon</li>
          </ul>
        </div>

        {/* vertical (9:16) prints — the originals are portrait phone footage */}
        <div className="mx-auto grid max-w-sm gap-7 sm:max-w-4xl sm:grid-cols-3">
          {LOCKED.videos.map((v, i) => (
            <VideoPrint key={v.src} v={v} index={i} />
          ))}
        </div>

        <p className="mt-10 max-w-md border-l-2 border-[var(--accent)] pl-4 font-mono text-[0.62rem] uppercase tracking-[0.24em] leading-relaxed text-[var(--muted)]">
          Filmed at the actual feast nights — 1,657 food photos in the camera roll.
        </p>
      </div>
    </section>
  );
}
