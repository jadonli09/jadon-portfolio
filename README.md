# Jadon Li — Five Worlds

A glamorous, multi-page personal portfolio. Each page is its own visually distinct
"world" (Civic, Research, Built, Leadership, The Court, About) anchored by a cinematic
WebGL landing and capped by an embeds-rich projects page and a designed contact close.
The connective tissue is craft — typography, motion, transitions — not a shared palette.

## Stack
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind v4** with per-world `[data-world]` CSS-variable theming
- **motion** (Framer Motion) · **GSAP** · **Lenis** smooth scroll · **React Three Fiber / three** (WebGL hero) · **Embla** · **lucide-react**

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
```
Production:
```bash
npm run build
npm run start
```

## Structure
```
src/
  app/                 # routes: / about civic research built leadership court achievements contact, not-found, opengraph-image
  components/
    chrome/            # Nav, Cursor, Footer, Grain, World (per-page theme wrapper)
    providers/         # SmoothScroll (Lenis)
    primitives/        # Reveal, KineticHeadline, Counter, Marquee, Magnetic, TiltCard, BrandIcons
    hero/              # WebGL particle hero (code-split) + preloader
    landing/ about/ civic/ research/ built/ leadership/ court/ achievements/ contact/
  lib/
    data.ts            # single source of truth (all real content)
    motion.ts  cn.ts
public/embeds/         # captured live-site screenshots for the project mockups
```

## Content & truth
Every stat comes from the two reference documents (SpringLight profile + achievements
ledger). Nothing is invented. See `RESEARCH_NOTES.md` and `BUILD_LOG.md`.

## Notes / limitations
- The Ugreen NAS media source was not reachable this session, so media uses tasteful
  abstract/SVG/CSS visuals plus real captured screenshots of the live project sites.
  Every media slot is built to accept real NAS footage/photos later (drop files into
  `public/` and reference them).
- Project embeds use screenshots inside device mockups because the live sites send
  `X-Frame-Options`; each has a "Visit live" link to the real site.
- Custom domain ready: no hardcoded absolute URLs (set `metadataBase` in `layout.tsx`).
