"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";
import { asset } from "@/lib/base";
import { FLEET_CARDS } from "@/lib/built-story";
import { PROJECTS, type Project } from "@/lib/data";

/* ────────────────────────────────────────────────────────────────────
   Fleet — the five smaller products, as a filmstrip.

   The one full-bleed dark band on an otherwise white page, which is the job it
   is doing: these five are the tail of the record, and a room of their own
   stops them competing with the three that carry the page. Its top and bottom
   edges fade to white, so the band is a change of key rather than a seam.

   Each card is that site's viewport screenshot at 16:10 — the whole page, not
   a crop of it — and each `accent` is a colour lifted from that screenshot, so
   the backdrop swings to whatever you are pointing at.

   `PROJECTS` order IS display order and is the source of the numbering; the
   presentation copy lives in `built-story.ts`. Do not sort here.
   ──────────────────────────────────────────────────────────────────── */

const FLEET = PROJECTS.filter((p) => p.tier === 3);

/** Tier 3 starts at 04 because three chapters precede the strip. */
const OFFSET = PROJECTS.filter((p) => p.tier < 3).length;

const ITEMS: HeroCarouselItem[] = FLEET.map((p, i) => {
  const card = FLEET_CARDS[p.slug];
  return {
    id: p.slug,
    title: card.title,
    image: asset(`/embeds/fleet/${p.slug}.jpg`),
    href: p.url,
    credit: `${String(i + OFFSET + 1).padStart(2, "0")} — ${p.tagline.toUpperCase()}`,
    meta: card.facts,
    accent: card.accent,
    // The domain belongs to the action above the strip; captions identify the product.
    caption: {
      name: p.name,
      when: card.when,
    },
  };
});

/** The URL hash, as an external store — SSR-safe and free of effects. */
const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const readHash = () => window.location.hash.slice(1);
/** The server has no URL fragment; it never reaches the server anyway. */
const serverHash = () => "";

/**
 * What the focused product actually is: its figures, its stack, and the way
 * out to it. Sits above the strip, where the reference put three words.
 */
function Detail({ project }: { project: Project }) {
  const stats = project.stats.filter((stat) => stat.value !== "Live");
  return (
    <div className="flex flex-col items-start gap-4 sm:items-end">
      {project.slug === "msjhs-asb" && (
        <p className="text-sm text-white/80">Rebuilt with Kaiwei Parks.</p>
      )}
      {stats.length ? (
        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2 sm:justify-end">
          {stats.map((s) => (
            <span key={s.label} className="flex items-baseline gap-2">
              <span className="text-[1.35rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">
                {s.value}
              </span>
              <span className="text-[0.75rem] opacity-70">{s.label}</span>
            </span>
          ))}
        </div>
      ) : null}

      {/* No stack chips. "Web · Search · ASB" named a technology and told the
          reader nothing about the product; the figures and the link do the
          work. */}
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor-hover
          draggable={false}
          className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[0.78rem] font-semibold text-black transition-transform duration-150 active:scale-95"
        >
          {project.domain} <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

export function Fleet() {
  const [index, setIndex] = useState(0);

  /*
    Deep link: a hash for one of the five focuses that card. This strip is the
    only place these projects appear, so `/built#cuesheet` has to land ON
    CueSheet, not merely somewhere near the section.

    Read through `useSyncExternalStore` and reconciled during render rather
    than in an effect. An effect that calls setState on mount renders the
    section twice and, worse, paints card 01 for a frame before jumping — the
    reader sees the wrong product flash by on a deep link.
  */
  const hash = useSyncExternalStore(subscribeToHash, readHash, serverHash);
  const [seenHash, setSeenHash] = useState<string | null>(null);

  if (hash !== seenHash) {
    setSeenHash(hash);
    const i = FLEET.findIndex((p) => p.slug === hash);
    if (i >= 0 && i !== index) setIndex(i);
  }

  const onIndexChange = useCallback((next: number) => setIndex(next), []);
  const renderDetail = useCallback(
    (_item: HeroCarouselItem, i: number) => <Detail project={FLEET[i]} />,
    [],
  );

  return (
    <section id="fleet" className="scroll-mt-20">
      {/*
        Deep-link stubs, deliberately OUTSIDE the carousel: the strip is a
        transformed, overflow-hidden track, and a native anchor jump to an id
        inside it would scroll the track sideways underneath the transform and
        land on the wrong card.
      */}
      {FLEET.map((p) => (
        <div key={p.slug} id={p.slug} className="h-0 scroll-mt-24" aria-hidden />
      ))}

      <HeroCarousel
        items={ITEMS}
        index={index}
        onIndexChange={onIndexChange}
        renderDetail={renderDetail}
        brand={<span className="text-[var(--muted)]">More projects</span>}
        contentClassName="mx-auto max-w-7xl px-5 md:px-9"
        backgroundBlur={26}
        // 16:10 — a browser capture's own shape, so the whole page shows.
        cardAspect={1.6}
        captionRatio={0.16}
        fadeEdges={150}
        className="h-[84svh] min-h-[40rem] md:h-[88svh] md:min-h-[42rem]"
      />
    </section>
  );
}
