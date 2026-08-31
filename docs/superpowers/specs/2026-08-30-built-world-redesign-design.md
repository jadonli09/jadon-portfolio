# Built world redesign — design

**Date:** 2026-08-30 · **Status:** approved in chat, section by section · **Branch:** `built-world-redesign`

## The problem

`/built` today features one project and lists seven footnotes.

- AcornPrep gets ~2 full screens via `AcornFlagship`. The other seven share `ProductsGrid` as identical 1/3-width cards — Hermes, which runs unattended every weekday, sits at exactly the same visual weight as jadonli.com.
- Each card is thumbnail + tagline + stats + chips + link. No story, no demonstration of what the product does, no proof.
- The `archival` halftone filter is applied to product screenshots as well as photographs, so every screenshot on the page is gray mush. The one piece of evidence of what each product looks like is destroyed by the art direction.
- The page then re-lists every project three more times: `GitHubShowcase`, `LaunchLedger`, and the closing manifesto.
- Nothing is interactive beyond `TiltCard` hover.

Jadon's brief: each project gets its own highlighting and a real description, AcornPrep keeps the most weight, CueSheet can sit lower, and the page should feel interactive to explore.

## Decisions

**Interactivity is tiered, the same way the content is.** The top three projects get bespoke, playable demos. The remaining five get a strong shared presentation mechanic with real media. Building eight bespoke demos was rejected — MSJ Makes and the ASB site have nothing meaningful to demo, and it is weeks of work for the projects that matter least.

**Top tier (bespoke demo): AcornPrep, Hermes, NotebookLI.** Weighted by impact and engineering signal. Each proves something different — reach, systems engineering, research fluency. CueSheet is the most *fun* to demo but Jadon flagged it lower priority, and it would spend the budget on the weakest signal.

**Structure: weighted scroll for the top three, a deck for the tail five.** Two mechanics, each where it earns its place.

- A pure deck was rejected: a deck gives every card an identical frame by definition, so AcornPrep could not outweigh CueSheet. Weight would become a claim rather than something a visitor experiences.
- A mission-control console (persistent rail, swappable stage) was rejected for the same reason — everything swapping into an identically-sized stage flattens hierarchy — plus it needs a separate mobile treatment.
- A pure weighted scroll was rejected as ~14 screens and a reading experience rather than something to play with.

The hybrid encodes weight physically as screen real estate for the top three, keeps them fully scannable for a reader who never clicks, and turns the tail into something explorable instead of a wall of thumbnails. Target: ~9 screens.

**Media: Jadon supplies a demo login; screenshots are captured from the real product interiors.** Today a visitor only ever sees AcornPrep's marketing page, which undercuts the "500+ users" claim. Capturing MCQ practice, FRQ grading, flashcards, mind maps, and the NotebookLI reader is the single biggest upgrade available and costs Jadon nothing but an account.

## Page skeleton

```
1  HERO                     keep the bones, fix the stat strip
2  MISSION INDEX            8 rows, doubles as jump-nav            (new)
3  M-01  ACORNPREP          ~3 screens · "try it" panel
4  M-02  HERMES             ~2 screens · steppable pipeline
5  M-03  NOTEBOOKLI         ~2 screens · live reader
6  THE REST OF THE FLEET    deck of 5 full-width panels
7  CLOSING                  one beat + compact repo strip
```

**Cuts.** `LaunchLedger` moves to the top and becomes the mission index, so every project keeps a name-check and a jump link but appears once instead of twice. `GitHubShowcase` shrinks from a full section to a repo strip inside the closing. The manifesto drops to two lines. Three redundant closing sections become one.

**Routing.** Single `/built` page, static-export safe. Chapters keep `#acornprep` / `#hermes` / `#notebookli` — the leadership world already links `/built#hermes` and that must survive. Deck panels get `#cuesheet`, `#msjhs-asb`, `#youth-stem-journal`, `#msj-makes`, `#jadonli-com`; the deck reads the hash on mount and advances to the matching panel.

## The three demos

### AcornPrep — "Try it"

A three-way switcher inside the chapter, each face showing a real product surface.

| Face | What it does |
|---|---|
| **Practice** | A real MCQ from the bank. Reader picks an answer, it grades instantly, the real explanation reveals. "Next question" pulls another from the set. |
| **Grade** | A short FRQ response with the AI rubric scoring it line by line as it animates in. This is the actual differentiator and nothing on the page currently shows it. |
| **Review** | A flashcard that flips. |

