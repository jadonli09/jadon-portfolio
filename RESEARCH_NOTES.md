# RESEARCH NOTES — Jadon Li Portfolio

## Source-of-truth audit (both reference files read in full)

- **SpringLight student profile (PDF, 10 pages)** — narrative profile: classes & AP scores, test scores, awards, civic work, research, builds, leadership, athletics, jobs, reading list, meeting notes.
- **List of Achievements (XLSX, 8 sheets)** — `ALL` master (130 rows) + per-year ledgers (Pre-HS, Freshman 23-24, Summer 24, Sophomore 24-25, Summer 25, Junior 25-26, Summer 26). The **Relevancy column was ignored** as instructed; editorial weighting is my own.

Every number on the site traces to these two files. Nothing invented or inflated. Key verified facts encoded in `src/lib/data.ts`:
SAT 1530 (EBRW 740 / Math 790), PSAT 1490, ACT 29 (8th grade), six AP 5s (Chinese, Bio, Macro, World, Stats, CSA); USABO Honorable Mention (26, cutoff 28); UK Bio Olympiad Silver (top 10%); ACSEF 3rd Computational Biology (gout RNA-seq); NCS Champions 2026 (first in school & district history); Car Meet ($35M+, 60+ cars, $3.5M Pagani, ~200 attendees, 50+ volunteers, 32k families emailed); Winter Ball 350; AcornPrep 500+ users / 13,000 MCQs / 10 APs / #1 Google / 4 AP-teacher endorsements; @li_locked.in 1,400+ followers / 500k+ views; Mayor videos ~1k→10k; Mission Peak birthday climbs (59:58 → 49:46 → 59:18 → 47:33 PR → 54:00 sunrise/filmed).

## Editorial architecture (my call, not the spreadsheet's)

Six navigable **worlds**, each its own art direction, plus an Achievements trophy case, Contact, and a cinematic Landing. The connective tissue is **craft** (type discipline, motion, transitions, grid), NOT a shared palette — each page is its own internally-cohesive colour world.

| World | Art direction | Signature |
|-------|---------------|-----------|
| Landing | cinematic void, ember/gold | WebGL particle field + preloader + world index |
| About | warm paper, quiet editorial | interactive Mission Peak birthday-climb chart |
| Civic | newsprint cream, press red, documentary | broadsheet masthead, lead feature, counters |
| Research | deep lab navy, signal teal / magenta | stylized RNA-seq **volcano plot** (SVG, interactive) |
| Built | dark slate, periwinkle / lime, product launch | live-site **screenshot device mockups** + GitHub API |
| Leadership | asphalt black, champagne gold, event poster | hand-drawn supercar SVG, dramatic counters, parallax |
| Court | black + electric orange, sports magazine | NCS Champions cover, ticker tape, kinetic timeline |
| Achievements | trophy gold vault | filterable trophy case + AP-5 medallions |
| Contact | cinematic void (bookends landing) | cursor spotlight, copy-to-clipboard, mailto composer |

## Design references studied (per-page direction)

Award-site patterns referenced from memory of Awwwards / Godly / Dribbble winners (the live Playwright/Dribbble browsing tool was not connected this session — see Pivots): editorial broadsheet civic kits; scientific journal-figure dashboards (volcano plots); Linear/Vercel-grade product launch pages with device mockups; luxury automotive show posters (champagne-on-asphalt); SLAM-style kinetic sports covers; quiet photographer-portfolio negative space for About.

## Technical decisions

- **Stack:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript (strict, no `any`) + Tailwind v4 (CSS `@theme`, per-world `[data-world]` variable scopes).
- **Motion toolkit:** `motion` (Framer Motion for React 19), GSAP available, **Lenis** smooth scroll (`lenis/react`, disabled under reduced-motion), **React Three Fiber + drei** for the WebGL hero (custom GLSL points shader), Embla available, `lucide-react` icons.
- **SSR/hydration gotchas handled:** WebGL hero is `dynamic(..., { ssr:false })` and code-split so it never blocks first paint; a CSS gradient fallback sits beneath the canvas so a failed WebGL context still yields atmosphere (verified — sandboxed QA browser couldn't create a GL context and the hero still looked complete). Per-world theming uses an SSR-safe wrapper (`<World>`) that carries the CSS variables itself, avoiding a flash of default theme.
- **Embeds:** acornprep.com / cuesheet.xyz / youthstemjournal.org all send `X-Frame-Options`, so live iframes are unreliable. Pattern chosen: **real screenshots captured of each live site, shown inside a browser-chrome device mockup** with a hover "Visit live ↗" CTA. (`LiveEmbed` keeps an iframe+timeout fallback path for any future embeddable URL with no screenshot.)
- **GitHub showcase:** client-side fetch of the public GitHub API for `jadonli09` (profile + recent repos) with loading skeleton and a graceful fallback card if rate-limited. Features the profile (real repos render when the API responds).
- **Reduced motion:** global CSS kills animation/transition durations; Lenis off; counters & spotlight check `prefers-reduced-motion`; reveals resolve to their visible state.

## Reference sites captured (Playwright pivot → gstack browser)

Screenshots of all three live sites captured at 1440×900, clipped to the hero viewport, compressed to JPG (110–196 KB) → `public/embeds/`.
- acornprep.com — "The fastest way to a 5." acorn-mascot hero, AP courses.
- cuesheet.xyz — music-supervision app (album-art grid).
- youthstemjournal.org — Astro journal site.
