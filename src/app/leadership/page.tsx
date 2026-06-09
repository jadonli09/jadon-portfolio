import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { LeadershipHero } from "@/components/leadership/LeadershipHero";
import { CarMeetShowpiece } from "@/components/leadership/CarMeetShowpiece";
import { WinterBall } from "@/components/leadership/WinterBall";
import { EventsTicker } from "@/components/leadership/EventsTicker";
import { EventsLedger } from "@/components/leadership/EventsLedger";
import { LeadershipCTA } from "@/components/leadership/LeadershipCTA";

export const metadata: Metadata = {
  title: "Leadership & Events — Jadon Li",
  description:
    "$35M of cars in a parking lot. A winter ball rebuilt from nothing. Class President three years running, now ASB President — running events at the scale of a small city.",
};

/**
 * Leadership & Events world page.
 * Art direction: luxury event poster / automotive show.
 * Asphalt black, champagne gold (#d4af6a), oxblood (#6e1f2a).
 * Server component — all interactive sub-sections carry their own "use client".
 */
export default function LeadershipPage() {
  return (
    <World id="leadership">
      {/* 1. Hero poster — "Running events at the scale of a city." */}
      <LeadershipHero />

      {/* 2. Gold ticker — sets the pace between hero and showpiece */}
      <EventsTicker />

      {/* 3. Car Meet showpiece — the cinematic centrepiece */}
      <CarMeetShowpiece />

      {/* 4. Winter Ball — distinct treatment, built-from-scratch story */}
      <WinterBall />

      {/* 5. Second ticker — reversed direction, between ball and ledger */}
      <EventsTicker reverse />

      {/* 6. Events ledger — interactive accordion, all roles */}
      <EventsLedger />

      {/* 7. Magnetic CTA — reach out section */}
      <LeadershipCTA />

      {/* 8. Footer with next-world handoff */}
      <Footer current="leadership" />
    </World>
  );
}
