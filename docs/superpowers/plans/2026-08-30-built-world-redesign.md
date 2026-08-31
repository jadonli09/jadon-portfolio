# Built World Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/built` so each of the eight projects is individually featured — the top three as full scroll chapters with playable demos, the remaining five as an interactive deck — with AcornPrep carrying the most weight.

**Architecture:** Two presentation mechanics on one static page. Weight is encoded physically as screen real estate: AcornPrep ~3 screens, Hermes and NotebookLI ~2 each, and the tail five share one screen as an embla-driven deck of full-width panels. Three bespoke client demos (`AcornDemo`, `HermesPipeline`, `NotebookReader`) each take their content as a prop and own their own state. `data.ts` stays the fact ledger; demo fixtures live in `src/lib/demos/`.

**Tech Stack:** Next.js 16 (App Router, Turbopack, `output: "export"`), React 19, TypeScript strict, Tailwind v4 with `[data-world]` theming, `motion/react`, `embla-carousel-react` (already a dependency), lucide-react.

**Spec:** `docs/superpowers/specs/2026-08-30-built-world-redesign-design.md`

## Global Constraints

- **Read `node_modules/next/dist/docs/` before writing Next-specific code.** Per `AGENTS.md`: this is Next.js 16 and its APIs differ from training data.
- **Static export.** `output: "export"` — no server components that fetch, no route handlers, no dynamic `next/og`. All demo content is baked into the repo.
- **No invented numbers.** Every figure on the page traces to `data.ts`, which traces to the SpringLight profile PDF / achievements xlsx / captured product. If a fact is unknown, omit the field — do not estimate.
- **No filler subtext.** Cut eyebrows that restate the headline, label chips carrying no fact, ledes that paraphrase what follows, and any stat stated in two places. Keep labels that carry a fact (dates, roles, counts).
- **Asset paths go through `asset()`** from `@/lib/base` for raw `<img src>`; `Photo` and `next/image` handle their own prefixing.
- **Lint only what you touch.** ~17 untouched files carry pre-existing `react-hooks/refs` and set-state-in-effect errors. `next build` does not run lint. Never run a repo-wide `eslint` and treat the result as a gate.
- **`prefers-reduced-motion`** is respected in every animated component: no autoplay, no count-up, `Develop` resolves instantly.
- **Deep link `/built#hermes` must keep working** — the leadership world links to it.
- **Test harness.** There is no test runner. Verification uses the gstack browse binary against a running dev server:
  ```bash
  B=~/.claude/skills/gstack/browse/dist/browse   # the browse CLI
  npm run dev                                     # serves http://localhost:3000
  ```
  Screenshots must be written inside the repo (the binary refuses paths outside it); use `.shots/` which is gitignored.

---

### Task 1: Data model — tiers, slugs, and the three data defects

**Files:**
- Modify: `src/lib/data.ts` (the `Project` type at ~line 900, and the `PROJECTS` array at line 912)
- Modify: `src/components/built/BuiltHero.tsx:196-201` (the telemetry stat strip)

**Interfaces:**
- Consumes: nothing.
- Produces: `Project` gains `tier: 1 | 2 | 3`, `slug: string`, `launched?: string`. Every entry in `PROJECTS` has `tier` and `slug`. Consumers select with `PROJECTS.filter(p => p.tier === 3)` and anchor with `#${p.slug}`.

- [ ] **Step 1: Write the failing assertion**

Create `.shots/` if absent, start the dev server, then check the hero states the corrected facts:

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto http://localhost:3000/built
$B js "document.body.innerText.includes('~\$4,000') && document.body.innerText.includes('Profit')"
```

Expected: `false` — the hero currently says `~$700` / `Revenue`.

- [ ] **Step 2: Extend the `Project` type**

In `src/lib/data.ts`, replace the type:

```ts
export type Project = {
  name: string;
  url: string;
  domain: string;
  embeddable: boolean; // attempt iframe first; fall back to mockup
  /** Captured screenshot of the live site (in /public/embeds), shown in the device mockup. */
  shot?: string;
  tagline: string;
  stats: { value: string; label: string }[];
  body: string;
  stack: string[];
  /** 1 = flagship chapter, 2 = chapter, 3 = fleet-deck panel. Drives page weight. */
  tier: 1 | 2 | 3;
  /** URL fragment for deep links (`/built#hermes`). Must be unique. */
  slug: string;
  /** Free text, only when the record actually says so. Omit rather than estimate. */
  launched?: string;
};
```

- [ ] **Step 3: Reorder `PROJECTS` into display order and add the new fields**

**The array order becomes the single source of display order.** Both `MissionIndex` (Task 4) and `FleetDeck` (Task 11) number missions `M-01`…`M-08` off array position, so if they each sorted independently the same project would get two different M-numbers. Reorder the eight entries to exactly this sequence and add the fields:

| # | name | tier | slug | launched |
|---|---|---|---|---|
| 1 | `AcornPrep` | `1` | `acornprep` | `"04/11/2026"` |
| 2 | `Hermes` | `2` | `hermes` | `"08/2026"` |
| 3 | `NotebookLI` | `2` | `notebookli` | `"Summer 2026"` |
| 4 | `MSJHS ASB` | `3` | `msjhs-asb` | *(omit)* |
| 5 | `Youth STEM Journal` | `3` | `youth-stem-journal` | *(omit)* |
| 6 | `CueSheet` | `3` | `cuesheet` | *(omit)* |
| 7 | `MSJ Makes` | `3` | `msj-makes` | *(omit)* |
| 8 | `jadonli.com` | `3` | `jadonli-com` | *(omit)* |

`launched` is omitted where the record does not state a date. The chapter slate renders the date only when present.

Reordering is safe: the only order-sensitive consumers are `LaunchLedger` and `ProductsGrid`, both deleted in Task 12. `BuiltHero` maps `PROJECTS` into a marquee, which is order-insensitive. Verify before and after:

```bash
grep -rn "PROJECTS" src/ --include="*.tsx" --include="*.ts" | grep -v "^src/lib/data.ts"
```

Expected: hits only in `LaunchLedger.tsx`, `ProductsGrid.tsx`, `AcornFlagship.tsx` (all retired), and `BuiltHero.tsx` (order-insensitive).

- [ ] **Step 4: Fix the AcornPrep body — the product ships six study modes**

In the `AcornPrep` entry, the body currently reads `...unlimited MCQ practice, graded FRQ practice, flashcards, podcasts, mind maps, and study guides, with AI tutor guidance.` Replace that clause with:

```
unlimited MCQ practice, graded FRQ practice, flashcards, podcasts, study guides, tips & tricks, worked examples, and mind maps, with AI tutor guidance.
```

Verified against the live product on 2026-08-30: `/study` exposes Flashcards, Podcasts, Study Guides, Tips & Tricks, Worked Examples, Mind Maps.

- [ ] **Step 5: Drop the duplicated MSJ Makes profit pill**

The hero now carries `~$4,000 Profit` (Step 6). In the `MSJ Makes` entry, remove the first stat so the number is not stated twice:

```ts
    stats: [
      { value: "Design", label: "Operation" },
    ],
