import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { LeadershipHero } from "@/components/leadership/LeadershipHero";
import { ElectedOffices } from "@/components/leadership/ElectedOffices";
import { EventsTicker } from "@/components/leadership/EventsTicker";
import { EventsGrid } from "@/components/leadership/EventsGrid";
import { WinterBall } from "@/components/leadership/WinterBall";
import { CarMeetShowpiece } from "@/components/leadership/CarMeetShowpiece";
import { FieldPhotoStrip } from "@/components/leadership/FieldPhotoStrip";
import { LeadershipCTA } from "@/components/leadership/LeadershipCTA";

export const metadata: Metadata = {
  title: "Leadership & Events — Jadon Li",
  description:
    "Three-time Class President, now ASB President — elected every year. 13 fundraisers, $5,520 raised, 500-person protests, a first-ever car meet, and a Winter Ball built from scratch.",
};

/**
 * Leadership & Events world page.
 * Art direction: luxury editorial poster / elected-office showcase.
 * Asphalt black, champagne gold (#d4af6a), oxblood (#6e1f2a).
 *
 * Page order:
 *   1. Hero — "Elected to lead, every year."
 *   2. ElectedOffices — ASB President + Class President ×3 as editorial stars;
 *      two VP roles as supporting accordion rows; counters + arc callout.
 *   3. EventsTicker — kinetic gold separator.
 *   4. EventsGrid — rich interactive ledger; each event card leads with its metric.
 *   5. WinterBall — distinct feature treatment, built-from-scratch story.
 *   6. EventsTicker (reversed) — second separator.
 *   7. CarMeetShowpiece — demoted notable-event section (strong but secondary).
 *   8. FieldPhotoStrip — ASB / climbing / fundraising / panels photo marquee.
 *   9. LeadershipCTA — magnetic reach-out section.
 *  10. Footer with next-world handoff.
 *
 * Server component — all interactive sub-sections carry their own "use client".
 */
export default function LeadershipPage() {
  return (
    <World id="leadership">
      {/* 1. Hero poster — "Elected to lead, every year." */}
      <LeadershipHero />

      {/* 2. Elected offices — the centerpiece: ASB + Class President highlight cards */}
      <ElectedOffices />

      {/* 3. Gold ticker — transitions from offices to the event log */}
      <EventsTicker />

      {/* 4. Event log grid — range and volume, metrics prominent */}
      <EventsGrid />

      {/* 5. Winter Ball — distinct built-from-scratch feature */}
      <WinterBall />

      {/* 6. Second ticker (reversed) — between Winter Ball and the car meet */}
      <EventsTicker reverse />

      {/* 7. MSJ Car Meet — notable event section (demoted from hero) */}
      <CarMeetShowpiece />

      {/* 8. In-the-field photo strip — ASB / climbing / fundraising / panels */}
      <FieldPhotoStrip />

      {/* 9. Magnetic CTA — reach out */}
      <LeadershipCTA />

      {/* 10. Footer with next-world handoff */}
      <Footer current="leadership" />
    </World>
  );
}
