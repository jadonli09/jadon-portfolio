# Research world redesign — Fusarium first

**Date:** 2026-08-30
**Page:** `/research` (world 03 — "The Scientist")
**Status:** approved design, ready for implementation plan

---

## Why

The research world is the least usable page on the site. Today it renders a
terminal that prints `This page is a terminal. Nothing is shown until you ask
for it.` — a visitor who does not type sees no research at all. The summer's
UMass Amherst wet-lab work sits behind `git checkout umass-2026`, a command
nobody discovers. The gout RNA-seq project, which is older and smaller, owns
the headline.

Three things are wrong, in order of severity:

1. **Content is gated behind commands.** Every other world shows its work on
   arrival. This one requires a skill check.
2. **The wrong project leads.** Six weeks in the Ma Lab is the stronger,
   newer, more distinctive work, and it is a branch.
3. **The metaphor fights the content.** A terminal suits RNA-seq. It does not
   suit protoplasting, PEG transformation, and a confocal microscope.
   `cat protocol.sh` is the wrong verb for work done with your hands.

Secondary: the page is locked to `h-[100dvh] overflow-hidden` so nothing
scrolls; the left rail spends its full width duplicating the global menu; and
the chrome ("TERMINAL — DEG-SH", "GO TO", "TRY", "ONLINE · ⌘K",
"TAB ⇄ COMPLETE · ↑↓ HISTORY") is exactly the filler subtext being removed
site-wide.

## Scope

Presentation and information architecture only. **No research facts change.**
`content.ts` already encodes the poster in full — plasmid feature map,
four-step protocol, three strains, results, citation, twelve images. This
redesign is about surfacing it.

Out of scope: the poster PDF itself, `/achievements`, and the other worlds.

## Governing principle

> **Nothing important sits behind a click.**

Every fact on the page is reachable by scrolling. Interactions exist to help a
reader *understand* something, never to *unlock* it. This is the direct answer
to "the UI is super clunky… not really easy to navigate or find information."

It also settles individual calls downstream: the protocol shows all four steps
at once rather than stepping through them; results are prose on the page, not
a disclosure toggle; the console is an alternative route to content, never the
only one.

### Second principle — the page is about the scientist, not only the science

> **Every section must answer "what does this tell me about Jadon?"**

The poster is a five-author artifact and Jadon is one of two pre-college
students on a PhD student's project. A page that renders the poster
beautifully proves the *Ma Lab* does good work. It does not prove Jadon can do
science.

This is the difference between a portfolio and a reprint, and it drives four
additions below: a bench-contribution section, a reasoning layer on the
protocol, an honest setback, and a reframing of the gout chapter as evidence
of independent analysis rather than merely earlier work.

---

## Art direction — "Dark Field"

Chosen from three mocked-up directions (Dark Field / Field Notebook / The
Plate) at <https://claude.ai/code/artifact/bf6358f0-8bed-4d63-89b2-d41bde53cdbc>.

The project's premise is *you cannot study a fight you cannot see, so we made
it visible*. Dark Field is the only direction where the reader **performs**
that sentence: the page opens dark and the glow is something they bring up
themselves. The interaction is the finding.

It also extends the world's existing identity instead of discarding it —
`globals.css` already defines the RFP colourway (`--accent: #ff3d5e` mRFP,
`--accent-2: #7dff8a` GFP) — and a dark page is the natural home for the
console.

Rejected: **Field Notebook** (warm graph paper) collides with the About
world's warm-paper editorial direction and mutes the glow. **The Plate**
(bone-white gallery wall) is the most legible but turns the glow into an
illustration rather than an event, and reads closest to a generic science
page.

### Tokens

Existing `[data-world="research"]` variables, with the RFP colourway promoted
from an opt-in class to the page default:

| Token | Fusarium chapters | Gout chapter | Beyond |
|---|---|---|---|
| `--accent` | `#ff3d5e` (mRFP) | `#bcff46` (up-regulated) | inherit, unused |
| `--accent-2` | `#7dff8a` (GFP) | `#4fe6ee` (down-regulated) | — |
| `--bg` | `#07080b` | `#0b0e13` | `#0b0e13` |

Type stays on the site's existing families: **Instrument Serif** display,
**Archivo** body, **JetBrains Mono** labels and data.

### Colour as wayfinding

The accent changes between chapters and the change carries information:
crimson is the reporter actually inserted into the fungus; lime and cyan are
the volcano plot's own up/down encoding. Scrolling from one project to the
other *looks* like a change of project. This is orientation doing real work,
not decoration.

Implementation: a `data-chapter` attribute on each chapter section scopes the
variable overrides in CSS. No JavaScript required for the colour itself.

