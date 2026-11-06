import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { ResumeList } from "@/components/milestones/ResumeList";

export const metadata: Metadata = {
  title: "Milestones — Résumé",
  description:
    "Every milestone on one page — leadership, research, civic work, things built, academics, the court, and life outside the résumé.",
};

/** The one-page, résumé-style list of everything on the climb. */
export default function MilestonesResumePage() {
  return (
    <World id="milestones">
      <ResumeList />
      <Footer />
    </World>
  );
}
