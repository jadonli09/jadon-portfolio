/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashedGrid } from "@/components/ui/dashed-grid";
import { PhotoStack } from "@/components/ui/photo-stack";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { asset } from "@/lib/base";
import { PROFILE } from "@/lib/data";

const WORK_PHOTOS = [
  {
    src: asset("/img/speaking-at-rally.jpg"),
    alt: "Speaking at a rally in Fremont",
    caption: "Rally · 500+ turnout",
  },
  {
    src: asset("/img/editing-for-mayor-timeline.jpg"),
    alt: "Editing timeline for a mayor video",
    caption: "Editing for the Mayor",
  },
  {
    src: asset("/img/voices-of-fremont-with-jennifersiebalnewsom.jpg"),
    alt: "Voices of Fremont with Jennifer Siebel Newsom",
    caption: "With the First Partner",
  },
];

const SERVICES = ["/ CIVIC VIDEO", "/ PODCAST DIRECTION", "/ OP-ED & CAMPAIGNS"];

/**
 * The portrait, whole. The frame carries the photo's own 3:4 ratio so nothing
 * is cropped off it; the location strip is a sibling column, not an overlay.
 */
function Portrait() {
  return (
    <div className="group flex bg-secondary">
      <div className="relative aspect-[3/4] min-w-0 flex-1 overflow-hidden">
        <img
          src={asset("/img/civics-jadon-picture.jpg")}
          alt={`${PROFILE.name} portrait`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="shrink-0 rotate-180 p-2 text-left text-xs font-medium tracking-widest [writing-mode:vertical-rl]">
        BASED IN FREMONT, CALIFORNIA
      </div>
    </div>
  );
}

function RecentWork() {
  return (
    <div className="mt-6 text-right">
      <div className="flex items-center justify-end gap-2">
        <span className="text-lg font-medium tracking-wider">RECENT WORK</span>
        <ArrowDownRight className="size-6" />
      </div>
      <div className="mt-2">
        <KineticHeadline
          as="h2"
          text="A City, Documented"
          className="text-right text-[2.1rem] uppercase leading-[1.05] tracking-[-2px] lg:text-4xl lg:tracking-[-3px]"
        />
      </div>
    </div>
  );
}

/**
 * Hero 04 — oversized-headline poster hero for the Civic world.
 *
 * One block, no leftover strip at the bottom: the headline runs flush left,
 * the fanned work photos fill the rag beside CIVIC, and the portrait column on
 * the right carries the "A City, Documented" heading under it. Everything that
 * used to sit in its own row below the fold now holds up part of the poster.
 */
export function HeroSection04() {
  return (
    <section className="relative overflow-hidden pb-12 pt-32 md:pb-16 md:pt-36">
      <div className="relative z-20 mx-auto max-w-7xl px-6">
        <Reveal delay={0.4}>
          <div className="flex items-baseline justify-between border-b border-primary/15 pb-4 font-mono text-xs font-medium tracking-[0.2em] md:text-sm">
            <span>EST. 2025</span>
            <span className="tracking-[0.4em]">{PROFILE.name.toUpperCase()}</span>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-x-14 gap-y-10 md:mt-9 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
          {/* ── left: the headline, the services, the promise ── */}
          <div className="min-w-0">
            <div className="relative">
              <KineticHeadline
                as="h1"
                text="CIVIC STORYTELLER"
                balance={false}
                className="relative z-20 max-w-[12ch] font-grotesk text-[12.8vw] font-bold leading-[0.82] tracking-[-0.045em] text-primary md:text-[10.5vw] md:tracking-[-0.065em] lg:text-[8.2vw] xl:text-[8.6vw]"
              />
              {/* Fanned into the rag to the right of CIVIC — short enough to
                  live inside that one line without landing on STORYTELLER. */}
              <div className="absolute right-0 top-2 z-30 hidden lg:block">
                <PhotoStack photos={WORK_PHOTOS} variant="compact" />
              </div>
            </div>

            <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end md:mt-14 lg:mt-16">
              <div className="bg-secondary px-8 py-7 text-xl font-semibold leading-[1.75]">
                {SERVICES.map((s) => (
                  <div key={s}>{s}</div>
                ))}
              </div>
              <div>
                <Reveal>
                  <p className="max-w-[42ch] font-mono text-sm font-medium leading-[1.7] tracking-wide md:text-base">
                    I TURN A CITY INTO A STORY — CIVIC VIDEO, PODCASTS, AND CAMPAIGNS THAT MOVE
                    REAL NUMBERS.
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="mt-6">
                    <Button size="lg" asChild>
                      <Link href="/contact">Get in touch</Link>
                    </Button>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Below lg there is no rag to sit in, so the pile rides here. */}
            <div className="mt-12 lg:hidden">
              <Reveal>
                <PhotoStack photos={WORK_PHOTOS} />
              </Reveal>
            </div>
          </div>

          {/* ── right: the portrait, whole, and what it points at ── */}
          <div className="lg:pt-1">
            <Portrait />
            <Reveal delay={0.1}>
              <RecentWork />
            </Reveal>
          </div>
        </div>
      </div>

      <DashedGrid fade="top" />
    </section>
  );
}
