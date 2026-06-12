# Contact Sheet Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Nav text-list overlay with a darkroom "contact sheet" (7 film frames + utility negatives, one click to all 11 pages), add a photo-"develop" page transition, and remove the inaccurate Footer "Next chapter" hand-off.

**Architecture:** Two new client components. `ContactSheet` renders inside the existing `Nav` open/close shell at `z-40` (under the `z-50` header so the Close trigger stays clickable). `Develop` is mounted once in the root layout at `z-[60]` (above nav, **below the custom Cursor at `z-[70]`** — anything higher hides the cursor) and runs a small stage machine: a `develop:start` window event covers the screen on click, the `usePathname()` change triggers the developer-bath animation, and a `sessionStorage` flag covers hard-refresh edge cases. Spec: `docs/superpowers/specs/2026-06-11-contact-sheet-nav-design.md`.

**Tech Stack:** Next.js 16 App Router (`output: "export"`, client-side `next/link` routing), React 19, TS strict, Tailwind v4, motion/react, Lenis (inner scrollers need `data-lenis-prevent`). No test framework exists in this repo — each task verifies via `npm run build` (TS strict + static export) and headless browser QA with the gstack browse skill. All asset paths must go through `asset()` from `@/lib/base` (GitHub Pages base path).

---

### Task 1: Remove the Footer "Next chapter" hand-off

**Files:**
- Modify: `src/components/chrome/Footer.tsx`
- Modify: `src/app/{civic,court,leadership,locked-in,built,about,achievements}/page.tsx` (the 7 `<Footer current="…" />` call sites)

- [ ] **Step 1: Rewrite `Footer.tsx` without the next-world block**

Replace the entire file with:

```tsx
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/lib/data";
import { Magnetic } from "@/components/primitives/Magnetic";

/** Designed page close: name block + contact links — never a blank white footer. */
export function Footer() {
  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--bg-2)] px-5 py-16 md:px-9 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-2xl">{PROFILE.name}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              {PROFILE.school} · {PROFILE.city}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
            {[
              { label: "Instagram", href: PROFILE.links.instagram },
              { label: "LinkedIn", href: PROFILE.links.linkedin },
              { label: "GitHub", href: PROFILE.links.github },
              { label: "Email", href: `mailto:${PROFILE.email}` },
            ].map((l) => (
              <Magnetic key={l.label} strength={0.3}>
                <a href={l.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-[var(--muted)] transition-colors hover:text-[var(--fg)]">
                  {l.label}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
        <p className="mt-10 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
          © {new Date().getFullYear()} Jadon Li — one person, locked in
        </p>
      </div>
    </footer>
  );
}
```

Note what's gone: the `current` prop, the `WORLDS`/`WorldId`/`ArrowRight`/`Link` imports, the next-world `Link` block, and the conditional `marginTop`/`borderTopWidth` style on the contact row.

- [ ] **Step 2: Update all call sites**

```bash
cd "/Users/jadonli/Downloads/Jadon Li/jadon" && grep -rl 'Footer current=' src/app | xargs perl -pi -e 's/<Footer current="[a-z-]+" \/>/<Footer \/>/'
```

Then verify nothing remains: `grep -rn 'Footer current=' src/app` — expected: no output.

- [ ] **Step 3: Build to verify**

