import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { ResearchNav } from "@/components/research/ResearchNav";
import { Console } from "@/components/research/Console";
import { LabEasterEggs } from "@/components/research/lab/LabEasterEggs";
import { Opening } from "@/components/research/sections/Opening";
import { Glow } from "@/components/research/sections/Glow";
import { Bench } from "@/components/research/sections/Bench";
import { Deeper } from "@/components/research/sections/Deeper";
import { ScienceFair } from "@/components/research/sections/ScienceFair";
import { Beyond } from "@/components/research/sections/Beyond";

export const metadata: Metadata = {
  title: "Research & STEM",
  description:
    "Six weeks in the Ma Lab at UMass Amherst engineering a red-fluorescent human clinical strain of Fusarium oxysporum — plus RNA-seq on a mouse gout model that placed 3rd in computational biology at ACSEF.",
};

/**
 * Research world — "Dark Field".
 *
 * Two projects, two posters, in that order: the claim, the boards, then as
 * much of either as you ask for. Depth that used to run down the page in
 * full now sits inside panels you open — the page is an overview first.
 *
 * Server component — interactive sections carry their own "use client".
 */
export default function ResearchPage() {
  return (
    <World id="research">
      <ResearchNav />
      <Opening />
      <Glow />
      <Bench />
      <Deeper />
      <ScienceFair />
      <Beyond />
      <Footer />
      <LabEasterEggs />
      <Console />
    </World>
  );
}
