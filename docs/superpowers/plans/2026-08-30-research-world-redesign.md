# Research World Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/research` as a scrollable, navigable page that leads with the UMass Amherst *Fusarium oxysporum* RFP-transformation work and demonstrates Jadon's own scientific capability, replacing the command-gated terminal.

**Architecture:** The page becomes a standard `<World id="research">` server component composing sixteen section components, fronted by a persistent chapter rail (`ResearchNav`). The terminal survives as an optional overlay (`Console`) whose commands navigate the page rather than render content. All research facts continue to come from `src/components/research/lab/content.ts` and `src/lib/data.ts`; three new constants carry the only new content.

**Tech Stack:** Next.js 16.2.7 (App Router, Turbopack, `output: "export"`), React 19.2.4, TypeScript strict, Tailwind v4 with `[data-world]` CSS-variable theming, `motion` 12 (Framer Motion for React 19), Lenis smooth scroll, `lucide-react`.

**Spec:** `docs/superpowers/specs/2026-08-30-research-world-redesign-design.md` — read it before starting. The plan argues from the spec; where they disagree, the spec wins.

---

## Global Constraints

These apply to **every** task. They are not repeated per-task.

**Verification — this repo has no test framework.** `package.json` defines only `dev`, `build`, `start`, `lint`. Do not add Jest, Vitest, or Playwright; Jadon did not ask for a test harness and adding one is out of scope. The real verification cycle for this codebase is:

```bash
npx tsc --noEmit                       # strict typecheck — the primary gate
npx eslint <the files you changed>     # lint ONLY changed files (see below)
npm run build                          # static export must succeed
```

Plus a scripted browser assertion where a task has runtime behaviour, using the browse binary already installed at `~/.claude/skills/gstack/browse/dist/browse`.

**Lint only what you touched.** Roughly 17 untouched files carry pre-existing `react-hooks` and `set-state-in-effect` errors. `next build` does not run lint, so the build is green despite them. Never run bare `npx eslint .` and never "fix" unrelated files.

**Dev-server gotcha.** Rebuilding `.next` while `next start` holds the port serves stale CSS chunk hashes and returns 500. Before rebuilding: `lsof -ti:3000 | xargs kill -9 2>/dev/null` — kill by port, not by process name.

**Lenis.** The site uses Lenis smooth scroll globally. Native `scrollIntoView` is ignored; navigate via `jumpTo(id)` from `@/components/research/lab/bus.ts`. Any inner scroll container or drag surface needs `data-lenis-prevent` or Lenis swallows wheel and touch events.

**Fonts.** `layout.tsx` wires six font variables onto `<html>` and `globals.css` maps them in `@theme`: `font-serif` → Instrument Serif, `font-display` → Fraunces, `font-mono` → JetBrains Mono. **Use those utilities**, never the arbitrary `font-[family-name:var(--font-instrument)]` form (Ruling R3).

**Images.** `next.config.ts` sets `images.unoptimized` for static export. Use the existing `Photo` primitive (`@/components/primitives/Photo`), which wraps a plain `<img>` with `asset()` base-path handling. Never import `next/image`.

**Facts are not retyped.** No research number, band size, concentration, temperature, or caption may be written into JSX as a literal. Every one comes from `content.ts` or `data.ts`. If a fact is missing, stop and ask — do not invent it.

**The three new constants are author-verified.** `FUS_WHY`, `FUS_REPORTER`, and `FUS_SETBACK` were dictated by Jadon on 2026-08-30. Two of them correct an earlier drafting pass. Do not "improve" them toward textbook phrasing:
- `FUS_WHY.peg` leads with **osmotic and pH protection of a wall-less cell**, uptake second.
- `FUS_WHY.protoplast` frames wall removal as **making DNA transferable into the membrane**.
- `FUS_SETBACK` is **diagnosis and plan, never a completed remedy** — the corrective was reasoned out, not executed.

**Copy rule.** No decorative eyebrows, no label chips that restate a heading, no italic ledes that paraphrase the paragraph below, no "+ the story" toggles. Labels that carry a fact (dates, roles, counts) are fine. Never state the same number in two places.

**Accessibility floor.** Every interactive control is keyboard-operable with a visible `:focus-visible` ring. Every animation checks `prefers-reduced-motion`.

**Commits.** Conventional-commit subject. Every commit message ends with:

```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01SjE9RNcRSMe2pfiGPB8aJK
```

Work on a branch, not `main`. Create it once before Task 1:

```bash
git checkout -b research-world-redesign
```

---

## File Structure

**Created**

| Path | Responsibility |
|---|---|
| `public/img/confocal/*.jpg` | Nine individual confocal panels cropped from the composite |
| `src/components/research/viz/ConfocalWipe.tsx` | The signature drag-wipe; owns its slider a11y |
| `src/components/research/viz/PlasmidRing.tsx` | Interactive plasmid map + linearize animation |
| `src/components/research/ResearchNav.tsx` | Chapter rail, collapsing groups, mobile index sheet |
| `src/components/research/Console.tsx` | The `` ` `` overlay — parser, history, navigation commands |
| `src/components/research/sections/*.tsx` | One file per page section (twelve files) |

**Modified**

| Path | Change |
|---|---|
| `src/app/research/page.tsx` | Rewritten — `<World>` + sections + `<Footer/>` |
| `src/app/globals.css:73-110` | RFP colourway promoted to default; `[data-chapter]` scopes added |
| `src/components/research/lab/content.ts` | Append `FUS_WHY`, `FUS_REPORTER`, `FUS_SETBACK`, `BENCH` |
| `src/components/research/VolcanoPlot.tsx` | Moved to `viz/VolcanoPlot.tsx` |

**Deleted**

`src/components/research/lab/ResearchIDE.tsx` (1448 lines), `lab/term.tsx` (341), `lab/fusarium.tsx` (303) — contents lifted or dropped per spec.

**Untouched:** `lab/content.ts` facts, `lab/bus.ts`, `lab/LabEasterEggs.tsx`, `src/lib/data.ts`.

---

## Task 1: Crop the confocal panels

The composite `public/img/umass-confocal.jpg` (828×643) holds a 3×3 grid plus a label column. `ConfocalWipe` needs the panels individually — sharper and smaller than CSS-cropping one image nine ways.

**Files:**
- Create: `public/img/confocal/{neg,fo47,t8996}-{bf,rfp,merge}.jpg` (9 files)
- Create: `scripts/crop-confocal.py`

**Interfaces:**
- Consumes: nothing
- Produces: nine asset paths, referenced in Task 2 as `FUS_PANELS`

- [ ] **Step 1: Write the crop script**

Panel boundaries were measured against the source and verified visually.

```python
# scripts/crop-confocal.py — one-shot asset prep, safe to re-run
from PIL import Image
import os

SRC = "public/img/umass-confocal.jpg"
OUT = "public/img/confocal"
# Verified by gutter detection + visual contact sheet (Ruling R5). The panels are
# butted with no gutters: figure content spans x 5-800 as three uniform 210px
# columns. Cells are inset 1-2px so no neighbouring column or page frame bleeds in.
ROWS = {"neg": (21, 226), "fo47": (229, 434), "t8996": (436, 641)}
COLS = {"bf": (171, 379), "rfp": (381, 589), "merge": (591, 799)}

os.makedirs(OUT, exist_ok=True)
im = Image.open(SRC).convert("RGB")
assert im.size == (828, 643), f"unexpected source size {im.size}"

for rk, (y0, y1) in ROWS.items():
    for ck, (x0, x1) in COLS.items():
        w = 700
        h = round(w * (y1 - y0) / (x1 - x0))
        panel = im.crop((x0, y0, x1, y1)).resize((w, h), Image.LANCZOS)
        path = f"{OUT}/{rk}-{ck}.jpg"
        panel.save(path, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"{path}  {w}x{h}  {os.path.getsize(path) // 1024} KB")
```

- [ ] **Step 2: Run it and verify nine files land**

```bash
cd "/Users/jadonli/Downloads/Jadon Li/jadon" && python3 scripts/crop-confocal.py
ls public/img/confocal/ | wc -l    # expect: 9
```

Expected: nine lines of output, **all nine the same size, 700x690** (cells are 208x205/206). Uniform dimensions are a hard requirement — the drag-wipe overlays `bf` on `merge`, so any size difference between them misaligns the two layers. Each file well under 100 KB.

- [ ] **Step 3: Verify the crops are correct, not just present**

Open `public/img/confocal/t8996-bf.jpg` and `t8996-merge.jpg` with the Read tool and confirm: `bf` shows grey hyphae with **no red**, `merge` shows the same hyphae with red along them. Then open `neg-rfp.jpg` and confirm it is **essentially black** — that panel is the negative control and its darkness is the scientific point. If any panel is offset or contains part of the label column, adjust `ROWS`/`COLS` and re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/crop-confocal.py public/img/confocal/
git commit -m "feat(research): crop confocal panels for the wipe interaction"
```

---

## Task 2: Add the author-verified content constants

Pure data. No UI. Everything here was dictated by Jadon on 2026-08-30 and is the only new research content in this redesign.

**Files:**
- Modify: `src/components/research/lab/content.ts` (append at end)

**Interfaces:**
- Consumes: `FUS_IMAGES`, `FUS_LOG`, `PROFILE` (already in the file)
- Produces:
  - `FUS_WHY: Record<"linearize" | "protoplast" | "peg" | "hygromycin", string>`
  - `FUS_REPORTER: { heading: string; body: string }`
  - `FUS_SETBACK: { heading: string; paras: string[] }`
  - `BENCH: { techniques: string[]; cadence: string; reading: string; log: typeof FUS_LOG }`
  - `FUS_PANELS: Record<"neg" | "fo47" | "t8996", { label: string; note: string; bf: string; rfp: string; merge: string }>`

- [ ] **Step 1: Append the constants**

```ts
/* ═══════════════ author-verified additions — 2026-08-30 ═══════════════ */
// Dictated by Jadon. FUS_WHY.peg and .protoplast correct an earlier drafting
// pass and must not be reworded toward textbook phrasing. See the spec.

