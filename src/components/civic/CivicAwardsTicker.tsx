import { Marquee } from "@/components/primitives/Marquee";
import { CIVIC } from "@/lib/data";

/** Red-band awards marquee — awards + metric phrases as an infinite ticker. */
export function CivicAwardsTicker() {
  const tickerItems = [
    ...CIVIC.awards,
    "10k views per mayor video",
    "500k+ views in under a month",
    "18k Palm Ave Park promo views",
    "32k FUSD families reached",
  ];

  return (
    <div className="relative overflow-hidden border-y border-[var(--accent)] bg-[var(--accent)] py-3.5">
      {/* Bleed masks on each side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--accent)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--accent)] to-transparent"
      />

      <Marquee
        items={tickerItems}
        sep="▸"
        durationSec={42}
        className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white"
      />
    </div>
  );
}
