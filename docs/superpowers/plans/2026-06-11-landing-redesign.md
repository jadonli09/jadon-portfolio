# Landing Redesign ("One person, locked in") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landing's seven-chapter scroll with a giant interactive sentence (seven doors) + a dense pinboard of achievements, and rename the site "Jadon Li — Locked In".

**Architecture:** Two new client components (`SentenceDoors`, `Pinboard`) + a dark `LandingClose`, driven by new `SENTENCE_DOORS` / `PINBOARD` data in `src/lib/data.ts`. The story-spine components and `CHAPTERS`/`WORLD_TO_CHAPTER` are deleted. Copy sweep renames "five worlds / chapters" everywhere.

**Tech Stack:** Next.js 16 static export, React 19, Tailwind v4, motion/react. No test runner exists in this repo — verification is `npm run build` + `npm run lint` + headless-browser QA (gstack browse) per task group, not TDD.

**Repo caution:** Tree contains ~130 uncommitted files of *finished* prior-session work. Task 0 commits that separately. Later commits `git add` only the files named in each task.

Spec: `docs/superpowers/specs/2026-06-11-landing-redesign-design.md`

---

### Task 0: Commit prior sessions' outstanding work

- [ ] **Step 0.1:** `cd "/Users/jadonli/Downloads/Jadon Li/jadon" && git add -A && git status --short | wc -l` (expect 0 unstaged afterwards)
- [ ] **Step 0.2:** Commit: `git commit -m "Page redesigns: about/built/civic/court/leadership/locked-in/research + albums 3D view (prior sessions, batched)"`
- [ ] **Step 0.3:** `npm run build` — must pass BEFORE the redesign starts so failures bisect cleanly. Expected: "✓ Generating static pages".

### Task 1: Data — SENTENCE_DOORS + PINBOARD replace CHAPTERS

**Files:** Modify `src/lib/data.ts` (lines ~22 tagline, ~114–240 chapters block)

- [ ] **Step 1.1:** Change `tagline: "Documenting the grind across five worlds."` → `tagline: "One person, locked in — documented in public."`
- [ ] **Step 1.2:** Delete the whole `Chapter` type + `CHAPTERS` array + `WORLD_TO_CHAPTER` block (the section between the `THE STORY SPINE` banner comment and the next section). Replace with:

