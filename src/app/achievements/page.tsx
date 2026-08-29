import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { AchievementsHero } from "@/components/achievements/AchievementsHero";
import { AchievementsTicker } from "@/components/achievements/AchievementsTicker";
import { ScoreBoard } from "@/components/achievements/ScoreBoard";
import { TrophyCase } from "@/components/achievements/TrophyCase";

export const metadata: Metadata = {
  title: "Experiences & Achievements",
  description:
    "Every experience and achievement in one place — ACT 35, SAT 1540, eleven AP fives, NCS Champions, a UMass research summer, USABO, UK Biology Olympiad, and more.",
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

      {/* 4. The archive — the interactive constellation (centerpiece) */}
      <TrophyCase />

      {/* 5. Footer */}
      <Footer />
    </World>
  );
}
