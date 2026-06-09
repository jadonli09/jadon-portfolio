"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { TiltCard } from "@/components/primitives/TiltCard";
import { CivicVideoFrame } from "@/components/civic/CivicVideoFrame";
import { CivicPressPhoto } from "@/components/civic/CivicPressPhoto";
import { Photo } from "@/components/primitives/Photo";
import { CIVIC } from "@/lib/data";
import { cn } from "@/lib/cn";

/** Map story title to its real press photo, if any. */
const STORY_PHOTOS: Record<string, { src: string; caption: string }> = {
  "The Mayor's Videographer": {
    src: "/img/editing-for-mayor-timeline.jpg",
    caption: "Editing for Mayor Salwan · @li_locked.in",
  },
  "Small Business Accessibility": {
    src: "/img/speaking-at-rally.jpg",
    caption: "Speaking at a community rally · Fremont, CA",
  },
  "HG Nguyen for D7": {
    src: "/img/acwd-water-contest-1stplace.jpg",
    caption: "ACWD Water Clip Contest · 1st Place · $600",
  },
};

type Story = (typeof CIVIC.stories)[number];

/** Hover-expanded article card for secondary stories. */
function ArticleCard({ story, index }: { story: Story; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const photo = STORY_PHOTOS[story.title];

  return (
    <TiltCard max={4} className="h-full">
      <motion.article
        data-cursor-hover
        className={cn(
          "group relative flex h-full flex-col border border-[var(--line)] bg-[var(--bg)] transition-colors duration-300 hover:border-[var(--accent)] hover:bg-[var(--bg-2)]",
        )}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        tabIndex={0}
      >
        {/* Press photo at the top of the card (if available) */}
        {photo && (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            {/* Red accent top rule */}
            <div className="absolute left-0 right-0 top-0 z-10 h-[2px] bg-[var(--accent)]" />
            <motion.div
              className="h-full w-full"
              animate={{ scale: expanded ? 1.04 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Photo
                src={photo.src}
                alt={photo.caption}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        )}

        <div className="flex flex-1 flex-col p-6 md:p-8">
          {/* Index + handle row */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--accent)]">
              {story.handle}
            </span>
            <span className="font-mono text-[0.6rem] text-[var(--muted)] opacity-60">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Dateline */}
          <p className="eyebrow mb-3 text-[var(--muted)]">{story.window}</p>

          {/* Title with underline-wipe on hover */}
          <h3 className="relative mb-3 inline-block font-display text-xl font-semibold leading-tight md:text-2xl">
            <span className="relative">
              {story.title}
              <motion.span
                className="absolute -bottom-0.5 left-0 h-[1px] bg-[var(--accent)]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: expanded ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: "100%" }}
              />
            </span>
          </h3>

          {/* Body */}
          <p className="mt-auto text-sm leading-relaxed text-[var(--muted)]">{story.body}</p>

          {/* Read-more glyph */}
          <motion.div
            className="mt-5 flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--accent)]"
            animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : 4 }}
            transition={{ duration: 0.3 }}
          >
            Full story <ArrowUpRight className="h-3 w-3" />
          </motion.div>
        </div>
      </motion.article>
    </TiltCard>
  );
}

