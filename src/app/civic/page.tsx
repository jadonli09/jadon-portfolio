import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { CivicMasthead } from "@/components/civic/CivicMasthead";
import { CivicMetricsBand } from "@/components/civic/CivicMetricsBand";
import { CivicAwardsTicker } from "@/components/civic/CivicAwardsTicker";
import { CivicFeaturedPress } from "@/components/civic/CivicFeaturedPress";
import { CivicStories } from "@/components/civic/CivicStories";
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
      {/* 1. Broadsheet hero masthead */}
      <CivicMasthead />

      {/* 2. Animated metrics band */}
      <CivicMetricsBand />

      {/* 3. Awards ticker (first instance — above stories, pace-sets the red accent) */}
      <CivicAwardsTicker />

      {/* 3b. Jennifer Siebel Newsom press feature — standout civic reach moment */}
      <CivicFeaturedPress />

      {/* 4. Editorial stories section */}
      <CivicStories />

      {/* 5. Commission pull-quote callout */}
      <CivicCommission />

      {/* 6. Instagram CTA — magnetic interaction */}
      <CivicInstagramCTA />

      {/* 7. Footer with next-world handoff */}
      <Footer current="civic" />
    </World>
  );
}
