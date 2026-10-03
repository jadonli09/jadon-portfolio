"use client";

import { motion } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { ClipCard } from "@/components/civic/ClipCard";
import { Photo } from "@/components/primitives/Photo";
import { PosterHeading } from "@/components/ui/poster-heading";
import { CIVIC } from "@/lib/data";
import { revealUp } from "@/lib/motion";

/** The two field stories, told in full — all real, from Jadon's achievement ledger. */
const SWEET_TOMATOES = {
  dateline: "Fremont, CA to Tucson, AZ, 2025",
  body: "The video that made him viral. He tracked down the realty company that owned the old Sweet Tomatoes location, then learned a Chinese couple had already bought it to open a Chinese food court. Jadon argued the location and local demographic wouldn't support it — and pitched a Sweet-Tomatoes-style restaurant instead. The owners were receptive. Working with the Mayor, they emailed the surviving Sweet Tomatoes in Tucson about Bay Area expansion.",
};

const MAYOR = {
  dateline: "Fremont, CA, since June 2025",
  photo: { src: "/img/editing-for-mayor-timeline.jpg", caption: "Cutting a Mayor video on the timeline" },
  body: "The Mayor spotted Jadon's @li_locked.in channel and reached out directly. Jadon films civic events and onstage talks, edits the footage, and delivers final cuts for the Mayor's Instagram — more than 60 videos to date. Per-video reach is up roughly sixteen-fold since he started, and the account's following has quadrupled.",
};

type Story = (typeof CIVIC.stories)[number];

/** Lead feature — the Sweet Tomatoes campaign, with its four reels in order. */
function LeadFeature({ story }: { story: Story }) {
  return (
    <Reveal>
      <article className="bg-secondary p-6 md:p-12">
        <div className="mb-5 h-[2px] w-16 bg-[var(--accent)]" />
        <KineticHeadline
          as="h3"
          text={story.title}
          className="font-grotesk text-[2.2rem] font-bold uppercase leading-[0.95] tracking-[-2px] text-[var(--fg)] md:text-[4.2rem] md:tracking-[-4px]"
          delay={0.05}
        />
        <p className="mt-3 text-base text-[var(--muted)]">{SWEET_TOMATOES.dateline}</p>

        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-[var(--fg)] md:text-lg [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:font-anton [&::first-letter]:text-[4rem] [&::first-letter]:leading-[0.82] [&::first-letter]:text-[var(--accent)]">
          {SWEET_TOMATOES.body}
        </p>

        <RevealGroup
          className="-mx-6 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0"
          stagger={0.06}
        >
          {CIVIC.sweetTomatoesReels.map((reel) => (
            <motion.div key={reel.url} variants={revealUp} className="w-[46%] shrink-0 snap-start md:w-auto">
              <ClipCard
                href={reel.url}
                poster={reel.poster}
                title={`“${reel.caption}”`}
                meta={`${reel.likes} likes, ${reel.date}`}
              />
            </motion.div>
          ))}
        </RevealGroup>
      </article>
    </Reveal>
  );
}

/** The Mayor's Videographer — the story, the edit bay, then his most-viewed cuts. */
function SecondFeature({ story }: { story: Story }) {
  return (
    <Reveal delay={0.05}>
      <article className="border border-[var(--line)] bg-[var(--bg)] p-6 md:border-l-8 md:border-l-[var(--accent)] md:p-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_19rem] md:gap-10">
          <div>
            <h3 className="font-grotesk text-3xl font-bold uppercase leading-tight tracking-[-1px] md:text-5xl md:tracking-[-3px]">
              {story.title}
            </h3>
            <p className="mt-2 text-base text-[var(--muted)]">{MAYOR.dateline}</p>
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-[var(--fg)] md:text-lg">{MAYOR.body}</p>
          </div>
          {/* the edit bay — stretches to the height of the story beside it */}
          <figure className="relative m-0 aspect-[4/3] overflow-hidden border border-[var(--line)] bg-[var(--bg-2)] md:aspect-auto">
            <Photo
              src={MAYOR.photo.src}
              alt="Jadon's editing timeline for a Mayor video"
              className="absolute inset-0"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-[var(--bg)]/85 px-3 py-2 text-sm text-[var(--fg)] backdrop-blur">
              {MAYOR.photo.caption}
            </figcaption>
          </figure>
        </div>

        <RevealGroup
          className="-mx-6 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0"
          stagger={0.06}
        >
          {CIVIC.mayorReels.map((reel) => (
            <motion.div key={reel.url} variants={revealUp} className="w-[46%] shrink-0 snap-start md:w-auto">
              <ClipCard href={reel.url} poster={reel.poster} title={reel.title} meta={`${reel.views} views`} />
            </motion.div>
          ))}
        </RevealGroup>
      </article>
    </Reveal>
  );
}

export function CivicStories() {
  const mayorStory = CIVIC.stories[0]; // "The Mayor's Videographer"
  const viralStory = CIVIC.stories[2]; // "Reviving Sweet Tomatoes"

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-9 md:py-20">
      <PosterHeading title="From the Field" className="mb-8 md:mb-12" />
      <SecondFeature story={mayorStory} />
      <div className="mt-6 md:mt-8">
        <LeadFeature story={viralStory} />
      </div>
    </section>
  );
}
