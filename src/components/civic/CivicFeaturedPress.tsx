"use client";

import { motion } from "motion/react";
import { CivicPressPhoto } from "@/components/civic/CivicPressPhoto";
import { Reveal } from "@/components/primitives/Reveal";
import { EASE } from "@/lib/motion";

/**
 * Standalone press feature — Jennifer Siebel Newsom photo.
 * Full-bleed editorial layout with a newsprint caption block.
 * Positioned between the awards ticker and the stories section.
 */
export function CivicFeaturedPress() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-9 md:py-16">
      {/* Section rule */}
      <Reveal>
        <div className="mb-6 flex items-center justify-between border-b border-[var(--fg)] pb-3 md:mb-8">
          <p className="font-anton text-sm uppercase tracking-widest text-[var(--accent)] md:text-base">
            Press
          </p>
          <p className="eyebrow hidden sm:block">California&nbsp;·&nbsp;2025</p>
        </div>
      </Reveal>

      {/* Asymmetric press layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_360px] md:items-start md:gap-10">
        {/* Photo — full-bleed left */}
        <CivicPressPhoto
          src="/img/voices-of-fremont-with-jennifersiebalnewsom.jpg"
          alt="Jadon Li with California First Partner Jennifer Siebel Newsom at Voices of Fremont"
          caption="Voices of Fremont · with California First Partner Jennifer Siebel Newsom"
          subCaption="Ampersand Media · 2025"
          variant="full-bleed"
          aspect="4 / 3"
          priority
        />

        {/* Right column — pull quote + context */}
        <Reveal delay={0.12}>
          <div className="flex h-full flex-col gap-6">
            {/* Red rule */}
            <div className="h-[2px] w-12 bg-[var(--accent)]" />

            {/* Headline */}
            <div>
              <p className="eyebrow mb-2 text-[var(--accent)]">Voices of Fremont</p>
              <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
                A Podcast at the <span className="italic">State Level</span>
              </h2>
            </div>

            {/* Body */}
            <p className="text-base leading-relaxed text-[var(--muted)]">
              Directs a civic podcast featuring the Mayor of Fremont on policy, operations,
              and the future of the city — and the connections that come with it. Met with
              California First Partner Jennifer Siebel Newsom as part of the{" "}
              <em>California Love, California Strong</em> initiative.
            </p>

            {/* Credential bar */}
            <div className="mt-auto border-t border-[var(--line)] pt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                    Format
                  </p>
                  <p className="mt-1 font-mono text-sm text-[var(--fg)]">Podcast</p>
                </div>
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                    Team
                  </p>
                  <p className="mt-1 font-mono text-sm text-[var(--fg)]">8 people</p>
                </div>
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                    Role
                  </p>
                  <p className="mt-1 font-mono text-sm text-[var(--fg)]">Director</p>
                </div>
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                    Since
                  </p>
                  <p className="mt-1 font-mono text-sm text-[var(--fg)]">Fall 2025</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Thin rule end */}
      <Reveal delay={0.2}>
        <motion.div
          className="mt-10 h-[1px] bg-[var(--line)] md:mt-14"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        />
      </Reveal>
    </section>
  );
}
