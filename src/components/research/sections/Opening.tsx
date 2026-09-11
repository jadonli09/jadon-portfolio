"use client";

import { asset } from "@/lib/base";
import { FUS, FUS_IMAGES, FUS_PANELS, IMAGES, PROJECT } from "../lab/content";
import { PosterLoupe } from "../viz/PosterLoupe";
import { JumpAction } from "./Action";

/**
 * The claim and the proof of it, on the same screen.
 *
 * The headline used to stand alone on a black field and the boards were a
 * section further down. Now the two posters sit directly under the sentence
 * they back up, so the first thing you see has something in it.
 */
const BOARDS = [
  {
    key: "fusarium",
    image: FUS_IMAGES.poster,
    title: FUS.title,
    meta: "Ma Lab, UMass Amherst — August 2026, with Jerry Zhang",
    to: "glow",
    action: "Into the fungus",
  },
  {
    key: "gout",
    image: IMAGES.poster,
    title: PROJECT.title,
    meta: "ACSEF 2025 — 3rd, computational biology",
    to: "gout",
    action: "Into the study",
  },
] as const;

export function Opening() {
  return (
    <section
      id="opening"
      className="relative overflow-hidden px-6 pb-[clamp(3rem,7vh,5.5rem)] pt-[clamp(6rem,13vh,9rem)] lg:pl-64 lg:pr-10"
    >
      {/* The transformed strain, glowing, bled in behind the headline row.
          Pushed far enough down in luminance that only the RFP streaks read —
          the grey brightfield would otherwise lift the whole corner and eat
          the contrast under the paragraph sitting on it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-[64vh] w-[64%] md:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(FUS_PANELS.t8996.merge)}
          alt=""
          className="h-full w-full object-cover opacity-[0.72] [filter:blur(0.5px)_brightness(0.3)_contrast(1.55)_saturate(1.9)] [mask-image:linear-gradient(to_right,transparent,#000_34%,#000_88%,transparent)]"
        />
        {/* No hard bottom edge where the box ends. */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_58%_at_0%_22%,var(--bg)_36%,rgba(7,8,11,0.6)_64%,transparent_86%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <p className="text-[1rem] leading-[1.6] text-[var(--muted)]">
          Six weeks in the Ma Lab at UMass Amherst, summer 2026.
        </p>

        <div className="mt-7 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:items-end">
          <h1 className="max-w-[11ch] font-serif text-[clamp(3rem,7.2vw,6rem)] leading-[0.9] tracking-[-0.02em] text-balance">
            We made the fungus{" "}
            <em className="not-italic text-[var(--accent)] [text-shadow:0_0_42px_rgba(255,61,94,0.55),0_0_90px_rgba(255,61,94,0.28)]">
              glow.
            </em>
          </h1>

          <p className="max-w-[52ch] text-[clamp(1.06rem,1.35vw,1.24rem)] leading-[1.62] text-[var(--muted)] lg:pb-2">
            <i className="italic text-[var(--fg)]">Fusarium oxysporum</i>{" "}
            blinds people and kills bananas — one fungus, two kingdoms. Its human strains slip past
            the immune system better than the plant ones do. You can&rsquo;t study a fight you
            can&rsquo;t see, so we put a red fluorescent protein into a human clinical strain, to
            watch what happens when a macrophage finds it.
          </p>
        </div>

        <div
          id="boards"
          className="mt-[clamp(2.75rem,6vh,4.5rem)] grid scroll-mt-24 gap-x-8 gap-y-12 sm:grid-cols-2"
        >
          {BOARDS.map((b) => (
            <article key={b.key} className="flex flex-col">
              <PosterLoupe src={b.image.src} alt={b.image.alt} />
              <h2 className="mt-5 font-serif text-[clamp(1.3rem,1.9vw,1.7rem)] leading-[1.18] text-[var(--fg)]">
                {b.title}
              </h2>
              <p className="mt-2 text-[0.98rem] leading-[1.5] text-[var(--muted)]">{b.meta}</p>
              <div className="mt-6 lg:mt-auto lg:pt-6">
                <JumpAction to={b.to} tone="solid">
                  {b.action}
                </JumpAction>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-7 text-[0.98rem] text-[var(--muted)]">
          Hover a poster to read it close up. Click for full size.
        </p>
      </div>
    </section>
  );
}