---

## Information architecture

One page, `/research`, three chapter groups, fifteen sections. Fourteen of
them are rail entries — the hero is the top of the page, not a destination.
"At the bench" carries the setback as its closing beat rather than taking its
own rail entry:

```
FUSARIUM · UMASS 2026        GOUT · RNA-SEQ         (no group label)
  hero                         the question           olympiads
  the question                 the pipeline           programs
  the strains                  the volcano
  the plasmid                  the mediators
  at the bench      ← NEW
  the protocol
  the evidence
  what's next
  the poster
```

The third group carries **no label**. "Beyond" named nothing and is exactly
the filler subtext being cut site-wide; "Olympiads" and "Programs" stand on
their own.

### Navigation — `ResearchNav`

The core fix. A persistent chapter rail, present at every scroll position.

- **≥1024px:** fixed vertical rail, left, below the global nav. **Only the
  active group is expanded**; the other groups collapse to their labels and
  expand on click or on scroll into them. Fifteen permanent lines drop to
  about eight — a full rail is furniture, and this page is already fighting
  clutter. Everything stays reachable in at most two clicks. Active section
  highlighted; a progress bar shows position through the page.
- **<1024px:** sticky compact bar under the global nav showing the current
  chapter name and `4 / 14`. Tapping opens a full-screen index sheet.

Built from real `<a href="#strains">` anchors, so it works with JavaScript
disabled and every section is deep-linkable. Active state comes from an
`IntersectionObserver`. Navigation is routed through the existing
`jumpTo()` in `bus.ts`, which already handles Lenis (native `scrollIntoView`
is ignored under Lenis smooth scroll).

### Back-compatibility

`/research?branch=umass-2026` has been shared. It must not 404 or land
somewhere confusing. Since UMass is now the page's default subject, the
parameter is accepted and ignored — the visitor lands at the top of the
Fusarium chapters, which is what the link promised.

---

## Sections

### Fusarium

**1. Hero.** Full viewport. Headline `We made the fungus glow.` with *glow*
set in mRFP crimson and a soft bloom. Meta line: Summer 2026 · Ma Lab ·
Biochemistry & Molecular Biology · UMass Amherst. Lede: the cross-kingdom
framing.

Behind it, the **brightfield** confocal panel — grey hyphae, no fluorescence.
The word *glow* is the only crimson on the screen.

**The hero does not show the glow.** An earlier draft opened with an iris
reveal that fluoresced the RFP merge in on scroll, then repeated the idea as
a drag wipe six sections later. That is the same trick twice, and it spends
the payoff before the page has earned it. Withholding fluorescence until "the
evidence" makes that section the first time a reader ever sees the fungus
light up.

The cost is findability — the strongest asset now sits six sections deep, and
findability is the whole reason for this redesign. Mitigation: the hero's
scroll cue names its destinations and **"the evidence" is a link**. Readers
who scroll get the build; readers who skim get the payoff in one click.

Ambient motion in the hero is limited to a slow drift on the field and the
pulsing live dot — atmosphere, not revelation.

**2. The question.** Why this organism: invasive keratitis in an eye, Panama
wilt in a banana, the same fungus crossing kingdoms; human clinical strains
evade the mammalian immune system more efficiently than plant strains. States
the problem the reporter solves.

**3. The strains.** Three cards from `FUS_STRAINS` — NRRL32931 (blood isolate,
leukemia patient), MRL8996 (keratitis isolate, and the strain that took), II5
(Panama wilt, plant comparison). MRL8996 carries a crimson state.

**4. The plasmid.** pCT74-mRFP (5774 bp) as an **interactive ring**, lifted
and upgraded from the existing `PlasmidRing` in `fusarium.tsx`. Hovering or
focusing a feature arc — mRFP, HygR, AmpR, ori, trpC promoter — surfaces its
note from `FUS_PLASMID.features`. A **"Linearize with Psp-OMI"** control
unrolls the ring into a straight map at the cut site, which is the reason the
enzyme is used at all. Reduced motion swaps instantly instead of animating.

**5. At the bench.** *(new section — the answer to "what did Jadon do?")*

The page's credibility section. Three things, all assembled from content that
already exists but is currently buried:

- **Techniques run.** `PROFILE.stack` already lists `miniprep · PCR ·
  protoplasting · confocal` alongside the R toolchain. Today this is visible
  only by typing `neofetch` into the terminal. It becomes a scannable
  inventory, sitting directly above the protocol that evidences each one.
- **Duration and cadence.** *"Six weeks at the bench, 9 to 4 every weekday,
  under a PhD mentor"* — currently buried inside a program card in `data.ts`.
  Six weeks of daily bench work reads very differently from a summer project.
