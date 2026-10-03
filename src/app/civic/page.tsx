import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { CivicHero } from "@/components/civic/CivicHero";
import { CivicMetricsBand } from "@/components/civic/CivicMetricsBand";
import { CivicFeaturedPress } from "@/components/civic/CivicFeaturedPress";
import { CivicBroadcast } from "@/components/civic/CivicBroadcast";
import { CivicStories } from "@/components/civic/CivicStories";
import { CivicInternProgram } from "@/components/civic/CivicInternProgram";
import { CivicSBAIFlow } from "@/components/civic/CivicSBAIFlow";
import { CivicCommission } from "@/components/civic/CivicCommission";
import { CivicInstagramCTA } from "@/components/civic/CivicInstagramCTA";
import { CivicNational } from "@/components/civic/CivicNational";

export const metadata: Metadata = {
  title: "Civic & Storytelling",
  description:
    "Jadon Li turns a city into a story — civic video, podcasts, and campaigns that move real numbers.",
};

/**
 * Civic & Storytelling world page.
 * Server component — all interactive sub-sections carry their own "use client" directive.
 * Art direction: bold documentary / editorial / newsprint.
 */
export default function CivicPage() {
  return (
    <World id="civic">
      {/* 1. Poster hero — headline, one sentence, portrait */}
      <CivicHero />

      {/* 2. The numbers */}
      <CivicMetricsBand />

      {/* 3. From the field — the Mayor's videographer, then the Sweet Tomatoes campaign */}
      <CivicStories />

      {/* 4. Voices of Fremont — the podcast he built for the Mayor */}
      <CivicFeaturedPress />

      {/* 5. The mayor's intern program — intern, then one of three leads */}
      <CivicInternProgram />

      {/* 6. Small Business Accessibility Initiative — process flow */}
      <CivicSBAIFlow />

      {/* 7. Seats: the Youth Advisory Commission, then the national stage */}
      <CivicCommission />
      <CivicNational />

      {/* 8. The school — MSJTV and the cinematic cuts */}
      <CivicBroadcast />

      {/* 9. Instagram CTA */}
      <CivicInstagramCTA />

      {/* 10. Footer */}
      <Footer />
    </World>
  );
}
