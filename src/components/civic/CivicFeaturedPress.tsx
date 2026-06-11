"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { CivicPressPhoto } from "@/components/civic/CivicPressPhoto";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Counter } from "@/components/primitives/Counter";
import { PosterHeading } from "@/components/ui/poster-heading";
import { asset } from "@/lib/base";
import { CIVIC } from "@/lib/data";
import { EASE, revealUp } from "@/lib/motion";

/** Real posts from the @voices_of_fremont feed (thumbnails captured Jun 2026). */
const VOF_FEED = [
  { src: "/embeds/vof-01.jpg", caption: "Ep. 01 — the introductory episode" },
  { src: "/embeds/vof-04.jpg", caption: "Governor Newsom takes the hot seat" },
  { src: "/embeds/vof-06.jpg", caption: "With First Partner Jennifer Siebel Newsom" },
  { src: "/embeds/vof-03.jpg", caption: "We asked Fremont: who runs the city?" },
  { src: "/embeds/vof-02.jpg", caption: "Central Park milestone · Lake Elizabeth" },
  { src: "/embeds/vof-05.jpg", caption: "Real questions, real answers" },
] as const;

const CREDENTIAL_ROWS = [
  { label: "Format", val: "Podcast · ~7 min + short-form" },
  { label: "Cadence", val: "Monthly · thousands of views" },
  { label: "Role", val: "Director + Editor" },
  { label: "Origin", val: "The Mayor's direct ask" },
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
      {/* Poster section heading */}
      <PosterHeading
        label="Press & Access"
        title="A Podcast at the State Level"
        meta="California · 2025"
        className="mb-10 md:mb-14"
      />

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

            {/* Series mark + label — links to the show's Instagram */}
            <a
              href={CIVIC.vofInstagram}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="group inline-flex items-center gap-3 transition-colors duration-300 hover:text-[var(--accent)]"
            >
              <img
                src={asset("/embeds/vof-logo.jpg")}
                alt="Voices of Fremont logo"
                className="h-12 w-12 shrink-0 rounded-md border bg-white object-contain p-1 shadow-sm transition-transform duration-500 ease-[var(--ease-cine)] group-hover:-rotate-3"
              />
              <span className="inline-flex items-center gap-2 text-lg font-semibold tracking-wide">
                / VOICES OF FREMONT
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
            </a>

            {/* Origin story */}
            <div>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                It started with a single phone call — from{" "}
                <strong className="text-[var(--fg)]">the Mayor himself</strong>. Mayor Salwan wanted
                an outlet to discuss city issues, solutions, and events with the public, and asked
                Jadon directly to build it from the ground up: concept, team, format, and
                distribution.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Each episode runs approximately 7 minutes, paired with short-form publicity cuts.
                The show interviews residents, highlights small businesses, and surfaces social issues —
                pulling thousands of views per month. The connections that come with it led all the way
                to the California First Partner.
              </p>
            </div>

            {/* Credential list — flat secondary box, hero-04 "/" vocabulary */}
            <div className="bg-secondary p-6 md:p-8">
              {CREDENTIAL_ROWS.map((r) => (
                <div
                  key={r.label}
                  className="group flex items-baseline justify-between gap-4 py-1.5"
                >
                  <p className="shrink-0 text-sm font-semibold tracking-wide transition-colors duration-300 group-hover:text-[var(--accent)]">
                    / {r.label.toUpperCase()}
                  </p>
                  <p className="text-right font-mono text-[0.65rem] text-[var(--muted)]">{r.val}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Governor row — second press beat */}
      <Reveal delay={0.18}>
        <div className="mt-10 bg-secondary p-6 md:mt-14 md:p-8">
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

      {/* From the feed — real posts, hero-04 card treatment, all link to the show's IG */}
      <div className="mt-12 md:mt-16">
        <Reveal>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-base font-medium tracking-wider md:text-lg">FROM THE FEED</span>
            <ArrowDownRight className="size-5 text-[var(--accent)]" />
            <a
              href={CIVIC.vofInstagram}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="ml-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--accent)]"
            >
              {CIVIC.vofHandle} ↗
            </a>
          </div>
        </Reveal>

        <RevealGroup
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6"
          stagger={0.06}
          delayChildren={0.05}
        >
          {VOF_FEED.map((post) => (
            <motion.a
              key={post.src}
              href={CIVIC.vofInstagram}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              variants={revealUp}
              whileHover={{ y: -6, rotate: -1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="group relative block aspect-square overflow-hidden rounded-md border shadow-lg"
            >
              <img
                src={asset(post.src)}
                alt={`Voices of Fremont — ${post.caption}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.06]"
              />
              {/* Caption strip slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[var(--fg)]/85 px-2.5 py-1.5 transition-transform duration-500 ease-[var(--ease-cine)] group-hover:translate-y-0">
                <p className="truncate font-mono text-[0.55rem] uppercase tracking-widest text-[var(--bg)]">
                  {post.caption}
                </p>
              </div>
              {/* Corner glyph */}
              <ArrowUpRight className="absolute right-2 top-2 h-3.5 w-3.5 text-white opacity-0 drop-shadow transition-opacity duration-300 group-hover:opacity-100" />
            </motion.a>
          ))}
        </RevealGroup>
      </div>

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