/** Lead front-page feature (Sweet Tomatoes viral origin). */
function LeadFeature({ story }: { story: Story }) {
  return (
    <Reveal>
      <article className="group relative border border-[var(--line)] bg-[var(--bg-2)] p-7 md:p-12">
        {/* Red rule accent */}
        <div className="mb-5 h-[2px] w-16 bg-[var(--accent)]" />

        {/* Label */}
        <div className="mb-3 flex items-center gap-4">
          <span className="eyebrow text-[var(--accent)]">Lead Story</span>
          <span className="eyebrow">{story.window}</span>
          <span className="eyebrow ml-auto opacity-60">{story.handle}</span>
        </div>

        {/* Headline — big editorial with Anton */}
        <KineticHeadline
          as="h2"
          text={story.title}
          className="font-anton text-[2.6rem] uppercase leading-[0.95] tracking-tight text-[var(--fg)] md:text-[5rem]"
          delay={0.05}
        />

        {/* Body with drop-cap styling */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <p
            className="text-base leading-relaxed text-[var(--fg)] md:text-lg [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:font-anton [&::first-letter]:text-[4rem] [&::first-letter]:leading-[0.82] [&::first-letter]:text-[var(--accent)]"
          >
            {story.body}
          </p>

          {/* Video placeholder frame */}
          <CivicVideoFrame
            caption="Campaign clip · @li_locked.in"
            label="Play clip"
          />
        </div>

        {/* Bottom rule */}
        <div className="mt-8 border-t border-[var(--line)] pt-4">
          <p className="eyebrow">
            The campaign that put {story.handle.toLowerCase()} on the map
          </p>
        </div>
      </article>
    </Reveal>
  );
}

/** Mayor's Videographer — second hero story, distinct layout. */
function SecondFeature({ story }: { story: Story }) {
  const photo = STORY_PHOTOS[story.title];

  return (
    <Reveal delay={0.05}>
      <article className="relative flex flex-col border border-[var(--line)] bg-[var(--bg)] p-7 md:flex-row md:items-stretch md:p-0">
        {/* Side accent band */}
        <div className="hidden w-2 shrink-0 bg-[var(--accent)] md:block" />

        <div className="flex-1 p-7 md:p-10">
          {/* Label row */}
          <div className="mb-3 flex flex-wrap items-center gap-4">
            <span className="eyebrow text-[var(--accent)]">Videography</span>
            <span className="eyebrow">{story.window}</span>
          </div>

          <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
            {story.title}
          </h2>

          <p className="mt-2 font-mono text-xs text-[var(--muted)]">{story.handle}</p>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
            <p className="max-w-xl text-base leading-relaxed text-[var(--fg)] md:text-lg">
              {story.body}
            </p>

            {/* Press photo — editing session */}
            {photo && (
              <CivicPressPhoto
                src={photo.src}
                alt={photo.caption}
                caption={photo.caption}
                variant="frame"
                aspect="4 / 3"
                className="w-full md:w-56 shrink-0"
              />
            )}
          </div>
        </div>

        {/* Stat sidebar */}
        <div className="shrink-0 border-t border-[var(--line)] p-7 md:w-48 md:border-l md:border-t-0 md:p-8">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
            Growth
          </p>
          <p className="mt-2 font-anton text-4xl leading-none text-[var(--accent)]">1k → 10k</p>
          <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
            Views/video
          </p>
          <div className="mt-6 border-t border-[var(--line)] pt-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              First invoice
            </p>
            <p className="mt-1 font-display text-2xl font-semibold">$600</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function CivicStories() {
  // Stories by position: Sweet Tomatoes (#2 idx) = viral lead, Mayor's Videographer (#0) = second feature
  // Rest go into column grid
  const viralStory = CIVIC.stories[2]; // "Reviving Sweet Tomatoes"
  const mayorStory = CIVIC.stories[0]; // "The Mayor's Videographer"
  const secondaryStories = CIVIC.stories.filter((_, i) => i !== 2 && i !== 0);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">
      {/* Section masthead */}
      <Reveal>
        <div className="mb-8 flex items-baseline justify-between border-b border-[var(--fg)] pb-3 md:mb-12">
          <div className="flex items-baseline gap-4 md:gap-6">
            <p className="font-anton text-sm uppercase tracking-widest text-[var(--accent)] md:text-base">
              The Stories
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              {CIVIC.stories.length}&nbsp;features
            </p>
          </div>
          <p className="eyebrow hidden sm:block">Ampersand&nbsp;Media&nbsp;·&nbsp;2025</p>
        </div>
      </Reveal>

      {/* Lead feature — Sweet Tomatoes viral origin */}
      <LeadFeature story={viralStory} />

      {/* Mayor story — horizontal layout */}
      <div className="mt-6 md:mt-8">
        <SecondFeature story={mayorStory} />
      </div>

      {/* Secondary grid */}
      <div className="mt-6 md:mt-8">
        <Reveal className="mb-5">
          <div className="flex items-center gap-3 border-b border-[var(--line)] pb-3">
            <p className="eyebrow text-[var(--muted)]">More from the field</p>
          </div>
        </Reveal>

        <RevealGroup
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
          stagger={0.07}
          delayChildren={0.05}
        >
          {secondaryStories.map((story, i) => (
            <ArticleCard key={story.title} story={story} index={i} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
