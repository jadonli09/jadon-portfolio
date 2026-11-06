import type { Metadata } from "next";
import { Redirect } from "@/components/chrome/Redirect";

export const metadata: Metadata = { title: "Milestones", robots: { index: false } };

/** Old URL — the page now lives at /milestones. */
export default function OldAchievementsPage() {
  return <Redirect to="/milestones/" />;
}
