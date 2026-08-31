import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { ResearchNav } from "@/components/research/ResearchNav";
import { Console } from "@/components/research/Console";
import { LabEasterEggs } from "@/components/research/lab/LabEasterEggs";
import { Hero } from "@/components/research/sections/Hero";
import { Question } from "@/components/research/sections/Question";
import { Strains } from "@/components/research/sections/Strains";
import { Plasmid } from "@/components/research/sections/Plasmid";
import { AtTheBench } from "@/components/research/sections/AtTheBench";
import { Protocol } from "@/components/research/sections/Protocol";
import { Evidence } from "@/components/research/sections/Evidence";
import { WentWrong } from "@/components/research/sections/WentWrong";
import { WhatsNext } from "@/components/research/sections/WhatsNext";
import { Poster } from "@/components/research/sections/Poster";
import { GoutChapter } from "@/components/research/sections/GoutChapter";
import { Beyond } from "@/components/research/sections/Beyond";

export const metadata: Metadata = {
  title: "Research & STEM",
  description:
    "Six weeks in the Ma Lab at UMass Amherst engineering a red-fluorescent human clinical strain of Fusarium oxysporum — plus RNA-seq on a mouse gout model that placed 3rd in computational biology at ACSEF.",
};

/**
 * Research world — "Dark Field".
 *
 * Leads with the UMass Fusarium RFP transformation; the gout RNA-seq work is
 * the dry-lab counterpart. Governing principle: nothing important sits behind
 * a click. Every fact is reachable by scrolling; the console only navigates.
 *
 * Server component — interactive sections carry their own "use client".
 */
export default function ResearchPage() {
  return (
    <World id="research">
      <ResearchNav />
      <Hero />
      <Question />
      <Strains />
      <Plasmid />
      <AtTheBench />
      <Protocol />
      <Evidence />
      <WentWrong />
      <WhatsNext />
      <Poster />
      <GoutChapter />
      <Beyond />
      <Footer />
      <LabEasterEggs />
      <Console />
    </World>
  );
}
