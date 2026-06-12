import type { Metadata } from "next";
import { ResearchIDE } from "@/components/research/lab/ResearchIDE";
import { LabEasterEggs } from "@/components/research/lab/LabEasterEggs";

export const metadata: Metadata = {
  title: "Research & STEM",
  description:
    "A bioinformatics IDE: explore Jadon Li's RNA-seq research on a mouse gout model, biology-olympiad results, and STEM programs entirely through a command line.",
};

export default function ResearchPage() {
  return (
    <main
      data-world="research"
      className="relative h-[100dvh] overflow-hidden pt-[3.25rem] md:pt-[4.25rem]"
    >
      <h1 className="sr-only">Research & STEM</h1>
      {/* hidden delights — Konami + factoid toasts */}
      <LabEasterEggs />
      <ResearchIDE />
    </main>
  );
}
