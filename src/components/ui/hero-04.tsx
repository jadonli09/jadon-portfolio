/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/base";
import { PROFILE } from "@/lib/data";

/**
 * Hero 04 — oversized-headline poster hero, themed for the Civic &
 * Storytelling world. Server component; all content is real (data.ts /
 * SpringLight profile), images are local /public assets.
 */
export function HeroSection04() {
  return (
    <section className="relative min-h-screen overflow-hidden pb-20 pt-36 md:pt-40">
      <div className="relative z-20 mx-auto max-w-7xl px-6">
        <div className="relative">
          <p className="absolute -top-4 left-20 text-sm font-medium tracking-wider">
            EST. 2025
          </p>
          <h1 className="relative z-20 text-center font-grotesk text-7xl font-bold tracking-[-7px] text-primary md:text-9xl md:tracking-[-14px] xl:text-[10rem] xl:tracking-[-1rem]">
            CIVIC STORYTELLER
          </h1>
          <p className="absolute -bottom-12 right-24 hidden text-4xl font-thin tracking-[6px] xl:block">
            {PROFILE.name.toUpperCase()}
          </p>
          <p className="absolute -bottom-12 left-24 text-4xl font-thin tracking-[6px] xl:hidden">
            {PROFILE.name.toUpperCase()}
          </p>
        </div>

        <div className="relative grid">
          <div className="flex justify-center gap-6 space-y-8 pt-20">
            <div className="flex h-fit w-full max-w-xl items-end gap-6 space-y-2 bg-secondary p-10 text-xl font-bold md:text-2xl lg:text-3xl">
              <div className="text-xl font-semibold">
                <div>/ CIVIC VIDEO</div>
                <div>/ PODCAST DIRECTION</div>
                <div>/ OP-ED &amp; CAMPAIGNS</div>
              </div>
              <div className="absolute -top-10 left-1/2 hidden w-fit overflow-hidden bg-secondary md:flex">
                <img
                  src={asset("/img/headshot1.jpg")}
                  alt={`${PROFILE.name} portrait`}
                  className="h-100 w-full object-contain grayscale"
                />
                <div className="rotate-180 p-2 text-left text-xs font-medium tracking-widest [writing-mode:vertical-rl]">
                  BASED IN FREMONT, CALIFORNIA
                </div>
              </div>
            </div>
          </div>
          <div className="-top-10 left-1/2 flex w-full overflow-hidden bg-secondary md:hidden md:w-fit">
            <img
              src={asset("/img/headshot1.jpg")}
              alt={`${PROFILE.name} portrait`}
              className="h-100 w-full object-contain grayscale"
            />
            <div className="rotate-180 p-2 text-left text-xs font-medium tracking-widest [writing-mode:vertical-rl]">
              BASED IN FREMONT, CALIFORNIA
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-40">
          <p className="mx-auto max-w-2xl text-center font-mono text-sm font-medium tracking-wide md:text-base">
            UNDER THE BANNER OF AMPERSAND MEDIA,
            <br />
            I TURN A CITY INTO A STORY — CIVIC VIDEO, PODCASTS,
            <br />
            AND CAMPAIGNS THAT MOVE REAL NUMBERS
          </p>
        </div>
        <div className="flex justify-center pt-6">
          <Button size="lg" asChild>
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>

        <div className="mt-20 items-end justify-between md:flex">
          <div className="relative">
            <div className="mb-8 h-36 w-60 overflow-hidden rounded-md border shadow-lg md:mb-0">
              <img
                src={asset("/img/speaking-at-rally.jpg")}
                alt="Speaking at a rally in Fremont"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -top-6 left-6 mb-8 h-36 w-60 overflow-hidden rounded-md border shadow-lg md:mb-0">
              <img
                src={asset("/img/editing-for-mayor-timeline.jpg")}
                alt="Editing timeline for a mayor video"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -top-12 left-12 mb-8 h-36 w-60 overflow-hidden rounded-md border shadow-lg md:mb-0">
              <img
                src={asset("/img/voices-of-fremont-with-jennifersiebalnewsom.jpg")}
                alt="Voices of Fremont with Jennifer Siebel Newsom"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 md:justify-end">
              <span className="text-lg font-medium tracking-wider">
                RECENT WORK
              </span>
              <ArrowDownRight className="size-6" />
            </div>

            <div className="mt-3 md:text-right">
              <h2 className="text-5xl uppercase tracking-[-4px]">
                A City, Documented
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Dashed-grid backdrop, fading from the top — follows the world's --line colour */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, var(--line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--line) 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </section>
  );
}