```ts
/* ─────────────────── THE SENTENCE (landing doors) ─────────────────── */
/** One door per world: a bold word in the landing's one-sentence overview. */
export type SentenceDoor = {
  id: WorldId;
  word: string;
  href: string;
  /** bright text colour on the dark landing */
  color: string;
  /** destination world accent (underline) */
  accent: string;
  /** background flood + peek-card photo */
  photo: string;
  /** one-line stat in the peek card */
  peek: string;
};

export const SENTENCE_DOORS = {
  leads: { id: "leadership", word: "leads", href: "/leadership", color: "#d9a83f", accent: "#b07c1e", photo: "/img/asb-officers.jpg", peek: "3× Class President → ASB President" },
  films: { id: "civic", word: "films", href: "/civic", color: "#e0644e", accent: "#c2402c", photo: "/img/voices-of-fremont-with-jennifersiebalnewsom.jpg", peek: "The Mayor's videographer · Voices of Fremont" },
  researches: { id: "research", word: "researches", href: "/research", color: "#2fc4ad", accent: "#0c9c86", photo: "/img/acsef-science-fair.jpg", peek: "Gout pain in the genome · 3rd at ACSEF" },
  builds: { id: "built", word: "builds", href: "/built", color: "#7c89e8", accent: "#4f5fd6", photo: "/img/presenting-acornprep-at-gemini-meetup.jpg", peek: "AcornPrep · 500+ students · #1 on Google" },
  competes: { id: "court", word: "competes", href: "/court", color: "#f0703a", accent: "#e04e12", photo: "/img/ncs-champions.jpg", peek: "First NCS title in school history" },
  documents: { id: "lockedin", word: "documents all of it", href: "/locked-in", color: "#e8689c", accent: "#d23f7c", photo: "/img/headshot1.jpg", peek: "@li_locked.in · 1.39M plays in year one" },
  person: { id: "about", word: "person", href: "/about", color: "#c98a5d", accent: "#a9683f", photo: "/img/missionpeak2026-1.jpg", peek: "Mission Peak every birthday · journaling since 8th grade" },
} satisfies Record<string, SentenceDoor>;

export const SENTENCE_TICKER = ["3× president", "10k views / video", "ACSEF 3rd", "500+ users", "NCS champions", "1.39M plays"] as const;

/* ─────────────────── THE PINBOARD (landing record) ─────────────────── */
export type PinKind = "letter" | "polaroid" | "plaque" | "seal" | "ticket" | "note" | "news" | "receipt" | "ribbon" | "index";
export type PinItem = {
  kind: PinKind;
  /** destination; omit for the letter */
  href?: string;
  /** hover tag, e.g. "→ the court · rafters" */
  go?: string;
  img?: string;
  caption?: string;
  value?: string;
  label?: string;
  text?: string;
  hed?: string;
  src?: string;
  lines?: string[];
  accent?: string;
  /** desktop board placement */
  left: string;
  top: number;
  rot: number;
  z: number;
  w?: number;
};

/** Sixty-word intro, pinned on the board as a letter. */
export const PIN_LETTER_TEXT =
  "Jadon Li is a junior at Mission San Jose. Elected president every year since freshman year, films for the Mayor of Fremont, traced gout pain through the genome, built a study app 500+ students use, started on the first championship team in school history — and posted the whole journey.";

export const PINBOARD: PinItem[] = [
  { kind: "letter", left: "1%", top: 30, rot: -2, z: 2, w: 270 },
  { kind: "polaroid", href: "/court", go: "→ the court", img: "/img/ncs-champions.jpg", caption: "first NCS title in school history!", left: "21%", top: 14, rot: 4, z: 4, w: 180 },
  { kind: "news", href: "/court", go: "→ the court · rafters", hed: "“Believe it: Mission San Jose wins first NCS title in boys basketball”", src: "The Mercury News · Feb 2026 · MSJ 46–40", left: "34%", top: 122, rot: -3.5, z: 6, w: 212 },
  { kind: "seal", href: "/leadership#elected-offices-heading", go: "→ leadership · offices", text: "3× CLASS PRESIDENT · NOW ASB", left: "53%", top: 12, rot: 8, z: 5, w: 98 },
  { kind: "polaroid", href: "/leadership", go: "→ leadership", img: "/img/speaking-at-rally.jpg", caption: "rally szn", left: "61%", top: 54, rot: -5, z: 3, w: 158 },
  { kind: "plaque", href: "/locked-in#timeline", go: "→ the pursuit", value: "1.39M", label: "plays · yr one · @li_locked.in", accent: "#e8689c", left: "75%", top: 22, rot: 3, z: 6 },
  { kind: "note", href: "/about", go: "→ the person", text: "journaling since 8th grade ✎ — naps highly recommended", accent: "#ffe27a", left: "87%", top: 96, rot: -6, z: 4, w: 132 },
  { kind: "polaroid", href: "/about", go: "→ the person", img: "/img/ironchef-win.jpg", caption: "Iron Chef — W", left: "85%", top: 208, rot: 5, z: 3, w: 146 },
  { kind: "polaroid", href: "/leadership#elected-offices-heading", go: "→ leadership · offices", img: "/img/asb-officers.jpg", caption: "ASB officer team", left: "2%", top: 262, rot: 3, z: 4, w: 168 },
  { kind: "receipt", href: "/leadership#elected-offices-heading", go: "→ leadership · offices", lines: ["CLASS OF 2027", "──────────", "FUNDRAISED  $15,000", "STOLES JOB     $700", "──────────", "TOTAL        A LOT"], left: "16%", top: 224, rot: -4, z: 5, w: 132 },
  { kind: "ribbon", href: "/research", go: "→ research", value: "3rd", label: "ACSEF · comp bio", left: "27%", top: 206, rot: 6, z: 7, w: 96 },
  { kind: "polaroid", href: "/research", go: "→ research", img: "/img/acsef-science-fair.jpg", caption: "the genomics of gout pain", left: "33%", top: 252, rot: -2, z: 4, w: 162 },
  { kind: "ticket", href: "/built", go: "→ built", text: "ACORNPREP · ADMIT 500+", label: "six AP exams · #1 on Google", accent: "#7c89e8", left: "48%", top: 220, rot: -5, z: 6, w: 154 },
  { kind: "polaroid", href: "/built", go: "→ built", img: "/img/presenting-acornprep-at-gemini-meetup.jpg", caption: "pitching at the Gemini meetup", left: "57%", top: 258, rot: 5, z: 4, w: 168 },
  { kind: "polaroid", href: "/civic", go: "→ civic", img: "/img/voices-of-fremont-with-jennifersiebalnewsom.jpg", caption: "Voices of Fremont, w/ the First Partner", left: "72%", top: 248, rot: -4, z: 5, w: 178 },
  { kind: "polaroid", href: "/about", go: "→ the person", img: "/img/missionpeak2026-1.jpg", caption: "every birthday, same mountain", left: "4%", top: 416, rot: -5, z: 3, w: 158 },
  { kind: "seal", href: "/about", go: "→ the person", value: "46:46", text: "MISSION PEAK", accent: "silver", left: "18%", top: 398, rot: 7, z: 6, w: 82 },
  { kind: "index", href: "/leadership#club-crews-heading", go: "→ leadership · clubs", text: "Also currently: MSJ Makes President · STEM-PAC Co-President · ~$4k profit shipping merch jobs", left: "26%", top: 444, rot: -3, z: 5, w: 178 },
  { kind: "ticket", href: "/civic", go: "→ civic", text: "★ 10K VIEWS", label: "per Mayor video", accent: "#e0644e", left: "41%", top: 414, rot: 4, z: 5, w: 126 },
  { kind: "note", href: "/civic", go: "→ civic", text: "saved a beloved restaurant w/ one viral push", accent: "#ffd0e2", left: "50%", top: 452, rot: -6, z: 4, w: 118 },
  { kind: "polaroid", href: "/leadership#winter-ball-title", go: "→ leadership · events", img: "/img/winterball-1.jpg", caption: "Winter Ball — sold out", left: "61%", top: 422, rot: 6, z: 4, w: 152 },
];
```

