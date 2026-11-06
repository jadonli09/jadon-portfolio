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
 * Achievements as a split (one photo, two ways in), Albums as a strip of
 * pictures, and Say hello as a field of gold.
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

/* ── achievements: one photo, two ways in ─────────────────────────── */

function Achievements() {
  return (
    <section id="close" aria-labelledby="ach-h" className="scroll-mt-24 px-5 pb-24 pt-24 md:px-9 md:pb-36 md:pt-36">
      <div className="mx-auto grid max-w-[1360px] items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
        <Rise>
          <h2 id="ach-h" className="font-anton text-[clamp(3.4rem,7.4vw,7rem)] uppercase leading-[0.9] tracking-[-0.01em]">
            Achievements
          </h2>
          <p className="mt-6 max-w-[34ch] text-[19px] leading-relaxed text-[#e6ded3] md:text-[21px]">
            Every award and role since 2021. Climb Mission Peak with me at night, or read it all on one page.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/achievements" className={`${solid} bg-[#d9a83f] text-[#120e0c] hover:bg-[#e6b955]`}>
              Climb Mission Peak
            </Link>
            <Link href="/achievements/resume" className={`${solid} bg-white/[0.08] text-[#f4efe6] hover:bg-white/[0.14]`}>
              See the full list
            </Link>
          </div>
        </Rise>
        <Rise delay={0.1}>
          <Link href="/achievements" aria-label="Climb Mission Peak" className="group block overflow-hidden rounded-[3px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/img/missionpeak2026.jpg")}
              alt="Jadon on the Mission Peak summit rocks at sunrise"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] md:aspect-[5/6]"
              style={{ objectPosition: "50% 40%" }}
            />
          </Link>
        </Rise>
      </div>
    </section>
  );
}

/* ── albums: a strip of real pictures, one height, native shapes ───── */

const STRIP = [
  { src: "/img/ny-01.jpg", alt: "The Brooklyn Bridge at night", ar: 0.75, phone: 0 },
  { src: "/img/ncs-champions.jpg", alt: "MSJ varsity with the NCS banner", ar: 1.78, phone: 1 },
  { src: "/img/winterball-1.jpg", alt: "The Winter Ball dance floor", ar: 0.86, phone: 0 },
  { src: "/img/umass-01.jpg", alt: "Presenting the poster at UMass", ar: 1.5, phone: -1 },
];

function Albums() {
  const rows = [STRIP.filter((p) => p.phone === 0), STRIP.filter((p) => p.phone === 1)];
  const pic = (p: (typeof STRIP)[number]) => (
    <span key={p.src} className="block overflow-hidden rounded-[3px]" style={{ flex: `${p.ar} 1 0%`, aspectRatio: p.ar }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(p.src)} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" />
    </span>
  );
  return (
    <section aria-labelledby="alb-h" className="px-5 pb-24 md:px-9 md:pb-36">
      <div className="mx-auto max-w-[1360px]">
        <Rise className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <h2 id="alb-h" className="font-anton text-[clamp(3.4rem,7.4vw,7rem)] uppercase leading-[0.9] tracking-[-0.01em]">
              Albums
            </h2>
            <p className="mt-5 max-w-[40ch] text-[19px] leading-relaxed text-[#e6ded3] md:text-[21px]">
              Every original photo, and a 45-selfie match cut from summer 2026.
            </p>
          </div>
          <Link href="/albums" className={`${solid} bg-[#7c89e8] text-[#120e0c] hover:bg-[#949fee]`}>
            Open the albums
          </Link>
        </Rise>
        <Rise delay={0.1} className="mt-10 md:mt-14">
          <Link href="/albums" aria-label="Open the albums" className="group block">
            <span className="hidden gap-3 md:flex">{STRIP.map(pic)}</span>
            <span className="flex flex-col gap-2 md:hidden">
              {rows.map((r, i) => (
                <span key={i} className="flex gap-2">
                  {r.map(pic)}
                </span>
              ))}
            </span>
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
      <Achievements />
      <Albums />
      <SayHello />
    </>
  );
}
