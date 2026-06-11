"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { CircleScribble } from "@/components/about/Doodles";

/**
 * Six passions as sticker cards — numbered, hand-drawn icons,
 * a hard offset shadow that grows on hover. All facts from the record.
 */

type Passion = {
  title: string;
  tag: string;
  body: string;
  note: string; // handwritten margin note
  icon: React.ReactNode;
};

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const PASSIONS: Passion[] = [
  {
    title: "Sports",
    tag: "the court & beyond",
    body: "Basketball since 3rd grade — varsity starter, 2026 NCS Champion (a first in school and district history). Off the court: skiing, swimming, running, hiking, ping pong.",
    note: "team dinners > drills",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden {...ICON_PROPS}>
        <circle cx="24" cy="24" r="19" />
        <path d="M5 24h38 M24 5c-7 6-7 32 0 38 M24 5c7 6 7 32 0 38" />
      </svg>
    ),
  },
  {
    title: "Cooking",
    tag: "jl kitchens",
    body: "Biweekly cooking with Samay — macarons perfected, Beef Ragu on rotation, a Hojicha Basque cheesecake still in progress. Full feasts for friends at Thanksgiving, New Year's, and Lunar New Year.",
    note: "1,657 food photos & counting",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden {...ICON_PROPS}>
        <path d="M8 28h32 M10 28c0-8 6-14 14-14s14 6 14 14 M24 14v-5 M14 36h20 M12 28l2 8m22-8l-2 8" />
      </svg>
    ),
  },
  {
    title: "Aerial Photography",
    tag: "faa part 107",
    body: "An FAA-approved drone pilot flying the places he could only see when he dreamed of flying — DJI Mini 2 SE, then the Avata 2 FPV, bought with saved and earned money.",
    note: "the sky was the first gallery",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden {...ICON_PROPS}>
        <path d="M18 24h12 M14 20a6 6 0 1 0 0 8 M34 20a6 6 0 1 1 0 8 M8 10l6 6m26-6l-6 6M8 38l6-6m26 6l-6-6" />
      </svg>
    ),
  },
  {
    title: "Videography",
    tag: "since the iphone 6",
    body: "Filming since he was a kid on his mom's iPhone 6. Now it's an Osmo Pocket 3, a city podcast in the edit bay, and videos that grew a mayor's reach from 1k to 10k.",
    note: "shoot, cut, post, repeat",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden {...ICON_PROPS}>
        <rect x="6" y="14" width="24" height="20" rx="2" />
        <path d="M30 22l12-7v18l-12-7 M11 14l5-6m6 6l5-6" />
      </svg>
    ),
  },
  {
    title: "Journaling",
    tag: "since 8th grade",
    body: "A journal kept since the start of 8th grade, at least once a month — first just summarizing events, then releasing the truth and going deeper. Every Mission Peak climb ends up in it.",
    note: "the rawest data on this site",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden {...ICON_PROPS}>
        <path d="M10 8h22v32H10z M16 8v32 M36 12l4 4-14 14-6 2 2-6z" />
      </svg>
    ),
  },
  {
    title: "Traveling",
    tag: "passport pages",
    body: "Six weeks in Xi'an with grandparents. Kyoto, Tokyo, Osaka. Taipei. And a Vancouver spring break chosen over AP grinding — he came back energized.",
    note: "street food is research",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden {...ICON_PROPS}>
        <path d="M6 34l36-14-8 18-8-6-6 8-2-10z M42 20L20 30" />
      </svg>
    ),
  },
];

export function PassionGrid() {
  return (
    <section className="relative border-y border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        <div className="relative mb-14 inline-block">
          <h2 className="font-anton text-4xl uppercase tracking-tight md:text-6xl">
            What I&apos;m <span className="relative inline-block">
              about
              <CircleScribble className="absolute -inset-x-4 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+2rem)]" />
            </span>
          </h2>
          <p className="font-hand mt-4 rotate-[-1.5deg] text-2xl text-[var(--muted)]">
            six things that never made the transcript
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PASSIONS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 28, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -0.6 : 0.8 }}
              whileHover={{ rotate: 0, y: -4 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
              data-cursor-hover
              className="group relative border border-[var(--fg)] bg-[var(--bg)] p-7 shadow-[5px_6px_0_rgba(23,21,17,0.14)] transition-shadow duration-300 hover:shadow-[8px_10px_0_color-mix(in_srgb,var(--accent)_55%,transparent)]"
            >
              <div className="flex items-start justify-between">
                <span className="h-11 w-11 text-[var(--fg)] transition-colors duration-300 group-hover:text-[var(--accent)]">
                  {p.icon}
                </span>
                <span className="font-mono text-xs text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 font-anton text-2xl uppercase leading-none tracking-tight">
                {p.title}
              </h3>
              <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--accent)]">
                {p.tag}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{p.body}</p>

              <p className="font-hand mt-5 rotate-[-1deg] text-xl leading-none text-[var(--fg)] opacity-70">
                — {p.note}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
