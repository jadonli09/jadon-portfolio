# Summer 2026 update — design

**Date:** 2026-08-29 · **Status:** approved by Jadon in chat (direction → one-shot build)

## Sources
- SpringLight student profile (Aug 29, 2026 revision) and List of Achievements.xlsx (new "Senior 26 27" sheet) — diffed against the June versions.
- UMass research poster: *RFP Transformation of Human Strains of Fusarium oxysporum* (Li, Zhang, Wu, Truncer, Ma).
- Activity reflections for the UMass Ma Lab intensive and the FIRE Free Speech Forum. Per Jadon: **keep the summer to the science** — no personal-growth narrative, no stipend, no rooftops.

## Decisions
- **Keep the seven doors.** The summer lands inside existing worlds, tied together by one motif: **the red glow** (mRFP). It appears as a colourway in the research IDE, a fluorescent halo on one landing pin, and nowhere else.
- **Research world = two branches.** The IDE gets a `main` ↔ `umass-2026` branch switcher (status bar, masthead pills, explorer badge, `git checkout`). `umass-2026` swaps the working tree to `fusarium/` (fusarium.md, protocol.sh, plasmid.map, strains.tsv, results.md, figures, citation.bib), flips the masthead to **GLOW, ENGINEERED.**, and turns on the `:root.rfp` colourway (accent = mRFP red, accent-2 = GFP green). Generic names (`poster`, `results`, `project`, `methodology`…) resolve to the branch's files; opening any `fusarium/` file from `main` auto-checks out. `microscope` opens the confocal panel in a darkfield frame. `git log` renders the six weeks as commits. Deep link: `/research?branch=umass-2026`.
- **Built:** NotebookLI joins as a live product card (screenshot captured); CueSheet gets its real story; the site itself is a card ("Websites are the new résumés"); AcornPrep's body records the YBVC top-15 pitch at Stanford, including the judges' verdict.
- **Leadership:** ASB President note moves to "in office"; a gold **term log** (senior sunrise lipdub, Green & White Assembly, the promo) sits under the arc callout; Green & White Assembly is the first row of the events ledger.
- **Civic:** new `CivicNational` section (`#national`) after the commission — two wire cards: CommonApp Student Advisory Commission (1 of 20) and FIRE Free Speech Forum (DC). Mayor's Videographer story extends to present (Ro Khanna reel, Carter handoff).
- **About:** four travel pins (Amherst, DC, Boston, New York) with notes; photo slots remain until real photos arrive.
- **Locked In:** `LockedYearTwo` embeds the two summer reels live (AP-score reaction, UMass music video) so dates/counts come from Instagram — nothing typed in.
- **Landing:** letter rewritten for senior year; three new pins (glowing confocal polaroid → research branch, CommonApp seal → civic, YBVC ticket → built); ticker adds ACT 35 · 11 AP 5s · 1 of 20 CommonApp; board height 530 → 600.
- **Achievements:** SCORES → SAT 1540 (750/790), ACT 35 (36/36/35/34 as bars), PSAT; AP fives 6 → 11; 13 new trophies for 2026.
- **Meta:** metadataBase → jadonli.com (the live domain, served by Vercel from this repo).

## Data conflicts resolved
- YSJC 2026: xlsx (newer) says 60 students / 6 cohorts / 20 mentored; PDF says 35 / 8. Used the xlsx.
- UMass dates: PDF says "June 27 – July 6", poster is dated Aug 4; the program is six weeks. Site says "Summer 2026 · 6 weeks".
- YBVC field: PDF says top 15 of 300+; xlsx cites 1,000+ applicants *last year*. Used 300+.

## Open
- Photos: UMass lab / poster session, FIRE, DC·Boston·NY, Green & White Assembly, YBVC — slots exist (travel polaroids, albums, IDE `photo` on the branch). Drop files in `public/img` and register them.
- Hermes status is unchanged from June ("in build") — unverified.

## Addendum — photos, match cut, Hermes, ASB site (same day)
- **Photos** arrived in `~/Downloads/new photos` (umass · FIRE · green and white assembly · selfies from the summer · travel/{boston,DC,NY} · YBVC). Resized with PIL (`exif_transpose`, long side 1800 / selfies 1400) into `public/img/{umass,fire,gw,selfie,boston,dc,ny,ybvc}-NN.jpg`.
- **Selfie match cut** (`albums/SelfieMatchCut.tsx`): the 45 selfies play as hard cuts (560 ms beat) with the face locked to one anchor. Face boxes came from Apple Vision (`VNDetectFaceRectanglesRequest` via a throwaway Swift script) and live in `src/lib/selfies.ts` as `{cx, cy, fw}`; each frame is scaled so the face is 30% of frame width and translated so its centre sits at (50%, 42%). Reticle marks the match point; hover pauses, click/arrows step, reduced motion disables autoplay. Next 4 frames stay mounted invisibly so cuts never pop.
- **Albums**: new *The Summer* album (06) — UMass, YBVC, FIRE, DC/Boston/NY; Green & White Assembly frames lead *The Podium*; Portraits → 07.
- **Slots filled**: travel polaroids (Amherst · DC · Boston · NY); research `umass-2026` branch gets `photo` (poster day), `bench`, `session`, and the ice-rink image on `field/umass.md`; leadership field strip opens with Leadership II + G&W (replacing the never-delivered `asb-leadership-2026.jpg` slot); FIRE cohort photo on its CivicNational card; YBVC pinboard pin is now a polaroid.
- **Hermes is live** on @msjclubs (weekday club-schedule stories). Card shows a real story frame; flight log status is LIVE for every mission.
- **msjhsasb.org** (built with Kaiwei Parks, replaces msjasb.org) — new built card + term-log entry + trophy.
- **Green & White Assembly** copy per Jadon: start-of-school rally — teacher introductions, student-engagement activities, hype activities.
- Still open: nothing from Jadon's list. Hermes stack chips (Node.js · Claude API · Google Sheets) read from the repo's package.json.