- [ ] **Step 1.3:** `npx tsc --noEmit` will fail on `StoryChapter`/`StorySpine`/`DeepDiveBar` imports — expected; fixed by Tasks 2–4. Don't commit yet.

### Task 2: SentenceDoors component

**Files:** Create `src/components/landing/SentenceDoors.tsx`

- [ ] **Step 2.1:** Write the component (full code):

```tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SENTENCE_DOORS, SENTENCE_TICKER, type SentenceDoor } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

const D = SENTENCE_DOORS;

/** The sentence, tokenized. `after` is punctuation that hugs the previous word. */
type Token = { text?: string; door?: SentenceDoor; after?: string };
const TOKENS: Token[] = [
  { text: "He" },
  { door: D.leads, after: "," },
  { door: D.films, after: "," },
  { door: D.researches, after: "," },
  { door: D.builds, after: "," },
  { door: D.competes },
  { text: "—" },
  { text: "and" },
  { door: D.documents },
  { text: "—" },
  { text: "one" },
  { door: D.person, after: "," },
  { text: "locked" },
  { text: "in." },
];

const DOORS = Object.values(D);

/**
 * The landing overview: one giant sentence where every bold word is a door
 * into a world. Hover (or first tap) floods the background with that world's
 * photo and opens a stat peek; click (or second tap) enters.
 */
export function SentenceDoors() {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();
  // touch = no hover: first tap arms the door, second tap follows the link
  const touch = useRef(false);
  if (typeof window !== "undefined") touch.current = window.matchMedia("(hover: none)").matches;

  return (
    <section
      id="doors"
      className="relative flex min-h-[100svh] scroll-mt-24 items-center overflow-hidden"
      onMouseLeave={() => setActive(null)}
    >
      {/* photo floods, one per door, cross-fading behind the words */}
      {DOORS.map((d) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={d.id}
          src={asset(d.photo)}
          alt=""
          aria-hidden
          loading="eager"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: active === d.word ? (reduce ? 0.14 : 0.26) : 0 }}
        />
      ))}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07070a] via-transparent to-[#07070a]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 md:px-9">
        <p className="eyebrow mb-8 text-[#e8b15a]">Who he is, in one sentence</p>

        <motion.h2
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-18% 0px" }}
          transition={{ staggerChildren: 0.09, delayChildren: 0.1 }}
          className="font-display max-w-5xl text-[2.6rem] leading-[1.32] tracking-tight md:text-[4.3rem] md:leading-[1.3]"
        >
          {TOKENS.map((t, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top [margin-right:0.28em]">
              <motion.span
                variants={{ hidden: { y: "115%" }, show: { y: 0, transition: { duration: 0.7, ease: EASE } } }}
                className="inline-block"
              >
                {t.door ? <Door door={t.door} active={active} setActive={setActive} touch={touch} /> : t.text}
                {t.after}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reduce ? 0 : 1.6, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[#8a8a99]"
        >
          {SENTENCE_TICKER.map((s, i) => (
            <span key={s} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden>·</span>}
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Door({
  door,
  active,
  setActive,
  touch,
}: {
  door: SentenceDoor;
  active: string | null;
  setActive: (w: string | null) => void;
  touch: React.RefObject<boolean>;
}) {
  const open = active === door.word;
  return (
    <span className="relative inline-block" onMouseEnter={() => setActive(door.word)}>
      <Link
        href={door.href}
        data-cursor-hover
        className="italic transition-[background-color] duration-200 hover:bg-white/10"
        style={{ color: door.color, borderBottom: `3px solid ${door.accent}` }}
        onClick={(e) => {
          if (touch.current && !open) {
            e.preventDefault();
            setActive(door.word);
          }
        }}
      >
        {door.word}
      </Link>
      {/* stat peek */}
      <span
        aria-hidden={!open}
        className="pointer-events-none absolute left-1/2 top-[112%] z-20 block w-60 -translate-x-1/2 rounded border border-white/20 bg-[#0e0e14]/95 p-2.5 font-mono text-[0.6rem] normal-case tracking-wide text-[#f4f1ea] shadow-2xl transition-all duration-300 not-italic"
        style={{ opacity: open ? 1 : 0, transform: `translateX(-50%) translateY(${open ? 0 : 6}px)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(door.photo)} alt="" className="mb-2 h-20 w-full rounded-sm object-cover" />
        {door.peek}
        <span className="mt-1.5 flex items-center gap-1.5 font-bold" style={{ color: door.color }}>
          enter <ArrowRight className="size-3" />
        </span>
      </span>
    </span>
  );
}
```

- [ ] **Step 2.2:** No build yet (Landing still imports StorySpine; data compiles). `npx tsc --noEmit 2>&1 | grep -v "StorySpine\|StoryChapter\|DeepDiveBar\|ChapterRail"` — no errors from SentenceDoors itself.

### Task 3: Pinboard component

**Files:** Create `src/components/landing/Pinboard.tsx`

- [ ] **Step 3.1:** Write the component (full code):

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PINBOARD, PIN_LETTER_TEXT, type PinItem } from "@/lib/data";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/**
 * The record, pinned: a dense overlapping collage of achievements in physical
 * styles (polaroids, plaques, seals, tickets, notes, newsprint…). Hover lifts
 * an object above its neighbours and reveals where it links. Desktop is an
 * absolutely-placed board; mobile reflows into a tight 2-column collage.
 */
export function Pinboard() {
  return (
    <section id="record" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        <p className="eyebrow mb-3 text-center text-[#e8b15a]">The record · pinned</p>
        <h2 className="font-display mx-auto mb-12 max-w-xl text-center text-2xl leading-snug text-[#f4f1ea] md:text-3xl">
          Everything below links somewhere. Pull a pin.
        </h2>

        {/* desktop board */}
        <div
          className="relative hidden h-[640px] rounded-lg border border-white/10 md:block"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, #11111a 0%, transparent 60%), radial-gradient(circle at 80% 70%, #10101a 0%, transparent 55%), repeating-linear-gradient(0deg, transparent 0 39px, rgba(255,255,255,0.02) 39px 40px), repeating-linear-gradient(90deg, transparent 0 39px, rgba(255,255,255,0.02) 39px 40px), #0a0a0f",
          }}
        >
          {PINBOARD.map((it, i) => (
            <Pinned key={i} item={it} index={i} />
          ))}
        </div>

        {/* mobile collage */}
        <div className="columns-2 gap-3 md:hidden">
          <div className="mb-3 break-inside-avoid" style={{ columnSpan: "all" }}>
            <PinBody item={PINBOARD[0]} />
          </div>
          {PINBOARD.slice(1).map((it, i) => (
            <MobilePin key={i} item={it} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Pinned({ item, index }: { item: PinItem; index: number }) {
  const [hot, setHot] = useState(false);
  const reduce = useReducedMotion();
  const body = (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26, rotate: item.rot * 2.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: item.rot }}
      viewport={{ once: true, margin: "-8% 0px" }}
      whileHover={reduce ? undefined : { rotate: 0, scale: 1.09 }}
      transition={{ type: "spring", stiffness: 220, damping: 19, delay: index * 0.035 }}
      className="relative"
      onHoverStart={() => setHot(true)}
      onHoverEnd={() => setHot(false)}
    >
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 z-30 size-2.5 -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        style={{ background: "radial-gradient(circle at 35% 30%, #f0d48a, #8a6312)" }}
      />
      <PinBody item={item} />
      {item.go && (
        <span
          className="pointer-events-none absolute -bottom-5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#07070a]/90 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#e8b15a] transition-opacity duration-200"
          style={{ opacity: hot ? 1 : 0 }}
        >
          {item.go}
        </span>
      )}
    </motion.div>
  );
  return (
    <div
      className="absolute"
      style={{ left: item.left, top: item.top, zIndex: hot ? 99 : item.z, width: item.w ? `${item.w}px` : undefined }}
    >
      {item.href ? (
        <Link href={item.href} data-cursor-hover className="block">
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}

function MobilePin({ item, index }: { item: PinItem; index: number }) {
  const inner = (
    <div className="relative" style={{ transform: `rotate(${item.rot / 2}deg)` }}>
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 z-30 size-2.5 -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        style={{ background: "radial-gradient(circle at 35% 30%, #f0d48a, #8a6312)" }}
      />
      <PinBody item={item} />
    </div>
  );
  return (
    <div className={cn("mb-3 break-inside-avoid", index % 3 === 1 && "-mt-1")}>
      {item.href ? (
        <Link href={item.href} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}

/** Renders one physical object. */
function PinBody({ item }: { item: PinItem }) {
  switch (item.kind) {
    case "letter":
      return (
        <div className="bg-[#f7f3e8] p-4 font-display text-[#2a2722] shadow-[0_10px_26px_rgba(0,0,0,0.66)]">
          <p className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-[#8a6312]">In sixty words</p>
          <p className="mt-2 text-[0.72rem] leading-[1.7]">{PIN_LETTER_TEXT}</p>
          <p className="font-hand mt-2 text-lg leading-none">— Jadon</p>
        </div>
      );
    case "polaroid":
      return (
        <div className="bg-[#f4f1ea] p-1.5 pb-4 text-[#1a1a20] shadow-[0_10px_26px_rgba(0,0,0,0.66)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(item.img!)} alt={item.caption ?? ""} loading="lazy" className="aspect-[3/2] w-full object-cover" />
          <p className="font-hand mt-1.5 text-center text-sm leading-tight">{item.caption}</p>
        </div>
      );
    case "plaque":
      return (
        <div className="rounded border border-[#e8b15a66] bg-gradient-to-br from-[#15151d] to-[#0e0e14] px-4 py-3 shadow-[0_10px_26px_rgba(0,0,0,0.6),inset_0_0_18px_rgba(232,177,90,0.05)]">
          <p className="font-anton text-2xl leading-none" style={{ color: item.accent }}>{item.value}</p>
          <p className="mt-1 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-[#9a9aa8]">{item.label}</p>
        </div>
      );
    case "seal":
      return item.accent === "silver" ? (
        <div className="flex aspect-square w-full flex-col items-center justify-center rounded-full text-center font-bold text-[#26231d] shadow-[0_10px_26px_rgba(0,0,0,0.66),inset_0_0_0_3px_rgba(0,0,0,0.13),inset_0_0_0_6px_rgba(255,255,255,0.16)]" style={{ background: "radial-gradient(circle at 35% 30%, #e8e4da, #9a948a)" }}>
          <span className="font-display text-base leading-none">{item.value}</span>
          <span className="mt-0.5 px-2 font-mono text-[0.42rem] tracking-[0.1em]">{item.text}</span>
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-full p-3 text-center font-display text-[0.56rem] font-bold leading-[1.45] text-[#241a04] shadow-[0_10px_26px_rgba(0,0,0,0.66),inset_0_0_0_3px_rgba(0,0,0,0.13),inset_0_0_0_6px_rgba(255,255,255,0.16)]" style={{ background: "radial-gradient(circle at 35% 30%, #d9a83f, #7d5a10)" }}>
          {item.text}
        </div>
      );
    case "ticket":
      return (
        <div className="rounded-sm border-[1.5px] border-dashed bg-[#14141b] px-3 py-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.6)]" style={{ borderColor: `${item.accent}88` }}>
          <p className="font-mono text-[0.62rem] font-bold tracking-wide" style={{ color: item.accent }}>{item.text}</p>
          <p className="mt-0.5 font-mono text-[0.54rem] text-[#9a9aa8]">{item.label}</p>
        </div>
      );
    case "note":
      return (
        <div className="font-hand p-3 text-[0.95rem] leading-snug shadow-[0_10px_26px_rgba(0,0,0,0.6)]" style={{ background: item.accent, color: item.accent === "#ffd0e2" ? "#4a1228" : "#3c3208" }}>
          {item.text}
        </div>
      );
    case "news":
      return (
        <div className="bg-[#ece6d8] px-3.5 py-3 text-[#23211c] shadow-[0_10px_26px_rgba(0,0,0,0.66)]">
          <p className="font-display text-[0.84rem] font-bold leading-[1.25]">{item.hed}</p>
          <p className="mt-1.5 border-t border-[#c9c2b0] pt-1 font-mono text-[0.46rem] uppercase tracking-[0.14em] text-[#6a6458]">{item.src}</p>
        </div>
      );
    case "receipt":
      return (
        <div className="bg-[#fbf8ef] px-3 py-2.5 font-mono text-[0.55rem] leading-[1.8] text-[#2a2722] shadow-[0_10px_26px_rgba(0,0,0,0.6)]">
          {item.lines!.map((l) => (
            <p key={l} className="whitespace-pre">{l}</p>
          ))}
        </div>
      );
    case "ribbon":
      return (
        <div className="bg-[#2fc4ad] px-3 pb-5 pt-2 text-center text-[#06302a] shadow-[0_10px_26px_rgba(0,0,0,0.6)]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)" }}>
          <p className="font-anton text-lg leading-none">{item.value}</p>
          <p className="mt-0.5 font-mono text-[0.46rem] uppercase tracking-[0.1em]">{item.label}</p>
        </div>
      );
    case "index":
      return (
        <div className="border-t-4 border-[#b07c1e] bg-[#fdfbf4] px-3 py-2.5 font-display text-[0.68rem] leading-[1.65] text-[#26231d] shadow-[0_10px_26px_rgba(0,0,0,0.6)]">
          {item.text}
        </div>
      );
  }
}
```

