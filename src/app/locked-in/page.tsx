import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { LockedHero } from "@/components/lockedin/LockedHero";
import { LockedDouyinFeature } from "@/components/lockedin/LockedDouyinFeature";
import { LockedNativeFeed, LockedInstagramGrid } from "@/components/lockedin/LockedFeedWall";
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
 * Section order:
 *   1. Hero — eyebrow, kinetic headline, metrics, handle CTA
 *   2. DouYin viral feature — 569k showpiece card
 *   3. Marquee — pink ticker band
 *   4. Native cooking-video feed — plays inline, 9:16 grid
 *   5. Instagram embeds — 10 live reel iframes, responsive grid
 *   6. Marquee — reversed, between embeds and CTA
 *   7. Follow CTA
 *   8. Footer
 *
 * Server component. All interactive sections carry their own "use client" directive.
 */
export default function LockedInPage() {
  return (
    <World id="lockedin">
      {/* 1. Cinematic hero */}
      <LockedHero />

      {/* 2. DouYin viral feature — 569k showpiece card */}
      <LockedDouyinFeature />

      {/* 3. Content theme marquee — pink ticker band */}
      <LockedMarquee />

      {/* 4. Native cooking-video players — inline playback, 9:16 strip */}
      <LockedNativeFeed />

      {/* 5. Instagram embeds — 10 live reels, intentionally framed */}
      <LockedInstagramGrid />

      {/* 6. Second marquee — reversed, between embeds and CTA */}
      <LockedMarquee />

      {/* 7. Follow CTA section */}
      <LockedFollowCTA />

      {/* 8. Footer with next-world handoff */}
      <Footer current="lockedin" />
    </World>
  );
}
