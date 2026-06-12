# Contact Sheet Navigation — Design

**Date:** 2026-06-11
**Status:** Shipped, then revised same-day per user feedback (v2 below)
**Replaces:** the Nav fullscreen text-list overlay and the Footer "Next chapter" hand-off.

> **v2 revision (user-directed, 06/11/2026):** the seven separate tall frames became **one continuous horizontal film roll** (perforation rows top/bottom, amber rebate edge-markings `FR 0N · word` under each frame); frames now match each photo's **native aspect ratio** so nothing is cropped (`ASPECT` map in `ContactSheet.tsx`); **hovering a frame crossfades the still to a real screenshot of the destination page** (`public/img/previews/<id>.jpg`, captured headless at 1280×800); clicking originally zoomed that preview to fullscreen, but **v3/v4 same-day revisions replaced this**: the roll became a full-bleed slim strip (all 7 frames fit the viewport at once, no sideways scrolling; hover morphs the frame to the preview's 16:10 aspect; grease-pencil circle dropped for an amber "● here" rebate tag), and the zoom gave way to **per-world signature transitions** in `Develop.tsx` — civic camera flash, court basketball + orange wipe, leadership gold banner + 3× seal, research terminal scanline (CRT-off exit), built tile mosaic, locked-in REC viewfinder, about dawn sweep. Each covers the screen by ~450ms (navigation at 520ms), exits over the new page per `EXIT_MS`, falls back to a plain fade under reduced motion. The `develop:start` event detail is `{world}`; the sessionStorage refresh flag was removed. Previews must be re-captured when page heroes change.

## Goal

One click from any page to any other page, through a navigation experience that is itself part of the site's story. The metaphor: a photographer's **film roll in a darkroom** — every page of the site is a frame on a developed roll of film; hovering a frame shows the page it leads to, and entering is the camera *zooming into the frame*. Leans into the "documents all of it" / @li_locked.in identity.

## What is removed

1. **`Footer.tsx` "Next chapter" block** — the `next` world computation and the big `Link` at the top of the footer are deleted on all pages. The footer keeps the name/school block, contact links, and copyright. The `current` prop is removed from `Footer` and from all call sites (`civic`, `court`, `leadership`, `locked-in`, `built`, `about`, `achievements` pages). Rationale: its `WORLDS`-order cycling no longer matches the door structure and reads as inaccurate.
2. **The current Nav overlay** (text list of doors + bottom utility links inside `Nav.tsx`). The fixed header — JADON LI wordmark + top-right trigger button with `mix-blend-difference` — stays.

## The overlay: darkroom contact sheet

New component `src/components/chrome/ContactSheet.tsx`, rendered by `Nav.tsx` in place of the old overlay (same `AnimatePresence` open/close pattern, same body scroll-lock + Esc-to-close + close-on-route-change behavior).

### Layout

