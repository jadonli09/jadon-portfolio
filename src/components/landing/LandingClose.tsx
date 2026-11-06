"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";
import { PROFILE } from "@/lib/data";

/*
 * The close of the homepage. The hero already opens the seven chapters, so the
 * end only carries what the hero doesn't — and gives each its own shape:
 * Achievements and Albums side by side (one photo against a grid of four),
 * then Say hello as a field of gold.
 */

function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay, duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const solid = "inline-flex h-14 items-center rounded-full px-7 text-[17px] font-semibold transition-[scale,background-color,color] duration-200 active:scale-[0.97]";

/* ── achievements and albums, side by side ─────────────────────────── */

const H2 = "font-anton text-[clamp(3rem,5.4vw,5.6rem)] uppercase leading-[0.9] tracking-[-0.01em]";
const LEDE = "mt-5 max-w-[36ch] text-[18px] leading-relaxed text-[#e6ded3] md:text-[20px]";
const GROW = "transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]";

const ALBUM_GRID = [
  { src: "/img/ny-01.jpg", alt: "The Brooklyn Bridge at night", pos: "50% 55%" },
  { src: "/img/winterball-1.jpg", alt: "The Winter Ball dance floor", pos: "50% 50%" },
  { src: "/img/ncs-champions.jpg", alt: "MSJ varsity with the NCS banner", pos: "50% 45%" },
  { src: "/img/umass-01.jpg", alt: "Presenting the poster at UMass", pos: "50% 40%" },
];

function Doors() {
  return (
    <section id="close" aria-label="Achievements and albums" className="scroll-mt-24 px-5 pb-24 pt-24 md:px-9 md:pb-36 md:pt-36">
      {/* phones read each door top to bottom; desktop lines the two up — words on one row, pictures on the next */}
      <div className="mx-auto grid max-w-[1360px] gap-x-12 gap-y-8 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
        <Rise className="md:col-start-1 md:row-start-1">
          <h2 className={H2}>Achievements</h2>
          <p className={LEDE}>Every award and role since 2021. Climb Mission Peak with me at night, or read it all on one page.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/achievements" className={`${solid} bg-[#d9a83f] text-[#120e0c] hover:bg-[#e6b955]`}>
              Climb Mission Peak
            </Link>
            <Link href="/achievements/resume" className={`${solid} bg-white/[0.08] text-[#f4efe6] hover:bg-white/[0.14]`}>
              See the full list
            </Link>
          </div>
        </Rise>
        <Rise delay={0.08} className="md:col-start-1 md:row-start-2">
          <Link href="/achievements" aria-label="Climb Mission Peak" className="group block aspect-[4/5] overflow-hidden rounded-[3px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/img/missionpeak2026.jpg")}
              alt="Jadon on the Mission Peak summit rocks at sunrise"
              loading="lazy"
              className={`h-full w-full object-cover ${GROW}`}
              style={{ objectPosition: "50% 40%" }}
            />
          </Link>
        </Rise>

        <Rise delay={0.12} className="mt-16 md:col-start-2 md:row-start-1 md:mt-0">
          <h2 className={H2}>Albums</h2>
          <p className={LEDE}>Every original photo, and a 45-selfie match cut from summer 2026.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/albums" className={`${solid} bg-[#7c89e8] text-[#120e0c] hover:bg-[#949fee]`}>
              Open the albums
            </Link>
          </div>
        </Rise>
        <Rise delay={0.2} className="md:col-start-2 md:row-start-2">
          <Link href="/albums" aria-label="Open the albums" className="group grid aspect-[4/5] grid-cols-2 grid-rows-2 gap-2 md:gap-3">
            {ALBUM_GRID.map((p) => (
              <span key={p.src} className="block overflow-hidden rounded-[3px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(p.src)} alt={p.alt} loading="lazy" className={`h-full w-full object-cover ${GROW}`} style={{ objectPosition: p.pos }} />
              </span>
            ))}
          </Link>
        </Rise>
      </div>
    </section>
  );
}

/* ── say hello: a field of gold, the email as the headline ─────────── */

function SayHello() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };
  const links = [
    { label: "Instagram", detail: PROFILE.links.instagramHandle, href: PROFILE.links.instagram },
    { label: "LinkedIn", detail: "Jadon Li", href: PROFILE.links.linkedin },
    { label: "GitHub", detail: PROFILE.links.githubUser, href: PROFILE.links.github },
  ];

  return (
    <footer aria-labelledby="backpage-h" className="relative bg-[#d9a83f] px-5 pb-10 pt-16 text-[#120e0c] md:px-9 md:pb-12 md:pt-24">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end md:gap-16">
          <div>
            <p className="text-[18px] md:text-[20px]">Say hello.</p>
            <h2 id="backpage-h" className="mt-3 whitespace-nowrap font-display text-[7.4vw] leading-[1.02] tracking-[-0.02em] md:text-[min(4.4vw,4.1rem)]">
              <a href={`mailto:${PROFILE.email}`} className="underline-offset-[0.12em] hover:underline">
                {PROFILE.email}
              </a>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copy}
                className="inline-flex h-14 items-center rounded-full bg-[#120e0c] px-7 text-[17px] font-semibold text-[#f4efe6] transition-[scale,background-color] duration-200 hover:bg-black active:scale-[0.97]"
                aria-live="polite"
              >
                {copied ? "Copied ✓" : "Copy email"}
              </button>
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex h-14 items-center rounded-full bg-[#120e0c]/10 px-7 text-[17px] font-semibold transition-[scale,background-color] duration-200 hover:bg-[#120e0c]/20 active:scale-[0.97]"
              >
                Write an email
              </a>
            </div>
          </div>

          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-4 rounded-[3px] px-3 py-3 -mx-3 transition-colors hover:bg-[#120e0c]/10"
                >
                  <span className="font-display text-[1.6rem] leading-none md:text-[1.9rem]">{l.label}</span>
                  <span className="text-[17px] text-[#120e0c]/75">
                    {l.detail} <span aria-hidden className="inline-block transition-[translate] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-16 text-[16px] md:mt-24">
          {PROFILE.name}, {PROFILE.school}, {PROFILE.gradeNote}
        </p>
      </div>
    </footer>
  );
}

/** The close of the homepage: achievements, albums, then say hello. */
export function LandingClose() {
  return (
    <>
      <Doors />
      <SayHello />
    </>
  );
}
