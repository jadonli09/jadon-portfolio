import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { AchievementsHero } from "@/components/achievements/AchievementsHero";
import { AchievementsTicker } from "@/components/achievements/AchievementsTicker";
import { ScoreBoard } from "@/components/achievements/ScoreBoard";
import { TrophyCase } from "@/components/achievements/TrophyCase";
import { OriginsStrip } from "@/components/achievements/OriginsStrip";

export const metadata: Metadata = {
  title: "Experiences & Achievements",
  description:
    "Every experience and achievement in one place — SAT 1530, six AP fives, NCS Champions, USABO, UK Biology Olympiad, and more.",
};

/**
 * Experiences & Achievements world.
 * Art direction: bright gallery — ivory background, warm shadows,
 * deep-gold accents, a filterable archive of every entry.
 * Server component. Interactive sub-sections carry their own "use client".
 */
export default function AchievementsPage() {
  return (
    <World id="achievements">
      {/* 1. Hero — plain title + bright graphic */}
      <AchievementsHero />

      {/* 2. Ticker — pace setter */}
      <AchievementsTicker />

      {/* 3. Scores — SAT counter, PSAT/ACT, AP-5 medallions */}
      <ScoreBoard />

      {/* 4. The archive — filterable by year or domain (centerpiece) */}
      <TrophyCase />

      {/* 5. Origins footnote — where it started */}
      <OriginsStrip />

      {/* 6. Footer with next-world handoff */}
      <Footer current="achievements" />
    </World>
  );
}