Run: `cd "/Users/jadonli/Downloads/Jadon Li/jadon" && npm run build`
Expected: build succeeds. (If it fails on a concurrent session's mid-flight file deletion — known repo gotcha — retry once.)

- [ ] **Step 4: Commit**

```bash
git add src/components/chrome/Footer.tsx src/app && git commit -m "feat(nav): remove inaccurate Next-chapter footer hand-off"
```

---

### Task 2: ContactSheet component

**Files:**
- Create: `src/components/chrome/ContactSheet.tsx`

- [ ] **Step 1: Create `ContactSheet.tsx`**

```tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PROFILE, SENTENCE_DOORS } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

type Door = (typeof SENTENCE_DOORS)[keyof typeof SENTENCE_DOORS];

/** Insertion order is num order: 01 leads … 07 person. */
const FRAMES: Door[] = Object.values(SENTENCE_DOORS);

const UTILITY = [
  { label: "Home", href: "/" },
  { label: "Trophy Case", href: "/achievements" },
  { label: "Albums", href: "/albums" },
  { label: "Contact", href: "/contact" },
] as const;

/** Photographer's red grease-pencil circle marking the frame you're on. */
function GreasePencil() {
  return (
    <svg viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute -inset-3 z-10">
      <path
        d="M50 6 C 82 4 96 38 94 80 C 92 124 78 154 48 155 C 20 156 5 122 6 78 C 7 36 22 8 50 6 Z"
        fill="none"
        stroke="#c43e2c"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.9"
        style={{ transform: "rotate(-2.5deg)", transformOrigin: "50% 50%" }}
      />
    </svg>
  );
}

function FilmFrame({
  door,
  index,
  isCurrent,
  onNavigate,
}: {
  door: Door;
  index: number;
  isCurrent: boolean;
  onNavigate: (e: React.MouseEvent, door: Door) => void;
}) {
  return (
    <Link
      href={door.href}
      data-cursor-hover
      onClick={(e) => onNavigate(e, door)}
      aria-current={isCurrent ? "page" : undefined}
      className="group relative shrink-0 snap-center outline-none"
    >
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 + index * 0.06, duration: 0.7, ease: EASE }}
        whileHover={{ scale: 1.06, y: -10 }}
        className="relative h-[46vh] w-[62vw] overflow-hidden rounded-[4px] bg-[#14141b] shadow-[0_18px_50px_rgba(0,0,0,0.6)] md:h-[52vh] md:w-[clamp(150px,12vw,220px)]"
      >
        {/* sprocket holes */}
        <div className="absolute inset-y-0 left-1 w-2 [background:repeating-linear-gradient(#070709_0_8px,transparent_8px_18px)]" />
        <div className="absolute inset-y-0 right-1 w-2 [background:repeating-linear-gradient(#070709_0_8px,transparent_8px_18px)]" />
        <span className="absolute left-4 top-2 font-mono text-[0.55rem] tracking-[0.2em] text-[#8a8a99]">FR {door.num}</span>
        {/* negative — accent-tinted underlay doubles as the image-error fallback */}
        <div
          className="absolute inset-x-4 bottom-12 top-7 overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${door.accent}33, #1a1a22)` }}
        >
          <img
            src={asset(door.photo)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover contrast-[1.05] saturate-[0.92] transition-[filter] duration-300 group-hover:saturate-100"
          />
        </div>
        {/* label */}
        <div className="absolute inset-x-4 bottom-2.5">
          <p className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-[#8a8a99]">{door.kicker}</p>
          <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#f4f1ea]" style={{ textDecorationColor: door.accent }}>
            {door.word}
          </p>
        </div>
        {/* accent edge glow on hover / keyboard focus */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[4px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1.5px ${door.accent}, 0 0 28px -6px ${door.accent}` }}
        />
        {isCurrent && <GreasePencil />}
      </motion.div>
      {/* peek stat under the loupe */}
      <span className="pointer-events-none absolute -bottom-6 left-1/2 w-max max-w-[110%] -translate-x-1/2 truncate font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#8a8a99] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {door.peek}
      </span>
    </Link>
  );
}

export function ContactSheet({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const stripRef = useRef<HTMLDivElement>(null);

  /** Hand off to the Develop overlay, then navigate once the cover has settled. */
  const onNavigate = (e: React.MouseEvent, door: Door) => {
    e.preventDefault();
    if (pathname === door.href) return onClose();
    try {
      sessionStorage.setItem("develop", JSON.stringify({ photo: door.photo, accent: door.accent, t: Date.now() }));
    } catch {
      /* private mode etc. — transition degrades to plain navigation */
    }
    window.dispatchEvent(new CustomEvent("develop:start", { detail: { photo: door.photo, accent: door.accent } }));
    window.setTimeout(() => router.push(door.href), 480);
  };

  /** ←/→ move focus along the roll; Enter on a focused frame navigates (native link). */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const links = Array.from(stripRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    if (!links.length) return;
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = links[(i + (e.key === "ArrowRight" ? 1 : -1) + links.length) % links.length];
    next.focus();
    next.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation — contact sheet"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-40 flex flex-col bg-[#070709] text-[#f4f1ea]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="grain" />
      {/* safelight glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,62,44,0.3),transparent_70%)]" />

      <p className="pt-24 text-center font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#8a8a99]">
        One year · seven rolls — pick a frame
      </p>

      {/* the roll — native horizontal scroller; Lenis must ignore it */}
      <div
        ref={stripRef}
        data-lenis-prevent
        onWheel={(e) => {
          if (stripRef.current) stripRef.current.scrollLeft += e.deltaY;
        }}
        className="flex flex-1 snap-x snap-mandatory items-center overflow-x-auto overflow-y-hidden"
      >
        <div className="mx-auto flex w-max items-center gap-5 px-6 pb-7 md:gap-6">
          {FRAMES.map((door, i) => (
            <FilmFrame key={door.id} door={door} index={i} isCurrent={pathname === door.href} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* utility strip — cut single negatives */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex flex-wrap items-center justify-center gap-2.5 px-5 pb-8"
      >
        {UTILITY.map((u) => {
          const here = pathname === u.href;
          return (
            <Link
              key={u.href}
              href={u.href}
              data-cursor-hover
              onClick={here ? (e) => { e.preventDefault(); onClose(); } : undefined}
              aria-current={here ? "page" : undefined}
              className={`border px-3.5 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] transition-colors [background:linear-gradient(#14141b,#14141b)_padding-box,repeating-linear-gradient(90deg,#070709_0_6px,#2a2a33_6px_8px)_border-box] ${
                here ? "border-[#c43e2c] text-[#f4f1ea]" : "border-transparent text-[#8a8a99] hover:text-[#f4f1ea]"
              }`}
            >
              {u.label}
            </Link>
          );
        })}
        <a
          href={PROFILE.links.instagram}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className="px-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#8a8a99] transition-colors hover:text-[#f4f1ea]"
        >
          {PROFILE.links.instagramHandle}
        </a>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Build to verify it compiles (component not yet mounted)**

Run: `cd "/Users/jadonli/Downloads/Jadon Li/jadon" && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/chrome/ContactSheet.tsx && git commit -m "feat(nav): darkroom contact-sheet overlay component"
```

---

### Task 3: Wire ContactSheet into Nav

**Files:**
- Modify: `src/components/chrome/Nav.tsx`

- [ ] **Step 1: Replace the old overlay with ContactSheet**

The header `<header>…</header>` block, the `open` state, and both `useEffect`s (close-on-route-change; scroll-lock + Esc) stay exactly as they are. Changes:

1. Imports — remove `Link`-overlay-only deps and add the sheet. The import block becomes:

```tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { Magnetic } from "@/components/primitives/Magnetic";
import { ContactSheet } from "@/components/chrome/ContactSheet";
```

(Deleted: `PROFILE, SENTENCE_DOORS` from `@/lib/data`, the `const DOORS = …` line, `EASE` from `@/lib/motion`, and `motion` — after this change nothing in `Nav.tsx` uses it; only `AnimatePresence` remains. `Link` stays — the wordmark uses it.)

2. Replace the entire `<motion.nav>…</motion.nav>` overlay (everything inside `<AnimatePresence>`) with:

```tsx
      <AnimatePresence>
        {open && <ContactSheet onClose={() => setOpen(false)} />}
      </AnimatePresence>
```

- [ ] **Step 2: Build**

Run: `cd "/Users/jadonli/Downloads/Jadon Li/jadon" && npm run build`
Expected: build succeeds with no unused-import lint errors.

- [ ] **Step 3: Headless QA of the open sheet**

Start a dedicated dev server (don't fight port 3000 — known multi-session gotcha): `PORT=3210 npm run dev` in the background. Then with the gstack browse skill:

1. Navigate to `http://localhost:3210/court`, click the "Menu" button (top right).
2. Screenshot. Expected: dark sheet, red safelight glow at top, 7 film frames with photos, COMPETES frame circled in red grease pencil, utility strip (Home / Trophy Case / Albums / Contact / @li_locked.in) at bottom, "Close" trigger still visible top-right (header z-50 sits above the z-40 sheet).
3. Verify wheel scroll works inside the strip at a narrow viewport (resize to 900px wide): dispatch a cancelable wheel event on the strip and confirm `defaultPrevented === false` (Lenis ignoring it via `data-lenis-prevent`) and `scrollLeft` changes.
4. Press Escape — sheet closes. Click Menu again, click the ALBUMS chip — navigates and the sheet closes on route change.
5. Hover a frame (dispatch `mouseover` with `bubbles: true` — `mouseenter` doesn't trigger React/motion in headless): frame scales, accent glow + peek stat appear.

- [ ] **Step 4: Commit**

```bash
git add src/components/chrome/Nav.tsx && git commit -m "feat(nav): replace text-list overlay with contact sheet"
```

---

### Task 4: Develop transition overlay

**Files:**
- Create: `src/components/chrome/Develop.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `Develop.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

type Stage =
  | { kind: "idle" }
  | { kind: "cover"; photo: string; accent: string }
  | { kind: "bath"; photo: string; accent: string }
  | { kind: "subtle" };

const FLAG = "develop";
/** Hard ceiling per active stage — the page must never stay trapped behind the overlay. */
const FAILSAFE_MS = 4200;

/**
 * Darkroom page transition. `develop:start` (from ContactSheet) covers the
 * screen in a red-washed print before navigation; the pathname change flips it
 * to the developer bath (B&W ghost -> sharp -> colour), then the print lifts.
 * A sessionStorage flag covers hard refreshes mid-transition; plain hard loads
 * get a subtle backdrop develop instead.
 */
export function Develop() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const lastPath = useRef(pathname);

  // Failsafe: any non-idle stage self-clears.
  useEffect(() => {
    if (stage.kind === "idle") return;
    const t = window.setTimeout(() => setStage({ kind: "idle" }), FAILSAFE_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  // Click side: cover the screen before navigation starts.
  useEffect(() => {
    const onStart = (e: Event) => {
      const d = (e as CustomEvent).detail as { photo?: string; accent?: string } | undefined;
      if (typeof d?.photo === "string") setStage({ kind: "cover", photo: d.photo, accent: d.accent ?? "#c43e2c" });
    };
    window.addEventListener("develop:start", onStart);
    return () => window.removeEventListener("develop:start", onStart);
  }, []);

  // Arrival: pathname changed while covered -> run the bath.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    try {
      sessionStorage.removeItem(FLAG);
    } catch {}
    const s = stageRef.current;
    if (s.kind === "cover") setStage({ kind: "bath", photo: s.photo, accent: s.accent });
  }, [pathname]);

  // Hard load: consume a fresh flag (refresh mid-transition), else subtle pass.
  useEffect(() => {
    let flag: { photo?: string; accent?: string; t?: number } | null = null;
    try {
      const raw = sessionStorage.getItem(FLAG);
      if (raw) flag = JSON.parse(raw) as typeof flag;
      sessionStorage.removeItem(FLAG);
    } catch {}
    if (flag?.photo && typeof flag.t === "number" && Date.now() - flag.t < 5000) {
      setStage({ kind: "bath", photo: flag.photo, accent: flag.accent ?? "#c43e2c" });
    } else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage({ kind: "subtle" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = stage.kind === "cover" || stage.kind === "bath";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="print"
          className="fixed inset-0 z-[60] bg-[#070709]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ y: "-103%", transition: { duration: 0.65, ease: EASE } }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={asset((stage as Extract<Stage, { kind: "cover" | "bath" }>).photo)}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            animate={
              stage.kind === "bath" && !reduced
                ? {
                    scale: 1,
                    filter: [
                      "grayscale(1) brightness(1.9) contrast(0.45) blur(2.5px)",
                      "grayscale(1) brightness(1.2) contrast(0.92) blur(0.5px)",
                      "grayscale(0.35) brightness(1.04) contrast(1) blur(0px)",
                      "grayscale(0) brightness(1) contrast(1) blur(0px)",
                    ],
                  }
                : { scale: stage.kind === "bath" ? 1 : 1.04 }
            }
            transition={
              stage.kind === "bath"
                ? { duration: reduced ? 0.4 : 1.4, ease: "easeInOut", times: reduced ? undefined : [0, 0.45, 0.75, 1] }
                : { duration: 0.5, ease: EASE }
            }
            onAnimationComplete={() => {
              if (stageRef.current.kind === "bath") window.setTimeout(() => setStage({ kind: "idle" }), 220);
            }}
          />
          {/* safelight wash — present on cover, lifts during the bath */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,60,40,0.5), rgba(120,14,9,0.72) 75%)", mixBlendMode: "hard-light" }}
            animate={{ opacity: stage.kind === "bath" ? 0 : 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </motion.div>
      )}
      {stage.kind === "subtle" && (
        <motion.div
          key="subtle"
          className="pointer-events-none fixed inset-0 z-[60]"
          initial={{ backdropFilter: "grayscale(1) brightness(0.94)", opacity: 1 }}
          animate={{ backdropFilter: "grayscale(0) brightness(1)", opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onAnimationComplete={() => setStage({ kind: "idle" })}
        />
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Mount in `src/app/layout.tsx`**

Add the import alongside the other chrome imports:

```tsx
import { Develop } from "@/components/chrome/Develop";
```

and render it after `<Nav />`:

```tsx
        <Grain />
        <Cursor />
        <Nav />
        <Develop />
        <SmoothScroll>{children}</SmoothScroll>
```

- [ ] **Step 3: Build**

Run: `cd "/Users/jadonli/Downloads/Jadon Li/jadon" && npm run build`
Expected: build succeeds (TS strict: the `Extract<…>` cast on `stage.photo` is required because `active` doesn't narrow inside JSX).

- [ ] **Step 4: Headless QA of the transition**

With the dev server from Task 3 still running, using the gstack browse skill:

1. Navigate to `http://localhost:3210/`, open Menu, click the RESEARCHES frame.
2. Screenshot immediately. Expected: fullscreen red-washed ACSEF photo (cover stage).
3. Screenshot after ~1s. Expected: the photo in mid-bath (desaturated/sharpening) or already lifting.
4. Screenshot after ~3s. Expected: the research IDE page fully visible, no overlay remaining (`document.querySelector('[class*="z-[60]"]')` count back to 0 or only inactive nodes), custom cursor still visible.
5. `sessionStorage.getItem("develop")` — expected: `null` (flag consumed).
6. Hard-reload `http://localhost:3210/court` directly. Expected: brief subtle grayscale lift on entry, then nothing; page interactive immediately (subtle overlay is `pointer-events-none`).
7. Emulate `prefers-reduced-motion: reduce`, repeat the frame click. Expected: no filter keyframes — quick fade/cover then page; no subtle pass on hard load.
8. Failsafe: in the console, dispatch `window.dispatchEvent(new CustomEvent("develop:start", { detail: { photo: "/img/ncs-champions.jpg" } }))` and do NOT navigate. Expected: overlay appears, then self-clears within ~4.5s.

- [ ] **Step 5: Commit**

```bash
git add src/components/chrome/Develop.tsx src/app/layout.tsx && git commit -m "feat(nav): developer-bath page transition with safelight cover"
```

---

### Task 5: Full QA sweep + mobile

**Files:** fixes only as QA surfaces them.

- [ ] **Step 1: All-destinations click-through**

With the dev server running, from `/leadership` open the sheet and verify each of the 11 destinations navigates correctly (7 frames + 4 utility chips), the grease-pencil circle is on LEADS when reopening from `/leadership`, and no frame is circled on `/`.

- [ ] **Step 2: Mobile viewport**

Resize to 390×844. Expected: frames at ~62vw width, horizontal swipe-scroll with snap (set `scrollLeft` programmatically and confirm snap positions), utility chips wrap, develop transition plays full-viewport.

- [ ] **Step 3: Production build + export check**

Run: `npm run build`
Expected: static export succeeds. Spot-check `out/` contains the pages and that `img` paths in the built HTML carry the base path when `NEXT_PUBLIC_BASE_PATH=/jadon-portfolio` is set (CI sets this; locally just confirm `asset()` is used everywhere in the two new components: `grep -n 'src=' src/components/chrome/ContactSheet.tsx src/components/chrome/Develop.tsx` shows only `asset(`-wrapped values).

- [ ] **Step 4: Commit any QA fixes**

```bash
git add -A src/components src/app && git commit -m "fix(nav): contact-sheet QA fixes"
```

(Skip if QA was clean.)

---

## Out of scope (phase 2, per spec)

In-page develop-on-scroll for the `Photo` primitive (grayscale→colour on first viewport entry). Ship the nav first.