- [ ] **Step 3.2:** Type check passes for the new file (same grep filter as 2.2).

### Task 4: LandingClose + rewire Landing.tsx + DeepDiveBar; delete story components

**Files:**
- Create `src/components/landing/LandingClose.tsx`
- Modify `src/components/landing/Landing.tsx` (imports, lines ~142–144 copy, ~156–161 melt, ~164–170 sections)
- Modify `src/components/chrome/DeepDiveBar.tsx`
- Delete `src/components/story/StorySpine.tsx`, `StoryChapter.tsx`, `ChapterRail.tsx`, `StoryClose.tsx`, `src/components/landing/WorldIndex.tsx`

- [ ] **Step 4.1:** `LandingClose.tsx` — StoryClose's structure, dark, new copy:

```tsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/primitives/Magnetic";
import { EASE } from "@/lib/motion";

const DOORS = [
  { href: "/achievements", label: "Experiences & Achievements", note: "The full archive — every award, role, and project by year", accent: "#b07c1e" },
  { href: "/albums", label: "Albums", note: "The photo archive — every frame of the whole story", accent: "#c9a227" },
  { href: "/contact", label: "Say Hello", note: "Email · Instagram · LinkedIn · GitHub", accent: "#b04a32" },
];

/** The synthesis + the final doorways, on the dark landing. */
export function LandingClose() {
  return (
    <section id="close" className="relative scroll-mt-24 border-t border-white/10 px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-display max-w-3xl text-[2.2rem] leading-[1.05] tracking-tight text-[#f4f1ea] md:text-[4rem]"
        >
          Seven doors, one direction:{" "}
          <span className="italic text-[#e8b15a]">the pursuit of happiness.</span>
        </motion.p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-3">
          {DOORS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              data-cursor-hover
              className="group relative flex flex-col justify-between gap-10 bg-[#07070a] p-8 transition-colors hover:bg-[#101016] md:p-12"
            >
              <span className="flex items-start justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#8a8a99]">Explore</span>
                <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" style={{ color: d.accent }} />
              </span>
              <span>
                <span className="block font-display text-3xl leading-none text-[#f4f1ea] transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                  {d.label}
                </span>
                <span className="mt-3 block font-mono text-[0.68rem] uppercase tracking-widest text-[#8a8a99]">
                  {d.note}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Magnetic strength={0.3}>
            <button
              onClick={() => (typeof window !== "undefined" ? window.scrollTo({ top: 0, behavior: "smooth" }) : null)}
              data-cursor-hover
              className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#8a8a99] transition-colors hover:text-[#f4f1ea]"
            >
              Back to the top
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4.2:** `Landing.tsx`: swap imports (`StorySpine`, `StoryClose` → `SentenceDoors`, `Pinboard`, `LandingClose`); change `One story · seven chapters` → `One person · seven doors`; melt gradient `#faf5ec` → `#07070a`; replace `<StorySpine />` + `<StoryClose />` with `<SentenceDoors /><Pinboard /><LandingClose />`.
- [ ] **Step 4.3:** `DeepDiveBar.tsx`: drop `WORLD_TO_CHAPTER` import (keep `type WorldId`); `href` → `"/#doors"`; label "The Story" → "One person"; remove now-unused `id` lookup (keep prop for callers).
- [ ] **Step 4.4:** `git rm src/components/story/StorySpine.tsx src/components/story/StoryChapter.tsx src/components/story/ChapterRail.tsx src/components/story/StoryClose.tsx src/components/landing/WorldIndex.tsx`
- [ ] **Step 4.5:** `grep -rn "StorySpine\|StoryChapter\|ChapterRail\|StoryClose\|WorldIndex\|CHAPTERS\|WORLD_TO_CHAPTER" src/` → only data-comment hits allowed; fix any stragglers.

