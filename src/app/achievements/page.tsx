import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { AchievementsHero } from "@/components/achievements/AchievementsHero";
import { AchievementsTicker } from "@/components/achievements/AchievementsTicker";
import { ScoreBoard } from "@/components/achievements/ScoreBoard";
import { TrophyCase } from "@/components/achievements/TrophyCase";
import { OriginsStrip } from "@/components/achievements/OriginsStrip";

export const metadata: Metadata = {
  title: "Achievements — Jadon Li",
  description:
    "Trophy case, scores, and awards — SAT 1530, six AP fives, NCS Champions, USABO, UK Biology Olympiad, and more.",
};

/**
 * Achievements / Trophy Case world.
 * Art direction: museum awards vault — metallic gold, precise vitrine
 * framing, a filterable trophy case, elegant restraint with moments of shine.
 * Server component. Interactive sub-sections carry their own "use client".
 */
export default function AchievementsPage() {
  return (
    <World id="achievements">
      {/* 1. Hero — "Receipts." kinetic headline + gold shimmer */}
      <AchievementsHero />

      {/* 2. Gold ticker — pace setter */}
      <AchievementsTicker />

      {/* 3. Scores showcase — SAT 1530 counter, PSAT/ACT, AP-5 medallions */}
      <ScoreBoard />

      {/* 4. Trophy case — filterable award vitrine (centerpiece) */}
      <TrophyCase />

      {/* 5. Origins footnote — where it started */}
      <OriginsStrip />

      {/* 6. Footer with next-world handoff */}
      <Footer current="achievements" />
    </World>
  );
}