- **Backdrop**: near-black (`#070709`) with a dim red safelight glow from the top edge and the site grain. Open animation: backdrop fades/deepens, strip slides in horizontally (motion/react, the site's `EASE`).
- **Main roll**: 7 tall film frames in a horizontal strip — one per `SENTENCE_DOORS` entry, in `num` order. Each frame:
  - sprocket holes both edges, frame number `FR 01`–`FR 07`
  - the door's `photo` as the negative image
  - label: `kicker` (e.g. THE COMPETITOR) + `word`; accent underline in the door's `accent`
  - hover ("loupe"): frame scales up (~1.06–1.1), world-accent edge glow, `peek` stat line fades in beneath
- **Current-page marker**: the frame for the page you're on gets a **red grease-pencil circle** (hand-drawn SVG ellipse, slightly rough stroke, `#c43e2c`) — the photographer's mark for a chosen frame. On the landing page no frame is circled.
- **Utility strip**: below the roll, a row of small cut single negatives: HOME · TROPHY CASE (`/achievements`) · ALBUMS · CONTACT, plus the Instagram handle as an external link. Smaller frames, same film language.
- **Caption line**: small mono caption above the roll ("ONE YEAR · SEVEN ROLLS" or similar), consistent with site eyebrows.

### Interaction

- **Desktop**: all 7 frames fit in the viewport; wheel/drag gives a gentle scrub/parallax nudge. Keyboard: ←/→ move a focus loupe, Enter navigates, Esc closes. Frames are real `next/link` anchors (focus-visible styles included).
- **Mobile**: horizontal swipe strip with scroll-snap per frame; utility strip wraps below. **The inner scroller carries `data-lenis-prevent`** (Lenis swallows native wheel/touch otherwise — known site gotcha).
- **Z-order**: the sheet sits at `z-[45]` — above `DeepDiveBar` (z-40, later in DOM so equal z loses) but **under the z-50 nav header so the Close trigger stays clickable**. Only the `Develop` transition overlay uses `z-[60]` (above the header, **below the custom Cursor layer at z-[70]**; anything above z-70 makes the hidden-native-cursor site appear cursorless — known constraint).
- All image paths go through the `BASE`/asset helper (GitHub Pages base path).

## The develop transition

The signature moment, bridged across a hard navigation (static export) with `sessionStorage`.

### Sequence

1. **Click a frame**: the frame's photo expands to fill the viewport (motion scale/position animation) under a **safelight-red wash**; `sessionStorage.setItem("develop", JSON.stringify({ world, photo, t: Date.now() }))`; then real navigation occurs.
2. **Arrival**: new component `src/components/chrome/Develop.tsx`, mounted once in `layout.tsx`. On mount it reads the flag (and clears it). If present and fresh (< ~5s old), it renders the same photo fullscreen, already red-washed — masking the page load — then plays the **Developer Bath** on it: blank-paper ghost → B&W emerges → sharpens → saturates to full colour (~1.4s, CSS filter keyframes), then the print lifts away (safelight-lift exit) revealing the destination page beneath.
3. **Direct load / refresh** (no flag): a shorter, subtler develop pass (quick grayscale→colour fade over the viewport, ~0.6s) so the language stays consistent without being a toll.
4. **Reduced motion** (`prefers-reduced-motion`): plain opacity fade, no filter animation.
5. **Failsafe**: the overlay unconditionally removes itself after a max timeout (~2s) even if the image errors or stalls — navigation can never be trapped behind it. Stale flags (> 5s) are ignored and cleared.

### Phase 2 (after core nav ships)

In-page "develops": photos in the `Photo` primitive get a one-time grayscale→colour develop when they first enter the viewport on world pages (CSS filter transition + IntersectionObserver). Honors the "scrolling into it" half of the request; isolated change, shipped separately.

## Data

Frame data is derived from `SENTENCE_DOORS` (photo, accent, kicker, word, peek, href, num — all already present). Utility pages defined as a small const in `ContactSheet.tsx` (or `data.ts` if reused): Home, Trophy Case, Albums, Contact. No new fields required in `data.ts` unless a door's photo needs a swap for legibility at film-frame aspect.

## Files

| File | Change |
| --- | --- |
| `src/components/chrome/ContactSheet.tsx` | new — darkroom overlay, frames, utility strip |
| `src/components/chrome/Develop.tsx` | new — arrival develop overlay |
| `src/components/chrome/Nav.tsx` | keep header/trigger; render `ContactSheet`; drop old overlay JSX |
| `src/components/chrome/Footer.tsx` | delete next-chapter block + `current` prop |
| `src/app/layout.tsx` | mount `Develop` |
| `src/app/{civic,court,leadership,locked-in,built,about,achievements}/page.tsx` | drop `current` prop from `<Footer>` |

All new components are `"use client"` and static-export safe. No new dependencies (motion/react, lucide already present).

## Error handling

- Image load failure in a frame → frame renders with accent-tinted placeholder + label (navigation still works).
- `sessionStorage` unavailable (private mode edge cases) → transition degrades to normal navigation; `Develop` plays the subtle direct-load variant.
- Develop overlay timeout failsafe as above.

## Testing

- `next build` passes (TS strict, static export).
- Headless QA (gstack browse; no WebGL involved): open/close the sheet; all 11 destinations navigate; grease-pencil circle appears on the correct frame per page; wheel scroll works inside the strip (`data-lenis-prevent` verified via cancelable-wheel check); Esc and route change close the overlay; sessionStorage flag set on click and consumed on arrival; failsafe timeout removes the overlay; reduced-motion variant via emulated media; mobile viewport swipe/snap; cursor remains visible over the overlay (z-order).
