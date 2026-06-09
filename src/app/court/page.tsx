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
  title: "The Court — Jadon Li",
  description:
    "NCS Champions 2026. First title in school and district history. Jadon Li started in the first five for MSJ Varsity Basketball.",
};

/**
 * The Court world — kinetic sports-magazine energy, stat-forward.
 * Server component. All interactive sections carry their own "use client" directive.
 * Art direction: SLAM magazine meets broadcast lower-third. font-anton, electric orange,
 * near-black, bold condensed type, motion blur, court-line SVG motifs, oversized numbers.
 */
export default function CourtPage() {
  return (
    <World id="court">
      {/* 1. Championship magazine-cover hero */}
      <CourtHero />

      {/* 2. Relentless stat ticker (orange band) */}
      <CourtTicker />

      {/* 2b. Broadcast lower-third stat line — FIRST 5 · NCS · 569k · .500 JV */}
      <CourtStatLine />

      {/* 3. Career timeline — AAU → NCS Champion */}
      <CourtTimeline />

      {/* 3b. Championship moments — mayor, city recognition, game action strip */}
      <ChampionshipMoments />

      {/* 4. DouYin viral moment — stat showpiece */}
      <CourtDouyin />

      {/* 5. Championship banner — by the numbers */}
      <CourtBanner />

      {/* 6. Second ticker before footer (reversed) */}
      <CourtTicker />

      {/* 7. Footer with next-world handoff */}
      <Footer current="court" />
    </World>
  );
}
