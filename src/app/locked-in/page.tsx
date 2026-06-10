import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { LockedHero } from "@/components/lockedin/LockedHero";
import { LockedInstagramGrid } from "@/components/lockedin/LockedFeedWall";
import { LockedMarquee } from "@/components/lockedin/LockedMarquee";
import { LockedFollowCTA } from "@/components/lockedin/LockedFollowCTA";

export const metadata: Metadata = {
  title: "Locked In — Jadon Li",
  description:
    "@li_locked.in — documenting the grind, locked in. Basketball, study tips, and a 262-player scavenger hunt. 1,400+ followers, 500k+ views in under a month.",
};

/**
 * Locked In world — content / video-wall page for @li_locked.in.
 * Art direction: premium content feed / reel wall — vertical 9:16 video tiles,
 * screen-glow pink (#ff3d81) + cyan (#3df0ff) accents on near-black, grain, kinetic.
 *
 * Section order:
 *   1. Hero — eyebrow, kinetic headline ("Documenting / the grind, / locked in."), metrics
 *   2. Marquee — pink ticker band
 *   3. Featured reels — 2-up large phone-framed Instagram embeds
 *   4. Reel mosaic — 8-reel varied-offset editorial grid
 *   5. Marquee — reversed, between embeds and CTA
 *   6. Follow CTA
 *   7. Footer
 *
 * Server component. All interactive sections carry their own "use client" directive.
 */
export default function LockedInPage() {
  return (
    <World id="lockedin">
      {/* 1. Cinematic hero */}
      <LockedHero />

      {/* 2. Content theme marquee — pink ticker band */}
      <LockedMarquee />

      {/* 3 + 4. Instagram reel wall — featured 2-up + 8-reel editorial mosaic */}
      <LockedInstagramGrid />

      {/* 5. Second marquee — reversed, between embeds and CTA */}
      <LockedMarquee />

      {/* 6. Follow CTA section */}
      <LockedFollowCTA />

      {/* 7. Footer with next-world handoff */}
      <Footer current="lockedin" />
    </World>
  );
}
