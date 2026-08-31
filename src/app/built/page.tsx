import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/primitives/Reveal";
import { BuiltHero } from "@/components/built/BuiltHero";
import { MissionIndex } from "@/components/built/MissionIndex";
import { Chapter } from "@/components/built/Chapter";
import { FleetDeck } from "@/components/built/FleetDeck";
import { RepoStrip } from "@/components/built/RepoStrip";
import { AcornDemo } from "@/components/built/demos/AcornDemo";
import { HermesPipeline } from "@/components/built/demos/HermesPipeline";
import { NotebookReader } from "@/components/built/demos/NotebookReader";
import { DecodeText, MissionRail } from "@/components/built/MissionFX";
import { PROFILE, PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Things I've Built",
  description:
    "AcornPrep, Hermes, NotebookLI and five more — real products with real users. 500+ users, #1 Google result, shipped by a high-school builder.",
};

const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)!;

/**
 * The flagship's build record — two real photographs, both already on the site
 * (albums gallery / hero). Only AcornPrep has one, and that is the point: the
 * extra screen height is what makes tier 1 outweigh tier 2 without a label
 * announcing it.
 */
const ACORNPREP_PHOTOS = [
  {
    src: "/img/acornprep-cofounders.jpg",
    alt: "Jadon Li and Pradyun Kanuparthi in AcornPrep shirts",
    caption: "The co-founders, Jadon Li & Pradyun Kanuparthi",
  },
  {
    src: "/img/acornprep-presentation-promptengineering.jpg",
    alt: "Jadon Li presenting an AcornPrep prompt-engineering slide at a podium",
    caption: "Presenting at the Google Gemini developer meetup",
  },
];

/**
 * Things I've Built — World 03.
 * Server component shell. Interactive sections carry their own "use client".
 *
 * Weight is encoded as screen real estate: the top three projects get full
 * chapters with playable demos, the remaining five share one screen as a deck.
 */
export default function BuiltPage() {
  return (
    <World id="built">
      <MissionRail />

      <BuiltHero />
      <MissionIndex />

      <Chapter project={bySlug("acornprep")} no="01" photos={ACORNPREP_PHOTOS}>
        <AcornDemo />
      </Chapter>

      <Chapter project={bySlug("hermes")} no="02">
        <HermesPipeline />
      </Chapter>

      <Chapter project={bySlug("notebookli")} no="03">
        <NotebookReader />
      </Chapter>

      <FleetDeck />

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center md:px-9 md:py-28">
        <Reveal>
          <h2 className="mission-display text-[2.6rem] md:text-[4.4rem]">
            <DecodeText text="Build something" />{" "}
            <span className="stencil">
              <DecodeText text="people use." duration={1.2} />
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.3} className="mt-8">
          <p className="mx-auto max-w-xl font-mono text-sm leading-relaxed text-[var(--muted)]">
            Every product here started as a question — what if there was a better way to study
            for AP exams? The answer is always the same: build it.
          </p>
        </Reveal>

        <RepoStrip user={PROFILE.links.githubUser} />
      </section>

      <Footer />
    </World>
  );
}
