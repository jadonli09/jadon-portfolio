"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { asset } from "@/lib/base";

export type DeckPhoto = { src: string; alt: string; caption: string; pos?: string };

/**
 * A stack of photographs that deals itself. The top card slides off and goes
 * to the back every few seconds; press the stack (or the arrow) to deal the
 * next one by hand, hover to hold it. The caption names the card on top.
 */
export function PhotoDeck({
  photos,
  ms = 3600,
  aspect = "4/5",
  className = "",
}: {
  photos: DeckPhoto[];
  ms?: number;
  aspect?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [top, setTop] = useState(0);
  const [held, setHeld] = useState(false);
  const n = photos.length;

  useEffect(() => {
    if (held || reduce) return;
    const t = setTimeout(() => setTop((v) => (v + 1) % n), ms);
    return () => clearTimeout(t);
  }, [top, held, reduce, ms, n]);

  const next = () => setTop((v) => (v + 1) % n);

  return (
    <div className={className} onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
      <button
        type="button"
        onClick={next}
        data-cursor-hover
        aria-label={`Next photo. Showing: ${photos[top].caption}`}
        className="relative block w-full"
        style={{ aspectRatio: aspect }}
      >
        {photos.map((p, k) => {
          const depth = (k - top + n) % n; // 0 = top card
          const leaving = depth === n - 1 && n > 2;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src}
              src={asset(p.src)}
              alt={depth === 0 ? p.alt : ""}
              aria-hidden={depth !== 0}
              loading={k < 2 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover transition-[translate,rotate,scale,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                objectPosition: p.pos,
                zIndex: n - depth,
                translate: depth === 0 ? "0 0" : leaving ? "-6% 2%" : `${depth * 5}% ${depth * -2.5}%`,
                rotate: depth === 0 ? "0deg" : leaving ? "-5deg" : `${depth * 3}deg`,
                scale: depth === 0 ? "1" : `${1 - depth * 0.05}`,
                opacity: depth > 2 && !leaving ? 0 : leaving ? 0 : 1,
                filter: depth === 0 ? undefined : `brightness(${1 - depth * 0.22})`,
              }}
            />
          );
        })}
      </button>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-[1rem] leading-snug" aria-live="polite">{photos[top].caption}</p>
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          {photos.map((p, k) => (
            <span key={p.src} className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${k === top ? "w-5 bg-[var(--accent)]" : "w-1.5 bg-current opacity-40"}`} />
          ))}
        </span>
      </div>
    </div>
  );
}
