import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { LockedHero } from "@/components/lockedin/LockedHero";
import { LockedDouyinFeature } from "@/components/lockedin/LockedDouyinFeature";
import { LockedFeedWall } from "@/components/lockedin/LockedFeedWall";
import { LockedMarquee } from "@/components/lockedin/LockedMarquee";
import { LockedFollowCTA } from "@/components/lockedin/LockedFollowCTA";

export const metadata: Metadata = {
  title: "Locked In — Jadon Li",
  description:
    "@li_locked.in — documenting the grind in public. Basketball, cooking, study tips, and a gym moment that hit 569k likes in China. 1,400+ followers, 500k+ views in under a month.",
};

/**
 * Locked In world — content / video-wall page for @li_locked.in.
 * Art direction: premium content feed / reel wall — vertical 9:16 video tiles,
 * screen-glow pink (#ff3d81) + cyan (#3df0ff) accents on near-black, grain, kinetic.
 *
 * Server component. All interactive sections carry their own "use client" directive.
 */
export default function LockedInPage() {
  return (
    <World id="lockedin">
      {/* 1. Cinematic hero — eyebrow, kinetic headline, metrics, handle CTA */}
      <LockedHero />

      {/* 2. DouYin viral feature — 569k showpiece card */}
      <LockedDouyinFeature />

      {/* 3. Content theme marquee — pink ticker band */}
      <LockedMarquee />

      {/* 4. The feed wall — native video players + reel link tiles, 9:16 grid */}
      <LockedFeedWall />

      {/* 5. Second marquee — reversed, between feed and CTA */}
      <LockedMarquee />

      {/* 6. Follow CTA section */}
      <LockedFollowCTA />

      {/* 7. Footer with next-world handoff */}
      <Footer current="lockedin" />
    </World>
  );
}
