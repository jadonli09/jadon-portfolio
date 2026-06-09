import type { Metadata } from "next";
import type { ReactNode } from "react";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { MissionPeak } from "@/components/about/MissionPeak";
import { AboutPortrait } from "@/components/about/AboutPortrait";
import { AboutCameraThread } from "@/components/about/AboutCameraThread";
import { AboutTravel } from "@/components/about/AboutTravel";
import { ABOUT, PROFILE } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "The person behind the worlds — li_locked.in, the Mission Peak ritual, and the pursuit of happiness.",
};

/**
 * Inline detail blocks for threads that have more than one line of copy.
 * Keeps the extra richness out of data.ts while surfacing it editorially.
 */
const THREAD_EXTRAS: Record<string, ReactNode> = {
  "The Kitchen": (
    <ul className="mt-5 space-y-1 border-l border-[var(--line)] pl-4">
      {[
        "Macarons — mastered after many failed attempts",
        "Beef Ragu — biweekly staple with Samay",
        "Grilled chicken — the crowd favourite",
        "Hojicha Basque cheesecake — still chasing it",
        "Feasts: Thanksgiving · New Year's · Lunar New Year",
      ].map((item) => (
        <li key={item} className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">
          {item}
        </li>
      ))}
    </ul>
  ),
  "The Journal": (
    <blockquote className="mt-5 border-l border-[var(--line)] pl-4">
      <p className="font-serif-i text-base italic leading-relaxed text-[var(--muted)]">
        "At first just summarising events — then releasing the truth and going deeper."
      </p>
      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
        Since 8th grade · at least once a month
      </p>
    </blockquote>
  ),
  "The Shelf": (
    <ul className="mt-5 space-y-1">
      {[
        { title: "The Three-Body Problem", author: "Liu Cixin" },
        { title: "Sunrise on the Reaping", author: "Collins" },
        { title: "The Circle & The Every", author: "Eggers" },
      ].map((book) => (
        <li key={book.title} className="flex items-baseline gap-2">
          <span className="font-display text-base text-[var(--fg)]">{book.title}</span>
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
            — {book.author}
          </span>
        </li>
      ))}
    </ul>
  ),
};

export default function AboutPage() {
  return (
    <World id="about">
      {/* HERO — quiet editorial with large portrait */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-36 md:px-9 md:pb-24 md:pt-48">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          {/* Text column */}
          <div>
            <Reveal>
              <p className="eyebrow">06 — The Person</p>
            </Reveal>
            <KineticHeadline
              as="h1"
              text="Documenting the grind."
              className="mt-6 font-display text-[3.2rem] leading-[0.95] tracking-tight md:text-[7rem]"
            />
            <Reveal delay={0.2} className="mt-10 max-w-2xl">
              <p className="font-serif-i text-2xl italic leading-snug md:text-3xl">
                {ABOUT.ethos}
              </p>
            </Reveal>
          </div>

          {/* Editorial portrait — large, quiet, lots of negative space */}
          <AboutPortrait />
        </div>
      </section>

      {/* MISSION PEAK */}
      <section className="border-y border-[var(--line)] bg-[var(--bg-2)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
          <Reveal className="mb-12">
            <p className="eyebrow">A ritual</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">{ABOUT.missionPeak.title}</h2>
          </Reveal>
          <MissionPeak />
        </div>
      </section>

      {/* THREADS */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        <Reveal className="mb-12">
          <p className="eyebrow">Off the record</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">The quieter pursuits</h2>
        </Reveal>
        <RevealGroup className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          {ABOUT.threads.map((t, i) =>
            t.title === "The Camera" ? (
              <AboutCameraThread key={t.title} thread={t} index={i} />
            ) : (
              <Reveal
                key={t.title}
                className="group bg-[var(--bg)] p-8 transition-colors hover:bg-[var(--bg-2)] md:p-12"
                delay={i * 0.05}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl md:text-3xl">{t.title}</h3>
                  <span className="font-mono text-xs text-[var(--muted)]">0{i + 1}</span>
                </div>
                <p className="mt-4 max-w-md text-[var(--muted)]">{t.body}</p>
                {/* Per-thread enrichment: kitchen menu, journal quote, bookshelf */}
                {THREAD_EXTRAS[t.title] ?? null}
              </Reveal>
            )
          )}
        </RevealGroup>
      </section>

      {/* TRAVEL */}
      <AboutTravel />

      {/* CLOSE */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center md:px-9 md:py-40">
        <Reveal>
          <p className="eyebrow mb-6">{PROFILE.links.instagramHandle}</p>
          <p className="font-display text-[2.4rem] leading-[1.05] tracking-tight md:text-[5rem]">
            It all points one direction —
            <span className="italic text-[var(--accent-2)]"> the pursuit of happiness.</span>
          </p>
        </Reveal>
      </section>

      <Footer current="about" />
    </World>
  );
}
