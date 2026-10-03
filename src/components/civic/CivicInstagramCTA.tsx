"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Magnetic } from "@/components/primitives/Magnetic";
import { DashedGrid } from "@/components/ui/dashed-grid";
import { PROFILE } from "@/lib/data";

/**
 * Closing dispatch CTA: dashed grid, centered poster headline, one-line deck,
 * magnetic Instagram button.
 */
export function CivicInstagramCTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <DashedGrid fade="bottom" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <KineticHeadline
          as="h2"
          text="The Story Doesn't End Here"
          className="mx-auto font-grotesk text-[10vw] font-bold uppercase leading-[1.02] tracking-[-0.06em] sm:text-6xl sm:tracking-[-4px] md:text-8xl md:tracking-[-7px]"
          delay={0.08}
        />

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Civic video, behind-the-scenes dispatches, and the grind, all on Instagram.
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
                className="group inline-flex h-12 items-center gap-3 rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors duration-300 hover:bg-[var(--accent)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {PROFILE.links.instagramHandle}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
