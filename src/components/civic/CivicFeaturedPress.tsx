"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Clapperboard, Play } from "lucide-react";
import { CivicPressPhoto } from "@/components/civic/CivicPressPhoto";
import { IgEmbed } from "@/components/civic/IgEmbed";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { PosterHeading } from "@/components/ui/poster-heading";
import { asset } from "@/lib/base";
import { CIVIC } from "@/lib/data";
import { cn } from "@/lib/cn";
import { EASE, revealUp } from "@/lib/motion";

/** Real posts from the @voices_of_fremont feed — each links to its own reel. */
const VOF_FEED = [
  { src: "/embeds/vof-01.jpg", caption: "Ep. 01 — the introductory episode", url: "https://www.instagram.com/reel/DZC_Q50uvax/" },
  { src: "/embeds/vof-04.jpg", caption: "Governor Newsom takes the hot seat", url: "https://www.instagram.com/reel/DXhWX5KEapX/" },
  { src: "/embeds/vof-06.jpg", caption: "With First Partner Jennifer Siebel Newsom", url: "https://www.instagram.com/reel/DW7ZWP6jpOA/" },
  { src: "/embeds/vof-03.jpg", caption: "We asked Fremont: who runs the city?", url: "https://www.instagram.com/reel/DW1Q3Z2Dno_/" },
  { src: "/embeds/vof-02.jpg", caption: "Central Park milestone · Lake Elizabeth", url: "https://www.instagram.com/reel/DWDGRnzkdFA/" },
  { src: "/embeds/vof-05.jpg", caption: "Real questions, real answers", url: "https://www.instagram.com/reel/DVqoJeUjpH_/" },
] as const;

/** The few stats worth keeping — shown as a scannable graphic, not a list. */
const STATS = [
  { k: "Format", v: "~7 min", sub: "+ short-form" },
  { k: "Reach", v: "50k", sub: "views / month" },
  { k: "On air", v: "Fall '25", sub: "monthly" },
] as const;

/** The actual reel — content-frame poster (never black); on click it swaps to
 *  the live Instagram embed (with like / comment counts), playing in place. */
function VofReel() {
  const [open, setOpen] = useState(false);
  if (open) return <IgEmbed reel="DSoCK6UDm57" />;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      data-cursor-hover
      aria-label="Play the Voices of Fremont reel"
      className="group relative block w-full overflow-hidden border border-[var(--line)] shadow-lg"
    >
      <img
        src={asset("/img/vof-reel-poster.jpg")}
        alt="Voices of Fremont reel — debunking Fremont stereotypes with the Mayor"
        className="aspect-[9/16] w-full bg-black object-cover"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-black/10">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--accent)] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110">
          <Play className="size-7 translate-x-0.5 fill-white text-white" strokeWidth={0} />
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/15 bg-black/55 px-3 py-2 backdrop-blur">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/90">
          Voices of Fremont · the reel
        </span>
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white">Watch ▶</span>
      </span>
    </button>
  );
}

