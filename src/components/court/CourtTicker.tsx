import { Marquee } from "@/components/primitives/Marquee";

const TICKER_ITEMS = [
  "NCS CHAMPIONS 2026",
  "FIRST IN DISTRICT HISTORY",
  "STARTED FIRST FIVE",
  "569K LIKES ON DOUYIN",
  "MSJ VARSITY BASKETBALL",
  "FIRST IN SCHOOL HISTORY",
  "FREMONT DISTRICT TITLE",
  "AAU ROOTS — GRADES 3–9",
  ".500 JV RECORD",
  "BENCH ENERGY DRIVES SYNERGY",
  "MAYOR + CITY RECOGNITION",
  "BROKEN ARM — STILL A-TEAM",
];

/** Courtside LED ad board — glowing dot-matrix ticker on the scorer's table. Server component. */
export function CourtTicker() {
  return (
    <div className="relative overflow-hidden border-y-2 border-[#1d1d21] bg-[#08080a] py-3.5">
      {/* LED dot-matrix grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,91,31,0.35) 0.8px, transparent 1px)",
          backgroundSize: "5px 5px",
        }}
      />

      {/* Bleed fade masks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#08080a] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#08080a] to-transparent"
      />

      <Marquee
        items={TICKER_ITEMS}
        sep="●"
        durationSec={36}
        className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)] [text-shadow:0_0_5px_rgba(255,91,31,0.9),0_0_18px_rgba(255,91,31,0.4)]"
      />
    </div>
  );
}
