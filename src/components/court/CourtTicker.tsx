import { Marquee } from "@/components/primitives/Marquee";

const TICKER_ITEMS = [
  "NCS CHAMPIONS 2026",
  "FIRST IN DISTRICT HISTORY",
  "STARTED FIRST FIVE",
  "500K+ LIKES ON DOUYIN",
  "MSJ VARSITY BASKETBALL",
  "FIRST IN SCHOOL HISTORY",
  "FREMONT DISTRICT TITLE",
  "AAU ROOTS — GRADES 3–9",
];

/** Orange-band championship stat ticker. Server component — Marquee is CSS-only. */
export function CourtTicker() {
  return (
    <div className="relative overflow-hidden border-y border-[var(--accent)] bg-[var(--accent)] py-3.5">
      {/* Bleed fade masks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--accent)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--accent)] to-transparent"
      />

      <Marquee
        items={TICKER_ITEMS}
        sep="✦"
        durationSec={36}
        className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white"
      />
    </div>
  );
}
