"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";
import { PROFILE, SENTENCE_DOORS } from "@/lib/data";
import { startWorldTransition, WORLD_NAV_DELAY_MS } from "@/lib/transition";

/* ── the contents page: every door in one list, one picture that swaps ── */

type Entry = { key: string; title: string; note: string; href: string; img: string; pos: string; accent: string; world?: string };

const D = SENTENCE_DOORS;
const ENTRIES: Entry[] = [
  { key: "leads", title: "Leadership & Events", note: D.leads.peek, href: D.leads.href, img: "/img/covers/leads.jpg", pos: "50% 30%", accent: D.leads.color, world: D.leads.id },
  { key: "films", title: "Civic & Storytelling", note: D.films.peek, href: D.films.href, img: "/img/covers/films.jpg", pos: "50% 30%", accent: D.films.color, world: D.films.id },
  { key: "researches", title: "Research & STEM", note: D.researches.peek, href: D.researches.href, img: "/img/covers/researches.jpg", pos: "50% 30%", accent: D.researches.color, world: D.researches.id },
  { key: "builds", title: "Things I've Built", note: D.builds.peek, href: D.builds.href, img: "/img/covers/builds.jpg", pos: "50% 30%", accent: D.builds.color, world: D.builds.id },
  { key: "competes", title: "The Court", note: D.competes.peek, href: D.competes.href, img: "/img/covers/competes.jpg", pos: "50% 30%", accent: D.competes.color, world: D.competes.id },
  { key: "documents", title: "Locked In", note: D.documents.peek, href: D.documents.href, img: "/img/covers/documents.jpg", pos: "50% 30%", accent: D.documents.color, world: D.documents.id },
  { key: "person", title: "The Person", note: D.person.peek, href: D.person.href, img: "/img/covers/person.jpg", pos: "50% 30%", accent: D.person.color, world: D.person.id },
  { key: "achievements", title: "Achievements", note: "Walk up Mission Peak, or read the whole list", href: "/achievements", img: "/img/missionpeak2026.jpg", pos: "50% 40%", accent: "#d9a83f" },
  { key: "albums", title: "Albums", note: "Every original photo, and a 45-selfie match cut", href: "/albums", img: "/img/ny-01.jpg", pos: "50% 55%", accent: "#7c89e8" },
];

function Contents() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const router = useRouter();
  const navigating = useRef(false);

  const go = (e: React.MouseEvent, en: Entry) => {
    if (!en.world || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (navigating.current) return;
    navigating.current = true;
    startWorldTransition(en.world);
    window.setTimeout(() => router.push(en.href), WORLD_NAV_DELAY_MS);
  };

  return (
    <section id="close" aria-labelledby="contents-h" className="relative scroll-mt-24 px-5 pb-28 pt-24 md:px-9 md:pb-40 md:pt-36">
      <div className="mx-auto grid max-w-[1360px] gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] md:gap-16">
        <div>
          <h2 id="contents-h" className="font-anton text-[clamp(3.2rem,8vw,7.5rem)] uppercase leading-[0.9] tracking-[-0.01em]">
            Contents
          </h2>
          <ul className="mt-8 md:mt-12">
            {ENTRIES.map((en, i) => {
              const on = i === active;
              return (
                <motion.li
                  key={en.key}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ delay: i * 0.06, duration: 0.7, ease: EASE }}
                >
                  <Link
                    href={en.href}
                    data-cursor-hover
                    onClick={(e) => go(e, en)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-center gap-4 py-3 outline-none md:py-3.5"
                  >
                    {/* phones have no hover: each row carries its own small picture */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(en.img)}
                      alt=""
                      loading="lazy"
                      className="size-16 shrink-0 rounded-[3px] object-cover md:hidden"
                      style={{ objectPosition: en.pos }}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-display text-[1.65rem] leading-[1.08] transition-[color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:underline md:text-[clamp(2rem,3vw,2.9rem)] md:group-hover:translate-x-2 ${on ? "md:text-[var(--acc)]" : ""}`}
                        style={{ ["--acc" as string]: en.accent }}
                      >
                        {en.title}
                      </span>
                      <span className="mt-1 block text-[15px] leading-snug text-[#cfc6bb] md:text-[17px]">{en.note}</span>
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-2xl transition-[translate,opacity] duration-300 md:opacity-0 md:group-hover:translate-x-1 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
                      style={{ color: en.accent }}
                    >
                      →
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* desktop: one big picture, swapped by the row under the pointer */}
        <div className="relative hidden md:block">
          <div className="sticky top-24 aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-black">
            {ENTRIES.map((en, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={en.key}
                src={asset(en.img)}
                alt={i === active ? en.title : ""}
                aria-hidden={i !== active}
                className="absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ objectPosition: en.pos, opacity: i === active ? 1 : 0, scale: i === active || reduced ? "1" : "1.04" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── the back page: the masthead once, then how to reach him ───────── */

function BackPage() {
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
    <footer aria-labelledby="backpage-h" className="relative bg-[#d9a83f] px-5 pb-10 pt-12 text-[#120e0c] md:px-9 md:pb-12 md:pt-16">
      <div className="mx-auto max-w-[1360px]">
        <p aria-hidden className="select-none whitespace-nowrap text-center font-anton text-[calc((100vw-44px)/3.61)] leading-[0.82] tracking-[-0.01em] md:text-[min(calc((100vw-76px)/3.61),376px)]">
          LOCKED IN
        </p>

        <div className="mt-12 grid gap-12 md:mt-20 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end md:gap-16">
          <div>
            <p className="text-[18px] md:text-[20px]">Say hello.</p>
            <h2 id="backpage-h" className="mt-3 whitespace-nowrap font-display text-[7.4vw] leading-[1.02] tracking-[-0.02em] md:text-[min(3.9vw,3.6rem)]">
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

/** The close of the homepage: a contents page, then the back page. */
export function LandingClose() {
  return (
    <>
      <Contents />
      <BackPage />
    </>
  );
}