- **The timeline.** `FUS_LOG` holds eleven dated entries from Jun 29 to
  Aug 04, reachable today only via `git log` in the console. It renders as a
  slim horizontal timeline.

**Science entries only.** `FUS_LOG` includes the ice-rink team bonding and the
Lab Olympics; those are real but they are not science, and the site's tone
rule keeps the summer "to the science." They stay off this page. Same for the
`umass-10.jpg` ice-rink photograph.

Also here: six Fusarium papers read, and NotebookLI built to get through them
— initiative, stated as fact rather than as reflection.

**5b. What went wrong.** *(new — needs Jadon's input, see Open Questions)*

The page currently reads as an unbroken success, which is the least believable
version of bench work. `FUS_LOG` hints at it — selection ran round 1 then
round 2 on PDA + Hygr at a raised concentration. One honest, specific setback
and how it was handled is the clearest signal on the page that this was real
lab work rather than a tour.

This must come from Jadon; it is not in `content.ts` and will not be invented.

**6. The protocol.** All four steps from `FUS_PROTOCOL` visible at once —
plasmid extraction, protoplast generation, PEG transformation, selection —
each with its bullets and the poster's own diagram (`umass-protoplast.jpg`,
`umass-transformation.jpg`). No stepper, no accordion.

**Each step gains a "why" line.** *(new content — needs verification, see
Open Questions)*

The steps currently state what was done and never why it was necessary. That
is the difference between running a protocol and understanding one, and it is
the highest-value content a scientific reader can find on this page. One line
per step, set apart from the procedure:

| Step | The reasoning |
|---|---|
| I · linearize with Psp-OMI | Circular plasmid has no free ends and does not replicate in *Fusarium*; linear DNA integrates into the genome. |
| II · protoplast | The chitin–glucan cell wall blocks DNA entry, so it is digested away — leaving an osmotically fragile cell, which is why everything downstream is buffered in 1.2 M KCl and STC. |
| III · PEG | PEG with Ca²⁺ destabilises the membrane and brings DNA into contact with it, allowing uptake. |
| IV · hygromycin | Transformation is rare and transformants are invisible. HygR rides the same plasmid as mRFP, so hygromycin kills everything that did not integrate the construct and the survivors are candidates. |

**None of this is in `content.ts` or on the poster.** It is standard molecular
biology and believed correct, but it is scientific reasoning being attributed
to Jadon on his own site, so it ships only after he confirms or rewrites it.
New constant: `FUS_WHY`, keyed by step id.

**7. The evidence.** The signature interaction: a **draggable wipe** across
Figure 2a, brightfield on one side and RFP merge on the other, over the same
field of hyphae. Strain chips switch between transformed 8996, the Fo47-RFP
positive control, and the NRRL32931 negative control — which genuinely stays
dark, so the control reads as a control.

Then Figure 1 (PCR products: Hygromycin 563 bp, RFP 372 bp) and Figure 2b
(gel confirmation against the 1 kb ladder) with their captions, then the four
`FUS_RESULTS` entries as prose.

**8. What's next.** The macrophage time-lapse frames (Schäfer et al. 2014) and
the direction they point: tracking real-time engulfment of mRFP-tagged
Fusarium by GFP macrophages under confocal imaging, and downstream hpRNA/siRNA
delivery into protoplasts.

**9. The poster & credits.** The full poster, click to enlarge. Authors as
printed. Mentors credited by name — Siyuan (Melanie) Wu, Will Truncer,
Dr. Li-Jun Ma. The three session photographs (`umass-02` bench, `umass-01`
poster session, `umass-11` poster day).

### Gout · RNA-seq

Accent shifts to lime/cyan. The question and hypothesis, the eight-step
pipeline from `PIPELINE`, the **interactive volcano plot** (existing
`VolcanoPlot.tsx`, restyled), DEG counts per tissue from `DEG_COUNTS`, the
nine pain mediators from `PAIN_MEDIATORS`, and ACSEF 3rd in Computational
Biology.

**Reframed.** An earlier draft justified this chapter's length by calling the
project "older and smaller." That is chronologically true and evidentially
wrong. The two projects prove different capabilities and a reader needs both:

- **UMass** — can operate inside a working research lab, on someone else's
  question, with someone else's techniques.
- **Gout** — can drive an analysis: a public dataset (GSE190138), a pipeline
  built and run in R, a hypothesis, and 3rd place as a first-time entrant.

It stays shorter, because the brief is to lead with UMass. But it is framed as
the dry-lab counterpart, not as juvenilia.

