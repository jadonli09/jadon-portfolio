"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Magnetic } from "@/components/primitives/Magnetic";
import { DashedGrid } from "@/components/ui/dashed-grid";
import { PROFILE } from "@/lib/data";

/**
 * Closing dispatch CTA — hero-04 bookend: dashed grid, centered poster
 * headline, mono uppercase deck, magnetic Instagram button.
 */
export function CivicInstagramCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <DashedGrid fade="bottom" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-base font-medium tracking-wider md:text-lg">
              FOLLOW THE DISPATCH
            </span>
            <ArrowDownRight className="size-5 text-[var(--accent)]" />
          </div>
        </Reveal>

        <KineticHeadline
          as="h2"
          text="The Story Doesn't End Here"
          className="mx-auto font-grotesk text-[10vw] font-bold uppercase leading-[1.02] tracking-[-0.06em] sm:text-6xl sm:tracking-[-4px] md:text-8xl md:tracking-[-7px]"
          delay={0.08}
        />

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl font-mono text-sm font-medium tracking-wide md:text-base">
            500K+ VIEWS IN UNDER A MONTH.
            <br />
            CIVIC VIDEO, BEHIND-THE-SCENES DISPATCHES,
            <br />
            AND THE GRIND — ALL ON INSTAGRAM
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex justify-center">
            <Magnetic strength={0.35} className="inline-block">
              <a
                href={PROFILE.links.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group inline-flex h-11 items-center gap-3 rounded-md bg-primary px-8 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-colors duration-300 hover:bg-[var(--accent)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {PROFILE.links.instagramHandle}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
          </div>
        </Reveal>

        {/* Sign-off — bookends the hero's name treatment */}
        <Reveal delay={0.4}>
          <p className="mt-14 text-4xl font-thin tracking-[6px] text-[var(--muted)]">
            {PROFILE.name.toUpperCase()}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
