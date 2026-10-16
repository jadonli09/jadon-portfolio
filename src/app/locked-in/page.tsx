import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { LockedScreening } from "@/components/lockedin/LockedScreening";

export const metadata: Metadata = {
  title: "We locked in",
  description:
    "We locked in — @li_locked.in as a season: the summer grind, the Sweet Tomatoes saga, junior year, seventeen, and year two. Scroll to browse.",
};

/**
 * The Locked In world — a streaming title page, one screen tall. Scrolling rolls
 * the film strip of episodes sideways instead of moving the page; the frame at
 * the gate becomes the billboard and plays. The twenty reels
 * are LOCKED_SEASON in src/lib/data.ts — Jadon’s picks, in posting order.
 */
export default function LockedInPage() {
  return (
    <World id="lockedin" homeBar={false} className="h-[100svh] min-h-0 overflow-hidden">
      <LockedScreening />
    </World>
  );
}