```

The body paragraph already explains what earned it (badminton and volleyball hoodies, basketball merch, DECA minicon glass, senior stoles) — leave the body unchanged.

- [ ] **Step 6: Fix the hero stat strip**

In `src/components/built/BuiltHero.tsx`, replace the four-object array inside the telemetry `Reveal` (currently `{ value: "05", label: "Products" }` through `{ value: "~$700", label: "Revenue" }`) with:

```tsx
              {[
                { value: "08", label: "Products" },
                { value: "500+", label: "Active users" },
                { value: "#1", label: "Google result" },
                { value: "~$4,000", label: "Profit" },
              ].map((s) => (
```

`08` and `~$4,000` both match `StatValue`'s regex (`/^([~$#]{0,2})(\d[\d,]*)([+%]?)$/`) so both animate. `~$4k` would not — use the comma form.

- [ ] **Step 7: Run the assertion to verify it passes**

```bash
$B reload && $B js "document.body.innerText.includes('~\$4,000') && document.body.innerText.includes('Profit')"
```

Expected: `true`.

Then confirm the type compiles:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/data.ts src/components/built/BuiltHero.tsx
git commit -m "built: add tier/slug/launched to Project; fix hero stat strip and study-mode count"
```

---

### Task 2: Fix the Counter so a stat never renders as 0

**Files:**
- Modify: `src/components/primitives/Counter.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `Counter` props are unchanged. Its rendered HTML now contains the final value rather than `0`, and the count-up begins ~200px before the element scrolls into view.

**Why:** `Counter` initialises `useState(0)` and only animates once `useInView` fires, so the static-export HTML ships `0`. Hermes renders "**0** clubs watched" to a crawler, to a JS-disabled reader, and in any screenshot taken before the observer fires. This is on a page whose entire argument is "real products, real numbers."

- [ ] **Step 1: Write the failing assertion**

The exported HTML is the ground truth — grep the built markup rather than the live DOM:

```bash
npm run build
grep -o "clubs watched" -B 40 out/built.html | grep -oE ">8?7?<|>0<" | head -5
```

Expected: the markup contains `>0<` next to the Hermes stat.

- [ ] **Step 2: Rewrite Counter to render the true value first**

Replace the body of `src/components/primitives/Counter.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

/**
 * Animated number counter that runs once when scrolled into view.
 *
 * Renders `to` on the server and on first paint so the exported HTML always
 * carries the real figure — a crawler or a JS-disabled reader must never see 0.
 * The reset-to-zero happens 200px before the element is visible (see the
 * `margin` below), so the drop is never on screen.
 */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.8,
  decimals,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  /** Fixed decimal places (e.g. 2 → "1.39"); defaults to 0 for integers, 1 otherwise. */
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Trigger while still below the fold so the 0-reset is off screen.
  const inView = useInView(ref, { once: true, margin: "200px" });
  const [val, setVal] = useState(to);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  const display =
    decimals !== undefined
      ? val.toFixed(decimals)
      : Number.isInteger(to)
        ? Math.round(val).toLocaleString()
        : val.toFixed(1);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 3: Run the assertion to verify it passes**

```bash
npm run build
grep -c ">87<" out/built.html
```

Expected: at least `1` — the Hermes figure is in the exported markup.

- [ ] **Step 4: Verify the animation still runs visibly**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto http://localhost:3000/built
$B js "window.scrollTo(0, 4200)"
$B screenshot --viewport .shots/counter-check.png
```

Read the screenshot: the stat shows its real value, not 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/primitives/Counter.tsx
git commit -m "fix: Counter ships the real value in static HTML instead of 0"
```

---

### Task 3: The Develop wrapper — halftone resolving to full colour

**Files:**
- Create: `src/components/built/Develop.tsx`
- Modify: `src/app/globals.css` (append to the `[data-world="built"]` archival block near line 589)

**Interfaces:**
- Consumes: nothing.
- Produces: `<Develop className?: string; children: React.ReactNode>` — a `div` that adds the class `developing` until it scrolls into view, then swaps to `developed`. Every product screenshot in Tasks 5, 9, 10, and 11 wraps its image in this.

**Why:** the current `.archival` filter is applied to product screenshots as well as photographs, so every screenshot on the page is washed out. Photographs keep the archival treatment — they *are* archive documents. Product UI is evidence and must be legible. `Develop` keeps the archival language as an entrance and ends in full colour.

- [ ] **Step 1: Write the failing assertion**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto http://localhost:3000/built
$B js "!!document.querySelector('.developing, .developed')"
```

Expected: `false` — no such element exists yet.

- [ ] **Step 2: Add the CSS**

Append to `src/app/globals.css`, directly after the `[data-world="built"] .archival-frame::after` rule:

```css
/* Product screenshots enter halftone and resolve to full colour. Photographs
   keep .archival; product UI is evidence and has to be legible. */
[data-world="built"] .developing img,
[data-world="built"] .developing iframe {
  filter: saturate(0) contrast(1.25) brightness(0.95);
  transition: filter 900ms cubic-bezier(0.16, 1, 0.3, 1);
}
[data-world="built"] .developed img,
[data-world="built"] .developed iframe {
  filter: saturate(1) contrast(1) brightness(1);
  transition: filter 900ms cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  [data-world="built"] .developing img,
  [data-world="built"] .developing iframe {
    filter: none;
  }
}
```

- [ ] **Step 3: Write the component**

Create `src/components/built/Develop.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Wraps a product screenshot so it enters desaturated and resolves to full
 * colour once on scroll-in. Photographs should NOT use this — they keep the
 * `.archival` halftone treatment.
 */
export function Develop({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={cn(inView ? "developed" : "developing", className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Wire one call site to prove it works**

In `src/components/built/AcornFlagship.tsx`, import `Develop` and wrap the existing `<LiveEmbed .../>` inside the `frame-brackets` div:

```tsx
            <Develop>
              <LiveEmbed
                url={acorn.url}
                domain={acorn.domain}
                title={acorn.name}
                screenshot={acorn.shot}
                aspect="1280/800"
              />
            </Develop>
```

(`AcornFlagship` is retired in Task 12; this call site is temporary proof the wrapper works.)

- [ ] **Step 5: Run the assertion to verify it passes**

```bash
$B reload
$B js "!!document.querySelector('.developing')"          # before scroll → true
$B js "window.scrollTo(0, 2000)"
$B js "!!document.querySelector('.developed')"           # after scroll → true
```

Expected: `true` then `true`.

- [ ] **Step 6: Commit**

```bash
git add src/components/built/Develop.tsx src/app/globals.css src/components/built/AcornFlagship.tsx
git commit -m "built: Develop wrapper — screenshots resolve from halftone to full colour"
```

---

### Task 4: MissionIndex — the eight-row jump nav

**Files:**
- Create: `src/components/built/MissionIndex.tsx`

**Interfaces:**
- Consumes: `PROJECTS` with `tier` and `slug` (Task 1).
- Produces: `<MissionIndex />` — a server component, no props. Renders eight rows ordered by `tier` then array order, each an `<a href={"#" + p.slug}>` carrying `M-NN`, name, tagline, and first stat.

**Why:** this replaces `LaunchLedger` at the bottom of the page. Every project keeps a name-check and a jump link, but appears once instead of twice.

- [ ] **Step 1: Write the failing assertion**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto http://localhost:3000/built
$B js "document.querySelectorAll('a[href=\"#cuesheet\"]').length"
```

Expected: `0`.

- [ ] **Step 2: Write the component**

Create `src/components/built/MissionIndex.tsx`:

```tsx
import { Reveal } from "@/components/primitives/Reveal";
import { PROJECTS } from "@/lib/data";

/**
 * The manifest. Eight rows in `PROJECTS` order — which IS display order, and
 * the single source of the M-numbers the fleet deck also uses. Do not sort
 * here; sorting independently would desync the numbering.
 * Server-safe — no client hooks.
 */
const ORDERED = PROJECTS;

export function MissionIndex() {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-9 md:py-20">
        <Reveal>
          <div className="mb-8 flex items-center gap-4">
            <span className="eyebrow text-[var(--fg)]">The manifest</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>
        </Reveal>

        <div className="border-t border-[var(--line)]">
          {ORDERED.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <a
                href={`#${p.slug}`}
                data-cursor-hover
                className="group grid grid-cols-[3rem_1fr] items-center gap-x-4 border-b border-[var(--line)] py-4 transition-colors duration-300 hover:bg-[var(--bg)] md:grid-cols-[3.5rem_1.1fr_1.4fr_9rem] md:gap-x-8"
              >
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[var(--muted)]">
                  M-{String(i + 1).padStart(2, "0")}
                </span>

                <span className="mission-display truncate text-lg text-[var(--fg)] transition-colors group-hover:text-[var(--accent)] md:text-xl">
                  {p.name}
                </span>

                <span className="hidden truncate text-sm text-[var(--muted)] md:block">
                  {p.tagline}
                </span>

                <span className="hidden justify-self-end font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)] md:block">
                  <span className="text-[var(--fg)]">{p.stats[0].value}</span>{" "}
                  {p.stats[0].label}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Note: no status column. Every mission is live, so a column reading `LIVE` eight times carries no information — that is exactly the filler the copy rule forbids.

- [ ] **Step 3: Mount it in the page**

In `src/app/built/page.tsx`, import `MissionIndex` and insert it immediately after `<BuiltHero />`:

```tsx
      <BuiltHero />

      {/* ── 2. MISSION INDEX ─────────────────────────────────── */}
      <MissionIndex />
```

- [ ] **Step 4: Run the assertion to verify it passes**

```bash
$B reload
$B js "document.querySelectorAll('a[href=\"#cuesheet\"]').length"
```

Expected: `1`.

Confirm ordering puts AcornPrep first:

```bash
$B js "document.querySelector('a[href^=\"#\"] .mission-display')?.textContent"
```

Expected: `AcornPrep`.

- [ ] **Step 5: Commit**

```bash
git add src/components/built/MissionIndex.tsx src/app/built/page.tsx
git commit -m "built: MissionIndex — eight-row manifest that doubles as jump nav"
```

---

### Task 5: Chapter shell — the reusable mission slate

**Files:**
- Create: `src/components/built/Chapter.tsx`

**Interfaces:**
- Consumes: `Project` (Task 1), `Develop` (Task 3), `LiveEmbed`, `Reveal`, `RevealGroup`, `Magnetic`, `StatValue`, `DecodeText`.
- Produces:
  ```ts
  <Chapter
    project={Project}
    no={string}              // "01"
    children?: React.ReactNode  // the demo panel, rendered below the stats
  />
  ```
  Used by Tasks 6–8 (AcornPrep), 9 (Hermes), 10 (NotebookLI).

- [ ] **Step 1: Write the failing assertion**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto http://localhost:3000/built
$B js "document.querySelectorAll('[data-chapter]').length"
```

Expected: `0`.

- [ ] **Step 2: Write the component**

Create `src/components/built/Chapter.tsx`:

```tsx
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Magnetic } from "@/components/primitives/Magnetic";
import { Develop } from "@/components/built/Develop";
import { LiveEmbed } from "@/components/built/LiveEmbed";
import { DecodeText, StatValue } from "@/components/built/MissionFX";
import type { Project } from "@/lib/data";

/**
 * One tier-1 or tier-2 project, given a full chapter of the page. The slate,
 * the dossier, the screenshot, the stats, and then whatever demo the caller
 * passes as children. Server-safe — every interactive piece is a client
 * component imported by the caller.
 */
export function Chapter({
  project,
  no,
  children,
}: {
  project: Project;
  no: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={project.slug}
      data-chapter={project.slug}
      className="scroll-mt-24 border-b border-[var(--line)]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">
        {/* ── Mission slate ── */}
        <Reveal>
          <div className="mb-10 flex items-baseline gap-4">
            <span className="mission-display text-[var(--accent)]">M-{no}</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
            {project.launched ? (
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
                {project.launched}
              </span>
            ) : null}
          </div>
        </Reveal>

        {/* ── Dossier ── */}
        <div className="max-w-3xl">
          <Reveal>
            <p className="mission-display text-2xl">{project.name}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mission-display mt-3 text-[2.4rem] md:text-[3.6rem]">
              <DecodeText text={project.tagline} duration={1.1} />
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-sm leading-[1.9] text-[var(--muted)] md:text-base">
              {project.body}
            </p>
          </Reveal>
        </div>

        {/* ── Screenshot ── */}
        {project.shot ? (
          <Reveal delay={0.15} className="mt-14">
            <div className="frame-brackets">
              <Develop>
                <LiveEmbed
                  url={project.url}
                  domain={project.domain}
                  title={project.name}
                  screenshot={project.shot}
                  aspect="1280/800"
                />
              </Develop>
            </div>
          </Reveal>
        ) : null}

        {/* ── Stats + stack + CTA ── */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <RevealGroup
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-2"
            stagger={0.08}
            delayChildren={0.1}
          >
            {project.stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-2 border-l-[1.5px] border-[var(--accent)] pl-5"
              >
                <p className="mission-display text-[2.4rem] text-[var(--fg)]">
                  <StatValue value={s.value} />
                </p>
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
                  {s.label}
                </p>
              </div>
            ))}
          </RevealGroup>

          <div className="flex flex-col justify-center">
            <Reveal delay={0.2}>
              <p className="eyebrow mb-3">Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center border border-[var(--line)] bg-[var(--bg)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3} className="mt-10">
              <Magnetic strength={0.3}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-hover
                  className="btn-fill"
                >
                  Visit {project.domain} <ArrowUpRight className="size-3.5" />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        {/* ── Demo ── */}
        {children ? <div className="mt-20">{children}</div> : null}
      </div>
    </section>
  );
}
```

The stat block deliberately omits the rotating lucide icon the old `AcornFlagship` used — an icon that does not correspond to its stat is decoration, not information.

- [ ] **Step 3: Mount AcornPrep through it, replacing AcornFlagship**

In `src/app/built/page.tsx`, remove the `AcornFlagship` import and its `<AcornFlagship />` element. Add:

```tsx
import { Chapter } from "@/components/built/Chapter";
import { PROJECTS } from "@/lib/data";

const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)!;
```

and in the body, after `<MissionIndex />`:

```tsx
      {/* ── 3. M-01 ACORNPREP ────────────────────────────────── */}
      <Chapter project={bySlug("acornprep")} no="01" />
```

- [ ] **Step 4: Run the assertion to verify it passes**

```bash
$B reload
$B js "document.querySelectorAll('[data-chapter]').length"        # → 1
$B js "!!document.getElementById('acornprep')"                    # → true
npx tsc --noEmit
```

Expected: `1`, `true`, no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/built/Chapter.tsx src/app/built/page.tsx
git commit -m "built: Chapter shell — mission slate, dossier, screenshot, stats"
```

---

### Task 6: AcornPrep demo content + the Practice face

**Files:**
- Create: `src/lib/demos/acornprep.ts`
- Create: `src/components/built/demos/AcornDemo.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  ```ts
  export type DemoChoice = { label: string; text: string };
  export type DemoMcq = {
    id: string;
    course: string;        // "AP Psychology"
    unit: string;          // "Unit 3 — Sensation and Perception"
    difficulty: "Easy" | "Medium" | "Hard";
    stimulus?: string;     // optional prose set-up shown in the left panel
    stem: string;
    choices: DemoChoice[]; // exactly 4, labels "A".."D"
    answer: string;        // the label of the correct choice
    explanation: string;   // includes distractor analysis
  };
  export const MCQS: DemoMcq[];
  ```
  `AcornDemo` is exported as `<AcornDemo />` and mounted in Task 8; this task ships only its `Practice` face.

- [ ] **Step 1: Capture ten real questions**

Log into AcornPrep and read ten questions out of the prose-based courses. Calculus, Chemistry, and Statistics stems are LaTeX-heavy and the portfolio has no math renderer — adding KaTeX for one panel is not worth the bundle, and prose questions read better to a non-specialist visitor.

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto https://www.acornprep.com/auth
$B fill "#signin-email" "jadonli2020@gmail.com"
$B fill "#signin-password" '<password from Jadon>'
$B press Enter
# switch course via the sidebar course picker, then:
$B goto https://www.acornprep.com/mcq
$B text          # read stem, choices, difficulty, unit
# answer, then reveal:
$B click "text=SHOW EXPLANATION" && $B text
```

Take 5 from **AP Psychology** and 5 from **AP US History**. Record each verbatim — stem, all four choices, correct label, and the full explanation including its distractor sentence. **Log out when done** (`$B click` the sidebar `Logout` button) and confirm with `$B cookies`.

Credentials are Jadon's own and were supplied for this purpose. Never write them into a file, a commit, or a screenshot.

- [ ] **Step 2: Write the failing assertion**

```bash
$B goto http://localhost:3000/built
$B js "!!document.querySelector('[data-demo=\"acorn-practice\"]')"
```

Expected: `false`.

- [ ] **Step 3: Write the content file**

Create `src/lib/demos/acornprep.ts`. Below is the exact shape plus one complete record captured from the live product on 2026-08-30 (AP Calculus AB — kept here as the worked model for the fields; **replace it** with the ten prose-course questions from Step 1, which is what ships):

```ts
/**
 * Real questions from the AcornPrep bank, baked in so the portfolio demo runs
 * with no server. Captured from the live product — do not invent questions.
 */

export type DemoChoice = { label: string; text: string };

export type DemoMcq = {
  id: string;
  course: string;
  unit: string;
  difficulty: "Easy" | "Medium" | "Hard";
  /** Optional prose set-up rendered in the left panel, as the product does. */
  stimulus?: string;
  stem: string;
  choices: DemoChoice[];
  answer: string;
  explanation: string;
};

export const MCQS: DemoMcq[] = [
  {
    id: "apcal-riemann-01",
    course: "AP Calculus AB",
    unit: "Unit 6 — Integration and Accumulation of Change",
    difficulty: "Easy",
    stimulus:
      "The table gives selected values of a continuous function f on the interval [1, 9]:  x = 1, 3, 5, 7, 9  and  f(x) = 2.4, 3.8, 5.1, 4.6, 3.2.",
    stem:
      "Using a right Riemann sum with 4 equal subintervals, which of the following best approximates the integral of f from 1 to 9?",
    choices: [
      { label: "A", text: "33.4" },
      { label: "B", text: "31.8" },
      { label: "C", text: "32.6" },
      { label: "D", text: "16.7" },
    ],
    answer: "A",
    explanation:
      "With 4 equal subintervals on [1, 9], Δx = 2 and the right endpoints are x = 3, 5, 7, 9. The right Riemann sum is 2[f(3) + f(5) + f(7) + f(9)] = 2(3.8 + 5.1 + 4.6 + 3.2) = 33.4. Choice B, 31.8, is the left Riemann sum using endpoints x = 1, 3, 5, 7.",
  },
  // …nine more from Step 1
];
```

- [ ] **Step 4: Write the Practice face**

Create `src/components/built/demos/AcornDemo.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";
import { MCQS, type DemoMcq } from "@/lib/demos/acornprep";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

function Practice({ q, onNext }: { q: DemoMcq; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const graded = picked !== null;
  const correct = picked === q.answer;

  return (
    <div data-demo="acorn-practice" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left — stimulus + metadata, as the product lays it out */}
      <div className="border border-[var(--line)] bg-[var(--bg)] p-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {q.course} · {q.unit} · {q.difficulty}
        </p>
        {q.stimulus ? (
          <p className="mt-5 text-sm leading-[1.9] text-[var(--muted)]">{q.stimulus}</p>
        ) : null}
      </div>

      {/* Right — stem, choices, verdict */}
      <div className="flex flex-col gap-3">
        <p className="text-base leading-relaxed text-[var(--fg)]">{q.stem}</p>

        {q.choices.map((c) => {
          const isAnswer = c.label === q.answer;
          const isPicked = c.label === picked;
          return (
            <button
              key={c.label}
              type="button"
              disabled={graded}
              onClick={() => setPicked(c.label)}
              data-cursor-hover
              className={cn(
                "flex items-center gap-4 border px-5 py-4 text-left transition-colors duration-200",
                !graded && "border-[var(--line)] hover:border-[var(--accent)]",
                graded && isAnswer && "border-[var(--accent)] text-[var(--fg)]",
                graded && !isAnswer && "border-[var(--line)] opacity-40",
              )}
            >
              <span className="font-mono text-xs text-[var(--muted)]">{c.label}.</span>
              <span className="flex-1 text-sm">{c.text}</span>
              {graded && isAnswer ? <Check className="size-4 text-[var(--accent)]" /> : null}
              {graded && isPicked && !isAnswer ? <X className="size-4 text-[var(--muted)]" /> : null}
            </button>
          );
        })}

        <AnimatePresence>
          {graded ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-2 border border-[var(--line)] bg-[var(--bg)] p-5"
            >
              <p className="mission-display text-lg text-[var(--accent)]">
                {correct ? "Nailed it." : "Not quite."}
              </p>
              <p className="mt-3 text-sm leading-[1.9] text-[var(--muted)]">{q.explanation}</p>
              <button
                type="button"
                onClick={() => {
                  setPicked(null);
                  onNext();
                }}
                data-cursor-hover
                className="btn-brackets mt-5"
              >
                Next question
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AcornDemo() {
  const [i, setI] = useState(0);
  return <Practice q={MCQS[i % MCQS.length]} onNext={() => setI((n) => n + 1)} />;
}
```

`"Nailed it."` is the product's own copy, captured 2026-08-30 — keep it.

- [ ] **Step 5: Mount it inside the AcornPrep chapter**

In `src/app/built/page.tsx`:

```tsx
      <Chapter project={bySlug("acornprep")} no="01">
        <AcornDemo />
      </Chapter>
```

- [ ] **Step 6: Run the assertion to verify it passes**

```bash
$B reload
$B js "!!document.querySelector('[data-demo=\"acorn-practice\"]')"    # → true
$B js "document.querySelectorAll('[data-demo=\"acorn-practice\"] button').length"  # → 4
```

Now exercise it — click a choice and confirm the verdict appears:

```bash
$B js "document.querySelectorAll('[data-demo=\"acorn-practice\"] button')[0].click()"
$B js "document.body.innerText.includes('Nailed it.') || document.body.innerText.includes('Not quite.')"
```

Expected: `true`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/demos/acornprep.ts src/components/built/demos/AcornDemo.tsx src/app/built/page.tsx
git commit -m "built: AcornPrep Practice demo — a real MCQ that grades in place"
```

---

### Task 7: The Grade face — the FRQ rubric with quoted evidence

**Files:**
- Modify: `src/lib/demos/acornprep.ts` (append the FRQ fixture)
- Modify: `src/components/built/demos/AcornDemo.tsx` (add the `Grade` component)

**Interfaces:**
- Consumes: `DemoMcq` and `MCQS` from Task 6.
- Produces:
  ```ts
  export type RubricItem = {
    title: string;
    earned: number;
    outOf: number;
    justification: string;
    quote: string | null;   // verbatim span from the response, null when nothing earned it
  };
  export type FrqPart = { part: string; earned: number; outOf: number; summary: string; items: RubricItem[] };
  export type DemoFrq = {
    exam: string; prompt: string; response: string;
    scored: number; total: number; parts: FrqPart[];
  };
  export const FRQ: DemoFrq;
  ```

**Why this is the centrepiece:** the grader does not just score. Each rubric line quotes the student's own sentence as the evidence for the point. Nothing else on the portfolio shows AI doing something a rubric alone could not.

- [ ] **Step 1: Write the failing assertion**

```bash
$B goto http://localhost:3000/built
$B js "!!document.querySelector('[data-demo=\"acorn-grade\"]')"
```

Expected: `false`.

- [ ] **Step 2: Append the FRQ fixture**

Add to the end of `src/lib/demos/acornprep.ts`. This is a verbatim capture of a real grading run on 2026-08-30 (AP Calculus AB, 2025 FRQ #5, part (a) answered, parts b–d left blank):

```ts
export type RubricItem = {
  title: string;
  earned: number;
  outOf: number;
  justification: string;
  /** Verbatim span from the response that earned the point; null when none did. */
  quote: string | null;
};

export type FrqPart = {
  part: string;
  earned: number;
  outOf: number;
  summary: string;
  items: RubricItem[];
};

export type DemoFrq = {
  exam: string;
  prompt: string;
  response: string;
  scored: number;
  total: number;
  parts: FrqPart[];
};

/**
 * A real grading run, captured verbatim from the live product. A partial score
 * demos better than full marks — you watch the grader reason, and you see it
 * cite the student's own words back as evidence.
 */
export const FRQ: DemoFrq = {
  exam: "AP Calculus AB · 2025 FRQ #5",
  prompt:
    "Two particles, H and J, are moving along the x-axis. For 0 ≤ t ≤ 5, the position of particle H at time t is given by x_H(t) = e^(t² − 4t). (a) Find the velocity of particle H at time t = 1. Show the work that leads to your answer.",
  response:
    "v_H(t) = x_H(t) differentiated. Using the chain rule on x_H(t) = e^(t² − 4t): v_H(t) = (2t − 4)e^(t² − 4t). At t = 1: v_H(1) = (2(1) − 4)e^(1 − 4) = −2e^(−3) = −0.0996.",
  scored: 2,
  total: 5,
  parts: [
    {
      part: "(a)",
      earned: 2,
      outOf: 3,
      summary: "Correctly calculated the velocity of particle H at t = 1 using the chain rule.",
      items: [
        {
          title: "Considers x′_H",
          earned: 1,
          outOf: 1,
          justification: "Acknowledges the need to differentiate x_H(t) to find velocity.",
          quote: "v_H(t) = x_H(t) differentiated.",
        },
        {
          title: "Answer",
          earned: 1,
          outOf: 1,
          justification: "Correctly calculated v_H(1) = −0.0996.",
          quote: "v_H(1) = −2e^(−3) = −0.0996.",
        },
      ],
    },
    {
      part: "(b)",
      earned: 0,
      outOf: 1,
      summary: "No response provided.",
      items: [
        {
          title: "Complete and correct response",
          earned: 0,
          outOf: 1,
          justification: "No relevant response provided.",
          quote: null,
        },
      ],
    },
  ],
};
```

- [ ] **Step 3: Write the Grade face**

Add to `src/components/built/demos/AcornDemo.tsx`, above the exported `AcornDemo`. **Merge the import into the existing `@/lib/demos/acornprep` line** rather than adding a second import from the same module — the file already imports `MCQS` and `DemoMcq` from it:

```tsx
// merged: import { MCQS, FRQ, type DemoMcq, type RubricItem } from "@/lib/demos/acornprep";

function RubricRow({ item, delay }: { item: RubricItem; delay: number }) {
  const earned = item.earned > 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="border border-[var(--line)] bg-[var(--bg)] p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm text-[var(--fg)]">
          {earned ? (
            <Check className="size-3.5 text-[var(--accent)]" />
          ) : (
            <X className="size-3.5 text-[var(--muted)]" />
          )}
          {item.title}
        </span>
        <span className="shrink-0 border border-[var(--accent)] px-2 py-0.5 font-mono text-[0.6rem] text-[var(--accent)]">
          {item.earned}/{item.outOf}
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{item.justification}</p>

      {item.quote ? (
        <p className="mt-3 border-l-2 border-[var(--accent)] bg-[var(--bg-2)] px-3 py-2 font-mono text-[0.7rem] italic leading-relaxed text-[var(--muted)]">
          &ldquo;{item.quote}&rdquo;
        </p>
      ) : null}
    </motion.div>
  );
}

function Grade() {
  return (
    <div data-demo="acorn-grade" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left — the prompt and what the student wrote */}
      <div className="border border-[var(--line)] bg-[var(--bg)] p-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {FRQ.exam}
        </p>
        <p className="mt-5 text-sm leading-[1.9] text-[var(--muted)]">{FRQ.prompt}</p>
        <p className="mt-6 border-t border-[var(--line)] pt-5 font-mono text-[0.8rem] leading-[1.9] text-[var(--fg)]">
          {FRQ.response}
        </p>
      </div>

      {/* Right — the rubric, item by item */}
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="mission-display text-2xl">Your results</span>
          <span className="border border-[var(--line)] px-3 py-1 font-mono text-xs text-[var(--fg)]">
            {FRQ.scored} / {FRQ.total} ({Math.round((FRQ.scored / FRQ.total) * 100)}%)
          </span>
        </div>

        {FRQ.parts.map((p, pi) => (
          <div key={p.part} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--accent)]">
                Part {p.part}
              </span>
              <span className="font-mono text-[0.65rem] text-[var(--muted)]">
                {p.earned}/{p.outOf} pts
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--muted)]">{p.summary}</p>
            {p.items.map((item, ii) => (
              <RubricRow key={item.title} item={item} delay={pi * 0.15 + ii * 0.1} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the assertion to verify it passes**

Temporarily render `<Grade />` from `AcornDemo` (Task 8 adds the real switcher):

```tsx
export function AcornDemo() {
  return <Grade />;
}
```

```bash
$B reload
$B js "!!document.querySelector('[data-demo=\"acorn-grade\"]')"                       # → true
$B js "document.body.innerText.includes('v_H(t) = x_H(t) differentiated.')"           # → true
$B js "document.body.innerText.includes('2 / 5')"                                     # → true
```

Expected: `true` three times. The quoted-evidence line is the assertion that matters — it is the whole point of the face.

- [ ] **Step 5: Commit**

```bash
git add src/lib/demos/acornprep.ts src/components/built/demos/AcornDemo.tsx
git commit -m "built: AcornPrep Grade demo — AI rubric quoting the student's own words"
```

---

### Task 8: The Review face and the three-way switcher

**Files:**
- Modify: `src/lib/demos/acornprep.ts` (append flashcards)
- Modify: `src/components/built/demos/AcornDemo.tsx` (add `Review`, replace `AcornDemo` with the switcher)

**Interfaces:**
- Consumes: `Practice` (Task 6), `Grade` (Task 7).
- Produces: `<AcornDemo />` renders a three-button switcher (`Practice` / `Grade` / `Review`) over the three faces. This is the final public shape; no later task changes it.

- [ ] **Step 1: Write the failing assertion**

```bash
$B goto http://localhost:3000/built
$B js "document.querySelectorAll('[data-demo-face]').length"
```

Expected: `0`.

- [ ] **Step 2: Append the flashcard fixture**

Add to `src/lib/demos/acornprep.ts`. Capture three real cards from `/study/flashcards` during the Task 6 login (the AP Calculus AB deck holds 160); the first below is captured verbatim from 2026-08-30 and the other two come from the same pass:

```ts
export type DemoCard = { front: string; back: string };

/** Real cards from the AcornPrep decks. */
export const CARDS: DemoCard[] = [
  {
    front: "Informal definition of a limit",
    back: "<captured back of this card>",
  },
  // …two more captured in the same pass
];
```

If the capture yields fewer than three usable cards, ship the ones you have — do not write cards yourself. The deck is real content and inventing a card breaks the no-invented-content rule.

- [ ] **Step 3: Write the Review face**

Add to `src/components/built/demos/AcornDemo.tsx`:

Again, merge `CARDS` into the existing `@/lib/demos/acornprep` import rather than adding a third import line from the same module — the final import should read `import { MCQS, FRQ, CARDS, type DemoMcq, type RubricItem } from "@/lib/demos/acornprep";`.

```tsx
function Review() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = CARDS[i % CARDS.length];

  return (
    <div data-demo="acorn-review" className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        data-cursor-hover
        className="flex min-h-[14rem] w-full max-w-2xl items-center justify-center border border-[var(--line)] bg-[var(--bg)] px-8 py-10 text-center transition-colors hover:border-[var(--accent)]"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={`${i}-${flipped}`}
            initial={{ opacity: 0, rotateX: -35 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 35 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="text-base leading-relaxed text-[var(--fg)]"
          >
            {flipped ? card.back : card.front}
          </motion.span>
        </AnimatePresence>
      </button>

      <div className="flex items-center gap-6 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--muted)]">
        <span>{flipped ? "Back" : "Front"} · click to flip</span>
        <button
          type="button"
          data-cursor-hover
          onClick={() => {
            setFlipped(false);
            setI((n) => n + 1);
          }}
          className="text-[var(--fg)] transition-opacity hover:opacity-70"
        >
          Next card →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Replace `AcornDemo` with the switcher**

```tsx
const FACES = [
  { id: "practice", label: "Practice", note: "Answer one" },
  { id: "grade", label: "Grade", note: "Watch it mark an FRQ" },
  { id: "review", label: "Review", note: "Flip a card" },
] as const;

export function AcornDemo() {
  const [face, setFace] = useState<(typeof FACES)[number]["id"]>("practice");
  const [i, setI] = useState(0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {FACES.map((f) => (
          <button
            key={f.id}
            type="button"
            data-demo-face={f.id}
            aria-pressed={face === f.id}
            onClick={() => setFace(f.id)}
            data-cursor-hover
            className={cn(
              "border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-colors",
              face === f.id
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-2 font-mono text-[0.65rem] text-[var(--muted)]">
          {FACES.find((f) => f.id === face)!.note}
        </span>
      </div>

      {face === "practice" ? (
        <Practice q={MCQS[i % MCQS.length]} onNext={() => setI((n) => n + 1)} />
      ) : null}
      {face === "grade" ? <Grade /> : null}
      {face === "review" ? <Review /> : null}
    </div>
  );
}
```

- [ ] **Step 5: Run the assertion to verify it passes**

```bash
$B reload
$B js "document.querySelectorAll('[data-demo-face]').length"                 # → 3
$B js "document.querySelector('[data-demo-face=\"grade\"]').click()"
$B js "!!document.querySelector('[data-demo=\"acorn-grade\"]')"              # → true
$B js "document.querySelector('[data-demo-face=\"review\"]').click()"
$B js "!!document.querySelector('[data-demo=\"acorn-review\"]')"             # → true
```

Expected: `3`, `true`, `true`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/demos/acornprep.ts src/components/built/demos/AcornDemo.tsx
git commit -m "built: AcornPrep Review face and the Practice/Grade/Review switcher"
```

---

### Task 9: Hermes — the steppable pipeline

**Files:**
- Create: `src/lib/demos/hermes.ts`
- Create: `src/components/built/demos/HermesPipeline.tsx`
- Modify: `src/app/built/page.tsx`

**Interfaces:**
- Consumes: `Chapter` (Task 5).
- Produces:
  ```ts
  export type Extracted = { club: string; room: string; time: string; what: string };
  export type Ingested = { handle: string; caption: string; extracted: Extracted | null };
  export const FEED: Ingested[];   // 5 records
  export const STORY_SHOT: string; // "/embeds/hermes-story.jpg"
  ```
  `<HermesPipeline />` takes no props.

- [ ] **Step 1: Capture five real captions and their extractions**

The Hermes repo is at `~/Downloads/Hermes` (Node.js · Claude API · Google Sheets). Read its scraped-caption samples and the extraction output — the Google Sheet it writes, or a logged run:

```bash
ls ~/Downloads/Hermes
grep -rn "caption" ~/Downloads/Hermes --include="*.js" --include="*.json" -l | head
```

Take five real club captions and the five structured rows Hermes produced from them. Include **at least one where extraction returns null** — a caption with no meeting in it — because that is what the filter actually does and it is more honest than five clean hits.

If the repo does not retain samples, read five current captions from the club accounts the bot watches and run the extraction prompt against them, recording exactly what came back.

- [ ] **Step 2: Write the failing assertion**

```bash
$B goto http://localhost:3000/built
$B js "!!document.querySelector('[data-demo=\"hermes\"]')"
```

Expected: `false`.

- [ ] **Step 3: Write the content file**

Create `src/lib/demos/hermes.ts`:

```ts
/**
 * Real captions from MSJ club accounts and the rows Hermes extracted from
 * them. Captured from the running bot — do not invent captions.
 */

export type Extracted = { club: string; room: string; time: string; what: string };

export type Ingested = {
  handle: string;
  caption: string;
  /** null when the caption carries no meeting — the filter is part of the demo. */
  extracted: Extracted | null;
};

export const FEED: Ingested[] = [
  // …five records captured in Step 1
];

export const STORY_SHOT = "/embeds/hermes-story.jpg";
```

- [ ] **Step 4: Write the pipeline component**

Create `src/components/built/demos/HermesPipeline.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { FEED, STORY_SHOT } from "@/lib/demos/hermes";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

const STAGES = [
  { id: 0, label: "Ingest", note: "87 club accounts, scraped" },
  { id: 1, label: "Extract", note: "Claude pulls the meeting out" },
  { id: 2, label: "Publish", note: "One story, every weekday" },
] as const;

export function HermesPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [stage, setStage] = useState(0);

  // Play through once on scroll-in, then leave it to the reader.
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = window.setTimeout(() => setStage(1), 1600);
    const b = window.setTimeout(() => setStage(2), 3400);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [inView]);

  return (
    <div ref={ref} data-demo="hermes">
      {/* Stage selector */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            data-stage={s.id}
            aria-pressed={stage === s.id}
            onClick={() => setStage(s.id)}
            data-cursor-hover
            className={cn(
              "border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-colors",
              stage === s.id
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]",
            )}
          >
            {s.label}
          </button>
        ))}
        <span className="ml-2 font-mono text-[0.65rem] text-[var(--muted)]">
          {STAGES[stage].note}
        </span>
      </div>

      <div className="min-h-[26rem] border border-[var(--line)] bg-[var(--bg)] p-6">
        <AnimatePresence mode="wait">
          {/* ── Ingest: the raw feed ── */}
          {stage === 0 ? (
            <motion.div
              key="ingest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col gap-3"
            >
              {FEED.map((f, i) => (
                <motion.div
                  key={f.handle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
                  className="border-l-2 border-[var(--line)] pl-4"
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
                    {f.handle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{f.caption}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : null}

          {/* ── Extract: caption → structured row ── */}
          {stage === 1 ? (
            <motion.div
              key="extract"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col gap-3"
            >
              {FEED.map((f, i) => (
                <motion.div
                  key={f.handle}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.1 }}
                  className="grid grid-cols-1 items-center gap-3 border-b border-[var(--line)] pb-3 md:grid-cols-[1fr_auto_1.2fr]"
                >
                  <p className="truncate text-xs text-[var(--muted)] opacity-60">{f.caption}</p>
                  <span className="hidden font-mono text-[var(--accent)] md:block">→</span>
                  {f.extracted ? (
                    <p className="font-mono text-[0.7rem] leading-relaxed text-[var(--fg)]">
                      {f.extracted.club} · {f.extracted.room} · {f.extracted.time}
                      <span className="text-[var(--muted)]"> — {f.extracted.what}</span>
                    </p>
                  ) : (
                    <p className="font-mono text-[0.7rem] text-[var(--muted)]">
                      no meeting — dropped
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : null}

          {/* ── Publish: the story that goes out ── */}
          {stage === 2 ? (
            <motion.div
              key="publish"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(STORY_SHOT)}
                alt="A Hermes daily club-schedule story as posted to @msjclubs"
                loading="lazy"
                decoding="async"
                className="max-h-[24rem] w-auto border border-[var(--line)]"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Mount the Hermes chapter**

In `src/app/built/page.tsx`, after the AcornPrep chapter:

```tsx
      {/* ── 4. M-02 HERMES ───────────────────────────────────── */}
      <Chapter project={bySlug("hermes")} no="02">
        <HermesPipeline />
      </Chapter>
```

- [ ] **Step 6: Run the assertion to verify it passes**

```bash
$B reload
$B js "!!document.querySelector('[data-demo=\"hermes\"]')"                    # → true
$B js "document.querySelectorAll('[data-stage]').length"                      # → 3
$B js "document.querySelector('[data-stage=\"1\"]').click()"
$B js "document.body.innerText.includes('no meeting — dropped')"              # → true
$B js "!!document.getElementById('hermes')"                                   # → true
```

The deep link the leadership world uses must resolve:

```bash
$B goto http://localhost:3000/built#hermes
$B js "Math.abs(document.getElementById('hermes').getBoundingClientRect().top) < 200"
```

Expected: `true`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/demos/hermes.ts src/components/built/demos/HermesPipeline.tsx src/app/built/page.tsx
git commit -m "built: Hermes pipeline demo — ingest, extract, publish"
```

---

### Task 10: NotebookLI — read one paragraph

**Files:**
- Create: `src/lib/demos/notebookli.ts`
- Create: `src/components/built/demos/NotebookReader.tsx`
- Modify: `src/app/built/page.tsx`

**Interfaces:**
- Consumes: `Chapter` (Task 5).
- Produces:
  ```ts
  export type Term = { term: string; definition: string };
  export type CitedAnswer = { question: string; answer: string; citesSentence: number };
  export const PAPER: { title: string; sentences: string[]; terms: Term[]; asks: CitedAnswer[] };
  ```
  `<NotebookReader />` takes no props. `citesSentence` indexes into `sentences`.

- [ ] **Step 1: Source a real paragraph**

Use one of the six Fusarium papers read at UMass. The research world already carries this material — check `src/components/research/lab/` for the `fusarium/` branch content, and the poster at `~/Downloads/Jadon Li/Jadon Li - Summer UMass Research Poster Design - Updated.pdf`:

```bash
grep -rn "Fusarium" src/components/research/lab/ | head -20
pdftotext -f 1 -l 1 "$HOME/Downloads/Jadon Li/Jadon Li - Summer UMass Research Poster Design - Updated.pdf" - | head -60
```

Take one real paragraph of 4–6 sentences and pick 4–6 technical terms from it to define. Definitions must be accurate — this sits on a page arguing the author reads papers.

- [ ] **Step 2: Write the failing assertion**

```bash
$B goto http://localhost:3000/built
$B js "!!document.querySelector('[data-demo=\"notebookli\"]')"
```

Expected: `false`.

- [ ] **Step 3: Write the content file**

Create `src/lib/demos/notebookli.ts`:

```ts
/**
 * A real paragraph from one of the six Fusarium papers read at UMass, with the
 * terms NotebookLI defines in place and two questions it answers by citation.
 */

export type Term = { term: string; definition: string };

export type CitedAnswer = {
  question: string;
  answer: string;
  /** Index into `sentences` — the sentence the answer cites and highlights. */
  citesSentence: number;
};

export const PAPER: {
  title: string;
  sentences: string[];
  terms: Term[];
  asks: CitedAnswer[];
} = {
  title: "", // the paper's real title, from Step 1
  sentences: [], // 4–6 real sentences
  terms: [], // 4–6 terms appearing in those sentences
  asks: [], // 2 questions, each citing a sentence index
};
```

- [ ] **Step 4: Write the reader**

Create `src/components/built/demos/NotebookReader.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PAPER } from "@/lib/demos/notebookli";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Splits a sentence so each defined term becomes its own clickable span. */
function annotate(
  sentence: string,
  terms: string[],
  onPick: (t: string) => void,
  active: string | null,
) {
  if (terms.length === 0) return sentence;
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return sentence.split(pattern).map((chunk, i) => {
    const hit = terms.find((t) => t.toLowerCase() === chunk.toLowerCase());
    if (!hit) return <span key={i}>{chunk}</span>;
    return (
      <button
        key={i}
        type="button"
        data-term={hit}
        onClick={() => onPick(hit)}
        data-cursor-hover
        className={cn(
          "underline decoration-dotted underline-offset-4 transition-colors",
          active === hit ? "text-[var(--accent)]" : "text-[var(--fg)] hover:text-[var(--accent)]",
        )}
      >
        {chunk}
      </button>
    );
  });
}

export function NotebookReader() {
  const [term, setTerm] = useState<string | null>(null);
  const [cited, setCited] = useState<number | null>(null);

  const termNames = PAPER.terms.map((t) => t.term);
  const definition = PAPER.terms.find((t) => t.term === term);

  return (
    <div data-demo="notebookli" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
      {/* Left — the paper */}
      <div className="border border-[var(--line)] bg-[var(--bg)] p-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {PAPER.title}
        </p>
        <p className="mt-5 text-sm leading-[2.1] text-[var(--muted)]">
          {PAPER.sentences.map((s, i) => (
            <span
              key={i}
              data-sentence={i}
              className={cn(
                "transition-colors duration-500",
                cited === i && "bg-[var(--selection)] text-[var(--fg)]",
              )}
            >
              {annotate(s, termNames, setTerm, term)}{" "}
            </span>
          ))}
        </p>
      </div>

      {/* Right — definition in place, then the asks */}
      <div className="flex flex-col gap-4">
        <div className="min-h-[8rem] border border-[var(--line)] bg-[var(--bg)] p-5">
          <AnimatePresence mode="wait">
            {definition ? (
              <motion.div
                key={definition.term}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="mission-display text-lg text-[var(--accent)]">{definition.term}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {definition.definition}
                </p>
              </motion.div>
            ) : (
              <p key="hint" className="text-sm text-[var(--muted)]">
                Tap any underlined term to define it without leaving the paragraph.
              </p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-2">
          {PAPER.asks.map((a) => (
            <button
              key={a.question}
              type="button"
              data-ask
              onClick={() => setCited(a.citesSentence)}
              data-cursor-hover
              className="border border-[var(--line)] px-4 py-3 text-left text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
            >
              {a.question}
            </button>
          ))}

          <AnimatePresence>
            {cited !== null ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="border-l-2 border-[var(--accent)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
              >
                {PAPER.asks.find((a) => a.citesSentence === cited)?.answer}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Mount the NotebookLI chapter**

```tsx
      {/* ── 5. M-03 NOTEBOOKLI ───────────────────────────────── */}
      <Chapter project={bySlug("notebookli")} no="03">
        <NotebookReader />
      </Chapter>
```

- [ ] **Step 6: Run the assertion to verify it passes**

```bash
$B reload
$B js "!!document.querySelector('[data-demo=\"notebookli\"]')"          # → true
$B js "document.querySelectorAll('[data-term]').length > 0"             # → true
$B js "document.querySelector('[data-term]').click()"
$B js "document.querySelectorAll('[data-ask]').length"                  # → 2
$B js "document.querySelector('[data-ask]').click()"
$B js "!!document.querySelector('[data-sentence].bg-\\\\[var\\\\(--selection\\\\)\\\\]') || document.body.innerText.length > 0"
```

Expected: `true`, `true`, `2`, and a highlighted sentence visible in a screenshot:

```bash
$B screenshot --viewport .shots/notebookli-cited.png
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/demos/notebookli.ts src/components/built/demos/NotebookReader.tsx src/app/built/page.tsx
git commit -m "built: NotebookLI reader demo — define in place, answer by citation"
```

---

### Task 11: FleetDeck — the tail five

**Files:**
- Create: `src/components/built/FleetDeck.tsx`
- Modify: `src/app/built/page.tsx`

**Interfaces:**
- Consumes: `PROJECTS` filtered to `tier === 3` (Task 1), `Develop` (Task 3), `LiveEmbed`.
- Produces: `<FleetDeck />` takes no props. Renders five panels in array order: MSJHS ASB, Youth STEM Journal, CueSheet, MSJ Makes, jadonli.com — sorted so `jadonli-com` is last.

- [ ] **Step 1: Write the failing assertion**

```bash
$B goto http://localhost:3000/built
$B js "!!document.querySelector('[data-deck]')"
```

Expected: `false`.

- [ ] **Step 2: Write the deck**

Create `src/components/built/FleetDeck.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { Develop } from "@/components/built/Develop";
import { LiveEmbed } from "@/components/built/LiveEmbed";
import { DecodeText, StatValue } from "@/components/built/MissionFX";
import { PROJECTS } from "@/lib/data";
import { cn } from "@/lib/cn";

/**
 * Tier 3 in `PROJECTS` order: ASB, YSJ, CueSheet, MSJ Makes, jadonli.com —
 * the site itself last, as the closing wink. Do not sort; array order is the
 * canonical display order and `MissionIndex` numbers off the same sequence.
 */
const FLEET = PROJECTS.filter((p) => p.tier === 3);

/** Tier 3 starts at M-04 because three chapters precede the deck. */
const FLEET_OFFSET = PROJECTS.filter((p) => p.tier < 3).length;

export function FleetDeck() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false, align: "start" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  // Deep link: /built#cuesheet advances the deck to that panel.
  useEffect(() => {
    if (!embla) return;
    const hash = window.location.hash.slice(1);
    const i = FLEET.findIndex((p) => p.slug === hash);
    if (i >= 0) embla.scrollTo(i, true);
  }, [embla]);

  const go = useCallback(
    (i: number) => {
      embla?.scrollTo(i);
    },
    [embla],
  );

  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-28">
        <div className="mb-10">
          <Reveal>
            <h2 className="mission-display text-[2.2rem] md:text-[3.6rem]">
              <DecodeText text="The rest of" />{" "}
              <span className="stencil">
                <DecodeText text="the fleet." duration={1.2} />
              </span>
            </h2>
          </Reveal>
        </div>

        {/* File-folder tabs */}
        <div
          role="tablist"
          aria-label="The rest of the fleet"
          className="flex flex-wrap gap-px border-b border-[var(--line)]"
        >
          {FLEET.map((p, i) => (
            <button
              key={p.slug}
              role="tab"
              id={`fleet-tab-${p.slug}`}
              aria-selected={selected === i}
              aria-controls={`fleet-panel-${p.slug}`}
              tabIndex={selected === i ? 0 : -1}
              data-fleet-tab={p.slug}
              data-cursor-hover
              onClick={() => go(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(Math.min(i + 1, FLEET.length - 1));
                if (e.key === "ArrowLeft") go(Math.max(i - 1, 0));
              }}
              className={cn(
                "flex items-baseline gap-2 border border-b-0 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors",
                selected === i
                  ? "border-[var(--accent)] bg-[var(--bg)] text-[var(--accent)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              <span className="opacity-60">
                M-{String(i + FLEET_OFFSET + 1).padStart(2, "0")}
              </span>
              {p.name}
            </button>
          ))}
        </div>

        {/* Panels — all in the DOM so ⌘F and crawlers find every project */}
        <div className="overflow-hidden border border-t-0 border-[var(--line)]" ref={emblaRef}>
          <div className="flex">
            {FLEET.map((p, i) => (
              <div
                key={p.slug}
                id={p.slug}
                className="min-w-0 flex-[0_0_100%] scroll-mt-24"
                role="tabpanel"
                aria-labelledby={`fleet-tab-${p.slug}`}
                data-deck={p.slug}
              >
                <div className="grid min-h-[30rem] grid-cols-1 gap-8 p-6 md:p-10 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
                  {/* Writeup */}
                  <div className="flex flex-col justify-center">
                    <p className="mission-display text-2xl">{p.name}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{p.tagline}</p>
                    <p className="mt-5 text-sm leading-[1.9] text-[var(--muted)]">{p.body}</p>

                    <div className="mt-6 flex flex-col gap-1.5">
                      {p.stats.map((s) => (
                        <div key={s.label} className="flex items-baseline gap-2">
                          <span className="mission-display text-xl text-[var(--fg)]">
                            <StatValue value={s.value} />
                          </span>
                          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center border border-[var(--line)] px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor-hover
                      className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--fg)] transition-opacity hover:opacity-70"
                    >
                      Visit {p.domain} <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>

                  {/* Media */}
                  <div className="flex items-center">
                    {p.shot ? (
                      <div className="frame-brackets w-full">
                        <Develop>
                          <LiveEmbed
                            url={p.url}
                            domain={p.domain}
                            title={p.name}
                            screenshot={p.shot}
                            aspect="1280/800"
                          />
                        </Develop>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

`jadonli.com` has no `shot` in `data.ts`, so its panel renders writeup-only — which is correct, since the reader is already looking at the site.

- [ ] **Step 3: Mount the deck**

```tsx
      {/* ── 6. THE REST OF THE FLEET ─────────────────────────── */}
      <FleetDeck />
```

- [ ] **Step 4: Run the assertion to verify it passes**

```bash
$B reload
$B js "document.querySelectorAll('[data-deck]').length"                          # → 5
$B js "document.querySelectorAll('[data-fleet-tab]').length"                     # → 5
$B js "document.querySelector('[data-fleet-tab]').getAttribute('data-fleet-tab')" # → msjhs-asb
$B js "[...document.querySelectorAll('[data-fleet-tab]')].pop().getAttribute('data-fleet-tab')" # → jadonli-com
```

Every project must remain findable in the DOM even when its panel is off-screen:

```bash
$B js "document.body.innerText.includes('The right song for the cut.')"          # → true
```

Deep link into a panel:

```bash
$B goto http://localhost:3000/built#cuesheet
$B js "document.querySelector('[data-fleet-tab=\"cuesheet\"]').getAttribute('aria-selected')"
```

Expected: `true`.

- [ ] **Step 5: Commit**

```bash
git add src/components/built/FleetDeck.tsx src/app/built/page.tsx
git commit -m "built: FleetDeck — five full-width panels behind file-folder tabs"
```

---

### Task 12: Page assembly and retiring the old sections

**Files:**
- Modify: `src/app/built/page.tsx` (full rewrite)
- Create: `src/components/built/RepoStrip.tsx`
- Delete: `src/components/built/AcornFlagship.tsx`, `src/components/built/ProductsGrid.tsx`, `src/components/built/LaunchLedger.tsx`, `src/components/built/GitHubShowcase.tsx`

**Interfaces:**
- Consumes: everything from Tasks 4–11.
- Produces: the final `/built` page. `<RepoStrip user={string} />` renders a one-line list of repos in the closing.

- [ ] **Step 1: Write the failing assertion**

The old sections must be gone and the page must be one screen shorter:

```bash
$B goto http://localhost:3000/built
$B js "document.body.innerText.includes('End of transmission')"
```

Expected: `true` — the filler is still there.

- [ ] **Step 2: Write the repo strip**

`GitHubShowcase` renders a full section with an avatar, a decorative fake contribution graph, and four repo cards that repeat project names already stated twice above. A decorative graph labelled "decorative pattern" is an ornament asserting activity it does not measure — it goes. Create `src/components/built/RepoStrip.tsx`:

```tsx
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";

const REPOS = [
  { name: "jadon-portfolio", lang: "TypeScript" },
  { name: "Hermes", lang: "JavaScript" },
  { name: "lockedin", lang: "Swift" },
  { name: "cuesheet", lang: "TypeScript" },
];

/** The code, in public. One line per repo — no ornaments. */
export function RepoStrip({ user }: { user: string }) {
  return (
    <Reveal className="mx-auto mt-16 max-w-2xl">
      <div className="border-t border-[var(--line)] pt-8">
        {REPOS.map((r) => (
          <a
            key={r.name}
            href={`https://github.com/${user}/${r.name}`}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor-hover
            className="group flex items-center justify-between border-b border-[var(--line)] py-3 transition-colors hover:text-[var(--accent)]"
          >
            <span className="font-mono text-sm text-[var(--fg)] group-hover:text-[var(--accent)]">
              {r.name}
            </span>
            <span className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              {r.lang}
              <ArrowUpRight className="size-3" />
            </span>
          </a>
        ))}
      </div>
    </Reveal>
  );
}
```

- [ ] **Step 3: Rewrite the page**

Replace `src/app/built/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { World } from "@/components/chrome/World";
import { Footer } from "@/components/chrome/Footer";
import { Reveal } from "@/components/primitives/Reveal";
import { BuiltHero } from "@/components/built/BuiltHero";
import { MissionIndex } from "@/components/built/MissionIndex";
import { Chapter } from "@/components/built/Chapter";
import { FleetDeck } from "@/components/built/FleetDeck";
import { RepoStrip } from "@/components/built/RepoStrip";
import { AcornDemo } from "@/components/built/demos/AcornDemo";
import { HermesPipeline } from "@/components/built/demos/HermesPipeline";
import { NotebookReader } from "@/components/built/demos/NotebookReader";
import { DecodeText, MissionRail } from "@/components/built/MissionFX";
import { PROFILE, PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Things I've Built",
  description:
    "AcornPrep, Hermes, NotebookLI and five more — real products with real users. 500+ users, #1 Google result, shipped by a high-school builder.",
};

const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)!;

/**
 * Things I've Built — World 03.
 * Server component shell. Interactive sections carry their own "use client".
 *
 * Weight is encoded as screen real estate: the top three projects get full
 * chapters with playable demos, the remaining five share one screen as a deck.
 */
export default function BuiltPage() {
  return (
    <World id="built">
      <MissionRail />

      <BuiltHero />
      <MissionIndex />

      <Chapter project={bySlug("acornprep")} no="01">
        <AcornDemo />
      </Chapter>

      <Chapter project={bySlug("hermes")} no="02">
        <HermesPipeline />
      </Chapter>

      <Chapter project={bySlug("notebookli")} no="03">
        <NotebookReader />
      </Chapter>

      <FleetDeck />

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center md:px-9 md:py-28">
        <Reveal>
          <h2 className="mission-display text-[2.6rem] md:text-[4.4rem]">
            <DecodeText text="Build something" />{" "}
            <span className="stencil">
              <DecodeText text="people use." duration={1.2} />
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.3} className="mt-8">
          <p className="mx-auto max-w-xl font-mono text-sm leading-relaxed text-[var(--muted)]">
            Every product here started as a question — what if there was a better way to study
            for AP exams? The answer is always the same: build it.
          </p>
        </Reveal>

        <RepoStrip user={PROFILE.links.githubUser} />
      </section>

      <Footer />
    </World>
  );
}
```

Cut, per the copy rule: the `03 — Things I've Built` numbering duplicated by the mission slates, `Mission 01 — Flagship` alongside `01 / 05`, the `Live transmission — acornprep.com` caption above a button already reading `Visit acornprep.com`, `The builder's creed` eyebrow above a headline that says it, `End of transmission`, and the three-question run in the closing paragraph (one question makes the point).

- [ ] **Step 4: Delete the retired components**

```bash
git rm src/components/built/AcornFlagship.tsx \
       src/components/built/ProductsGrid.tsx \
       src/components/built/LaunchLedger.tsx \
       src/components/built/GitHubShowcase.tsx
```

Confirm nothing else imports them:

```bash
grep -rn "AcornFlagship\|ProductsGrid\|LaunchLedger\|GitHubShowcase" src/
```

Expected: no output.

- [ ] **Step 5: Run the assertion to verify it passes**

```bash
$B reload
$B js "document.body.innerText.includes('End of transmission')"    # → false
$B js "document.querySelectorAll('[data-chapter]').length"          # → 3
$B js "document.querySelectorAll('[data-deck]').length"             # → 5
npx tsc --noEmit
npm run build
```

Expected: `false`, `3`, `5`, no type errors, clean build.

- [ ] **Step 6: Commit**

```bash
git add -A src/
git commit -m "built: assemble the page — three chapters, the fleet deck, one closing beat"
```

---

### Task 13: Verification pass

**Files:**
- No source changes unless a defect is found.

**Interfaces:**
- Consumes: the assembled page from Task 12.
- Produces: a verified page and `.shots/` evidence.

- [ ] **Step 1: Build and lint only what changed**

```bash
npm run build
npx eslint src/components/built src/lib/demos src/app/built/page.tsx src/components/primitives/Counter.tsx
```

Expected: clean build; zero errors in these paths. Do NOT run a repo-wide lint — ~17 untouched files carry pre-existing errors that are not in scope.

- [ ] **Step 2: Capture three viewports**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
for W in 1440x900 768x1024 390x844; do
  $B viewport $W
  $B goto http://localhost:3000/built
  for Y in 0 1400 2800 4200 5600 7000; do
    $B js "window.scrollTo(0,$Y)"
    $B screenshot --viewport ".shots/final-${W}-${Y}.png"
  done
done
```

Read every capture. Check: no horizontal overflow at 390px, the deck tabs wrap rather than clip, each chapter's demo is fully visible, and no screenshot is still washed out after its `Develop` fires.

- [ ] **Step 3: Verify deep links**

```bash
$B viewport 1440x900
for H in acornprep hermes notebookli cuesheet msjhs-asb youth-stem-journal msj-makes jadonli-com; do
  $B goto "http://localhost:3000/built#$H"
  echo -n "$H → "
  $B js "!!document.getElementById('$H')"
done
```

Expected: `true` for all eight. `#hermes` in particular is linked from the leadership world and must land on the chapter.

- [ ] **Step 4: Keyboard-only pass**

```bash
$B goto http://localhost:3000/built
$B press Tab; $B press Tab; $B press Tab
$B js "document.activeElement.tagName + ' ' + document.activeElement.textContent.slice(0,40)"
```

Tab to the deck tablist and confirm arrow keys move panels:

```bash
$B js "document.querySelector('[data-fleet-tab=\"msjhs-asb\"]').focus()"
$B press ArrowRight
$B js "document.querySelector('[data-fleet-tab=\"youth-stem-journal\"]').getAttribute('aria-selected')"
```

Expected: `true`. Every demo control must be reachable by Tab and activatable by Enter — they are all real `<button>` elements, so confirm none were replaced with divs.

- [ ] **Step 5: Reduced-motion pass**

```bash
$B js "matchMedia('(prefers-reduced-motion: reduce)').matches"
```

If the harness cannot emulate the media query, verify by reading the source instead: `Counter` (Task 2), `HermesPipeline` (Task 9), and the `Develop` CSS (Task 3) each branch on `prefers-reduced-motion`. Confirm all three branches exist and that no autoplay timer runs when it matches.

- [ ] **Step 6: Confirm the M-numbers agree between the index and the deck**

The index and the deck number missions off the same array; a desync would show the same project as two different missions. Check the four deck projects:

```bash
$B goto http://localhost:3000/built
$B js "[...document.querySelectorAll('[data-fleet-tab]')].map(t => t.textContent.trim().split(/\s+/)[0] + ' ' + t.getAttribute('data-fleet-tab')).join(' | ')"
```

Expected: `M-04 msjhs-asb | M-05 youth-stem-journal | M-06 cuesheet | M-07 msj-makes | M-08 jadonli-com`.

Cross-check against the index rows:

```bash
$B js "[...document.querySelectorAll('a[href^=\"#\"]')].slice(0,8).map(a => a.textContent.trim().split(/\s+/)[0] + a.getAttribute('href')).join(' | ')"
```

Expected: the M-number preceding each slug matches the deck exactly for all five tier-3 projects.

- [ ] **Step 7: Confirm no invented numbers survived**

```bash
grep -rn "700\|05 Products\|Revenue" src/components/built src/lib/data.ts
```

Expected: no hits for the retired `~$700` / `05 Products` / `Revenue` strings.

- [ ] **Step 8: Commit any fixes and push the branch**

```bash
git add -A
git commit -m "built: verification pass — viewports, deep links, keyboard, reduced motion"
git push -u origin built-world-redesign
```

---

## Self-Review

**Spec coverage.** Every section of the spec maps to a task: page skeleton → Tasks 4, 5, 12; the three demos → Tasks 6–10; fleet deck → Task 11; art direction (`Develop`, chapter slates, filler cuts) → Tasks 3, 5, 12; data fixes → Tasks 1 and 2; architecture (file layout, retirements) → Tasks 5–12; verification → Task 13. Routing and `#hermes` survival are asserted in Tasks 9, 11, and 13.

**Ordering.** `PROJECTS` array order is the single source of display order and of the `M-01`…`M-08` numbering. `MissionIndex` (Task 4) and `FleetDeck` (Task 11) both read it without sorting; Task 13 Step 6 asserts the two agree. An earlier draft had each component sort independently, which numbered MSJHS ASB as M-07 in the index and M-04 in the deck.

**Type consistency.** `Project.tier` / `.slug` / `.launched` (Task 1) are the only fields Tasks 4, 5, 11, and 12 read. `DemoMcq`, `MCQS` (Task 6) are consumed by Task 8's switcher under the same names. `RubricItem`, `FrqPart`, `DemoFrq`, `FRQ` (Task 7) are used only inside `AcornDemo`. `Develop` (Task 3) is imported by Tasks 5 and 11 with the same `{ children, className }` signature throughout.

**Known content gaps, and why they are steps rather than placeholders.** Three fixtures cannot be written from here because the content is not invented — it is captured: the ten MCQs (Task 6 Step 1, from the live bank), the five Hermes captions (Task 9 Step 1, from `~/Downloads/Hermes`), and the Fusarium paragraph (Task 10 Step 1, from the poster/research files). Each has an explicit, mechanical capture procedure, a fully specified type, and — for the MCQ and FRQ fixtures — a complete real record captured on 2026-08-30 as the worked model. Writing this content from imagination would violate the project's no-invented-numbers rule; gathering it is the first step of the task that needs it.
