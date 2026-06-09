import { Marquee } from "@/components/primitives/Marquee";

const TICKER_ITEMS = [
  "$35M+ in cars on the lot",
  "60+ cars · one Pagani $3.5M",
  "~200 attendees",
  "50+ volunteers",
  "32,000 FUSD families emailed",
  "First car meet in MSJ history",
  "350 students at Winter Ball",
  "Built from scratch · no playbook",
  "ASB President 2026–2027",
  "Class President · 3 years",
  "Prom @ Cal Academy of Sciences",
  "@msjmeets",
  "7AM setup · 5PM cleanup",
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
