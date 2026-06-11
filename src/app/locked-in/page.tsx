import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { LockedHero } from "@/components/lockedin/LockedHero";
import { LockedMarquee } from "@/components/lockedin/LockedMarquee";
import { PursuitTimeline } from "@/components/lockedin/PursuitTimeline";
import { LockedFollowCTA } from "@/components/lockedin/LockedFollowCTA";

export const metadata: Metadata = {
  title: "The Pursuit — Jadon Li",
  description:
    "@li_locked.in, one year documented — 83 reels, 1.39M plays, 368 days. From a summer-grind promise to the Sweet Tomatoes saga to interviewing the Governor: the whole journey, in order.",
};

/**
 * The Pursuit world — "One year, documented."
 * Art direction: a season-graded scroll timeline on feed-black. The spine grades
 * chapter-by-chapter (summer gold → focus cyan → viral pink → ember → dawn violet);
 * pink stays the world identity in the hero/nav/CTA. Every reel sits at its real
 * date with its real caption and play count; keystone moments play natively.
 *
 * Section order:
 *   1. Hero — kinetic headline ("One year, / documented. / still locked in."), real metrics
 *   2. Marquee — pink ticker band
 *   3. Pursuit timeline — 5 chapters, 13 native videos, log tidbits, Day 001 → Day 369
 *   4. Follow CTA
 *   5. Footer
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

      {/* 3. The year, in order */}
      <PursuitTimeline />

      {/* 4. Follow CTA section */}
      <LockedFollowCTA />

      {/* 5. Footer with next-world handoff */}
      <Footer current="lockedin" />
    </World>
  );
}
