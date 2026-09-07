import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { StreamHero } from "@/components/built/StreamHero";
import { ProjectChapter } from "@/components/built/ProjectChapter";
import { PhotoStrip } from "@/components/built/PhotoStrip";
import { HermesFlow } from "@/components/built/HermesFlow";
import { Fleet } from "@/components/built/Fleet";
import { Dock } from "@/components/built/Dock";
import { Closing } from "@/components/built/Closing";
import { PROFILE, PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Things I've Built",
  description:
    "AcornPrep, Hermes, NotebookLI and five more — real products with real users. 500+ users, #1 Google result, shipped by a high-school builder.",
};

const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)!;

/**
 * The flagship's build record — four photographs already on the site, with the
 * captions exactly as they are vetted in `data.ts`'s albums ledger. Only
 * AcornPrep has a photo strip, and that is the point: the extra height is what
 * makes it outrank the chapters below without a label saying so.
 */
const ACORNPREP_PHOTOS = [
  {
    src: "/img/acornprep-cofounders.jpg",
    alt: "Jadon Li and Pradyun Kanuparthi in AcornPrep shirts",
    caption: "With Pradyun, co-founder",
  },
  {
    src: "/img/acornprep-presentation-promptengineering.jpg",
    alt: "Jadon Li presenting an AcornPrep prompt-engineering slide at a podium",
    caption: "Google Gemini developer meetup",
  },
  {
    src: "/img/ybvc-02.jpg",
    alt: "Jadon Li on the microphone beside Pradyun Kanuparthi, AcornPrep slide behind them",
    caption: "YBVC at Stanford",
  },
];

/**
 * Things I've Built — World 03.
 * Server component shell; every interactive section carries its own "use client".
 *
 * Weight is screen real estate: the top three get a chapter where the real
 * product pins and its features scroll past, the remaining five share one deck
 * you can throw.
 */
export default function BuiltPage() {
  return (
    <World id="built">
      <StreamHero />

      <ProjectChapter project={bySlug("acornprep")} index={1}>
        <PhotoStrip photos={ACORNPREP_PHOTOS} />
      </ProjectChapter>

      {/* Hermes has no interface to pin, so its section shows the pipeline
          itself rather than a screenshot of the one thing it emits.

          Nothing sits under the pipeline any more. A six-figure breakdown of
          one night's run — accounts, posts, new, duplicates, failures, run
          time — was telemetry from inside the machine; the section already
          says what the machine does and how often, and the numbers that
          matter to a reader are in the figures row above. */}
      <ProjectChapter
        project={bySlug("hermes")}
        index={2}
        stage={<HermesFlow shot="/embeds/hermes-story.jpg" />}
      />

      <ProjectChapter project={bySlug("notebookli")} index={3} />

      <Fleet />

      <Closing githubUser={PROFILE.links.githubUser} />

      <Dock />
      <Footer />
    </World>
  );
}
