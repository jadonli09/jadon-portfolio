import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { CourtHero } from "@/components/court/CourtHero";
import { CourtTicker } from "@/components/court/CourtTicker";
import { CourtStatLine } from "@/components/court/CourtStatLine";
import { CourtTimeline } from "@/components/court/CourtTimeline";
import { ChampionshipMoments } from "@/components/court/ChampionshipMoments";
import { CourtDouyin } from "@/components/court/CourtDouyin";
import { CourtBanner } from "@/components/court/CourtBanner";

export const metadata: Metadata = {
  title: "The Court",
  description:
    "NCS Champions 2026. First title in school and district history. Jadon Li started in the first five for MSJ Varsity Basketball.",
};

/**
 * The Court world — the page IS a basketball.
 * Server component. All interactive sections carry their own "use client" directive.
 * Art direction: every element borrows from the ball, the hoop or the gym —
 * pebbled leather, seam channels, scoreboard LEDs, rafter banners, backboard glass.
 * The career timeline runs along the seams of the ball, game photos stitched in.
 */
export default function CourtPage() {
  return (
    <World id="court">
      {/* 1. Championship magazine-cover hero — the ball checks in */}
      <CourtHero />

      {/* 2. Courtside LED ad board */}
      <CourtTicker />

      {/* 2b. Gym scoreboard — FIRST 5 · NCS · 569k · .500 JV */}
      <CourtStatLine />

      {/* 3. Career timeline — the seams of the ball, game photos embedded per era */}
      <CourtTimeline />

      {/* 3b. Championship moments — banners raised to the rafters */}
      <ChampionshipMoments />

      {/* 4. DouYin viral moment — mounted on backboard glass */}
      <CourtDouyin />

      {/* 5. Championship banner — by the numbers */}
      <CourtBanner />

      {/* 6. Second ticker before footer (reversed) */}
      <CourtTicker />

      {/* 7. Footer */}
      <Footer />
    </World>
  );
}