### Task 5: Rename sweep ("Locked In")

**Files:** Modify `src/app/layout.tsx`, `src/app/not-found.tsx:16`, `src/components/hero/Preloader.tsx:55`, `src/components/chrome/Footer.tsx:54`, `src/components/about/PersonHero.tsx:55`

- [ ] **Step 5.1:** `layout.tsx`: `default: "Jadon Li — Locked In"`, OG `title: "Jadon Li — Locked In"`, description → `"Jadon Li — student leader, civic storyteller, researcher, builder, and athlete. One person, locked in — a portfolio in seven worlds."` (both `description` fields).
- [ ] **Step 5.2:** `Preloader.tsx`: `Five worlds · one person` → `One person · locked in`.
- [ ] **Step 5.3:** `Footer.tsx`: `one story, seven chapters` → `one person, locked in`.
- [ ] **Step 5.4:** `not-found.tsx`: `…but there are five worlds that do.` → `…but there are seven doors that do.`
- [ ] **Step 5.5:** `PersonHero.tsx`: `The other five worlds are the résumé.` → `The rest of the site is the résumé.`
- [ ] **Step 5.6:** `grep -rni "five worlds\|seven chapters\|five pursuits" src/` → zero hits.

### Task 6: Build, lint, visual QA

- [ ] **Step 6.1:** `npm run build` → "✓ Generating static pages". `npm run lint` → clean.
- [ ] **Step 6.2:** Dev server on a free port (`npm run dev -- -p 3010`, NOT 3000 — another session may own it).
- [ ] **Step 6.3:** gstack browse QA at 1440×900: load `/`, scroll to `#doors` (sentence reveals, hover `films` → flood + peek), `#record` (board dense, hover lifts object + shows go-tag, click NCS polaroid → /court), `#close`. Then 390×844: sentence wraps, tap door once → peek, twice → navigates; pinboard is 2-col collage. Screenshot each state.
- [ ] **Step 6.4:** Check `DeepDiveBar` from /court → lands on `/#doors`.

