"use client";

import { motion } from "motion/react";
import { CivicPressPhoto } from "@/components/civic/CivicPressPhoto";
import { Reveal } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { EASE } from "@/lib/motion";

const CREDENTIAL_ROWS = [
  { label: "Format", val: "Podcast · ~7 min + short-form" },
  { label: "Cadence", val: "Monthly · thousands of views" },
  { label: "Role", val: "Director + Editor" },
  { label: "Origin", val: "Mayor's ask via Manav Patel" },
  { label: "Team", val: "8 people · 3 sections" },
  { label: "Since", val: "Fall 2025" },
] as const;

/**
 * Standalone press feature — Jennifer Siebel Newsom photo + Governor mention.
 * Full-bleed editorial layout with a newsprint caption block.
 * Enriched with podcast origin story and a second photo column.
 */
export function CivicFeaturedPress() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-9 md:py-16">
      {/* Section rule */}
      <Reveal>
        <div className="mb-6 flex items-center justify-between border-b border-[var(--fg)] pb-3 md:mb-8">
          <p className="font-anton text-sm uppercase tracking-widest text-[var(--accent)] md:text-base">
            Press&nbsp;&amp;&nbsp;Access
          </p>
          <p className="eyebrow hidden sm:block">California&nbsp;·&nbsp;2025</p>
        </div>
      </Reveal>

      {/* Asymmetric press layout — photo left, editorial right */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_360px] md:items-start md:gap-10">
        {/* Photo — full-bleed left */}
        <CivicPressPhoto
          src="/img/voices-of-fremont-with-jennifersiebalnewsom.jpg"
          alt="Jadon Li with California First Partner Jennifer Siebel Newsom at Voices of Fremont"
          caption="Voices of Fremont · with California First Partner Jennifer Siebel Newsom"
          subCaption="California Love, California Strong · 2025"
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

            {/* Origin story */}
            <div>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                It started with a single phone call.{" "}
                <strong className="text-[var(--fg)]">Manav Patel</strong>, the Mayor&apos;s assistant,
                reached out — the Mayor wanted an outlet to discuss city issues, solutions, and events
                with the public. Jadon was asked to build it from the ground up: concept, team, format,
                and distribution.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Each episode runs approximately 7 minutes, paired with short-form publicity cuts.
                The show interviews residents, highlights small businesses, and surfaces social issues —
                pulling thousands of views per month. The connections that come with it led all the way
                to the California First Partner.
              </p>
            </div>

            {/* Credential grid */}
            <div className="border border-[var(--line)]">
              {CREDENTIAL_ROWS.map((r, i) => (
                <div
                  key={r.label}
                  className={`flex items-start justify-between gap-4 px-4 py-3 ${i !== CREDENTIAL_ROWS.length - 1 ? "border-b border-[var(--line)]" : ""}`}
                >
                  <p className="shrink-0 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                    {r.label}
                  </p>
                  <p className="text-right font-mono text-[0.65rem] text-[var(--fg)]">{r.val}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Governor row — second press beat */}
      <Reveal delay={0.18}>
        <div className="mt-10 border border-[var(--line)] bg-[var(--bg-2)] p-6 md:mt-14 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            {/* Red accent mark */}
            <div className="hidden h-px w-10 shrink-0 bg-[var(--accent)] md:block" />

            <div className="flex-1">
              <p className="eyebrow mb-2 text-[var(--accent)]">Also in the room</p>
              <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl">
                Met the Governor &amp; California First Partner
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                As part of the <em>California Love, California Strong</em> initiative —
                civic journalism at the state level. A direct result of the Voices of Fremont platform.
              </p>
            </div>

            {/* Stat sidebar — views growth */}
            <div className="shrink-0 border-t border-[var(--line)] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                Monthly reach
              </p>
              <p className="mt-1 font-anton text-4xl leading-none text-[var(--accent)]">
                <Counter to={1000} suffix="s" duration={1.4} />
              </p>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                of views / month
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Thin rule end */}
      <Reveal delay={0.22}>
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
