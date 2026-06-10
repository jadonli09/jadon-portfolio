import { Marquee } from "@/components/primitives/Marquee";
import { TROPHIES, AP_FIVES, SCORES } from "@/lib/data";

/** Build a ticker from factual achievements data. */
const TICKER_ITEMS = [
  ...TROPHIES.map((t) => `${t.year} · ${t.title}`),
  `SAT ${SCORES[0].value}`,
  `PSAT ${SCORES[1].value}`,
  `ACT ${SCORES[2].value} — 8th grade`,
  ...AP_FIVES.map((e) => `${e} · 5`),
];

export function AchievementsTicker() {
  return (
    <div
      className="border-y border-[var(--line)] py-3.5"
      style={{ background: "rgba(176,124,30,0.06)" }}
    >
      <Marquee
        items={TICKER_ITEMS}
        sep="✦"
        durationSec={55}
        className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]"
      />
    </div>
  );
}
