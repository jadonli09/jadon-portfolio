"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { SELFIES, type Selfie } from "@/lib/selfies";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/**
 * The selfie match cut. Every selfie from summer 2026, cut so the face never
 * moves: each frame is scaled and translated from its detected face box so the
 * eyes land on one fixed anchor and the face keeps one fixed size. Hard cuts on
 * a beat, like the one-selfie-a-day videos — the world changes, the face holds.
 */

const FRAME_W = 4;
const FRAME_H = 5; // portrait 4:5
const ANCHOR = { x: 0.5, y: 0.42 }; // where the face centre sits, as a fraction of the frame
const FACE_W = 0.3; // face width as a fraction of frame width
const BEAT_MS = 560;

/** Position one selfie so its face box lands on the anchor (percent units of the frame). */
function placement(s: Selfie) {
  const renderedW = Math.min(3.2, Math.max(1, FACE_W / s.fw)); // in frame-width units
  const renderedH = renderedW * (s.h / s.w); // in frame-width units
  const left = ANCHOR.x - s.cx * renderedW; // frame-width units
  const topFrameH = ANCHOR.y - (s.cy * renderedH) / (FRAME_H / FRAME_W); // frame-height units
  return {
    width: `${(renderedW * 100).toFixed(2)}%`,
    left: `${(left * 100).toFixed(2)}%`,
    top: `${(topFrameH * 100).toFixed(2)}%`,
  };
}

export function SelfieMatchCut() {
  const reduce = useReducedMotion();
  const total = SELFIES.length;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [hover, setHover] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { margin: "-20% 0px" });
  const places = useMemo(() => SELFIES.map(placement), []);

  const step = useCallback((d: number) => setI((x) => (x + d + total) % total), [total]);

  // the beat
  useEffect(() => {
    if (!playing || !inView || hover || reduce) return;
    const t = window.setInterval(() => step(1), BEAT_MS);
    return () => window.clearInterval(t);
  }, [playing, inView, hover, reduce, step]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inView) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === " " && document.activeElement === frameRef.current) { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, step]);

  // keep the next few frames warm so cuts never pop in
  const warm = useMemo(() => {
    const set = new Set<number>();
    for (let k = -1; k <= 4; k++) set.add((i + k + total) % total);
    return set;
  }, [i, total]);

  const cur = SELFIES[i];

  return (
    <section id="match-cut" className="relative scroll-mt-24 border-t border-[var(--line)] px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_minmax(300px,420px)] md:gap-16">
        {/* copy */}
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--muted)]">Selfie match cut · Summer 2026</p>
          <h2 className="mt-4 font-anton text-4xl uppercase leading-[0.95] tracking-tight md:text-6xl">
            One face,
            <br />
            forty-five places<span className="text-[var(--accent)]">.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Every selfie from the summer before senior year — SFO to DC to Amherst to Boston to New York — cut so the face never moves.
            Each frame is scaled and shifted from its detected face box onto one anchor; the world changes behind it, the face holds.
          </p>
          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            {reduce ? "step with the arrows" : "hover to pause · click to step · ← → keys"}
          </p>

          {/* transport */}
          <div className="mt-8 flex items-center gap-3">
            <button data-cursor-hover onClick={() => step(-1)} aria-label="previous selfie" className="flex size-9 items-center justify-center border border-[var(--line)] text-[var(--fg)] transition-colors hover:border-[var(--fg)]">
              <SkipBack className="size-3.5" />
            </button>
            <button
              data-cursor-hover
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "pause" : "play"}
              className="flex h-9 items-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--bg)] transition-opacity hover:opacity-80"
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button data-cursor-hover onClick={() => step(1)} aria-label="next selfie" className="flex size-9 items-center justify-center border border-[var(--line)] text-[var(--fg)] transition-colors hover:border-[var(--fg)]">
              <SkipForward className="size-3.5" />
            </button>
            <span className="ml-2 font-mono text-[0.7rem] tabular-nums text-[var(--muted)]">
              <span className="text-[var(--fg)]">{String(i + 1).padStart(2, "0")}</span> / {total}
            </span>
          </div>

          {/* timeline — one tick per frame */}
          <div className="mt-6 flex max-w-md flex-wrap gap-1" role="tablist" aria-label="selfie timeline">
            {SELFIES.map((s, k) => (
              <button
                key={s.src}
                role="tab"
                aria-selected={k === i}
                aria-label={`selfie ${k + 1}`}
                data-cursor-hover
                onClick={() => setI(k)}
                className={cn("h-3 w-2 transition-colors", k === i ? "bg-[var(--accent)]" : k < i ? "bg-[var(--fg)]/60 hover:bg-[var(--fg)]" : "bg-[var(--line)] hover:bg-[var(--muted)]")}
              />
            ))}
          </div>
        </div>

        {/* the frame */}
        <div
          ref={frameRef}
          tabIndex={0}
          data-cursor-hover
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => step(1)}
          className="relative mx-auto w-full max-w-[420px] cursor-pointer select-none overflow-hidden rounded-md border border-[var(--line)] bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
          aria-label={`Selfie ${i + 1} of ${total}`}
        >
          {/* warm frames: mounted but hidden so the next cuts are already decoded */}
          {SELFIES.map((s, k) =>
            warm.has(k) && k !== i ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.src} src={asset(s.src)} alt="" aria-hidden decoding="async" className="pointer-events-none absolute opacity-0" style={{ ...places[k], maxWidth: "none" }} />
            ) : null,
          )}

          {/* the cut — a hard swap with a tiny settle, no crossfade */}
          <AnimatePresence initial={false}>
            <motion.img
              key={cur.src}
              src={asset(cur.src)}
              alt={`Selfie ${i + 1} of ${total}, summer 2026`}
              decoding="async"
              initial={reduce ? false : { scale: 1.035 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="absolute origin-center"
              style={{ ...places[i], maxWidth: "none" }}
            />
          </AnimatePresence>

          {/* grain + vignette */}
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />

          {/* the match point — reticle on the anchor */}
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 500" style={{ opacity: hover ? 0.85 : 0.45, transition: "opacity 0.3s" }}>
            {(() => {
              const cx = ANCHOR.x * 400;
              const cy = ANCHOR.y * 500;
              const r = (FACE_W * 400) / 2;
              const b = 12;
              const c = "var(--accent)";
              return (
                <g stroke={c} strokeWidth={1.2} fill="none">
                  <path d={`M ${cx - r} ${cy - r + b} V ${cy - r} H ${cx - r + b}`} />
                  <path d={`M ${cx + r - b} ${cy - r} H ${cx + r} V ${cy - r + b}`} />
                  <path d={`M ${cx - r} ${cy + r - b} V ${cy + r} H ${cx - r + b}`} />
                  <path d={`M ${cx + r - b} ${cy + r} H ${cx + r} V ${cy + r - b}`} />
                  <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} />
                  <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} />
                </g>
              );
            })()}
          </svg>

          {/* rec strip */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/85">
            <span className="flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full bg-[var(--accent)]", playing && inView && !hover && !reduce && "animate-pulse")} />
              {playing && !hover ? "cut" : "hold"}
            </span>
            <span className="tabular-nums">{String(i + 1).padStart(2, "0")} / {total}</span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/85">
            <span>Summer &apos;26</span>
            <span>match point · face locked</span>
          </div>
        </div>
      </div>
    </section>
  );
}
