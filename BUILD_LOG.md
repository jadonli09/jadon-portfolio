# BUILD LOG — Jadon Li Portfolio

## Phase 1: Research & Discovery
- Read both reference files in full (PDF profile + XLSX ledger, 8 sheets). Confirmed every stat against source; ignored the Relevancy column per instructions.
- Tool reality check: **Magic MCP** available, **Vercel MCP** available. **Playwright MCP not connected** → pivoted to the gstack headless-browser tool for screenshots + QA. **Ugreen NAS MCP not connected** (only the server source folder was present, no live tool, no resources) → pivoted to tasteful abstract/SVG/CSS visuals + captured live-site screenshots; **NAS never written to (it was never reachable).**
- Locked editorial architecture (six worlds + achievements + contact + landing) and per-page art directions. Wrote `RESEARCH_NOTES.md`.

## Phase 2: Foundation & Architecture
- Scaffolded Next.js 16 + React 19 + TS + Tailwind v4 (`create-next-app`). Installed motion / gsap / lenis / three / @react-three/fiber / drei / embla / lucide / clsx / tailwind-merge (clean install under React 19).
- Built the design system: `globals.css` with `[data-world]` colour scopes (each page its own world), shared type scale, grain overlay, reduced-motion handling. Distinctive fonts: Fraunces (display), Archivo (grotesk), Instrument Serif (italic), JetBrains Mono, Anton (condensed) — no Inter, no default system fonts.
- Typed single source of truth: `src/lib/data.ts`.
- Shared shell: root layout, Lenis `SmoothScroll`, magnetic custom `Cursor` (blend-difference, pointer-fine + reduced-motion aware), full-screen world `Nav` (clip-path reveal), `template.tsx` page transitions, designed `Footer` (next-world handoff), grain.
- Primitives: `Reveal`/`RevealGroup`, `KineticHeadline` (masked word reveal), `Counter`, `Marquee`, `Magnetic`, `TiltCard`, `BrandIcons`, `World` wrapper.
- Decision: fixed a stray parent `package-lock.json` confusing Turbopack root → pinned `turbopack.root` in `next.config.ts`.

## Phase 3: Landing + About
- Landing: WebGL particle-field hero (custom GLSL points shader, code-split `ssr:false`, CSS gradient fallback), counted preloader, rotating multi-hyphenate identity, interactive world index, stat marquee. Verified the hero degrades gracefully when WebGL is unavailable.
- About: editorial paper world; signature **interactive Mission Peak** birthday-climb chart (hover/select years, PR highlighted, sunrise-climb note); "off the record" threads; pursuit-of-happiness close.

## Phase 4–6: The remaining worlds (built in parallel via subagents, each isolated to its own files)
- **Civic** — broadsheet masthead, animated metric counters, lead feature (Sweet Tomatoes viral origin) with drop-cap + video frame, story grid, FYAC commission red band, SBAI op-ed, awards ticker.
- **Research** — interactive SVG volcano-plot motif (deterministic points, hover tooltips), RNA-seq pipeline flow, restrained awards (USABO 26/cutoff 28), programs grid.
- **Built** — AcornPrep flagship device mockup, products grid, GitHub showcase (live API + fallback), creed close.
- **Leadership** — poster headline, Car Meet showpiece (hand-drawn supercar SVG, scroll parallax, dramatic counters, $3.5M Pagani callout), Winter Ball, events accordion, gold tickers.
- **Court** — NCS Champions magazine cover, background ticker, kinetic timeline, DouYin 500k viral card, orange stat banner.
- **Achievements** — score board (SAT 1530 counter, six AP-5 medallions), filterable trophy case with animated re-flow, origins strip.
- **Contact** — cursor spotlight, magnetic channel rows, copy-to-clipboard email, no-backend mailto composer; designed `404`.

## Phase 7: Testing & Debugging (gstack headless browser)
- First central build surfaced & fixed: **lucide v1.17 dropped brand icons** (Instagram/LinkedIn/GitHub) → added inline `BrandIcons`; `as const` narrowing on Mission Peak climbs → extracted a typed `Climb[]`.
- QA sweep at 375 / 768 / 1440 across all 10 routes: zero non-environmental console errors. Civic mobile horizontal overflow (marquee bleed) → fixed with `overflow-x: clip` on root.
- Embeds: live iframes blocked by `X-Frame-Options` (expected) → replaced with captured real screenshots inside device mockups + "Visit live" CTA; eliminated the blank-iframe void. GitHub showcase renders real repos.
- Verified animated counters fire on real scroll ($35M+, 350, ~200, etc.); the zeros seen in full-page screenshots are pre-trigger artifacts of `whileInView` (IntersectionObserver doesn't fire off-viewport during a static capture), not a runtime bug — confirmed content reveals correctly when scrolled.
- **Operational learning:** rebuilding `.next` while `next start` held the port left a stale CSS-chunk hash (500 on the stylesheet). Fix: always `kill (by port) → build → start`.

## Phase 8: Polish & Deploy
- Added `icon.svg` monogram favicon, dynamic `opengraph-image` (next/og), metadata/SEO.
- Final media optimization (embeds 110–196 KB JPG). Deploy to Vercel.
