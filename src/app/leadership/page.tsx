import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { LeadershipHero } from "@/components/leadership/LeadershipHero";
import { ElectedOffices } from "@/components/leadership/ElectedOffices";
import { EventsTicker } from "@/components/leadership/EventsTicker";
import { EventsGrid } from "@/components/leadership/EventsGrid";
import { WinterBall } from "@/components/leadership/WinterBall";
import { DisplayMarquee } from "@/components/leadership/DisplayMarquee";
import { CarMeetShowpiece } from "@/components/leadership/CarMeetShowpiece";
import { ClubCrews } from "@/components/leadership/ClubCrews";
import { FieldPhotoStrip } from "@/components/leadership/FieldPhotoStrip";
import { LeadershipCTA } from "@/components/leadership/LeadershipCTA";

export const metadata: Metadata = {
  title: "Leadership & Events — Jadon Li",
  description:
    "Three-time Class President, now ASB President — plus MSJ Makes President and STEM-PAC Co-President. 13 fundraisers, $5,520 raised, 500-person protests, a first-ever car meet, and a Winter Ball built from scratch.",
};

/**
 * Leadership & Events world page.
 * Art direction: luxury editorial poster spine (asphalt black, champagne
 * gold #d4af6a, oxblood #6e1f2a) — but every section speaks its own
 * graphic dialect so the page never repeats itself:
 *
 *   1. LeadershipHero — luxury poster (Anton + gold rules).
 *   2. ElectedOffices — editorial gold highlight cards (the centerpiece).
 *   3. EventsTicker — small gold mono ticker separator.
 *   4. EventsGrid — "The Range" as a brutalist full-bleed ledger:
 *      gold header band, heavy rules, row-inversion hovers.
 *   5. WinterBall — full inversion: ivory invitation paper, serif dance
 *      card, wax-seal stamp, tilted polaroid photo slots.
 *   6. DisplayMarquee — poster-scale outlined-Anton marquee.
 *   7. CarMeetShowpiece — automotive: hazard stripes, oxblood pit-board
 *      band, license-plate stat chips, photo collage.
 *   8. ClubCrews — scrapbook wall: handwritten Caveat, pinned paper cards,
 *      officer-team photo slots (MSJ Makes · STEM-PAC · Climbing).
 *   9. FieldPhotoStrip — ASB / climbing / fundraising photo marquee.
 *  10. LeadershipCTA — magnetic reach-out section.
 *  11. Footer with next-world handoff.
 *
 * Server component — all interactive sub-sections carry their own "use client".
 */
export default function LeadershipPage() {
  return (
    <World id="leadership">
      {/* 1. Hero poster — "Elected to lead, every year." */}
      <LeadershipHero />

      {/* 2. Elected offices — ASB + Class President highlight cards */}
      <ElectedOffices />

      {/* 3. Gold mono ticker — transitions from offices to the ledger */}
      <EventsTicker />

      {/* 4. Event ledger — brutalist full-bleed table */}
      <EventsGrid />

      {/* 5. Winter Ball — ivory invitation-paper inversion + photo slots */}
      <WinterBall />

      {/* 6. Poster-scale outlined marquee */}
      <DisplayMarquee />

      {/* 7. MSJ Car Meet — automotive treatment */}
      <CarMeetShowpiece />

      {/* 8. Club officer crews — scrapbook wall with photo slots */}
      <ClubCrews />

      {/* 9. In-the-field photo strip — ASB / climbing / fundraising */}
      <FieldPhotoStrip />

      {/* 10. Magnetic CTA — reach out */}
      <LeadershipCTA />

      {/* 11. Footer with next-world handoff */}
      <Footer current="leadership" />
    </World>
  );
}
