# The Evidence Board — landing cohesion redesign

**Date:** 2026-06-11
**Status:** Approved (brainstorm session, visual companion: Evidence Board direction → paper-tag words → scroll-drawn linked threads → manila-folder close)

## Problem

The landing's three sections below the Golden Gate hero (`SentenceDoors`, `Pinboard`, `LandingClose`) read as three unrelated designs, and the highlighted words in the sentence don't look clickable — nothing signals that each bold word routes to a world page.

## Concept

The hero stays untouched. Everything below it becomes **one continuous evidence board**: a single corkboard-dark surface (the grid texture the Pinboard already uses) running from the hero's melt gradient to the footer. The sentence, the record, and the close are three zones pinned to the same wall, tied together by red threads. This joins the rest of the page to the Pinboard's world (the section the user likes) and fits the "documents everything / locked in" site identity.

## Components

### 1. `BoardSurface.tsx` (new)

- Relative wrapper around the three sections; owns the continuous board background (dark base + faint grid lines + soft radial spots) and the thread SVG overlay.
- React context: `{ activeWorld, setActiveWorld, registerSource(world, el), registerAnchor(world, el) }`.
- Hero melt gradient retargeted to the board base color.

### 2. `SentenceDoors.tsx` — paper-tag words

- Each door word becomes a pinned paper tag: cream paper chip (`#f7f3e8`), word in the door's **accent** color (darker variant, for contrast on paper), italic Fraunces, slight per-word rotation, gold pin head top-center, small `↗` suffix. Plain words stay plain typeset — the contrast is the affordance.
- Hover: tag straightens (rotate → 0), lifts slightly, shadow grows; existing photo-flood and stat peek stay. Stat peek gets a tiny pin so it reads as a pinned card.
- Mobile keeps first-tap-arms / second-tap-navigates.
- Token reveal animation kept; outer mask gets top padding so the pin isn't clipped by `overflow-hidden`.
- Each tag's pin registers as a thread **source**.

### 3. Threads (inside `BoardSurface`)

- One absolute SVG overlay spanning the board. Per world, a gently sagging red (`#c43e2c`) cubic path from the word's pin to that world's **anchor pin** on the Pinboard.
- **Scroll-drawn:** paths draw downward as the user scrolls from the sentence into the board (stroke-dash + `useScroll` progress, staggered per thread, attributes set via motion value events — no re-render per frame).
- **Linked hover:** `activeWorld` brightens/thickens that thread, lifts the connected pinboard items (CSS transition on an inner wrapper — not the motion reveal props), and highlights the word tag when hovering from the board side.
- Measurement: `getBoundingClientRect` relative to wrapper; recomputed on `ResizeObserver`, `document.fonts.ready`, and image load settle.
- Desktop (`md+`) only. Mobile shows short thread stubs under each tag pin instead. `prefers-reduced-motion`: threads render fully drawn, no pulses.

### 4. `Pinboard.tsx` — joins the wall

- Loses its own bordered box and background (the wall is now `BoardSurface`); dense absolute collage layout unchanged.
- Eyebrow restyles as a pinned **masking-tape label** (shared `BoardLabel` component used by all three zones).
- `PinItem` gains optional `world?: string`; exactly one item per world is the thread anchor (court → NCS polaroid, lockedin → 1.39M plaque, leadership → 3× seal, research → ACSEF ribbon, built → AcornPrep ticket, civic → Voices polaroid, about → Mission Peak polaroid). Anchor pin elements register via context.
- Items with a matching `activeWorld` lift (scale + z bump + glow); hovering them sets `activeWorld`.

### 5. `LandingClose.tsx` — manila folders

- Synthesis line ("Seven doors, one direction: the pursuit of happiness.") stays typeset on the board.
- The doorway grid becomes three pinned manila folders (tab + gradient body + gold pin): **Experiences & Achievements** (paper edge peeking from the top), **Albums** (photo strip peeking), **Say Hello** (red "CASE OPEN" stamp). Hover lifts the folder and slides the peek up. Folder titles in Fraunces dark-brown on manila; notes in mono uppercase.
- Back-to-top button stays.

## Data changes (`src/lib/data.ts`)

- `PinItem` gets `world?: string`; seven anchor items tagged. `SENTENCE_DOORS` unchanged (its `id` doubles as the world key).

## Out of scope

Hero, Nav, Footer, all world pages, mobile thread geometry beyond stubs.

## Testing

- `next build` passes (static export).
- gstack browser screenshots: desktop full scroll, hover states (word → thread/pins, pin → word), mobile viewport, reduced motion.
- Revision cycles on aesthetics until the board reads as one continuous surface.
