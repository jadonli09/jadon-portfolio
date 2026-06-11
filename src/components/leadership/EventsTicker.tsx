import { Marquee } from "@/components/primitives/Marquee";

const TICKER_ITEMS = [
  "ASB President 2026–2027",
  "Class President · 3 years running",
  "Lost by ~10 votes · ran back · won",
  "13 fundraisers · $5,520.40",
  "Leadership II · 90 → 60 → 30",
  "350 students at Winter Ball",
  "500-person ICE Protest · 20k+ views",
  "262-player Scavenger Hunt",
  "500 students at CO26 Graduation",
  "Prom @ Cal Academy of Sciences",
  "Climbing Club VP · Boba $800+",
  "MSJ Makes President · 40 senior stoles",
  "STEM-PAC Co-President · ACSEF pipeline",
  "$35M+ in cars · First in MSJ history",
];

/**
 * Gold luxury ticker strip — separates major sections with kinetic energy.
 * Server component (Marquee is CSS-animated, no client JS needed).
 */
export function EventsTicker({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="relative my-16 overflow-hidden border-y border-[var(--line)] bg-[var(--bg-2)] py-3 md:my-24">
      {/* Left/right fade vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--bg-2)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--bg-2)] to-transparent"
      />

      <Marquee
        items={TICKER_ITEMS}
        sep="◆"
        reverse={reverse}
        durationSec={38}
        className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--accent)]"
      />
    </div>
  );
}