**Accuracy guard.** The landing copy says Jadon was *"trained in R by a
Stanford professor."* The honest claim is therefore *trained, then ran the
analysis independently* — not "self-taught." Do not overclaim here; the
understated version is both true and sufficient.

### The transition between chapters

One line where the accent changes, connecting them rather than merely
separating them: both projects are about **making an invisible thing
visible** — a pain signal that only appears in the transcriptome, a pathogen
that only appears once it is tagged. This is an editorial claim, so it needs
Jadon's sign-off, but it is what turns two adjacent projects into a
scientist with a through-line.

**Cut:** the heatmap and PCA views. At the size they render they are texture,
not evidence, and the volcano already carries the finding. Their data stays in
`content.ts`; only the page components go.

Target length: roughly one third of the Fusarium chapters.

### Olympiads and programs

**Olympiads** — USABO Honorable Mention, UK Biology Olympiad Silver, ACSEF
3rd, as three single lines with result and year, linking to `/achievements`.

These are currently stated in **three** places: `ACHIEVEMENTS` in `data.ts`,
`RESEARCH.olympiads` in `data.ts`, and `AWARDS` in `content.ts`, each with
its own prose. Per the site's no-repeating-facts rule, the expanded detail
lives once — in the trophy case — and this page acknowledges the result and
links.

**Programs** — Youth STEM Journal Club, PRISM, MSJ STEM-PAC as compact cards
from `PROGRAMS`. STEM-PAC is likewise narrated in three places in `data.ts`;
this page carries the short form.

---

## The console

The terminal survives as an **optional power mode**, opened with `` ` `` or a
small `>_` control in the page corner.

Its job changes from **delivering** content to **navigating** it. `open
plasmid` smooth-scrolls the page to that section and closes the overlay. `ls`
lists chapters. `git log` prints `FUS_LOG`. `whoami`, `neofetch`, `cite`,
`mutate`, `help`, and the Konami easter egg survive unchanged.

This removes the architecture's central duplication: today every view exists
twice, once as a terminal renderer and once as page-shaped data. `ResearchIDE`
drops from 1448 lines to roughly 300 — a parser, a history buffer, a renderer,
and a command table that mostly calls `jumpTo()`.

Commands that used to render large views (`volcano`, `poster`, `protocol`,
`plasmid`, `results`, `strains`, `awards`, `programs`) become navigation.
Commands with no on-page equivalent (`neofetch`, `whoami`, `git log`, `cite`)
still print.

The overlay needs `data-lenis-prevent` — Lenis swallows wheel and touch events
in inner scrollers.

---

## Components

```
src/app/research/page.tsx              rewritten — server component,
                                       <World id="research"> + sections + <Footer/>

src/components/research/
  ResearchNav.tsx                      NEW — rail, progress, mobile index sheet
  Console.tsx                          NEW — the ` overlay (absorbs term.tsx)
  sections/
    Hero.tsx                           NEW — iris reveal
    Question.tsx                       NEW
    Strains.tsx                        NEW
    Plasmid.tsx                        NEW — wraps PlasmidRing
    AtTheBench.tsx                     NEW — techniques, cadence, timeline,
                                       the setback
    Protocol.tsx                       NEW — steps + the FUS_WHY layer
    Evidence.tsx                       NEW — wraps ConfocalWipe
    WhatsNext.tsx                      NEW
    Poster.tsx                         NEW
    GoutChapter.tsx                    NEW — renders 4 anchored sub-sections
                                       (question, pipeline, volcano, mediators);
                                       wraps VolcanoPlot
    Beyond.tsx                         NEW — renders 2 anchored sub-sections
                                       (olympiads, programs)
  viz/
    ConfocalWipe.tsx                   NEW — the signature interaction
    PlasmidRing.tsx                    LIFTED from lab/fusarium.tsx, upgraded
    VolcanoPlot.tsx                    MOVED from research/, restyled
  lab/
    content.ts                         KEPT — source of truth, facts unchanged
    bus.ts                             KEPT — jumpTo/toast/mutate already correct
    LabEasterEggs.tsx                  KEPT
    ResearchIDE.tsx                    DELETED — replaced by Console + sections
    term.tsx                           DELETED — folded into Console
    fusarium.tsx                       DELETED — viz lifted, rest redistributed
```

Each section is its own file with one job, per the repo's existing per-world
component convention (see `components/leadership/`).

The deletions and the `VolcanoPlot` move are safe: `src/app/research/page.tsx`
is the only file outside `components/research/` that imports any of them, and
it is rewritten here. Verified by grep across `src/`.

## Assets

