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
    "Salwan Central, the hub Fremont Mayor Raj Salwan's office runs its resident conversations on; Rung, 2nd of 81 at a16z SpeedHacks; AcornPrep, 2,000+ users; and more.",
};

const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)!;

/**
 * The flagship's build record — four photographs already on the site, with the
 * captions exactly as they are vetted in `data.ts`'s albums ledger. Only
 * AcornPrep has a photo strip, and that is the point: the extra height is what
 * makes it outrank the chapters below without a label saying so.
 */
/** Real sessions run on Salwan Central, shot on Jadon's camera for the Mayor's media team. */
const SALWAN_PHOTOS = [
  {
    src: "/img/salwan/salwan-01.jpg",
    alt: "A student raising a cup of matcha with Mayor Raj Salwan at a café table",
    caption: "Matcha with the Mayor, Session 1",
  },
  {
    src: "/img/salwan/salwan-02.jpg",
    alt: "Mayor Raj Salwan talking with a table of high school students over matcha",
    caption: "Students bring the topic",
  },
  {
    src: "/img/salwan/salwan-06.jpg",
    alt: "A resident and Mayor Raj Salwan raising coffee cups in a café at night",
    caption: "Sips with Salwan, Session 2",
  },
  {
    src: "/img/salwan/salwan-09.jpg",
    alt: "Jadon Li holding a certificate beside Mayor Raj Salwan",
    caption: "With Mayor Salwan",
  },
];

const ACORNPREP_PHOTOS = [
  {
    src: "/img/acornprep-cofounders.jpg",
    alt: "Jadon Li and Pradyun Kanuparthi in AcornPrep shirts",
    caption: "With Pradyun, co-founder",
  },
  {
    src: "/img/presenting-acornprep-at-gemini-meetup.jpg",
    alt: "Jadon Li presenting AcornPrep to a seated audience at a Google Gemini developer meetup",
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

      <ProjectChapter project={bySlug("salwan-central")} index={1}>
        <PhotoStrip photos={SALWAN_PHOTOS} />
      </ProjectChapter>

      <ProjectChapter project={bySlug("rung")} index={2} />

      <ProjectChapter project={bySlug("acornprep")} index={3}>
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
        index={4}
        stage={<HermesFlow key="hermes-flow" shot="/embeds/hermes-story.jpg" />}
      />

      <Fleet />

      <Closing githubUser={PROFILE.links.githubUser} />

      <Dock />
      <Footer />
    </World>
  );
}
