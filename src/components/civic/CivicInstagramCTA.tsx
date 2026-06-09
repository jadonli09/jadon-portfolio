"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { Magnetic } from "@/components/primitives/Magnetic";
import { PROFILE } from "@/lib/data";

/**
 * Magnetic Instagram CTA — editorial "field dispatch" block.
 * Links to the real Instagram account.
 */
export function CivicInstagramCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">
      <div className="relative border border-[var(--line)] bg-[var(--bg-2)] p-8 md:p-14">
        {/* Corner accent */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-px w-20 bg-[var(--accent)]"
        />
        <span
          aria-hidden
          className="absolute left-0 top-0 h-20 w-px bg-[var(--accent)]"
        />

        <Reveal>
          <p className="eyebrow mb-4 text-[var(--accent)]">Follow the dispatch</p>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="max-w-xl font-display text-3xl font-semibold leading-snug md:text-5xl">
            The story doesn&apos;t end here.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted)] md:text-lg">
            500k+ views in under a month. Civic video, behind-the-scenes dispatches, and the grind
            — all on Instagram.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-8">
            <Magnetic strength={0.35} className="inline-block">
              <a
                href={PROFILE.links.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group inline-flex items-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-7 py-4 font-mono text-xs uppercase tracking-widest text-white transition-colors duration-300 hover:bg-transparent hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {PROFILE.links.instagramHandle}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
          </div>
        </Reveal>

        {/* Background type watermark */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 right-6 select-none font-anton text-[6rem] uppercase leading-none text-[var(--accent)]/[0.06] md:text-[9rem]"
        >
          &amp;
        </span>
      </div>
    </section>
  );
}