The nine confocal panels are currently one 828×643 composite
(`umass-confocal.jpg`) containing a 3×3 grid plus a label column. The wipe and
the strain chips need them individually.

Crop at build-prep time into `public/img/confocal/{neg,fo47,t8996}-{bf,rfp,merge}.jpg`
— nine files, roughly 700px wide each. Panel boundaries in the source, verified:
columns at x = 170–385 (brightfield), 385–590 (RFP), 590–815 (merge); rows at
y = 22–226 (NRRL32931), 230–428 (Fo47-RFP), 436–640 (transformed 8996).

Sharper and smaller than CSS-cropping one image nine ways. All other images
already exist in `public/img/`.

`next.config.ts` sets `images.unoptimized` for static export, so these ship
through the existing `Photo` primitive as plain `<img>` with `asset()`
base-path handling.

## Accessibility

- **The wipe** is a real `role="slider"` with `aria-valuenow`: arrow keys move
  it ±2%, Home and End jump to the ends, and pointer events cover mouse, touch
  and pen. It has a visible focus ring.
- **Reduced motion** — the hero iris starts open, the plasmid linearizes
  instantly, the pulse on the live dot stops. Global CSS already zeroes
  animation durations; per-component checks handle the rest.
- **The rail** is anchor links, so it functions with JavaScript disabled.
- **The console** is `aria-modal` with a focus trap and Escape to close, and it
  is never the only route to any content.
- Every figure carries the alt text already written in `FUS_IMAGES`.

## Risks

- **`content.ts` fact drift.** The redesign must not restate a single number.
  Every figure caption, band size, concentration, and temperature comes from
  the existing constants. Nothing is retyped into JSX.
- **Lenis interactions.** Both the drag wipe and the console sit inside a
  Lenis-controlled scroll context; both need `data-lenis-prevent` or pointer
  capture so dragging does not scroll the page.
- **Lint baseline.** Roughly 17 untouched files carry pre-existing
  `react-hooks` and `set-state-in-effect` errors, and `next build` does not run
  lint. Only newly written files get linted.
- **Stale dev server.** Rebuilding `.next` while `next start` holds the port
  serves stale CSS chunk hashes and 500s. Kill by port before rebuilding.

## Success criteria

**Comprehension — does the page do its job?** These matter more than the
mechanical ones and were missing from the first draft, which tested only
whether the page scrolled and built.

1. A reader who scrolls without clicking can state **what Jadon personally
   did** — which techniques he ran, for how long, and what he decided.
2. A reader can state **why** each protocol step was necessary, not only what
   it was.
3. A reader understands the two projects prove **different** things: bench
   competence inside a real lab, and independent analysis.
4. The page shows at least one honest setback, so the work reads as real.

**Mechanical**

5. A visitor who scrolls and clicks nothing sees the entire Fusarium project.
6. Any section is reachable in at most two clicks from any scroll position.
7. `/research?branch=umass-2026` still lands somewhere sensible.
8. No research fact appears that is not in `content.ts`, `data.ts`, or the
   new `FUS_WHY` / setback content Jadon has signed off on.
9. The wipe is operable by keyboard and by touch.
10. `next build` passes; new files lint clean.

## Open questions — blocking before ship, not before build

These three additions are the ones that carry the most weight for a
scientific reader, and all three are content that does not exist yet. Every
other part of the redesign can be built while they are resolved; the page
should not ship without them.

1. **The "why" lines.** The table in the protocol section is a best-effort
   draft of standard molecular biology. Jadon confirms, corrects, or rewrites
   each one.
2. **Why RFP rather than GFP?** Deliberately *not* drafted. The obvious
   inference — a red reporter keeps the fungus in a separate channel from
   GFP-tagged macrophages — is contradicted by the poster's own future-work
   figure, which labels the reference images *macrophages red, Fusarium
   green* (Schäfer et al. 2014). That is the reference paper's scheme, not
   necessarily the Ma Lab's rationale. Only Jadon knows the real reason.
3. **The setback.** One specific thing that failed and what was done about it.

## Rejected during design review

- **Iris reveal in the hero** — repeated the drag wipe and spent the payoff
  early. Replaced with a brightfield hero.
- **Full 13-item rail** — too much permanent chrome. Replaced with
  collapsing groups.
- **"Beyond" as a group label** — named nothing.
- **The heatmap and PCA components** — cut, but the QC reasoning they
  represented survives as pipeline step 02, which already reads
  `boxplots (raw + cpm) · BCV · PCA`. The claim to methodological rigour is
  made in text rather than through three weak charts.
- **The ice-rink and Lab Olympics entries** — real, but not science; the
  site's tone rule keeps the summer to the science.