### Task 7: Commit, push, verify deploy, update memory

- [ ] **Step 7.1:** `git add` only: `src/lib/data.ts src/components/landing src/components/chrome/DeepDiveBar.tsx src/app/layout.tsx src/app/not-found.tsx src/components/hero/Preloader.tsx src/components/chrome/Footer.tsx src/components/about/PersonHero.tsx docs/superpowers` + the five deletions. Commit: `"Landing redesign: sentence doors + pinned record, site renamed 'Locked In'"`.
- [ ] **Step 7.2:** `git push` → `gh run watch` (deploy.yml) → verify https://jadonli09.github.io/jadon-portfolio/ serves the new landing + `<title>Jadon Li — Locked In</title>`.
- [ ] **Step 7.3:** Update `~/.claude/.../memory/jadon-portfolio.md` (landing redesign entry; CHAPTERS removed; concurrent-work batch commit note).

## Self-review

- **Spec coverage:** hero copy+melt (4.2), sentence (1.2/2.1), pinboard dense+mobile (1.2/3.1), close (4.1), removals/rewiring (4.3–4.5), rename (5.x), reduced-motion (2.1 `useReducedMotion`, 3.1), static-export safe (no new deps; `asset()` used). ✓
- **Type consistency:** `SentenceDoor` fields used in `SentenceDoors.tsx` match Task 1; `PinItem` fields match `PinBody` switch. ✓
- **No placeholders.** ✓
