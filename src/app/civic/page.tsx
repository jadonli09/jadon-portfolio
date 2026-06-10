import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { HeroSection04 } from "@/components/ui/hero-04";
import { CivicMetricsBand } from "@/components/civic/CivicMetricsBand";
import { CivicAwardsTicker } from "@/components/civic/CivicAwardsTicker";
import { CivicFeaturedPress } from "@/components/civic/CivicFeaturedPress";
import { CivicFreemontStories } from "@/components/civic/CivicFreemontStories";
import { CivicStories } from "@/components/civic/CivicStories";
import { CivicSBAIFlow } from "@/components/civic/CivicSBAIFlow";
import { CivicCommission } from "@/components/civic/CivicCommission";
import { CivicInstagramCTA } from "@/components/civic/CivicInstagramCTA";

export const metadata: Metadata = {
  title: "Civic & Storytelling — Jadon Li",
  description:
    "Under the banner of Ampersand Media, Jadon Li turns a city into a story — civic video, podcasts, and campaigns that move real numbers.",
};

/**
 * Civic & Storytelling world page.
 * Server component — all interactive sub-sections carry their own "use client" directive.
 * Art direction: bold documentary / editorial / newsprint.
 */
export default function CivicPage() {
  return (
    <World id="civic">
      {/* 1. Poster hero — oversized headline, dashed-grid backdrop (hero-04 theme) */}
      <HeroSection04 />

      {/* 2. Animated metrics band */}
      <CivicMetricsBand />

      {/* 3. Awards ticker — red band, pace-setting accent */}
      <CivicAwardsTicker />

      {/* 3b. Jennifer Siebel Newsom press feature + podcast origin deep-dive */}
      <CivicFeaturedPress />

      {/* 4. Voices of Fremont + Fremont Stories dual-series section */}
      <CivicFreemontStories />

      {/* 5. Editorial stories section — all six stories with deep bylines/detail */}
      <CivicStories />

      {/* 6. Small Business Accessibility Initiative — process flow deep dive */}
      <CivicSBAIFlow />

      {/* 7. Commission pull-quote callout */}
      <CivicCommission />

      {/* 8. Instagram CTA — magnetic interaction */}
      <CivicInstagramCTA />

      {/* 9. Footer with next-world handoff */}
      <Footer current="civic" />
    </World>
  );
}