~10 questions, one FRQ + rubric, and three flashcards are baked into a repo file. Static, no server, still genuinely from the bank. Five seconds to complete, and it is the first time a visitor touches the thing 500 people used.

### Hermes — "Watch it run"

A steppable three-stage console:

1. **Ingest** — real, messy club captions scrolling by.
2. **Extract** — a caption morphing into a structured `{ club, room, time, what }` row.
3. **Publish** — the story card assembling. `public/embeds/hermes-story.jpg` already exists.

Auto-plays once on scroll-in, then scrubs on click or arrow key. The strongest of the three demos because it shows engineering rather than UI.

### NotebookLI — "Read one paragraph"

A real paragraph from one of the six Fusarium papers read at UMass. Terms are underlined; tapping one opens its definition in place. Below it, two canned questions — clicking one scrolls to and highlights the exact sentence it cites. Ties directly into the research world.

## The fleet deck

Five panels in order: **M-04 MSJHS ASB · M-05 Youth STEM Journal · M-06 CueSheet · M-07 MSJ Makes · M-08 jadonli.com** — the site itself last, as a closing wink.

Each panel is a full-width stage, not a card: writeup on the left (name, the real body paragraph from `data.ts`, stats, stack, link), screenshot on the right in a bracket frame at real size.

Navigation is a row of file-folder tabs stamped with the M-number, plus arrow keys and swipe. `embla-carousel-react` is already a dependency, so drag, keyboard, and swipe come for free rather than hand-rolled.

Active tab lit in rocket red. Fixed `min-height` so switching never jumps the page. All five panels stay in the DOM (`hidden`, not unmounted) so ⌘F and crawlers still find CueSheet. Real `tablist` semantics with roving `tabindex`.

## Art direction

**The one rule change: photographs stay archival, product screenshots go full color.** Photos of Jadon presenting *are* mission-archive documents and keep the halftone. Product UI is evidence and has to be legible. This is a principled split, not "turn the filter off."

To keep the archival language without losing legibility, screenshots enter at halftone-gray and **develop into full color** over ~900ms on scroll-in — a CSS filter transition driven by an intersection observer. This is the page's best motion beat and it is cheap.

Each chapter opens with a consistent mission slate: large M-number, name, one line, hairline rule carrying the launch date. The three chapters read as a series.

Per Jadon's no-filler-subtext rule, the following go:

- `Mission 01 — Flagship` and `01 / 05` on the same rule — one label carries the number, not two.
- `Live transmission — acornprep.com` sitting above a button that already reads `Visit acornprep.com`.
- `End of transmission`.

`prefers-reduced-motion` is respected throughout: demos become static with manual controls, develop resolves instantly to the color state.

## Data fixes

Three defects found while reading, all in scope:

1. Hero stat strip says **"05 Products"**. `PROJECTS` has 8 entries.
2. Hero stat strip says **"~$700 Revenue"**, which contradicts MSJ Makes' `~$4k profit` two sections below. Needs a single honest figure or the tile removed.
3. Hermes renders **"0 clubs watched"** in a captured screenshot — `StatValue` counts up from zero and reads as literally none when the animation has not fired. Should render the final value as the non-animated baseline.

## Architecture

`data.ts` remains the fact ledger. It gains `tier: 1 | 2 | 3`, `slug`, and `launched` on the `Project` type and nothing else. Demo content lives separately so fixtures never pollute the record.

```
src/lib/demos/acornprep.ts     ~10 real MCQs, 1 FRQ + rubric, 3 flashcards
src/lib/demos/hermes.ts        5 real captions → their extracted rows
src/lib/demos/notebookli.ts    paragraph, term definitions, 2 cited answers

src/components/built/
  MissionIndex.tsx             8-row jump index                    (server)
  Chapter.tsx                  shared chapter shell                (server)
  Develop.tsx                  halftone→color scroll wrapper       (client, tiny)
  FleetDeck.tsx                tail-five deck                      (client, embla)
  demos/AcornDemo.tsx                                              (client)
  demos/HermesPipeline.tsx                                         (client)
  demos/NotebookReader.tsx                                         (client)
```

Each demo takes its content as a prop and owns its own state. No shared context, no cross-talk; each is readable and changeable on its own.

**Retired:** `AcornFlagship.tsx`, `ProductsGrid.tsx`, `LaunchLedger.tsx`.
**Shrunk:** `GitHubShowcase.tsx` → a repo strip in the closing.
**Kept:** `BuiltHero.tsx` (trimmed), `LiveEmbed.tsx`, `MissionFX.tsx`.

