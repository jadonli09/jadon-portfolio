/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashedGrid } from "@/components/ui/dashed-grid";
import { PhotoStack } from "@/components/ui/photo-stack";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { asset } from "@/lib/base";
import { CIVIC, PROFILE } from "@/lib/data";

const WORK_PHOTOS = [
  { src: asset("/img/speaking-at-rally.jpg"), alt: "Speaking at a rally in Fremont", caption: "Rally, 500+ turnout" },
  { src: asset("/img/editing-for-mayor-timeline.jpg"), alt: "Editing timeline for a mayor video", caption: "Editing for the Mayor" },
  {
    src: asset("/img/voices-of-fremont-with-jennifersiebalnewsom.jpg"),
    alt: "Voices of Fremont with Jennifer Siebel Newsom",
    caption: "With the First Partner",
  },
];

/**
 * The civic poster: the headline, one sentence, one way to reach him, and the
 * portrait. On desktop the work photos fan out in the rag beside CIVIC.
 */
export function CivicHero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-28 md:pb-16 md:pt-36">
      <div className="relative z-20 mx-auto grid max-w-7xl gap-x-14 gap-y-10 px-6 md:grid-cols-[minmax(0,1fr)_17rem] lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 md:self-end">
          <div className="relative">
            <KineticHeadline
              as="h1"
              text="CIVIC STORYTELLER"
              balance={false}
              className="relative z-20 max-w-[12ch] font-grotesk text-[12.8vw] font-bold leading-[0.82] tracking-[-0.045em] text-primary md:text-[8vw] md:tracking-[-0.065em] xl:text-[8.6vw]"
            />
            <div className="absolute right-0 top-2 z-30 hidden lg:block">
              <PhotoStack photos={WORK_PHOTOS} variant="compact" />
            </div>
          </div>

          <Reveal>
            <p className="mt-8 max-w-[38ch] text-lg leading-relaxed text-[var(--fg)] md:mt-12 md:text-xl">
              {CIVIC.intro}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/contact"
              data-cursor-hover
              className="group mt-7 inline-flex h-14 items-center gap-3 rounded-md bg-primary px-7 text-[1.0625rem] font-medium text-primary-foreground transition-colors duration-300 hover:bg-[var(--accent)] hover:text-white"
            >
              Get in touch
              <ArrowRight className="size-4 transition-[translate] duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="relative mx-auto aspect-[3/4] w-full max-w-[22rem] overflow-hidden bg-secondary md:max-w-none">
          <img
            src={asset("/img/civics-jadon-picture.jpg")}
            alt={`${PROFILE.name} portrait`}
            className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-700 ease-[var(--ease-cine)] hover:scale-[1.04]"
          />
        </div>
      </div>

      <DashedGrid fade="top" />
    </section>
  );
}
