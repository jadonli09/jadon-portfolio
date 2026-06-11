# Landing redesign — "One person, locked in"

**Date:** 2026-06-11 · **Status:** approved by Jadon (brainstormed via visual companion; mockups in `.superpowers/brainstorm/19252-1781165910/content/`)

## Problem

The landing's bottom half is seven full-screen chapter sections — a long scroll that reads as "a list you click into." A visitor doesn't learn who Jadon is in the first 20 seconds. The tab still says "Five Worlds" (there are seven sections now), and "worlds" frames the parts as isolated rather than one cohesive story.

## Approved design

New landing flow, dark `#07070a` end to end (chosen: concept **B+ "One Sentence, Seven Doors"** + dense **Pinboard** highlights):

1. **Golden Gate hero** — unchanged, except:
   - "One story · seven chapters" → **"One person · seven doors"**
   - bottom melt gradient fades to dark (`#07070a`), not cream.

2. **The Sentence** (`id="doors"`, new `landing/SentenceDoors.tsx`) — full-viewport. Eyebrow: "Who he is, in one sentence." The sentence, huge (font-display), writes in word-by-word on scroll:

   > He **leads**, **films**, **researches**, **builds**, **competes** — and **documents all of it** — one **person**, locked in.

   Each bold word is a door in its world's accent: hover → full-bleed background photo flood (preloaded, cross-fade) + a stat peek card under the word (photo, one stat line); click → world page. Quiet mono stat ticker beneath. Mobile: first tap arms the door (flood + peek with explicit "enter →"), second tap navigates. Reduced motion: no word stagger, floods become a tint.

   Doors: leads→/leadership (3× Class President → ASB President), films→/civic (Mayor's videographer · Voices of Fremont), researches→/research (gout pain in the genome · ACSEF 3rd), builds→/built (AcornPrep · 500+ students), competes→/court (first NCS title in school history), documents all of it→/locked-in (1.39M plays · year one), person→/about (Mission Peak every birthday · journaling since 8th grade).

3. **The Pinboard** (`id="record"`, new `landing/Pinboard.tsx`) — "The record · pinned." A dense, overlapping collage (~19 items, 8 physical styles: polaroids, newsprint clipping, brass plaque, wax seals, ticket stubs, sticky notes, receipt, prize ribbon, index card). The sixty-word intro is pinned ON the board as a signed letter. **Packing: tight — items visibly overlap; per user feedback the mockup was still too spaced out.** Hover: object straightens (rotate→0), scales ~1.08, jumps z-top, shows a destination tag ("→ the court · rafters"). Click → linked page, deep-linking to a section anchor where one exists. Items settle in with a slight scatter/stagger on scroll. Mobile: collapses to a tight 2-column collage (small rotations, slight negative margins — no absolute positioning).

4. **The Close** — existing three doors (Achievements / Albums / Say Hello) restyled dark; headline → "Seven doors, one direction: *the pursuit of happiness.*" Albums note loses "all five worlds."

## Removals & rewiring

- Delete `StorySpine`, `StoryChapter`, `ChapterRail`, `WorldIndex` (and their imports).
- `data.ts`: `CHAPTERS` + `WORLD_TO_CHAPTER` replaced by `SENTENCE` (doors) + `PINBOARD` (items) structures. Same source-of-truth numbers; nothing invented.
- `DeepDiveBar` (world pages' "← The Story" pill) → links `/#doors`, label "One person".
- Landing's return-from-deep-dive hash-scroll effect stays (works with `#doors`/`#record`/`#close`).

## The rename — "Locked In"

- Tab/OG: **"Jadon Li — Locked In"**; description updated to match.
- Preloader: "Five worlds · one person" → "One person · locked in".
- Footer: "one story, seven chapters" → "one person, locked in".
- 404: "five worlds that do" line reworded.
- `PersOnHero` "The other five worlds are the résumé" → reworded without "five worlds".
- `PROFILE.tagline`: "Documenting the grind across five worlds." → "One person, locked in — documented in public."

## Constraints

- Existing stack only (motion/react, Lenis, Tailwind v4); static-export safe; `"use client"` where interactive.
- All stats from `data.ts` / SpringLight PDF / achievements xlsx — no invented numbers.
- `prefers-reduced-motion` honored in both new sections.
- Concurrent-session repo: commit prior sessions' finished work separately from this redesign.