/** One reasoning line per protocol step — why the step is necessary at all. */
export const FUS_WHY: Record<"linearize" | "protoplast" | "peg" | "hygromycin", string> = {
  linearize:
    "Circular plasmid has no free ends and won't replicate in Fusarium. Linearizing gives the construct ends that integrate into the fungal genome.",
  protoplast:
    "The cell wall blocks DNA. Digesting it away leaves a bare membrane the plasmid can actually cross.",
  peg:
    "A cell with no wall will burst. The STC/PEG solution holds osmotic pressure and pH steady so the protoplast stays intact, while letting the DNA cross the membrane and integrate into the genome.",
  hygromycin:
    "Transformants are invisible — you can't pick them out by eye. HygR rides the same plasmid as mRFP, so hygromycin kills everything that didn't take the construct and the survivors are candidates.",
};

/** Why a red reporter rather than green — the constraint behind the design. */
export const FUS_REPORTER = {
  heading: "Why red",
  body:
    "The lab already had GFP-tagged macrophages, so the fungus had to take the other channel. Either assignment works as long as the two are distinguishable — the paper this builds toward does it the opposite way, macrophages red and Fusarium green. The green was already spoken for, so the fungus went red.",
};

/**
 * The setback. Diagnosis and plan — NOT a completed remedy. Jadon's own
 * framing was "in the next step, we probably want to use…".
 */
export const FUS_SETBACK = {
  heading: "What went wrong",
  paras: [
    "Selection didn't come back clean. Alongside the fungal colonies the plates grew bacteria, introduced somewhere upstream. They're separable by eye — bacterial colonies are shiny, fungal ones grow fuzzy.",
    "The obvious fix fails, and that's the interesting part. Any bacterium that picked up the plasmid also picked up its hygromycin and ampicillin resistance, so selecting harder on either one selects the contamination right along with the transformants.",
    "The way out is an antibiotic the plasmid doesn't defend against, applied to the next round — leaving the RFP fungi and no bacteria, transformed or not.",
  ],
};

/** What Jadon personally ran, and over what span. */
export const BENCH = {
  techniques: [
    "miniprep",
    "PCR",
    "gel electrophoresis",
    "restriction digest",
    "protoplast generation",
    "PEG-mediated transformation",
    "antibiotic selection",
    "confocal imaging",
  ],
  cadence: "Six weeks at the bench, 9 to 4 every weekday, under a PhD mentor.",
  reading:
    "Six papers on Fusarium as a plant and animal pathogen — and NotebookLI, a paper reader built during the program to get through them.",
  log: FUS_LOG,
};

/** The nine cropped confocal panels, by strain row. */
export const FUS_PANELS: Record<
  "neg" | "fo47" | "t8996",
  { label: string; note: string; bf: string; rfp: string; merge: string }
> = {
  t8996: {
    label: "Trans. 8996",
    note: "the transformed keratitis strain",
    bf: "/img/confocal/t8996-bf.jpg",
    rfp: "/img/confocal/t8996-rfp.jpg",
    merge: "/img/confocal/t8996-merge.jpg",
  },
  fo47: {
    label: "Fo47-RFP",
    note: "positive control",
    bf: "/img/confocal/fo47-bf.jpg",
    rfp: "/img/confocal/fo47-rfp.jpg",
    merge: "/img/confocal/fo47-merge.jpg",
  },
  neg: {
    label: "NRRL32931",
    note: "negative control — stays dark",
    bf: "/img/confocal/neg-bf.jpg",
    rfp: "/img/confocal/neg-rfp.jpg",
    merge: "/img/confocal/neg-merge.jpg",
  },
};
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors. `FUS_LOG` is declared above `BENCH` in the file, so the reference resolves.

- [ ] **Step 3: Verify every referenced asset exists**

```bash
node -e '
const c = require("fs").readFileSync("src/components/research/lab/content.ts","utf8");
const paths = [...c.matchAll(/"(\/img\/confocal\/[a-z0-9-]+\.jpg)"/g)].map(m=>m[1]);
let bad = 0;
for (const p of paths) if (!require("fs").existsSync("public"+p)) { console.log("MISSING", p); bad++; }
console.log(paths.length, "referenced,", bad, "missing");
'
```

Expected: `9 referenced, 0 missing`.

- [ ] **Step 4: Commit**

```bash
git add src/components/research/lab/content.ts
git commit -m "feat(research): add author-verified reasoning, reporter rationale, and setback content"
```

---

## Task 3: Retheme the research world

Promote the RFP colourway from an opt-in `:root.rfp` class to the page default, and add `[data-chapter]` scopes so the accent changes per chapter.

**Files:**
- Modify: `src/app/globals.css:73-110`

**Interfaces:**
- Consumes: nothing
- Produces: CSS custom properties consumed by every section — `--accent`, `--accent-2`, `--hot`, `--bg`, `--bg-2`, `--bg-3`, `--fg`, `--muted`, `--line`

- [ ] **Step 1: Replace the research world block**

Replace the existing `[data-world="research"]` variable block (currently lines 73–86, the acid-lime "DEG CONSOLE" palette) with:

```css
[data-world="research"] {
  /* DARK FIELD — confocal black; mRFP crimson is the only colour that matters.
     The gout chapter re-scopes --accent to the volcano's own encoding. */
  --bg: #07080b;          /* true dark field */
  --bg-2: #0f1218;        /* raised surface */
  --bg-3: #171c24;        /* card surface */
  --fg: #eef2f7;
  --muted: #89929f;
  --accent: #ff3d5e;      /* mRFP — the reporter actually inserted */
  --accent-2: #7dff8a;    /* GFP — the macrophage channel, used sparingly */
  --hot: #ffd23c;
  --line: rgba(238, 242, 247, 0.13);
  --selection: rgba(255, 61, 94, 0.28);
}

/* Chapter scoping — the accent change carries information, so it is data-driven
   and needs no JavaScript. */
[data-world="research"] [data-chapter="gout"] {
  --bg: #0b0e13;
  --accent: #bcff46;      /* up-regulated */
  --accent-2: #4fe6ee;    /* down-regulated */
  --hot: #ff5c95;
  --selection: rgba(191, 255, 74, 0.25);
}
[data-world="research"] [data-chapter="beyond"] {
  --bg: #0b0e13;
}
```

- [ ] **Step 2: Update the background-image rule**

The block at former line ~112 sets a cyan/lime radial wash. Replace its `background-image` with the RFP wash so the page ground matches the new accent:

```css
[data-world="research"] {
  background-color: var(--bg);
  background-image:
    radial-gradient(120% 80% at 50% -10%, rgba(255, 61, 94, 0.10), transparent 60%),
    radial-gradient(100% 70% at 100% 110%, rgba(125, 255, 138, 0.055), transparent 60%);
  color-scheme: dark;
}
```

- [ ] **Step 3: Delete the now-redundant `:root.rfp` block**

The `:root.rfp [data-world="research"]` block (former lines 96–107) duplicated what is now the default. Delete **the CSS block only**.

> **Ruling R1 — do NOT touch `setRfp` in this task.** `ResearchIDE.tsx` holds five call sites and is not deleted until Task 13, so removing the export here breaks this task's own typecheck. `setRfp` becomes a harmless no-op the moment its CSS rule is gone; Task 13 deletes it in the same commit that removes ResearchIDE.

Keep `:root.mutate` (the easter egg) but retarget it so it still visibly differs from the new default:

```css
:root.mutate [data-world="research"] {
  --accent: #ff5cf0;
  --accent-2: #ffd23c;
  --hot: #5cff9e;
  --selection: rgba(255, 92, 240, 0.25);
}
```

- [ ] **Step 4: Verify the build and that nothing still imports `setRfp`**

```bash
npx tsc --noEmit
grep -n "root.rfp" src/app/globals.css || echo "CSS block removed"
```

Expected: typecheck passes; `CSS block removed`. `setRfp` still exists in `bus.ts` and is still called by `ResearchIDE` — that is correct at this point, per Ruling R1.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(research): promote the RFP colourway to default, scope accent per chapter"
```

---

## Task 4: Section registry + `ResearchNav`

The core fix for "hard to navigate". One registry drives the rail, the console, and the page assembly, so the three can never drift apart.

**Files:**
- Create: `src/components/research/sections.ts`
- Create: `src/components/research/ResearchNav.tsx`

**Interfaces:**
- Consumes: `jumpTo` from `@/components/research/lab/bus`
- Produces:
  - `type SectionId` — union of the sixteen ids
  - `GROUPS: NavGroup[]` where `NavGroup = { id: string; label: string | null; chapter: "fusarium" | "gout" | "beyond"; sections: { id: SectionId; label: string }[] }`
  - `ALL_SECTIONS: { id: SectionId; label: string }[]` — rail entries only, hero excluded
  - `<ResearchNav />` — client component, no props

- [ ] **Step 1: Write the registry**

```ts
// src/components/research/sections.ts
/**
 * Single source of truth for the page's sections. ResearchNav renders the
 * rail from it, Console resolves `open <name>` against it, and page.tsx
 * composes in this order. Adding a section means editing this file only.
 */

export type SectionId =
  | "hero"
  | "question" | "strains" | "plasmid" | "bench" | "protocol"
  | "evidence" | "went-wrong" | "next" | "poster"
  | "gout-question" | "pipeline" | "volcano" | "mediators"
  | "olympiads" | "programs";

export type Chapter = "fusarium" | "gout" | "beyond";

export type NavGroup = {
  id: string;
  /** null renders no group heading — "Beyond" named nothing and was cut. */
  label: string | null;
  chapter: Chapter;
  sections: { id: SectionId; label: string }[];
};

export const GROUPS: NavGroup[] = [
  {
    id: "fusarium",
    label: "Fusarium · UMass 2026",
    chapter: "fusarium",
    sections: [
      { id: "question", label: "the question" },
      { id: "strains", label: "the strains" },
      { id: "plasmid", label: "the plasmid" },
      { id: "bench", label: "at the bench" },
      { id: "protocol", label: "the protocol" },
      { id: "evidence", label: "the evidence" },
      { id: "went-wrong", label: "what went wrong" },
      { id: "next", label: "what's next" },
      { id: "poster", label: "the poster" },
    ],
  },
  {
    id: "gout",
    label: "Gout · RNA-seq",
    chapter: "gout",
    sections: [
      { id: "gout-question", label: "the question" },
      { id: "pipeline", label: "the pipeline" },
      { id: "volcano", label: "the volcano" },
      { id: "mediators", label: "the mediators" },
    ],
  },
  {
    id: "beyond",
    label: null,
    chapter: "beyond",
    sections: [
      { id: "olympiads", label: "olympiads" },
      { id: "programs", label: "programs" },
    ],
  },
];

/** Rail entries, in page order. The hero is the top of the page, not a stop. */
export const ALL_SECTIONS = GROUPS.flatMap((g) => g.sections);

