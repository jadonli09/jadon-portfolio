"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { Develop } from "@/components/built/Develop";
import { LiveEmbed } from "@/components/built/LiveEmbed";
import { DecodeText, StatValue } from "@/components/built/MissionFX";
import { PROJECTS } from "@/lib/data";
import { cn } from "@/lib/cn";

/**
 * Tier 3 in `PROJECTS` order: ASB, YSJ, CueSheet, MSJ Makes, jadonli.com —
 * the site itself last, as the closing wink. Do not sort; array order is the
 * canonical display order and `MissionIndex` numbers off the same sequence.
 */
const FLEET = PROJECTS.filter((p) => p.tier === 3);

/** Tier 3 starts at M-04 because three chapters precede the deck. */
const FLEET_OFFSET = PROJECTS.filter((p) => p.tier < 3).length;

export function FleetDeck() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false, align: "start" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  // Embla always starts at snap 0, matching the initial `selected` state
  // above — no synchronous sync call needed on mount. From here on the
  // "select" subscription keeps them in lockstep.
  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  // Deep link: /built#cuesheet advances the deck to that panel — both on a
  // cold load AND on a same-document hash change. A `MissionIndex` row is an
  // <a href="#slug">: clicking it never remounts this component, so the
  // hashchange listener is what actually moves the deck for that click.
  useEffect(() => {
    if (!embla) return;

    const goToHash = (jump: boolean) => {
      const hash = window.location.hash.slice(1);
      const i = FLEET.findIndex((p) => p.slug === hash);
      // Ignore hashes outside the fleet (chapters like #hermes / #acornprep
      // live elsewhere on the page) and no-op if already on that panel.
      if (i < 0 || i === embla.selectedScrollSnap()) return;
      embla.scrollTo(i, jump);
    };

    goToHash(true); // cold load: jump straight there, no animation

    const onHashChange = () => goToHash(false); // same-document: animate
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [embla]);

  const go = useCallback(
    (i: number) => {
      embla?.scrollTo(i);
    },
    [embla],
  );

  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-28">
        <div className="mb-10">
          <Reveal>
            <h2 className="mission-display text-[2.2rem] md:text-[3.6rem]">
              <DecodeText text="The rest of" />{" "}
              <span className="stencil">
                <DecodeText text="the fleet." duration={1.2} />
              </span>
            </h2>
          </Reveal>
        </div>

        {/* File-folder tabs */}
        <div
          role="tablist"
          aria-label="The rest of the fleet"
          className="flex flex-wrap gap-px border-b border-[var(--line)]"
        >
          {FLEET.map((p, i) => (
            <button
              key={p.slug}
              role="tab"
              id={`fleet-tab-${p.slug}`}
              aria-selected={selected === i}
              aria-controls={p.slug}
              tabIndex={selected === i ? 0 : -1}
              data-fleet-tab={p.slug}
              data-cursor-hover
              onClick={() => go(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(Math.min(i + 1, FLEET.length - 1));
                if (e.key === "ArrowLeft") go(Math.max(i - 1, 0));
              }}
              className={cn(
                "flex items-baseline gap-2 border border-b-0 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors",
                selected === i
                  ? "border-[var(--accent)] bg-[var(--bg)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              <span className="opacity-60">
                M-{String(i + FLEET_OFFSET + 1).padStart(2, "0")}
              </span>{" "}
              {p.name}
            </button>
          ))}
        </div>

        {/* Panels — all in the DOM so ⌘F and crawlers find every project */}
        <div className="overflow-hidden border border-t-0 border-[var(--line)]" ref={emblaRef}>
          <div className="flex">
            {FLEET.map((p) => (
              <div
                key={p.slug}
                id={p.slug}
                className="min-w-0 flex-[0_0_100%] scroll-mt-24"
                role="tabpanel"
                aria-labelledby={`fleet-tab-${p.slug}`}
                data-deck={p.slug}
              >
                <div className="grid min-h-[30rem] grid-cols-1 gap-8 p-6 md:p-10 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
                  {/* Writeup */}
                  <div className="flex flex-col justify-center">
                    <p className="mission-display text-2xl">{p.name}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{p.tagline}</p>
                    <p className="mt-5 text-sm leading-[1.9] text-[var(--muted)]">{p.body}</p>

                    <div className="mt-6 flex flex-col gap-1.5">
                      {p.stats.map((s) => (
                        <div key={s.label} className="flex items-baseline gap-2">
                          <span className="mission-display text-xl text-[var(--fg)]">
                            <StatValue value={s.value} />
                          </span>
                          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center border border-[var(--line)] px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor-hover
                      className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--fg)] transition-opacity hover:opacity-70"
                    >
                      Visit {p.domain} <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>

                  {/* Media */}
                  <div className="flex items-center">
                    {p.shot ? (
                      <div className="frame-brackets w-full">
                        <Develop>
                          <LiveEmbed
                            url={p.url}
                            domain={p.domain}
                            title={p.name}
                            screenshot={p.shot}
                            aspect="1280/800"
                          />
                        </Develop>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
