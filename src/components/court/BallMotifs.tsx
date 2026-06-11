"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Shared basketball design vocabulary for the Court world.
 * Pebble leather grain, the iconic ball-with-seams mark, rim + net line art,
 * and giant seam arcs for section backgrounds.
 */

/** Pebbled leather grain — two offset dot grids. Colour via `currentColor`, tune with text-* + opacity-*. */
export function PebbleGrain({ className, size = 9 }: { className?: string; size?: number }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 1.6px)," +
          `radial-gradient(circle at ${size / 2 + 1.5}px ${size / 2 + 1.5}px, currentColor 1px, transparent 1.6px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

/** The iconic basketball — radial-lit leather with channel seams. */
export function BallIcon({ className, seam = "#170b05" }: { className?: string; seam?: string }) {
  // Unique gradient id per instance — a shared id resolves to the first one in
  // the DOM, which may sit in a display:none subtree where Chrome won't paint it.
  const gradId = `ball-grad-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 40 40" className={cn("block", className)} aria-hidden>
      <defs>
        <radialGradient id={gradId} cx="34%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#ff8a4d" />
          <stop offset="55%" stopColor="#ff5b1f" />
          <stop offset="100%" stopColor="#b53a0c" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${gradId})`} />
      <g stroke={seam} strokeWidth="1.6" fill="none" opacity="0.8">
        <path d="M1 20 H39" />
        <path d="M20 1 V39" />
        <path d="M6.2 6.8 C 14.5 13.5, 14.5 26.5, 6.2 33.2" />
        <path d="M33.8 6.8 C 25.5 13.5, 25.5 26.5, 33.8 33.2" />
      </g>
      <circle cx="20" cy="20" r="19" fill="none" stroke={seam} strokeWidth="1.4" opacity="0.55" />
    </svg>
  );
}

/** Giant ball seam geometry (no fill) — vertical, horizontal and the two side channels. */
export function SeamArcs({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={cn("block", className)} aria-hidden>
      <g stroke="currentColor" strokeWidth={strokeWidth}>
        <circle cx="200" cy="200" r="198" />
        <path d="M2 200 H398" />
        <path d="M200 2 V398" />
        <path d="M58 60 C 146 128, 146 272, 58 340" />
        <path d="M342 60 C 254 128, 254 272, 342 340" />
      </g>
    </svg>
  );
}

/** Rim + hanging net, front view. Colour via currentColor. */
export function RimNet({ className }: { className?: string }) {
  // Net cords: points around the rim ellipse cross down to a narrower mouth.
  const top = [12, 28, 44, 60, 76, 92, 108];
  const bot = top.map((x) => 60 + (x - 60) * 0.55);
  return (
    <svg viewBox="0 0 120 132" fill="none" className={cn("block", className)} aria-hidden>
      {/* Backplate stub + bracket */}
      <line x1="60" y1="0" x2="60" y2="10" stroke="currentColor" strokeWidth="3" />
      {/* Net — two crossing passes */}
      <g stroke="currentColor" strokeWidth="1.1" opacity="0.7">
        {top.map((x, i) => (
          <path key={`a${i}`} d={`M ${x} 22 C ${x} 55, ${bot[Math.min(i + 1, bot.length - 1)]} 75, ${bot[Math.min(i + 1, bot.length - 1)]} 108`} />
        ))}
        {top.map((x, i) => (
          <path key={`b${i}`} d={`M ${x} 22 C ${x} 55, ${bot[Math.max(i - 1, 0)]} 75, ${bot[Math.max(i - 1, 0)]} 108`} />
        ))}
        {/* Bottom mouth */}
        <path d={`M ${bot[0]} 108 Q 60 118 ${bot[bot.length - 1]} 108`} />
      </g>
      {/* Rim */}
      <ellipse cx="60" cy="20" rx="52" ry="9" stroke="currentColor" strokeWidth="3.5" />
    </svg>
  );
}

/** Half-court diagram, baseline at bottom — key, free-throw circle, three-point arc. */
export function HalfCourt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 480" fill="none" className={cn("block", className)} aria-hidden>
      <path d="M 60 440 A 200 200 0 0 1 420 440" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.35" />
      <rect x="175" y="280" width="130" height="160" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="240" cy="280" r="48" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <circle cx="240" cy="420" r="12" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="60" y1="440" x2="420" y2="440" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

/** Net mesh background — diamond cords. Apply over a positioned parent. */
export function NetMesh({ className, gap = 16 }: { className?: string; gap?: number }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          `repeating-linear-gradient(63deg, currentColor 0px, currentColor 1px, transparent 1px, transparent ${gap}px),` +
          `repeating-linear-gradient(-63deg, currentColor 0px, currentColor 1px, transparent 1px, transparent ${gap}px)`,
      }}
    />
  );
}
