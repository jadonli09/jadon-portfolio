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

/**
 * Hero 04 — oversized-headline poster hero, themed for the Civic &
 * Storytelling world. Server component; all content is real (data.ts /
 * SpringLight profile), images are local /public assets.
 */
export function HeroSection04() {
  return (
    <section className="relative overflow-hidden pb-10 pt-36 md:pb-14 md:pt-40">
      <div className="relative z-20 mx-auto max-w-7xl px-6">
        <div className="relative">
          <Reveal delay={0.5}>
            <p className="absolute -top-4 left-20 text-sm font-medium tracking-wider">
              EST. 2025
            </p>
          </Reveal>
          {/* Fluid below sm: "STORYTELLER" is too long for the original fixed text-7xl at 375px */}
          <KineticHeadline
            as="h1"
            text="CIVIC STORYTELLER"
            balance={false}
            className="relative z-20 text-center font-grotesk text-[13vw] font-bold tracking-[-0.08em] text-primary sm:text-7xl sm:tracking-[-7px] md:text-9xl md:tracking-[-14px] xl:text-[10rem] xl:tracking-[-1rem]"
          />
          <Reveal delay={0.6}>
            <p className="absolute -bottom-12 right-24 hidden text-4xl font-thin tracking-[6px] xl:block">
              {PROFILE.name.toUpperCase()}
            </p>
            <p className="absolute -bottom-12 left-24 text-4xl font-thin tracking-[6px] xl:hidden">
              {PROFILE.name.toUpperCase()}
            </p>
          </Reveal>
        </div>

        <div className="relative grid">
          <div className="flex justify-center gap-6 space-y-8 pt-20">
            <div className="flex h-fit w-full max-w-xl items-end gap-6 space-y-2 bg-secondary p-10 text-xl font-bold md:text-2xl lg:text-3xl">
              <div className="text-xl font-semibold">
                <div>/ CIVIC VIDEO</div>
                <div>/ PODCAST DIRECTION</div>
                <div>/ OP-ED &amp; CAMPAIGNS</div>
              </div>
              <div className="group absolute -top-10 left-1/2 hidden w-fit overflow-hidden bg-secondary md:flex">
                <img
                  src={asset("/img/civics-jadon-picture.jpg")}
                  alt={`${PROFILE.name} portrait`}
                  className="h-100 w-72 object-cover object-[35%_40%] transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.04]"
                />
                <div className="rotate-180 p-2 text-left text-xs font-medium tracking-widest [writing-mode:vertical-rl]">
                  BASED IN FREMONT, CALIFORNIA
                </div>
              </div>
            </div>
          </div>
          <div className="-top-10 left-1/2 flex w-full overflow-hidden bg-secondary md:hidden md:w-fit">
            <img
              src={asset("/img/civics-jadon-picture.jpg")}
              alt={`${PROFILE.name} portrait`}
              className="h-100 w-full object-cover object-[35%_40%]"
            />
            <div className="rotate-180 p-2 text-left text-xs font-medium tracking-widest [writing-mode:vertical-rl]">
              BASED IN FREMONT, CALIFORNIA
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-40">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center font-mono text-sm font-medium tracking-wide md:text-base">
              I TURN A CITY INTO A STORY —
              <br />
              CIVIC VIDEO, PODCASTS, AND CAMPAIGNS
              <br />
              THAT MOVE REAL NUMBERS
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="flex justify-center pt-6">
            <Button size="lg" asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </Reveal>

        <div className="mt-6 items-end justify-between md:mt-8 lg:flex">
          <Reveal>
            <PhotoStack photos={WORK_PHOTOS} />
          </Reveal>
          <div>
            <div className="flex items-center gap-2 lg:justify-end">
              <span className="text-lg font-medium tracking-wider">
                RECENT WORK
              </span>
              <ArrowDownRight className="size-6" />
            </div>

            <div className="mt-3 lg:text-right">
              <KineticHeadline
                as="h2"
                text="A City, Documented"
                className="text-5xl uppercase tracking-[-4px]"
              />
            </div>
          </div>
        </div>
      </div>

      <DashedGrid fade="top" />
    </section>
  );
}
