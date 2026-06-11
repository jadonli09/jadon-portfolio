# The Pursuit (`/locked-in`) — "One Year, Documented" timeline redesign

**Date:** 2026-06-10
**Problem:** The page showed 10 Instagram reels as bare codes in a decorative mosaic — no dates,
captions, or significance. Bold kinetic text was good (keep); everything else read as placeholder.

## Research findings (Instagram unauthenticated feed API, scraped 2026-06-10)

- @li_locked.in spans **exactly one year**: 83 reels, Jun 6 2025 → Jun 8 2026.
- Real totals: **1,769 followers · 1,393,238 plays · 30,337 likes · 83 reels · 368 days**.
  (Page previously showed stale launch stats: "1,400+ / 500k in a month".)
- Jadon's own series is literally titled *The Pursuit of Happiness* (Ep. 1 = Mayor Salwan, 32.5k).
- Five clear narrative arcs exist in the data (see chapters below).

## Concept

A chronological, season-graded scroll timeline: every video sits at its **real date** with its
**real caption and view count**, with narrative "tidbits" between moments. Bold Anton chapter
headlines retained as the page's voice.

## Chapters & palette

Dark feed-black world retained (`--bg #0a0a0c`); pink `#ff3d81` stays the world identity
(nav/hero/CTA). The timeline spine grades through per-chapter accents:

| # | Chapter | Range | Accent |
|---|---------|-------|--------|
| 01 | The Summer Grind | Jun 2025 | summer gold `#ffb43d` |
| 02 | The Road to 1600 | Jul 2025 | focus cyan `#3df0ff` |
| 03 | The Sweet Tomatoes Saga | Jul–Aug 2025 | viral pink `#ff3d81` |
| 04 | The School Year | Sep–Dec 2025 | ember `#ff7a3d` |
| 05 | Seventeen | Jan–Jun 2026 | dawn violet `#b48cff` |

## Moments

13 keystone reels downloaded as native mp4s (`public/vid/pursuit/*.mp4` + poster jpgs,
540/480px CRF28-31, 47MB total, `preload="none"` — load only on play):
day1, climbing-wall, poh-ep1 · ap-scores · sweet-tomatoes, pursuing-happiness, we-got-ts ·
homecoming (landscape), vibe-coding · mission-peak-17, walkout, newsom, june-sat.

Between videos: **log rows** (date + day number + caption snippet + views, text-only) and one
**pull-quote** block ("an attempt to create the extraordinary from the mundane", Day 227).

## Components

- `src/lib/data.ts` → new `PURSUIT` export (chapters → moments union: video | log | quote);
  `LOCKED.metrics` updated to real year-one totals; landing chapter 07 stat → "1.39M+ plays, year one".
- `src/components/lockedin/PursuitTimeline.tsx` — spine (scroll-grown gradient line), chapter
  headers (KineticHeadline), `MomentVideo` phone-frame card (hover/tap play, IG link-out),
  `LogRow`, `QuoteBlock`, `DayChip` markers. Desktop: center spine, alternating cards;
  mobile: left spine, stacked.
- `LockedHero.tsx` — reframed: "ONE YEAR." / "DOCUMENTED." / "still locked in." + 4 real metrics
  + "DAY 001 — JUN 06 2025" handoff into the timeline.
- `page.tsx` — Hero → Marquee → PursuitTimeline → FollowCTA → Footer (reel mosaic retired).

## Out of scope

DouYin block stays on /court (prior decision). Old `LockedFeedWall`/`ReelTile` components left
in place (unimported) for git history. No commit/push — working tree has unrelated in-flight work.