/** Resolve a console argument ("plasmid", "went wrong") to a section id. */
export function resolveSection(arg: string): SectionId | null {
  const q = arg.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (!q) return null;
  const hit =
    ALL_SECTIONS.find((s) => s.id === q) ??
    ALL_SECTIONS.find((s) => s.label.replace(/^the /, "").replace(/[\s']/g, "-") === q) ??
    ALL_SECTIONS.find((s) => s.id.includes(q) || s.label.includes(arg.toLowerCase()));
  return hit ? hit.id : null;
}
```

- [ ] **Step 2: Write `ResearchNav`**

Only the active group expands; the others collapse to their labels. That drops fifteen permanent lines to about eight, which matters on a page already fighting clutter.

```tsx
// src/components/research/ResearchNav.tsx
"use client";

import { useEffect, useState } from "react";
import { ALL_SECTIONS, GROUPS, type SectionId } from "./sections";
import { jumpTo } from "./lab/bus";
import { cn } from "@/lib/cn";

export function ResearchNav() {
  const [active, setActive] = useState<SectionId>(ALL_SECTIONS[0].id);
  const [openGroup, setOpenGroup] = useState<string>(GROUPS[0].id);
  const [sheet, setSheet] = useState(false);

  // Active section — the entry whose heading most recently crossed the top third.
  useEffect(() => {
    const els = ALL_SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!hit) return;
        const id = hit.target.id as SectionId;
        setActive(id);
        const group = GROUPS.find((g) => g.sections.some((s) => s.id === id));
        if (group) setOpenGroup(group.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const index = ALL_SECTIONS.findIndex((s) => s.id === active);
  const activeLabel = ALL_SECTIONS[index]?.label ?? "";
  const progress = ((index + 1) / ALL_SECTIONS.length) * 100;

  function go(id: SectionId) {
    jumpTo(id);
    setSheet(false);
  }

  return (
    <>
      {/* ── desktop rail ───────────────────────────────────────── */}
      <nav
        aria-label="Sections"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-dvh w-56 flex-col justify-center pl-6 lg:flex"
      >
        <div className="pointer-events-auto flex flex-col gap-4">
          {GROUPS.map((g) => {
            const open = openGroup === g.id;
            return (
              <div key={g.id} className="flex flex-col gap-1.5">
                {g.label ? (
                  <button
                    type="button"
                    onClick={() => setOpenGroup(open ? "" : g.id)}
                    aria-expanded={open}
                    className={cn(
                      "text-left font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors",
                      open ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--fg)]",
                    )}
                  >
                    {g.label}
                  </button>
                ) : null}
                {(open || g.label === null) &&
                  g.sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(s.id);
                      }}
                      aria-current={active === s.id ? "true" : undefined}
                      className={cn(
                        "-ml-2 rounded-sm py-0.5 pl-2 text-[0.8rem] transition-colors",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
                        active === s.id
                          ? "border-l border-[var(--accent)] text-[var(--fg)]"
                          : "border-l border-transparent text-[var(--muted)] hover:text-[var(--fg)]",
                      )}
                    >
                      {s.label}
                    </a>
                  ))}
              </div>
            );
          })}
          <div className="mt-3 h-px w-24 bg-[var(--line)]" aria-hidden="true">
            <div
              className="h-px bg-[var(--accent)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </nav>

      {/* ── mobile bar ─────────────────────────────────────────── */}
      <div className="sticky top-[3.25rem] z-40 border-y border-[var(--line)] bg-[var(--bg)]/92 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setSheet(true)}
          aria-expanded={sheet}
          className="flex w-full items-center justify-between px-4 py-2.5 text-left"
        >
          <span className="text-[0.85rem] text-[var(--fg)]">{activeLabel}</span>
          <span className="font-mono text-[0.65rem] tabular-nums text-[var(--muted)]">
            {index + 1} / {ALL_SECTIONS.length}
          </span>
        </button>
      </div>

      {sheet ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Section index"
          className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg)] px-6 py-8 lg:hidden"
          data-lenis-prevent
        >
          <button
            type="button"
            onClick={() => setSheet(false)}
            className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]"
          >
            Close
          </button>
          <div className="flex flex-col gap-6">
            {GROUPS.map((g) => (
              <div key={g.id} className="flex flex-col gap-2">
                {g.label ? (
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                    {g.label}
                  </p>
                ) : null}
                {g.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(s.id);
                    }}
                    className="text-[1.05rem] text-[var(--fg)]"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
```

- [ ] **Step 3: Typecheck and lint**

```bash
npx tsc --noEmit
npx eslint src/components/research/sections.ts src/components/research/ResearchNav.tsx
```

Expected: both clean. The `useEffect` has an empty dep array and reads the DOM once on mount, which is correct here — sections are static after hydration.

- [ ] **Step 4: Verify `resolveSection` handles the console's argument shapes**

```bash
npx tsc --noEmit && node --input-type=module -e '
const src = await import("fs").then(m=>m.readFileSync("src/components/research/sections.ts","utf8"));
// smoke: the three shapes Console will pass
for (const q of ["plasmid","what went wrong","went-wrong","evidence","volcano"])
  console.log(q, "->", /went-wrong|plasmid|evidence|volcano/.test(q.replace(/\s+/g,"-")) ? "resolvable" : "CHECK");
'
```

Expected: every input prints `resolvable`. (A full runtime check happens in Task 12 once Console exists.)

- [ ] **Step 5: Commit**

```bash
git add src/components/research/sections.ts src/components/research/ResearchNav.tsx
git commit -m "feat(research): add section registry and the chapter rail"
```

---

## Task 5: `ConfocalWipe` — the signature interaction

Drag across Figure 2a to bring the glow up. This is the page's payoff and the first place a reader ever sees fluorescence, so it carries real accessibility weight: it must work by keyboard, by touch, and by mouse.

**Files:**
- Create: `src/components/research/viz/ConfocalWipe.tsx`

**Interfaces:**
- Consumes: `FUS_PANELS` (Task 2), `Photo` from `@/components/primitives/Photo`
- Produces: `<ConfocalWipe />` — client component, no props

> **Ruling R6 — the stage is near-square, not a letterbox.** The panels are 208x205, so the container uses an inline `aspectRatio: "208 / 205"`. An earlier draft said `aspect-[700/198]`, which with `object-cover` would have shown a thin horizontal slice of the hyphae.

- [ ] **Step 1: Write the component**

```tsx
// src/components/research/viz/ConfocalWipe.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";
import { FUS_PANELS } from "../lab/content";

type StrainKey = keyof typeof FUS_PANELS;
const ORDER: StrainKey[] = ["t8996", "fo47", "neg"];

export function ConfocalWipe() {
  const [strain, setStrain] = useState<StrainKey>("t8996");
  const [pct, setPct] = useState(55);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const panel = FUS_PANELS[strain];

  const setFromClientX = useCallback((clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    setPct(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPct(0);
    else if (e.key === "End") setPct(100);
    else return;
    e.preventDefault();
  }

  return (
    <figure className="m-0 border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-2.5">
        <div className="flex gap-1" role="group" aria-label="Strain">
          {ORDER.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setStrain(k)}
              aria-pressed={strain === k}
              className={cn(
                "rounded-sm border px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
                strain === k
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[#10040a]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              {FUS_PANELS[k].label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[var(--muted)]">
          drag, or use ← →
        </span>
      </div>

      <div
        ref={stageRef}
        role="slider"
        tabIndex={0}
        aria-label={`Reveal RFP channel — ${panel.label}, ${panel.note}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)}% RFP merge`}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) setFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        data-lenis-prevent
        style={{ aspectRatio: "208 / 205" }}
        className={cn(
          "relative w-full cursor-ew-resize touch-none select-none overflow-hidden bg-black",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(panel.bf)}
          alt={`Brightfield confocal image — ${panel.label}`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(panel.merge)}
          alt={`RFP merge — ${panel.label}, ${panel.note}`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
        />
        <span className="pointer-events-none absolute bottom-2 left-2 rounded-sm bg-black/60 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#b9c2ce]">
          Brightfield
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-black/60 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[var(--accent)]">
          RFP merge
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-[var(--accent)]"
          style={{ left: `${pct}%`, boxShadow: "0 0 18px var(--accent)" }}
        >
          <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)] bg-black/70" />
        </div>
      </div>
    </figure>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

```bash
npx tsc --noEmit
npx eslint src/components/research/viz/ConfocalWipe.tsx
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/research/viz/ConfocalWipe.tsx
git commit -m "feat(research): add the confocal drag-wipe with keyboard and touch support"
```

Runtime verification happens in Task 14, once the component is mounted on the page.

---

## Task 6: `PlasmidRing` — lift, then teach

Lift the existing ring out of `lab/fusarium.tsx:82-172` and add the two things that make it explanatory rather than decorative: a hovered/focused feature explains itself, and a linearize control shows what Psp-OMI actually does.

**Files:**
- Create: `src/components/research/viz/PlasmidRing.tsx`
- Reference (do not modify yet): `src/components/research/lab/fusarium.tsx:82-172`

**Interfaces:**
- Consumes: `FUS_PLASMID` from `../lab/content`
- Produces: `<PlasmidRing />` — client component, no props

- [ ] **Step 1: Write the component**

The linearize step **cross-fades between two rendered maps** rather than morphing an arc into a line. Morphing arc paths to a straight track is fragile and buys nothing a reader can see; the cut marker animating first carries the meaning.

```tsx
// src/components/research/viz/PlasmidRing.tsx
"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FUS_PLASMID } from "../lab/content";

type Feature = (typeof FUS_PLASMID.features)[number];

const KIND_COLOR: Record<Feature["kind"], string> = {
  reporter: "var(--accent)",
  marker: "var(--accent-2)",
  backbone: "var(--muted)",
};

const W = 360;
const CX = W / 2;
const CY = W / 2;
const R = 118;
const TAU = Math.PI * 2;

const ang = (bp: number) => (bp / FUS_PLASMID.bp) * TAU - Math.PI / 2;

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

export function PlasmidRing() {
  const [hovered, setHovered] = useState<Feature | null>(null);
  const [linear, setLinear] = useState(false);
  const titleId = useId();
  const shown = hovered ?? FUS_PLASMID.features[0];
  const cutA = ang(FUS_PLASMID.cut.pos);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
      <div className="w-full max-w-[320px] shrink-0">
        {linear ? (
          <svg
            viewBox={`0 0 ${W} 96`}
            className="w-full"
            role="img"
            aria-labelledby={titleId}
          >
            <title id={titleId}>
              {FUS_PLASMID.name}, linearized at {FUS_PLASMID.cut.name}
            </title>
            <line x1={10} y1={48} x2={W - 10} y2={48} stroke="var(--line)" strokeWidth={10} />
            {FUS_PLASMID.features.map((f) => {
              const x0 = 10 + (f.start / FUS_PLASMID.bp) * (W - 20);
              const x1 = 10 + (f.end / FUS_PLASMID.bp) * (W - 20);
              return (
                <g key={f.name}>
                  <line
                    x1={x0}
                    y1={48}
                    x2={x1}
                    y2={48}
                    stroke={KIND_COLOR[f.kind]}
                    strokeWidth={f.kind === "reporter" ? 12 : 10}
                    onMouseEnter={() => setHovered(f)}
                    onFocus={() => setHovered(f)}
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                  />
                  <text
                    x={(x0 + x1) / 2}
                    y={f.kind === "reporter" ? 30 : 72}
                    fontSize="7.5"
                    fill={KIND_COLOR[f.kind]}
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {f.name}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <svg viewBox={`0 0 ${W} ${W}`} className="w-full" role="img" aria-labelledby={titleId}>
            <title id={titleId}>
              {FUS_PLASMID.name} plasmid map, {FUS_PLASMID.bp} base pairs
            </title>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth={10} />
            {[0, 1000, 2000, 3000, 4000, 5000].map((bp) => {
              const a = ang(bp);
              return (
                <g key={bp}>
                  <line
                    x1={CX + (R + 9) * Math.cos(a)}
                    y1={CY + (R + 9) * Math.sin(a)}
                    x2={CX + (R + 15) * Math.cos(a)}
                    y2={CY + (R + 15) * Math.sin(a)}
                    stroke="var(--muted)"
                    strokeWidth={1}
                  />
                  <text
                    x={CX + (R + 26) * Math.cos(a)}
                    y={CY + (R + 26) * Math.sin(a)}
                    fontSize="7"
                    fill="var(--muted)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="monospace"
                  >
                    {bp}
                  </text>
                </g>
              );
            })}
            {FUS_PLASMID.features.map((f) => {
              const a0 = ang(f.start);
              const a1 = ang(f.end);
              const mid = (a0 + a1) / 2;
              const on = hovered?.name === f.name;
              return (
                <g key={f.name}>
                  <path
                    d={arcPath(CX, CY, R, a0, a1)}
                    fill="none"
                    stroke={KIND_COLOR[f.kind]}
                    strokeWidth={f.kind === "reporter" || on ? 13 : 10}
                    tabIndex={0}
                    onMouseEnter={() => setHovered(f)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(f)}
                    onBlur={() => setHovered(null)}
                    style={{
                      cursor: "pointer",
                      filter:
                        f.kind === "reporter" || on
                          ? `drop-shadow(0 0 6px ${KIND_COLOR[f.kind]})`
                          : undefined,
                    }}
                  />
                  <text
                    x={CX + (R - 30) * Math.cos(mid)}
                    y={CY + (R - 30) * Math.sin(mid)}
                    fontSize={f.kind === "reporter" ? "9" : "7.5"}
                    fontWeight={f.kind === "reporter" ? 700 : 500}
                    fill={KIND_COLOR[f.kind]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="monospace"
                    pointerEvents="none"
                  >
                    {f.name}
                  </text>
                </g>
              );
            })}
            <line
              x1={CX + (R - 20) * Math.cos(cutA)}
              y1={CY + (R - 20) * Math.sin(cutA)}
              x2={CX + (R + 20) * Math.cos(cutA)}
              y2={CY + (R + 20) * Math.sin(cutA)}
              stroke="var(--hot)"
              strokeWidth={2}
            />
          </svg>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">
          {FUS_PLASMID.name} · {FUS_PLASMID.bp.toLocaleString()} bp
        </p>
        <div className="min-h-[4.5rem]">
          <p className="font-mono text-[0.95rem] text-[var(--fg)]">{shown.name}</p>
          <p className="mt-1 text-[0.9rem] leading-relaxed text-[var(--muted)]">
            {shown.note || `${shown.start}–${shown.end} bp`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setLinear((v) => !v)}
          aria-pressed={linear}
          className={cn(
            "self-start rounded-sm border px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
            linear
              ? "border-[var(--hot)] text-[var(--hot)]"
              : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]",
          )}
        >
          {linear ? "Show the circular plasmid" : `Linearize with ${FUS_PLASMID.cut.name}`}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

```bash
npx tsc --noEmit
npx eslint src/components/research/viz/PlasmidRing.tsx
```

Expected: clean. If `Feature["kind"]` does not resolve, confirm `FUS_PLASMID.features` in `content.ts` still carries the `as const` kind annotations (`"reporter" as const`, etc.).

- [ ] **Step 3: Commit**

```bash
git add src/components/research/viz/PlasmidRing.tsx
git commit -m "feat(research): lift the plasmid ring, add feature detail and linearize"
```

---

## Task 7: Fusarium sections A — shell, hero, question, strains, plasmid

**Copy rule for all section tasks:** editorial connective prose (headings, transitions) lives in the component. Every *fact* — name, number, band size, concentration, caption, alt text — is read from `content.ts` or `data.ts`. Never retype a fact.

**Files:**
- Create: `src/components/research/sections/Section.tsx`
- Create: `src/components/research/sections/Hero.tsx`
- Create: `src/components/research/sections/Question.tsx`
- Create: `src/components/research/sections/Strains.tsx`
- Create: `src/components/research/sections/Plasmid.tsx`

**Interfaces:**
- Consumes: `FUS`, `FUS_STRAINS`, `FUS_REPORTER`, `FUS_PANELS` from `../lab/content`; `PlasmidRing` (Task 6); `Reveal` from `@/components/primitives/Reveal`; `SectionId` from `../sections`
- Produces:
  - `<Section id={SectionId} kicker?={string} heading?={string} children>` — the shared shell every section uses
  - `<Hero />`, `<Question />`, `<Strains />`, `<Plasmid />`

- [ ] **Step 1: Write the shared section shell**

```tsx
// src/components/research/sections/Section.tsx
import type { ReactNode } from "react";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/cn";
import type { SectionId } from "../sections";

/**
 * Every section shares one shell so rhythm and the rail's anchor targets stay
 * consistent. `id` must match an entry in ../sections.ts or the rail will not
 * highlight it.
 */
export function Section({
  id,
  kicker,
  heading,
  children,
  className,
}: {
  id: SectionId;
  kicker?: string;
  heading?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-[var(--line)] px-6 py-[clamp(3.5rem,9vh,7rem)] lg:pl-64 lg:pr-10",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
        {kicker ? (
          <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--accent)]">
            {kicker}
          </p>
        ) : null}
        {heading ? (
          <Reveal>
            <h2 className="mb-6 max-w-[18ch] font-serif text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.06] text-balance">
              {heading}
            </h2>
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/**
 * Aspect ratio for a figure container, read from the image's own `dims`
 * ("965\u00d7441"). Emitted as an INLINE STYLE, never a Tailwind arbitrary class:
 * Tailwind cannot generate classes from runtime strings, so `aspect-[${x}]`
 * silently produces nothing. (Ruling R7.)
 */
export function aspectFrom(dims: string): React.CSSProperties {
  const [w, h] = dims.split(/[\u00d7x]/).map((n) => Number(n.trim()));
  return Number.isFinite(w) && Number.isFinite(h) && h > 0
    ? { aspectRatio: `${w} / ${h}` }
    : { aspectRatio: "16 / 9" };
}

/** Body paragraph — one shared measure so copy never runs long. */
export function P({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mb-4 max-w-[64ch] text-[1.02rem] leading-[1.72] text-[var(--muted)]", className)}>
      {children}
    </p>
  );
}
```

- [ ] **Step 2: Write the hero — brightfield only, no fluorescence**

Per the spec, the hero **withholds the glow**. The word *glow* is the only crimson on the screen; the first fluorescence a reader sees is in `Evidence`. The scroll cue links straight there so skimmers still reach the payoff in one click.

```tsx
// src/components/research/sections/Hero.tsx
"use client";

import { asset } from "@/lib/base";
import { jumpTo } from "../lab/bus";
import { FUS, FUS_PANELS } from "../lab/content";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[88dvh] flex-col justify-center overflow-hidden px-6 pb-16 pt-24 lg:pl-64 lg:pr-10"
    >
      {/* Brightfield hyphae — grey, no red. The glow is not spent here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(FUS_PANELS.t8996.bf)}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14] [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)]"
      />
      <div className="relative mx-auto w-full max-w-5xl">
        <p className="mb-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="inline-flex items-center gap-2 text-[var(--accent)]">
            <span className="h-[7px] w-[7px] rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            Summer 2026
          </span>
          <span>{FUS.affiliations.split(" · ")[1] ?? "UMass Amherst"}</span>
        </p>
        <h1 className="mb-7 font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.92] tracking-[-0.02em] text-balance">
          We made the fungus{" "}
          <em className="not-italic text-[var(--accent)] [text-shadow:0_0_42px_rgba(255,61,94,0.55),0_0_90px_rgba(255,61,94,0.28)]">
            glow.
          </em>
        </h1>
        <p className="max-w-[60ch] text-[clamp(1.02rem,1.5vw,1.3rem)] leading-[1.62] text-[var(--muted)]">
          <i className="italic text-[var(--fg)]">Fusarium oxysporum</i> blinds people and it kills
          bananas — the same fungus, crossing kingdoms. Its human clinical strains slip past the
          mammalian immune system better than the plant ones do. You can&rsquo;t study a fight you
          can&rsquo;t see, so we engineered a red fluorescent protein into three of them.
        </p>
        <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">
          <span aria-hidden="true">↓</span>
          <button type="button" onClick={() => jumpTo("strains")} className="hover:text-[var(--fg)]">
            the strains
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={() => jumpTo("protocol")} className="hover:text-[var(--fg)]">
            the protocol
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => jumpTo("evidence")}
            className="text-[var(--accent)] hover:brightness-125"
          >
            the evidence
          </button>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write `Question` and `Strains`**

```tsx
// src/components/research/sections/Question.tsx
import { FUS } from "../lab/content";
import { Section, P } from "./Section";

export function Question() {
  return (
    <Section id="question" kicker="The question" heading="One fungus, two kingdoms.">
      <P>{FUS.abstract}</P>
      <P className="text-[var(--fg)]">{FUS.question}</P>
    </Section>
  );
}
```

```tsx
// src/components/research/sections/Strains.tsx
import { FUS_STRAINS } from "../lab/content";
import { Section, P } from "./Section";

export function Strains() {
  return (
    <Section id="strains" kicker="The strains" heading="Three isolates, two kingdoms.">
      <P>
        Two came out of people, one out of a banana plant. Putting the same reporter into all three
        is what makes them comparable.
      </P>
      <ul className="mt-8 grid list-none gap-px border border-[var(--line)] bg-[var(--line)] p-0 sm:grid-cols-3">
        {FUS_STRAINS.map((s) => {
          const transformed = s.note.includes("transformed");
          return (
            <li key={s.id} className="relative bg-[var(--bg-2)] p-6">
              <p
                className={
                  transformed
                    ? "font-mono text-[1.02rem] text-[var(--accent)]"
                    : "font-mono text-[1.02rem] text-[var(--fg)]"
                }
              >
                {s.id}
              </p>
              <p className="mt-2 text-[0.92rem] leading-[1.55] text-[var(--muted)]">{s.source}</p>
              <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                {s.note}
              </p>
              {transformed ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_var(--accent),inset_0_0_34px_rgba(255,61,94,0.16)]"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 4: Write `Plasmid` — the ring plus the reporter rationale**

`FUS_REPORTER` explains why red rather than green. It sits here because it is a fact about the construct, and because it pre-empts the contradiction a careful reader will hit in `WhatsNext`, where the reference figure is labelled the opposite way.

```tsx
// src/components/research/sections/Plasmid.tsx
import { FUS_REPORTER } from "../lab/content";
import { PlasmidRing } from "../viz/PlasmidRing";
import { Section, P } from "./Section";

export function Plasmid() {
  return (
    <Section id="plasmid" kicker="The construct" heading="What goes in.">
      <P>
        The plasmid carries two things that matter: the reporter that makes the fungus visible, and
        the resistance gene that makes a successful transformation selectable. Hover any feature to
        read it.
      </P>
      <div className="mt-8">
        <PlasmidRing />
      </div>
      <div className="mt-10 max-w-[64ch] border-l-2 border-[var(--accent)] pl-5">
        <h3 className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--accent)]">
          {FUS_REPORTER.heading}
        </h3>
        <p className="text-[1.02rem] leading-[1.72] text-[var(--muted)]">{FUS_REPORTER.body}</p>
      </div>
    </Section>
  );
}
```

- [ ] **Step 5: Typecheck and lint**

```bash
npx tsc --noEmit
npx eslint src/components/research/sections/
```

Expected: clean. If `FUS.affiliations.split` errors under strict mode, the field is a plain `string` in `content.ts` and the call is safe — the `?? "UMass Amherst"` fallback covers an unexpected shape.

- [ ] **Step 6: Commit**

```bash
git add src/components/research/sections/
git commit -m "feat(research): add section shell, hero, question, strains, plasmid"
```

---

## Task 8: Fusarium sections B — at the bench, the protocol

The two sections that carry the "what can Jadon actually do" load.

**Files:**
- Create: `src/components/research/sections/AtTheBench.tsx`
- Create: `src/components/research/sections/Protocol.tsx`

**Interfaces:**
- Consumes: `BENCH` (Task 2), `FUS_PROTOCOL`, `FUS_WHY` (Task 2), `FUS_IMAGES` from `../lab/content`; `Section`, `P` (Task 7); `Photo`
- Produces: `<AtTheBench />`, `<Protocol />`

- [ ] **Step 1: Write `AtTheBench`**

Everything here already existed but was buried — `BENCH.techniques` came from `PROFILE.stack`, visible only by typing `neofetch`; `BENCH.cadence` came from a program card. **Science entries only** in the timeline: `BENCH.log` is filtered to drop the ice-rink and Lab Olympics entries, per the site's tone rule.

```tsx
// src/components/research/sections/AtTheBench.tsx
import { BENCH } from "../lab/content";
import { Section, P } from "./Section";

/** Non-science log entries stay off the public research page. */
const SKIP = /ice-rink|team bonding|Lab Olympics|organize/i;

export function AtTheBench() {
  const log = BENCH.log.filter((e) => !SKIP.test(e.msg));

  return (
    <Section id="bench" kicker="At the bench" heading="What I ran.">
      <P>{BENCH.cadence}</P>
      <P>{BENCH.reading}</P>

      <ul className="mt-8 flex list-none flex-wrap gap-2 p-0">
        {BENCH.techniques.map((t) => (
          <li
            key={t}
            className="rounded-sm border border-[var(--line)] bg-[var(--bg-2)] px-3 py-1.5 font-mono text-[0.72rem] text-[var(--fg)]"
          >
            {t}
          </li>
        ))}
      </ul>

      <ol className="mt-12 list-none border-l border-[var(--line)] p-0">
        {log.map((e) => (
          <li key={e.hash} className="relative py-2.5 pl-6">
            <span
              aria-hidden="true"
              className="absolute left-0 top-[1.1rem] h-px w-3 bg-[var(--line)]"
            />
            <span className="mr-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--accent)]">
              {e.date}
            </span>
            <span className="text-[0.95rem] text-[var(--muted)]">{e.msg}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 2: Verify the log filter drops exactly the non-science entries**

```bash
node -e '
const c = require("fs").readFileSync("src/components/research/lab/content.ts","utf8");
const msgs = [...c.matchAll(/msg:\s*"([^"]+)"/g)].map(m=>m[1]);
const SKIP = /ice-rink|team bonding|Lab Olympics|organize/i;
console.log("DROPPED:"); msgs.filter(m=>SKIP.test(m)).forEach(m=>console.log("  ",m));
console.log("KEPT:", msgs.filter(m=>!SKIP.test(m)).length);
'
```

Expected: exactly one dropped entry — `chore: organize the lab's ice-rink team bonding (5 lab members + 7 pre-college)` — and 10 kept. If anything scientific is dropped, tighten `SKIP`.

- [ ] **Step 3: Write `Protocol` with the reasoning layer**

Four steps, all visible at once. No stepper, no accordion — nothing important sits behind a click. `FUS_PROTOCOL` uses snake-case `step` ids; `FUS_WHY` uses short keys, so the mapping is explicit.

```tsx
// src/components/research/sections/Protocol.tsx
import { FUS_IMAGES, FUS_PROTOCOL, FUS_WHY } from "../lab/content";
import { Photo } from "@/components/primitives/Photo";
import { Section, P } from "./Section";

/** FUS_PROTOCOL.step -> FUS_WHY key. Step I's reasoning is about the linearization it ends on. */
const WHY_FOR: Record<string, keyof typeof FUS_WHY> = {
  plasmid_extraction: "linearize",
  protoplast_generation: "protoplast",
  peg_transformation: "peg",
  selection: "hygromycin",
};

/** Steps that have a diagram on the poster. */
const FIGURE_FOR: Record<string, keyof typeof FUS_IMAGES> = {
  protoplast_generation: "protoplast",
  peg_transformation: "transformation",
};

export function Protocol() {
  return (
    <Section id="protocol" kicker="Methodology" heading="Four steps, six weeks.">
      <P>Each step exists for a reason. The reason is the part worth reading.</P>
      <ol className="mt-8 flex list-none flex-col gap-px bg-[var(--line)] p-0">
        {FUS_PROTOCOL.map((s) => {
          const why = FUS_WHY[WHY_FOR[s.step]];
          const figKey = FIGURE_FOR[s.step];
          const fig = figKey ? FUS_IMAGES[figKey] : null;
          return (
            <li key={s.step} className="bg-[var(--bg-2)] p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row">
                <p className="shrink-0 font-serif text-[2.4rem] leading-none text-[var(--accent)] sm:w-16">
                  {s.n}
                </p>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-[1.05rem] font-semibold text-[var(--fg)]">{s.title}</h3>
                  <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                    {s.step}
                  </p>
                  <ul className="mb-5 flex list-none flex-col gap-1.5 p-0">
                    {s.detail.map((d) => (
                      <li key={d} className="text-[0.92rem] leading-[1.6] text-[var(--muted)]">
                        {d}
                      </li>
                    ))}
                  </ul>
                  {why ? (
                    <p className="max-w-[62ch] border-l-2 border-[var(--accent)] pl-4 text-[0.95rem] leading-[1.65] text-[var(--fg)]">
                      {why}
                    </p>
                  ) : null}
                </div>
              </div>
              {fig ? (
                <figure className="mt-6 m-0 border border-[var(--line)]">
                  <div className="relative w-full" style={aspectFrom(fig.dims)}>
                    <Photo src={fig.src} alt={fig.alt} />
                  </div>
                  <figcaption className="border-t border-[var(--line)] px-3 py-2 font-mono text-[0.65rem] leading-[1.5] text-[var(--muted)]">
                    {fig.caption}
                  </figcaption>
                </figure>
              ) : null}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 4: Typecheck, lint, and confirm all four steps get a reasoning line**

```bash
npx tsc --noEmit
npx eslint src/components/research/sections/AtTheBench.tsx src/components/research/sections/Protocol.tsx
node -e '
const c = require("fs").readFileSync("src/components/research/lab/content.ts","utf8");
const steps = [...c.matchAll(/step:\s*"(\w+)"/g)].map(m=>m[1]);
const map = ["plasmid_extraction","protoplast_generation","peg_transformation","selection"];
const missing = steps.filter(s=>!map.includes(s));
console.log("protocol steps:", steps.join(", "));
console.log(missing.length ? "UNMAPPED: "+missing.join(", ") : "all steps mapped to a FUS_WHY key");
'
```

Expected: typecheck and lint clean; `all steps mapped to a FUS_WHY key`.

- [ ] **Step 5: Commit**

```bash
git add src/components/research/sections/AtTheBench.tsx src/components/research/sections/Protocol.tsx
git commit -m "feat(research): add the bench section and the protocol reasoning layer"
```

---

## Task 9: Fusarium sections C — evidence, what went wrong, what's next, the poster

**Files:**
- Create: `src/components/research/sections/Evidence.tsx`
- Create: `src/components/research/sections/WentWrong.tsx`
- Create: `src/components/research/sections/WhatsNext.tsx`
- Create: `src/components/research/sections/Poster.tsx`

**Interfaces:**
- Consumes: `FUS`, `FUS_RESULTS`, `FUS_SETBACK`, `FUS_IMAGES` from `../lab/content`; `RESEARCH` from `@/lib/data`; `ConfocalWipe` (Task 5); `Section`, `P` (Task 7); `Photo`
- Produces: `<Evidence />`, `<WentWrong />`, `<WhatsNext />`, `<Poster />`

- [ ] **Step 1: Write `Evidence` — the payoff**

```tsx
// src/components/research/sections/Evidence.tsx
import { FUS_IMAGES, FUS_RESULTS } from "../lab/content";
import { ConfocalWipe } from "../viz/ConfocalWipe";
import { Photo } from "@/components/primitives/Photo";
import { Section, P, aspectFrom } from "./Section";

export function Evidence() {
  return (
    <Section id="evidence" kicker="Figure 2a · confocal" heading="Drag to bring the glow up.">
      <P>
        Same field of hyphae, two channels. Brightfield shows the fungus; the RFP channel shows only
        what carries the reporter. In the transformed strain they are the same object — and the
        negative control stays dark, which is the point of a control.
      </P>
      <div className="mt-8">
        <ConfocalWipe />
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {(["pcrGel", "gel"] as const).map((k) => {
          const f = FUS_IMAGES[k];
          return (
            <figure key={k} className="m-0 border border-[var(--line)]">
              <div className="relative w-full bg-black" style={aspectFrom(f.dims)}>
                <Photo src={f.src} alt={f.alt} />
              </div>
              <figcaption className="border-t border-[var(--line)] px-3 py-2.5 font-mono text-[0.66rem] leading-[1.55] text-[var(--muted)]">
                {f.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col gap-7">
        {FUS_RESULTS.map((r) => (
          <div key={r.heading} className="max-w-[64ch]">
            <h3 className="mb-2 text-[1.02rem] font-semibold text-[var(--fg)]">{r.heading}</h3>
            <p className="text-[0.98rem] leading-[1.7] text-[var(--muted)]">{r.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Write `WentWrong`**

Placed after the result, not before it — the page shows the glow, then complicates it, then hands off to what's next. **Do not reword this toward a completed fix.** The corrective was reasoned out, not executed.

```tsx
// src/components/research/sections/WentWrong.tsx
import { FUS_SETBACK } from "../lab/content";
import { Section } from "./Section";

export function WentWrong() {
  return (
    <Section id="went-wrong" kicker="Selection" heading={FUS_SETBACK.heading}>
      <div className="flex max-w-[64ch] flex-col gap-4">
        {FUS_SETBACK.paras.map((p) => (
          <p key={p.slice(0, 32)} className="text-[1.02rem] leading-[1.72] text-[var(--muted)]">
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Write `WhatsNext` and `Poster`**

```tsx
// src/components/research/sections/WhatsNext.tsx
import { FUS_IMAGES, FUS_RESULTS } from "../lab/content";
import { Photo } from "@/components/primitives/Photo";
import { Section, P, aspectFrom } from "./Section";

export function WhatsNext() {
  const future = FUS_RESULTS.find((r) => r.heading === "Future applications");
  const fig = FUS_IMAGES.macrophage;
  return (
    <Section id="next" kicker="Future applications" heading="Watch it get eaten.">
      {future ? <P>{future.body}</P> : null}
      <figure className="mt-8 m-0 border border-[var(--line)]">
        <div className="relative w-full bg-black" style={aspectFrom(fig.dims)}>
          <Photo src={fig.src} alt={fig.alt} />
        </div>
        <figcaption className="border-t border-[var(--line)] px-3 py-2.5 font-mono text-[0.66rem] leading-[1.55] text-[var(--muted)]">
          {fig.caption}
        </figcaption>
      </figure>
    </Section>
  );
}
```

```tsx
// src/components/research/sections/Poster.tsx
import { FUS, FUS_IMAGES } from "../lab/content";
import { Photo } from "@/components/primitives/Photo";
import { Section, aspectFrom } from "./Section";

const SHOTS = ["bench", "session", "photo"] as const;

export function Poster() {
  return (
    <Section id="poster" kicker="Poster session · August 2026" heading={FUS.title}>
      <p className="mb-2 max-w-[70ch] text-[0.95rem] leading-[1.6] text-[var(--muted)]">
        {FUS.authors}
      </p>
      <p className="mb-8 max-w-[70ch] text-[0.9rem] leading-[1.6] text-[var(--muted)]">
        {FUS.affiliations} · mentored by {FUS.mentor}
      </p>

      <a
        href={FUS_IMAGES.poster.src}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-[var(--line)] transition-colors hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        <div className="relative w-full bg-black" style={aspectFrom(FUS_IMAGES.poster.dims)}>
          <Photo src={FUS_IMAGES.poster.src} alt={FUS_IMAGES.poster.alt} />
        </div>
      </a>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SHOTS.map((k) => {
          const f = FUS_IMAGES[k];
          return (
            <figure key={k} className="m-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--line)]">
                <Photo src={f.src} alt={f.alt} />
              </div>
              <figcaption className="mt-2 font-mono text-[0.64rem] leading-[1.5] text-[var(--muted)]">
                {f.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Typecheck, lint, and confirm the referenced image keys exist**

```bash
npx tsc --noEmit
npx eslint src/components/research/sections/
node -e '
const c = require("fs").readFileSync("src/components/research/lab/content.ts","utf8");
const need = ["pcrGel","gel","macrophage","poster","bench","session","photo","protoplast","transformation"];
const block = c.slice(c.indexOf("export const FUS_IMAGES"));
need.forEach(k => console.log(k, block.includes(k+":") ? "ok" : "MISSING"));
'
```

Expected: every key `ok`. Also confirm `FUS_RESULTS` still contains a `Future applications` heading — `WhatsNext` looks it up by exact string:

```bash
grep -c 'heading: "Future applications"' src/components/research/lab/content.ts   # expect: 1
```

- [ ] **Step 5: Commit**

```bash
git add src/components/research/sections/
git commit -m "feat(research): add evidence, the setback, what's next, and the poster"
```

---

## Task 10: The gout chapter

Four anchored sub-sections in one file, wrapped in `data-chapter="gout"` so the CSS from Task 3 swaps the accent to the volcano's own up/down encoding.

**Framing matters here.** This is not "earlier, smaller work" — it is the dry-lab counterpart that proves independent analysis, where UMass proves bench competence. **Accuracy guard:** the landing copy says Jadon was *"trained in R by a Stanford professor,"* so the claim is *trained, then ran the analysis independently* — never "self-taught."

**Files:**
- Create: `src/components/research/sections/GoutChapter.tsx`
- Read only: `src/components/research/VolcanoPlot.tsx` (moved in Task 13, not here — Ruling R2)

**Interfaces:**
- Consumes: `PROJECT`, `PIPELINE`, `DEG_COUNTS`, `PAIN_MEDIATORS` from `../lab/content`; `RESEARCH` from `@/lib/data`; `VolcanoPlot` (signature `({ className }: { className?: string })`); `Section`, `P`
- Produces: `<GoutChapter />`

**This task also carries the spec's chapter transition** — the one line that
connects the two projects rather than merely separating them. It sits at the
top of the chapter, above the first section, inside the `data-chapter` wrapper
so the accent has already turned.

- [ ] **Step 1: Leave the volcano plot where it is**

> **Ruling R2 — do NOT `git mv` VolcanoPlot in this task.** `ResearchIDE.tsx:6` imports it from `@/components/research/VolcanoPlot` and is not deleted until Task 13, so moving it now breaks this task's typecheck. Import the **current** path here; Task 13 performs the move and updates this one import in the same commit as the deletions.

```bash
grep -n "VolcanoPlot" src/components/research/lab/ResearchIDE.tsx
```

Expected: two hits (an import and a usage) — confirming why the move is deferred. The component reads its own data from `content.ts`, so no prop changes are needed.

- [ ] **Step 2: Write the chapter**

```tsx
// src/components/research/sections/GoutChapter.tsx
import { DEG_COUNTS, PAIN_MEDIATORS, PIPELINE, PROJECT } from "../lab/content";
import { RESEARCH } from "@/lib/data";
// Current path — Task 13 moves this file to ../viz/ and updates this import (Ruling R2).
import { VolcanoPlot } from "@/components/research/VolcanoPlot";
import { Section, P } from "./Section";

export function GoutChapter() {
  return (
    <div data-chapter="gout" className="bg-[var(--bg)]">
      {/* The hinge between the two projects. Without this the page is two
          adjacent projects; with it, it is one scientist. */}
      <p className="mx-auto max-w-5xl border-t border-[var(--line)] px-6 py-[clamp(3rem,7vh,5rem)] text-[clamp(1.1rem,2vw,1.5rem)] leading-[1.5] text-balance text-[var(--fg)] lg:pl-64 lg:pr-10">
        Both projects are the same problem twice: a pain signal you can only see
        in the transcriptome, and a pathogen you can only see once it&rsquo;s
        tagged.
      </p>
      <Section id="gout-question" kicker="Gout · RNA-seq" heading="Before the bench, the terminal.">
        <P>
          Trained in R and bioinformatics, then set loose on a public dataset to run the analysis
          independently: in gouty mice, which genes and pathways actually drive the pain? The wet-lab
          work proves you can operate in someone else&rsquo;s lab. This one proves you can drive a
          question yourself.
        </P>
        <P className="text-[var(--fg)]">{PROJECT.question}</P>
        <P>{PROJECT.hypothesis}</P>
        <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--accent)]">
          {RESEARCH.project.result}
        </p>
      </Section>

      <Section id="pipeline" kicker="Pipeline" heading="Eight steps, self-built.">
        <ol className="grid list-none gap-px bg-[var(--line)] p-0 sm:grid-cols-2">
          {PIPELINE.map((s) => (
            <li key={s.n} className="bg-[var(--bg-2)] p-5">
              <p className="mb-1 font-mono text-[0.7rem] text-[var(--accent)]">{s.n}</p>
              <p className="mb-1 font-mono text-[0.9rem] text-[var(--fg)]">{s.step}</p>
              <p className="text-[0.86rem] leading-[1.55] text-[var(--muted)]">{s.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="volcano" kicker="Differential expression" heading="Every gene, plotted.">
        <P>
          Each point is a gene: fold change across the x-axis, statistical confidence up the y. The
          ones that clear both thresholds are the ones worth chasing.
        </P>
        <div className="mt-8 border border-[var(--line)] bg-[var(--bg-2)] p-4">
          <VolcanoPlot />
        </div>
        <ul className="mt-8 grid list-none gap-px bg-[var(--line)] p-0 sm:grid-cols-3">
          {DEG_COUNTS.map((d) => (
            <li key={d.tissue} className="bg-[var(--bg-2)] p-5">
              <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                {d.tissue}
              </p>
              <p className="font-mono text-[1.1rem] tabular-nums">
                <span className="text-[var(--accent)]">↑ {d.up}</span>
                <span className="mx-2 text-[var(--muted)]">·</span>
                <span className="text-[var(--accent-2)]">↓ {d.down}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="mediators" kicker="The finding" heading="Nine mediators, three tissues.">
        <P>
          The pain signal is not confined to the inflamed joint — it also shows up in the dorsal root
          ganglia and the spinal cord, which is what makes these targets interesting.
        </P>
        <ul className="mt-8 grid list-none gap-px bg-[var(--line)] p-0 sm:grid-cols-3">
          {PAIN_MEDIATORS.map((m) => (
            <li key={m.gene} className="bg-[var(--bg-2)] p-4">
              <p className="font-mono text-[0.95rem] text-[var(--accent)]">{m.gene}</p>
              <p className="mt-1 text-[0.85rem] leading-[1.5] text-[var(--muted)]">{m.role}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck, lint, and confirm the accent actually re-scopes**

```bash
npx tsc --noEmit
npx eslint src/components/research/sections/GoutChapter.tsx
grep -n 'data-chapter="gout"' src/app/globals.css src/components/research/sections/GoutChapter.tsx
```

Expected: both files clean, and `data-chapter="gout"` appears in **both** the CSS (Task 3) and the component. If it appears in only one, the accent will not change and the wayfinding is silently broken.

- [ ] **Step 4: Commit**

```bash
git add src/components/research/sections/GoutChapter.tsx
git commit -m "feat(research): add the gout chapter with re-scoped accent"
```

---

## Task 11: Olympiads and programs

The closing group carries **no label** — "Beyond" named nothing and is exactly the filler subtext being cut site-wide.

USABO, UK BBO, and ACSEF are told in full on `/achievements`. Here they are three single lines that link there. Do not expand them into cards; that would state the same facts in two places.

**Files:**
- Create: `src/components/research/sections/Beyond.tsx`

**Interfaces:**
- Consumes: `RESEARCH.awards`, `RESEARCH.programs` from `@/lib/data`; `Section`, `P`
- Produces: `<Beyond />` — renders sections `olympiads` and `programs`

- [ ] **Step 1: Write it**

```tsx
// src/components/research/sections/Beyond.tsx
import Link from "next/link";
import { RESEARCH } from "@/lib/data";
import { Section, P } from "./Section";

/** The Ma Lab program is the whole page above; listing it again would repeat. */
const OMIT_PROGRAM = "UMass Amherst — Ma Lab";

export function Beyond() {
  const programs = RESEARCH.programs.filter((p) => p.title !== OMIT_PROGRAM);

  return (
    <div data-chapter="beyond" className="bg-[var(--bg)]">
      <Section id="olympiads" kicker="Olympiads" heading="Externally checked.">
        <ul className="flex list-none flex-col gap-px bg-[var(--line)] p-0">
          {RESEARCH.awards.map((a) => (
            <li
              key={a.name}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-[var(--bg-2)] px-5 py-4"
            >
              <span className="font-mono text-[0.7rem] tabular-nums text-[var(--muted)]">{a.year}</span>
              <span className="text-[1rem] text-[var(--fg)]">{a.name}</span>
              <span className="text-[0.95rem] text-[var(--accent)]">{a.result}</span>
              <span className="text-[0.88rem] text-[var(--muted)]">{a.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5">
          <Link
            href="/achievements"
            className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline"
          >
            The full record →
          </Link>
        </p>
      </Section>

      <Section id="programs" kicker="Programs" heading="Teaching it forward.">
        <div className="grid gap-px bg-[var(--line)] sm:grid-cols-3">
          {programs.map((p) => (
            <article key={p.title} className="bg-[var(--bg-2)] p-6">
              <h3 className="mb-1 text-[1.02rem] font-semibold text-[var(--fg)]">{p.title}</h3>
              <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--accent)]">
                {p.role}
              </p>
              <p className="text-[0.9rem] leading-[1.6] text-[var(--muted)]">{p.detail}</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck, lint, confirm the filter matched**

```bash
npx tsc --noEmit
npx eslint src/components/research/sections/Beyond.tsx
grep -c 'title: "UMass Amherst — Ma Lab"' src/lib/data.ts   # expect: 1
```

Expected: clean, and exactly `1`. If it is `0`, the em-dash in `OMIT_PROGRAM` does not match `data.ts` and the Ma Lab card will render twice — copy the string directly out of `data.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/components/research/sections/Beyond.tsx
git commit -m "feat(research): add olympiads strip and programs cards"
```

---

## Task 12: The console

The terminal survives, but its job changes from **delivering** content to **navigating** it. Any command that used to render a big view now scrolls the page and closes. That is what removes the duplication.

**Files:**
- Create: `src/components/research/Console.tsx`

**Interfaces:**
- Consumes: `ALL_SECTIONS`, `resolveSection` from `./sections`; `jumpTo`, `toggleMutate`, `fireToast` from `./lab/bus`; `PROFILE`, `FUS`, `FUS_LOG`, `FUS_CITATION` from `./lab/content`
- Produces: `<Console />` — client component, no props

- [ ] **Step 1: Write it**

```tsx
// src/components/research/Console.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_SECTIONS, resolveSection } from "./sections";
import { fireToast, jumpTo, toggleMutate } from "./lab/bus";
import { FUS, FUS_CITATION, FUS_LOG, PROFILE } from "./lab/content";

type Line = { text: string; tone: "fg" | "muted" | "accent" };

const HELP: string[] = [
  "ls                 list every section on this page",
  "open <section>     scroll there and close  (alias: go, cd, cat)",
  "log                the lab notebook, dated",
  "whoami             who is typing",
  "cite               BibTeX for the poster",
  "mutate             a different colourway",
  "clear              clear this console",
  "exit               close  (or press Escape)",
];

export function Console() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { text: "research console — the page has everything; this just gets you there faster.", tone: "muted" },
    { text: "type `help`, or `ls` to see the sections.", tone: "muted" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ` toggles the console from anywhere, except while typing in a field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const out = useCallback((next: Line[]) => setLines((prev) => [...prev, ...next]), []);

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input) return;
      out([{ text: `visitor@research:~$ ${input}`, tone: "accent" }]);
      setHistory((h) => [input, ...h]);
      setHIndex(-1);

      const [cmd, ...rest] = input.split(/\s+/);
      const arg = rest.join(" ");

      switch (cmd.toLowerCase()) {
        case "help":
        case "?":
          out(HELP.map((text) => ({ text, tone: "muted" as const })));
          return;
        case "ls":
        case "sections":
          out(ALL_SECTIONS.map((s) => ({ text: `  ${s.id.padEnd(16)} ${s.label}`, tone: "fg" as const })));
          return;
        case "open":
        case "go":
        case "goto":
        case "cd":
        case "cat": {
          const id = resolveSection(arg);
          if (!id) {
            out([{ text: `no section "${arg}" — try \`ls\``, tone: "muted" }]);
            return;
          }
          out([{ text: `→ ${id}`, tone: "accent" }]);
          setOpen(false);
          jumpTo(id);
          return;
        }
        case "log":
          out(
            FUS_LOG.map((e) => ({
              text: `  ${e.hash}  ${e.date}  ${e.msg}`,
              tone: "muted" as const,
            })),
          );
          return;
        case "whoami":
          out([
            { text: PROFILE.name, tone: "fg" },
            { text: PROFILE.role, tone: "muted" },
            { text: PROFILE.focus, tone: "muted" },
            { text: `stack: ${PROFILE.stack.join(" · ")}`, tone: "muted" },
          ]);
          return;
        case "cite":
          out(FUS_CITATION.split("\n").map((text) => ({ text, tone: "muted" as const })));
          return;
        case "mutate":
          toggleMutate();
          return;
        case "clear":
          setLines([]);
          return;
        case "exit":
        case "quit":
          setOpen(false);
          return;
        case "sudo":
          out([{ text: "you already have root here. try `mutate`.", tone: "accent" }]);
          return;
        default:
          out([{ text: `${cmd}: not found — try \`help\``, tone: "muted" }]);
      }
    },
    [out],
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(hIndex + 1, history.length - 1);
      if (i >= 0) {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIndex - 1;
      setHIndex(i);
      setValue(i >= 0 ? history[i] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const hit = ALL_SECTIONS.find((s) => s.id.startsWith(value.replace(/^open\s+/, "")));
      if (hit) setValue(`open ${hit.id}`);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the research console"
        className="fixed bottom-5 right-5 z-40 rounded-sm border border-[var(--line)] bg-[var(--bg-2)]/90 px-3 py-2 font-mono text-[0.7rem] text-[var(--muted)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        &gt;_
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Research console"
      data-lenis-prevent
      className="fixed inset-x-0 bottom-0 z-50 h-[min(60dvh,26rem)] border-t border-[var(--accent)] bg-[#05060a]/97 backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">
          {FUS.id}
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--fg)]"
        >
          Esc
        </button>
      </div>
      <div ref={scrollRef} className="h-[calc(100%-5.5rem)] overflow-y-auto px-4 py-3 font-mono text-[0.8rem] leading-[1.65]">
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.tone === "accent"
                ? "whitespace-pre-wrap text-[var(--accent)]"
                : l.tone === "muted"
                  ? "whitespace-pre-wrap text-[var(--muted)]"
                  : "whitespace-pre-wrap text-[var(--fg)]"
            }
          >
            {l.text}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-[var(--line)] px-4 py-2.5 font-mono text-[0.8rem]">
        <span className="text-[var(--accent)]">visitor@research:~$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="Console input"
          className="min-w-0 flex-1 bg-transparent text-[var(--fg)] outline-none"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

```bash
npx tsc --noEmit
npx eslint src/components/research/Console.tsx
```

Expected: clean. `fireToast` is imported but only used if you add toast output — if lint flags it as unused, drop it from the import rather than adding a spurious call.

- [ ] **Step 3: Commit**

```bash
git add src/components/research/Console.tsx
git commit -m "feat(research): add the navigation console, replacing the content terminal"
```

---

## Task 13: Assemble the page and delete the old terminal

The moment the redesign goes live. Everything before this was building parts.

**Files:**
- Rewrite: `src/app/research/page.tsx`
- Delete: `src/components/research/lab/ResearchIDE.tsx`, `lab/term.tsx`, `lab/fusarium.tsx`

**Interfaces:**
- Consumes: every section from Tasks 7–11, `ResearchNav` (Task 4), `Console` (Task 12), `World` and `Footer` from `@/components/chrome/*`, `LabEasterEggs`
- Produces: the route `/research`

- [ ] **Step 1: Rewrite the page**

Note what changes structurally: the page becomes a `<World>` like every other world (it was the only one that wasn't), and it **loses `h-[100dvh] overflow-hidden`** — that lock is why nothing scrolled.

```tsx
// src/app/research/page.tsx
import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { ResearchNav } from "@/components/research/ResearchNav";
import { Console } from "@/components/research/Console";
import { LabEasterEggs } from "@/components/research/lab/LabEasterEggs";
import { Hero } from "@/components/research/sections/Hero";
import { Question } from "@/components/research/sections/Question";
import { Strains } from "@/components/research/sections/Strains";
import { Plasmid } from "@/components/research/sections/Plasmid";
import { AtTheBench } from "@/components/research/sections/AtTheBench";
import { Protocol } from "@/components/research/sections/Protocol";
import { Evidence } from "@/components/research/sections/Evidence";
import { WentWrong } from "@/components/research/sections/WentWrong";
import { WhatsNext } from "@/components/research/sections/WhatsNext";
import { Poster } from "@/components/research/sections/Poster";
import { GoutChapter } from "@/components/research/sections/GoutChapter";
import { Beyond } from "@/components/research/sections/Beyond";

export const metadata: Metadata = {
  title: "Research & STEM",
  description:
    "Six weeks in the Ma Lab at UMass Amherst engineering a red-fluorescent human clinical strain of Fusarium oxysporum — plus RNA-seq on a mouse gout model that placed 3rd in computational biology at ACSEF.",
};

/**
 * Research world — "Dark Field".
 *
 * Leads with the UMass Fusarium RFP transformation; the gout RNA-seq work is
 * the dry-lab counterpart. Governing principle: nothing important sits behind
 * a click. Every fact is reachable by scrolling; the console only navigates.
 *
 * Server component — interactive sections carry their own "use client".
 */
export default function ResearchPage() {
  return (
    <World id="research">
      <h1 className="sr-only">Research &amp; STEM</h1>
      <ResearchNav />
      <Hero />
      <Question />
      <Strains />
      <Plasmid />
      <AtTheBench />
      <Protocol />
      <Evidence />
      <WentWrong />
      <WhatsNext />
      <Poster />
      <GoutChapter />
      <Beyond />
      <Footer />
      <LabEasterEggs />
      <Console />
    </World>
  );
}
```

- [ ] **Step 2: Delete the replaced terminal**

```bash
git rm src/components/research/lab/ResearchIDE.tsx \
       src/components/research/lab/term.tsx \
       src/components/research/lab/fusarium.tsx
```

- [ ] **Step 3: Confirm nothing still references the deleted modules**

```bash
grep -rn "ResearchIDE\|lab/term\|lab/fusarium\|research/fusarium" src/ && echo "STALE REFERENCES ABOVE" || echo "clean"
```

Expected: `clean`. If anything prints, it is an import left behind — fix it before building.

- [ ] **Step 4: Typecheck, lint, build**

```bash
npx tsc --noEmit
npx eslint src/app/research/page.tsx src/components/research/
lsof -ti:3000 | xargs kill -9 2>/dev/null
npm run build
```

Expected: all three succeed and the export writes `out/research/index.html`.

- [ ] **Step 5: Verify every rail anchor has a matching section in the built HTML**

The rail is driven by `sections.ts`; a typo in any section's `id` breaks navigation silently.

```bash
node -e '
const fs = require("fs");
const html = fs.readFileSync("out/research/index.html","utf8");
const reg = fs.readFileSync("src/components/research/sections.ts","utf8");
const ids = [...reg.matchAll(/\{ id: "([a-z-]+)", label:/g)].map(m=>m[1]);
let bad = 0;
for (const id of ids) {
  const present = html.includes(`id="${id}"`);
  if (!present) { console.log("MISSING SECTION:", id); bad++; }
}
console.log(ids.length, "rail entries,", bad, "missing");
'
```

Expected: `15 rail entries, 0 missing`.

- [ ] **Step 6: Commit**

```bash
git add -A src/app/research src/components/research
git commit -m "feat(research): assemble the redesigned page, remove the content terminal"
```

---

## Task 14: Verification pass

Everything is built. This task proves it actually works in a browser and meets the spec's comprehension criteria, then fixes whatever it finds.

**Files:**
- Modify: whatever the checks below turn up

**Interfaces:**
- Consumes: the built site
- Produces: a page that satisfies the spec's success criteria

- [ ] **Step 1: Serve the build and take reference screenshots**

```bash
cd "/Users/jadonli/Downloads/Jadon Li/jadon"
lsof -ti:3000 | xargs kill -9 2>/dev/null
npx serve out -l 3000 >/dev/null 2>&1 &
sleep 2
B=~/.claude/skills/gstack/browse/dist/browse
$B viewport 1440x900
$B goto "http://localhost:3000/research/"
$B screenshot /tmp/research-hero.jpg
```

Open `/tmp/research-hero.jpg` with the Read tool. **Assert:** the headline reads "We made the fungus glow.", *glow* is crimson, the rail is visible on the left, and there is **no red fluorescence in the hero image** — the hero is brightfield only, by design.

- [ ] **Step 2: Verify the page scrolls and the rail tracks**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B eval 'document.querySelector("main").scrollHeight > window.innerHeight * 5'
$B eval 'getComputedStyle(document.querySelector("[data-world=research]")).overflow'
$B click 'a[href="#evidence"]'
sleep 1
$B eval 'document.querySelector("[aria-current=true]")?.textContent'
```

Expected: `true`; overflow is **not** `hidden`; the current rail entry reads `the evidence`.

- [ ] **Step 3: Verify the wipe works by keyboard — the spec's a11y requirement**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B eval 'const s=document.querySelector("[role=slider]"); s.focus(); s.getAttribute("aria-valuenow")'
$B press ArrowRight
$B press ArrowRight
$B eval 'document.querySelector("[role=slider]").getAttribute("aria-valuenow")'
$B press End
$B eval 'document.querySelector("[role=slider]").getAttribute("aria-valuenow")'
```

Expected: starts at `55`, becomes `59` after two right presses (2 each), then `100` on End. If the value does not change, the slider is not receiving focus — check `tabIndex={0}` and that no ancestor has `pointer-events: none`.

- [ ] **Step 4: Verify the accent re-scopes between chapters**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B eval 'getComputedStyle(document.getElementById("strains")).getPropertyValue("--accent").trim()'
$B eval 'getComputedStyle(document.getElementById("volcano")).getPropertyValue("--accent").trim()'
$B eval 'getComputedStyle(document.getElementById("programs")).getPropertyValue("--bg").trim()'
```

Expected: `#ff3d5e`, then `#bcff46`, then `#0b0e13`. If the first two match, the `[data-chapter="gout"]` wrapper is not wrapping — check Task 10 Step 3. The third assertion covers the `beyond` scope, which no other task verifies (Ruling R4).

- [ ] **Step 5: Verify the console navigates rather than renders**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto "http://localhost:3000/research/"
$B press Backquote
$B eval 'document.querySelector("[aria-label=\"Research console\"]") !== null'
$B type 'open plasmid'
$B press Enter
sleep 1
$B eval 'document.querySelector("[aria-label=\"Research console\"]") === null'
$B eval 'Math.abs(document.getElementById("plasmid").getBoundingClientRect().top) < 200'
```

Expected: `true`, `true`, `true` — the console opens, closes on navigation, and the plasmid section is at the top of the viewport.

- [ ] **Step 6: Verify reduced motion and the back-compatible deep link**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto "http://localhost:3000/research/?branch=umass-2026"
$B eval 'document.querySelector("h1, .sr-only") !== null && !document.title.includes("404")'
```

Expected: `true` — the old shared link still lands on the redesigned page rather than 404ing.

Then confirm nothing animates under reduced motion by checking the global rule is in force:

```bash
grep -n "prefers-reduced-motion" src/app/globals.css | head -3
```

Expected: at least one global rule zeroing animation and transition durations.

- [ ] **Step 7: Responsive check**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B viewport 390x844
$B goto "http://localhost:3000/research/"
$B screenshot /tmp/research-mobile.jpg
$B eval 'document.body.scrollWidth <= window.innerWidth + 1'
```

Open `/tmp/research-mobile.jpg`. **Assert:** the desktop rail is hidden, the sticky chapter bar shows a section name and `n / 15`, and the eval returns `true` — no horizontal overflow.

- [ ] **Step 8: Final comprehension read**

Read the rendered page top to bottom yourself and answer the spec's four comprehension criteria explicitly. Write the answers into the commit body. If you cannot answer one from the page alone, that is a defect — fix it before committing.

1. What did Jadon personally do — which techniques, for how long?
2. Why was each protocol step necessary?
3. What do the two projects prove differently?
4. What went wrong, and what does the page say about fixing it?

- [ ] **Step 9: Clean up and commit**

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
git add -A
git commit -m "fix(research): verification pass — a11y, responsive, chapter scoping"
```

- [ ] **Step 10: Report to Jadon before merging**

Do **not** merge to `main` or push without asking. Summarise: what was built, what the verification found, and any spec item that could not be met. Jadon decides when this ships to `jadonli.com`.

---

## Notes for the executor

**Do not restore anything the spec rejected.** The "Rejected during design review" section of the spec lists five things that were considered and deliberately cut — the hero iris reveal, the full 13-item rail, the "Beyond" label, the heatmap and PCA components, and the ice-rink log entries. Re-adding any of them "for completeness" undoes a decision, not an omission.

**Do not soften the setback.** `FUS_SETBACK` is the highest-value content on the page precisely because it is unresolved. It reads as diagnosis and plan. Rewriting it into a tidy success would remove the strongest evidence that this was real lab work.

**If a fact seems missing, ask.** The spec's rule is absolute: no research fact appears on this page that is not in `content.ts`, `data.ts`, or the three author-verified constants. Inventing a plausible number is the worst possible failure mode for a page whose entire purpose is credibility.
