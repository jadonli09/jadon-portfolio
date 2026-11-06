import type { Metadata } from "next";
import { Redirect } from "@/components/chrome/Redirect";

export const metadata: Metadata = { title: "Milestones — Résumé", robots: { index: false } };

/** Old URL — the list now lives at /milestones/resume. */
export default function OldAchievementsResumePage() {
  return <Redirect to="/milestones/resume/" />;
}