/** One @voices_of_fremont feed tile — links straight to its reel. */
function FeedTile({ src, caption, url }: { src: string; caption: string; url: string }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      data-cursor-hover
      variants={revealUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="group relative block aspect-[4/3] overflow-hidden rounded-md border shadow"
    >
      <img
        src={asset(src)}
        alt={`Voices of Fremont — ${caption}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[var(--fg)]/85 px-2 py-1 transition-transform duration-500 ease-[var(--ease-cine)] group-hover:translate-y-0">
        <p className="truncate font-mono text-[0.5rem] uppercase tracking-widest text-[var(--bg)]">{caption}</p>
      </div>
      <ArrowUpRight className="absolute right-1.5 top-1.5 h-3 w-3 text-white opacity-0 drop-shadow transition-opacity duration-300 group-hover:opacity-100" />
    </motion.a>
  );
}

/**
 * Voices of Fremont — the Mayor's podcast Jadon directs and edits. Lead is the
 * actual reel (inline), the feed fills the column beside it, and the First
 * Partner beat sits compact at the very bottom.
 */
export function CivicFeaturedPress() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-9 md:py-16">
      <PosterHeading
        label="Press & Access"
        title="A Podcast at the State Level"
        meta="California · 2025"
        className="mb-10 md:mb-14"
      />

      {/* Lead — the reel + editorial column (text, stats, feed) */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,440px)_1fr] md:items-start md:gap-12">
        <Reveal>
          <VofReel />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex flex-col gap-6">
            <div className="h-[2px] w-12 bg-[var(--accent)]" />

            {/* Series mark */}
            <a
              href={CIVIC.vofInstagram}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="group inline-flex w-fit items-center gap-3 transition-colors duration-300 hover:text-[var(--accent)]"
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

            {/* Director / Editor credit */}
            <div className="flex items-center gap-2.5 border-l-2 border-[var(--accent)] pl-3">
              <Clapperboard className="size-4 shrink-0 text-[var(--accent)]" />
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--fg)]">
                Directed &amp; edited by Jadon Li
              </p>
            </div>

            {/* Origin + younger-audience messaging */}
            <div>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                It started with a call from <strong className="text-[var(--fg)]">the Mayor himself</strong> — Mayor
                Salwan wanted a public outlet for city issues and events, and asked Jadon to build it from the ground
                up: concept, team, format, and distribution.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                But it isn&apos;t only a platform for the Mayor. The goal is to make civics land with a{" "}
                <strong className="text-[var(--fg)]">younger audience</strong> — through modern, short-form content
                like the reel here, which rides a trend to carry a civic idea and reaches students, not just
                subscribers.
              </p>
            </div>

            {/* Stats — scannable graphic */}
            <div className="grid grid-cols-3 overflow-hidden rounded-md border border-[var(--line)] bg-[var(--bg-2)]">
              {STATS.map((s, i) => (
                <div key={s.k} className={cn("px-3 py-4 text-center", i > 0 && "border-l border-[var(--line)]")}>
                  <p className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[var(--muted)]">{s.k}</p>
                  <p className="mt-1.5 font-anton text-2xl leading-none text-[var(--accent)] md:text-3xl">{s.v}</p>
                  <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)]">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* From the feed — fills the space beside the reel */}
            <div className="mt-1">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-sm font-medium tracking-wider">FROM THE FEED</span>
                <a
                  href={CIVIC.vofInstagram}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--accent)]"
                >
                  {CIVIC.vofHandle} ↗
                </a>
              </div>
              <RevealGroup className="grid grid-cols-3 gap-3" stagger={0.05} delayChildren={0.05}>
                {VOF_FEED.map((post) => (
                  <FeedTile key={post.src} src={post.src} caption={post.caption} url={post.url} />
                ))}
              </RevealGroup>
            </div>
          </div>
        </Reveal>
      </div>

      {/* First Partner — compact, at the very bottom */}
      <Reveal delay={0.2}>
        <div className="mt-12 grid grid-cols-1 items-center gap-6 bg-secondary p-5 md:mt-16 md:grid-cols-2 md:gap-10 md:p-7">
          <CivicPressPhoto
            src="/img/voices-of-fremont-with-jennifersiebalnewsom.jpg"
            alt="Jadon Li with California First Partner Jennifer Siebel Newsom"
            caption="With California First Partner Jennifer Siebel Newsom"
            variant="full-bleed"
            aspect="16 / 9"
          />
          <div>
            <p className="eyebrow mb-2 text-base text-[var(--accent)]">Also in the room</p>
            <h3 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
              Met the Governor &amp; California First Partner
            </h3>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
              As part of the <em>California Love, California Strong</em> initiative — civic journalism at the state
              level, and a direct result of the Voices of Fremont platform.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Thin rule end */}
      <Reveal delay={0.24}>
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