## Verification

The repo has no test runner — `package.json` exposes only `dev`, `build`, `start`, `lint`. The honest plan:

- `next build` clean.
- `eslint` clean **on changed files only**. ~17 untouched files carry pre-existing `react-hooks/refs` and set-state-in-effect errors, and `next build` does not run lint.
- A `gstack browse` pass at 1440 / 768 / 390 capturing each chapter and each deck panel.
- A keyboard-only run through the deck and all three demos.
- Deep links `/built#hermes`, `/built#cuesheet` verified to land correctly.

## Open — needs Jadon

- **Demo login** for AcornPrep (test account, or stay signed in to Chrome and let the browser tools drive it). Blocks the interior captures for the Practice / Grade / Review faces.
- **Real MCQ content** — either the login gives access to the bank, or ~10 questions exported from Supabase.
- **Revenue figure** for the hero stat strip, or confirmation to drop that tile.

---

## Addendum — product interiors captured (2026-08-30)

Jadon supplied a demo login; the AcornPrep interiors were captured headless and the session was logged out afterward. Credentials were never written to a file or committed. Reference captures live in `.shots/ap-*.png` (gitignored).

### What the product actually contains

| Surface | What it is |
|---|---|
| Dashboard | Readiness %, predicted score /5, accuracy, total MCQs, day streak; weakest-unit callout; daily challenge; friends/leaderboard. Mascots **Pax** and **Sprout**. |
| MCQ Practice | Split view: stimulus (tables, figures) left, stem + 4 choices right. Difficulty and topic tags, calculator flag, filters, "Ask Sprout" tutor. **423 questions in AP Calculus AB alone.** |
| FRQ Practice | Real past exam FRQs by year (2025, 6 questions for Calc AB), multi-part A/B/C/D, reference panel, math symbol palette. |
| Study | **Six** modes: Flashcards (160 cards, space to flip), Podcasts, Study Guides, Tips & Tricks, Worked Examples, Mind Maps (draggable force-directed graph, one node per unit). |

### The FRQ grader is the best asset on the site

Grading a real 2025 Calc AB FRQ returned a per-part rubric where each line item carries points earned, a plain-English justification, **and a verbatim quotation from the student's own response as the evidence for that point**:

```
Your results                                    2 / 5 (40%)
PART (A)                                            2/3 pts
  ✓ Considers x'_H                                     1/1
    Acknowledges the need to differentiate x_H(t)…
    ❝ "v_H(t) = x_H(t) differentiated."
  ✓ Answer                                             1/1
    Correctly calculated v_H(1) = -0.0996.
    ❝ "v_H(t) = -2e^(-3) = -0.0996."
PART (B)                                            0/1 pts
  ✗ Complete and correct response                      0/1
    No relevant response provided.
```

That citation behaviour is the differentiator and it is what the **Grade** face must reproduce: response on the left, rubric items animating in on the right, each pulling a highlight back to the quoted span in the response. A partial score reads better than full marks — it shows the grader reasoning rather than rubber-stamping.

### Consequence for the demo content set

MCQ stems in Calculus, Chemistry, and Statistics are LaTeX-heavy; the portfolio has no math renderer and adding KaTeX for one panel is not worth the bundle. **The baked demo set should be drawn from the prose-based courses** — Psychology, US History, World History, Biology — which need no renderer and read better to a non-specialist visitor. The FRQ demo is the exception: its captured rubric can be reproduced as styled text with the one inline expression set as an image or plain glyphs.

### Corrections to `data.ts`

- The AcornPrep body lists "flashcards, podcasts, mind maps, and study guides" — the product ships **six** study modes. Add Tips & Tricks and Worked Examples.
- Hero stat strip fix, decided (Jadon, 2026-08-30 — recounted, and it is **profit**, not revenue): the tile becomes **`~$4k Profit`**, replacing the unsourced `~$700 Revenue`. The strip reads **08 Products · 500+ Users · #1 Google result · ~$4k Profit.** To keep the no-duplicate-stat rule, the MSJ Makes deck panel drops its own `~$4k Profit` stat pill; its body paragraph carries the breakdown that earned it (badminton and volleyball hoodies, basketball merch, DECA minicon glass, senior stoles) without restating the figure. The number appears once as a number.
- `05 Products` → `08`.
- `StatValue` must render its final value as the non-animated baseline so Hermes never reads "0 clubs watched".
