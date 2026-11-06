import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { ResumeList } from "@/components/achievements/ResumeList";

export const metadata: Metadata = {
  title: "Achievements — Résumé",
  description:
    "Every achievement on one page — leadership, research, civic work, things built, academics, the court, and life outside the résumé.",
};

/** The one-page, résumé-style list of everything on the climb. */
export default function AchievementsResumePage() {
  return (
    <World id="achievements">
      <ResumeList />
      <Footer />
    </World>
  );
}
