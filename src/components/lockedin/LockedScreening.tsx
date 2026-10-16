"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowUpRight,
  ChevronDown,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { LOCKED_SEASON, PROFILE } from "@/lib/data";
import type { Episode } from "@/lib/data";
import { asset } from "@/lib/base";
import { prefersReducedMotion } from "@/lib/fluid";

/**
 * @li_locked.in as a streaming title page — one screen, no vertical scroll.
 * An album photo fills the billboard for each chapter, the episode in focus
 * plays large on the right, and the season runs along a numbered row below.
 * Scrolling rolls the row sideways — one mouse-wheel notch is one episode, a
 * trackpad glides and snaps — and the card that reaches the gate grows and
 * tilts square to the viewer.
 */

type Reel = Episode & { chapterIdx: number };

/** The season in posting order. */
const CHRONO: Reel[] = LOCKED_SEASON.flatMap((ch, ci) =>
  ch.episodes.map((e) => ({ ...e, chapterIdx: ci })),
);
const N = CHRONO.length;

const poster = (m: Reel) => asset(`/vid/pursuit/${m.slug}.jpg`);
const clip = (m: Reel) => asset(`/vid/pursuit/${m.slug}.mp4`);
const isWide = (m: Reel) => m.aspect === "landscape";
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** "95.1k" → 95100 */
const plays = (v?: string) =>
  v ? parseFloat(v) * (v.endsWith("k") ? 1e3 : v.endsWith("M") ? 1e6 : 1) : 0;
/** Rank by plays among the episodes that have a count — for the Top 10 badge. */
const RANK = new Map(
  CHRONO.filter((r) => r.views)
    .sort((a, b) => plays(b.views) - plays(a.views))
    .map((r, i) => [r.slug, i + 1]),
);
/** The season ranked by plays, most played first. */
const POPULAR: Reel[] = [...CHRONO].sort(
  (a, b) => plays(b.views) - plays(a.views),
);

type Order = "chrono" | "popular";

/** The LI mark — the same slabs as the favicon (src/app/icon.svg). */
function LIMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" fill="var(--accent)" />
      <g fill="#fff">
        <rect x="16" y="14" width="8.5" height="36" />
        <rect x="16" y="41.5" width="17" height="8.5" />
        <rect x="39" y="14" width="8.5" height="36" />
      </g>
    </svg>
  );
}

const igUrl = (m: Reel) => `https://www.instagram.com/reel/${m.code}/`;

/* ─── The stage — the playing episode, with the next ones stacked behind ─ */
function StageItem({
  r,
  isActive,
  playing,
  sound,
  smooth,
  center,
  pitch,
  progress,
  onSound,
  onPick,
}: {
  r: Reel;
  isActive: boolean;
  playing: boolean;
  sound: boolean;
  smooth: MotionValue<number>;
  center: number;
  pitch: number;
  progress: MotionValue<number>;
  onSound: () => void;
  onPick: () => void;
}) {
  // Distance from the gate, in episodes. Upcoming ones (d > 0) wait behind the
  // main video, stepping out to the right, smaller and blurred; the one just
  // passed slides left and dissolves.
  const d = useTransform(smooth, (v) => (center - v) / pitch);
  const x = useTransform(d, (t) => (t > 0 ? t * 120 : t * 90));
  const scale = useTransform(d, (t) => 1 - Math.min(Math.abs(t), 3) * 0.09);
  const opacity = useTransform(d, (t) =>
    t < 0 ? Math.max(0, 1 + t * 1.8) : t > 3.2 ? 0 : 1,
  );
  const filter = useTransform(
    d,
    (t) =>
      `blur(${Math.min(Math.abs(t), 3) * 6}px) brightness(${1 - Math.min(Math.abs(t), 3) * 0.22})`,
  );
  const zIndex = useTransform(d, (t) => Math.round(100 - Math.abs(t) * 10));

  return (
    <motion.div
      className={`absolute right-0 origin-right overflow-hidden rounded-xl bg-black shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)] ${
        isWide(r) ? "top-0 aspect-video w-[47vw]" : "top-0 aspect-[9/16] h-full"
      } ${isActive ? "cursor-pointer" : "pointer-events-none"}`}
      style={{ x, scale, opacity, filter, zIndex }}
      onClick={isActive ? onPick : undefined}
      data-cursor-hover={isActive || undefined}
      aria-hidden={!isActive}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster(r)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {playing && !r.posterOnly && (
        <video
          key={r.slug}
          src={clip(r)}
          poster={poster(r)}
          autoPlay
          loop
          playsInline
          muted={!sound}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) progress.set(v.currentTime / v.duration);
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {isActive && (
        <>
          {/* Netflix-style corner: plays tab + round mute button */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-20">
            <span className="flex items-center gap-2 border-l-[3px] border-white/85 pl-3 font-grotesk text-[17px] font-semibold text-white">
              <Play className="size-4 fill-white" />
              {r.views} plays
            </span>
            {r.posterOnly ? (
              <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 font-grotesk text-base font-bold text-black">
                Watch on Instagram <ArrowUpRight className="size-4" />
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSound();
                }}
                data-cursor-hover
                aria-label={sound ? "Mute" : "Unmute"}
                className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-white/75 bg-black/35 text-white backdrop-blur transition-colors hover:border-white"
              >
                {sound ? (
                  <Volume2 className="size-5" />
                ) : (
                  <VolumeX className="size-5" />
                )}
              </button>
            )}
          </div>
          <span className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
            <motion.span
              className="block h-full origin-left bg-[var(--accent)]"
              style={{ scaleX: progress }}
            />
          </span>
        </>
      )}
    </motion.div>
  );
}

/* ─── One card in the row ──────────────────────────────────────────── */
function RowCard({
  r,
  index,
  isActive,
  playInline,
  sound,
  smooth,
  center,
  pitch,
  progress,
  onPick,
  itemRef,
  cardRef,
}: {
  r: Reel;
  index: number;
  isActive: boolean;
  /** Phones have no room for the preview, so the card itself plays. */
  playInline: boolean;
  sound: boolean;
  smooth: MotionValue<number>;
  center: number;
  pitch: number;
  progress: MotionValue<number>;
  onPick: () => void;
  itemRef: (el: HTMLDivElement | null) => void;
  cardRef: (el: HTMLButtonElement | null) => void;
}) {
  // Distance from the gate, in cards — drives the tilt, scale and light.
  const d = useTransform(smooth, (v) => (center - v) / pitch);
  const rotateY = useTransform(d, (x) => clamp(-x * 9, -32, 32));
  const scale = useTransform(
    d,
    (x) =>
      1 + 0.12 * Math.max(0, 1 - Math.abs(x)) - 0.03 * Math.min(Math.abs(x), 4),
  );
  const opacity = useTransform(d, (x) => 1 - Math.min(Math.abs(x), 7) * 0.07);
  const filter = useTransform(
    d,
    (x) => `brightness(${1 - Math.min(Math.abs(x), 3) * 0.17})`,
  );
  const z = useTransform(d, (x) => Math.round(100 - Math.abs(x) * 10));

  return (
    <div
      ref={itemRef}
      className="flex shrink-0 items-end pr-[calc(var(--card-h)*0.1)]"
    >
      <motion.div
        className="flex items-end"
        style={{ rotateY, scale, opacity, zIndex: z }}
      >
        {/* The big outlined episode number */}
        <span
          aria-hidden
          className="select-none font-anton leading-[0.78] text-[var(--bg)] [-webkit-text-stroke:3px_#6b6b6b]"
          style={{
            fontSize: "calc(var(--card-h) * 0.82)",
            marginRight: "calc(var(--card-h) * -0.1)",
          }}
        >
          {index + 1}
        </span>
        <motion.button
          ref={cardRef}
          type="button"
          onClick={onPick}
          data-cursor-hover
          aria-label={`Episode ${index + 1}: ${r.title}${r.views ? `, ${r.views} plays` : ""}`}
          aria-current={isActive}
          className={`relative overflow-hidden rounded-md bg-[var(--bg-2)] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.9)] ${
            isWide(r) ? "aspect-video" : "aspect-[9/16]"
          } h-[var(--card-h)]`}
          style={{ filter }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster(r)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {playInline && !r.posterOnly && (
            <video
              src={clip(r)}
              poster={poster(r)}
              autoPlay
              loop
              playsInline
              muted={!sound}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) progress.set(v.currentTime / v.duration);
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {/* Plays, on every card */}
          {r.views && (
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/85 to-transparent px-2.5 pb-3 pt-8 font-grotesk text-base font-bold text-white">
              <Play className="size-4 fill-white" />
              {r.views}
            </span>
          )}
          {isActive && (
            <>
              <span className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-white/90 ring-inset" />
              <span className="absolute inset-x-0 bottom-0 h-1.5 bg-white/25">
                <motion.span
                  className="block h-full origin-left bg-[var(--accent)]"
                  style={{ scaleX: progress }}
                />
              </span>
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ─── The timeline — months along a bar, a dot per episode ─────────── */
const DAY = 864e5;
const T0 = Date.UTC(2025, 5, 1); // Jun 1, 2025
const T1 = Date.UTC(2026, 10, 1); // through the end of Oct 2026
const DAY1 = Date.UTC(2025, 5, 6); // Day 1 of the account
/** Where a given account day sits along the bar, 0–100. */
const pctOfDay = (day: number) =>
  ((DAY1 + (day - 1) * DAY - T0) / (T1 - T0)) * 100;
const MONTHS: { pct: number; label: string; year?: string }[] = [];
for (
  let y = 2025, mo = 5;
  y < 2026 || mo <= 9;
  mo === 11 ? ((mo = 0), y++) : mo++
) {
  const t = Date.UTC(y, mo, 1);
  MONTHS.push({
    pct: ((t - T0) / (T1 - T0)) * 100,
    label: new Date(t).toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    }),
    year: mo === 0 || MONTHS.length === 0 ? String(y) : undefined,
  });
}

function Timeline({
  reels,
  smooth,
  centers,
  active,
  onPick,
}: {
  reels: Reel[];
  smooth: MotionValue<number>;
  centers: number[];
  active: number;
  onPick: (i: number) => void;
}) {
  // The playhead follows the row continuously: between two cards it sits
  // between their dates, so scrolling sweeps it along the months.
  const left = useTransform(smooth, (v) => {
    const n = reels.length;
    if (n < 2) return `${pctOfDay(reels[0]?.day ?? 1)}%`;
    let i = 0;
    while (i < n - 2 && centers[i + 1] <= v) i++;
    const span = centers[i + 1] - centers[i] || 1;
    const t = clamp((v - centers[i]) / span, 0, 1);
    const day = reels[i].day + (reels[i + 1].day - reels[i].day) * t;
    return `${pctOfDay(day)}%`;
  });

  return (
    <div
      className="relative w-full select-none"
      aria-label="Timeline, June 2025 to October 2026"
    >
      <div className="relative h-9">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/20" />
        <motion.div
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[var(--accent)]"
          style={{ width: left }}
        />
        {MONTHS.map((mo) => (
          <span
            key={mo.pct}
            aria-hidden
            className={`absolute top-1/2 w-px -translate-y-1/2 ${mo.year ? "h-4 bg-white/60" : "h-2.5 bg-white/35"}`}
            style={{ left: `${mo.pct}%` }}
          />
        ))}
        {reels.map((r, i) => (
          <button
            key={r.slug}
            type="button"
            onClick={() => onPick(i)}
            data-cursor-hover
            aria-label={`${r.title}, ${r.date}`}
            className="group absolute top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${pctOfDay(r.day)}%` }}
          >
            <span
              className={`block rounded-full transition-[scale,background-color] duration-200 group-hover:scale-150 ${
                i === active ? "size-2.5 bg-white" : "size-[7px] bg-white/55"
              }`}
            />
          </button>
        ))}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_rgba(229,9,20,0.9)] ring-2 ring-white"
          style={{ left }}
        />
      </div>
      <div className="relative h-6">
        {MONTHS.map((mo, k) => {
          const first = k === 0;
          const last = k === MONTHS.length - 1;
          return (
            <span
              key={mo.pct}
              className={`absolute top-0 whitespace-nowrap font-grotesk text-sm ${
                first ? "" : "-translate-x-1/2"
              } ${mo.year ? "font-semibold text-white" : "text-white/55"} ${
                k === 1
                  ? "hidden"
                  : first || last || mo.year
                    ? ""
                    : "hidden sm:block"
              }`}
              style={{ left: `${mo.pct}%` }}
            >
              {first ? `${mo.label} ’25` : mo.year ? mo.year : mo.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── The page ─────────────────────────────────────────────────────── */
export function LockedScreening() {
  const rootRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [centers, setCenters] = useState<number[]>(() =>
    CHRONO.map((_, i) => i * 240),
  );
  const [rowW, setRowW] = useState(0);
  const [active, setActive] = useState(0);
  const [settled, setSettled] = useState(0); // active once the row stops — gates video loading
  const [sound, setSound] = useState(false);
  const [phone, setPhone] = useState(false);
  const [order, setOrder] = useState<Order>("chrono");
  const REELS = order === "popular" ? POPULAR : CHRONO;

  const activeRef = useRef(0);
  const target = useRef(0);
  const offset = useMotionValue(0);
  // A touch of overshoot on the snap — the row lands, it doesn't just stop.
  const smooth = useSpring(offset, { stiffness: 190, damping: 24, mass: 0.7 });
  const gate = useMotionValue(0);
  const x = useTransform(() => gate.get() - smooth.get());
  const progress = useMotionValue(0);

  const pitch =
    centers.length > 1 ? (centers[N - 1] - centers[0]) / (N - 1) : 240;

  /* Measure card centers along the track + the row width. */
  useLayoutEffect(() => {
    const measure = () => {
      const items = itemRefs.current;
      const cards = cardRefs.current;
      if (!items[0] || !cards[0]) return;
      // The card is the last thing in its item, before the item's right padding.
      const c = items.map((it, i) => {
        const card = cards[i];
        if (!it || !card) return 0;
        const padR = parseFloat(getComputedStyle(it).paddingRight);
        return it.offsetLeft + it.offsetWidth - padR - card.offsetWidth / 2;
      });
      const isPhone = window.innerWidth < 768;
      setPhone(isPhone);
      setCenters(c.map((v) => v - c[0]));
      if (rowRef.current) {
        setRowW(rowRef.current.offsetWidth);
        gate.set(rowRef.current.offsetWidth * (isPhone ? 0.5 : 0.3) - c[0]);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rowRef.current) ro.observe(rowRef.current);
    return () => ro.disconnect();
  }, [gate, order]);

  /* Re-sorting starts the row over at its first card. */
  const changeOrder = (next: Order) => {
    activeRef.current = 0;
    target.current = 0;
    setActive(0);
    setSettled(0);
    progress.set(0);
    setOrder(next);
  };

  /** Index of the card whose center is nearest a track position. */
  const nearest = useCallback(
    (px: number) =>
      centers.reduce(
        (best, c, i) =>
          Math.abs(c - px) < Math.abs(centers[best] - px) ? i : best,
        0,
      ),
    [centers],
  );

  /* Keep the active card at the gate when the layout changes. */
  useEffect(() => {
    target.current = centers[activeRef.current];
    offset.jump(centers[activeRef.current]);
  }, [centers, offset, rowW]);

  const go = useCallback(
    (px: number, snap: boolean) => {
      const max = centers[N - 1];
      const slack = pitch * 0.45;
      let t = clamp(px, -slack, max + slack);
      const i = nearest(t);
      if (snap) t = centers[i];
      target.current = t;
      if (prefersReducedMotion()) offset.jump(t);
      else offset.set(t);
      if (i !== activeRef.current) {
        activeRef.current = i;
        setActive(i);
        progress.set(0);
        if (typeof navigator !== "undefined" && "vibrate" in navigator)
          navigator.vibrate?.(4);
      }
    },
    [centers, pitch, nearest, offset, progress],
  );

  const goTo = useCallback(
    (i: number) => go(centers[clamp(i, 0, N - 1)], true),
    [go, centers],
  );

  /* Let the row come to rest before mounting the next clip. */
  useEffect(() => {
    const t = setTimeout(() => setSettled(active), 240);
    return () => clearTimeout(t);
  }, [active]);

  /* Wheel: a mouse notch steps exactly one episode; a trackpad glides, then snaps
   * to where its momentum was heading. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let snapTimer: ReturnType<typeof setTimeout> | undefined;
    let lastStep = 0;
    let vel = 0;
    let lastT = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const notch =
        e.deltaMode === 1 ||
        (Math.abs(d) >= 48 && Number.isInteger(d) && e.deltaX === 0);
      const now = performance.now();
      if (notch) {
        if (now - lastStep < 90) return;
        lastStep = now;
        goTo(activeRef.current + Math.sign(d));
        return;
      }
      vel = d / Math.max(8, now - lastT);
      lastT = now;
      go(target.current + d * 1.1, false);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => go(target.current + vel * 90, true), 120);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(snapTimer);
    };
  }, [go, goTo]);

  /* Touch: a swipe in either direction rolls the row, with momentum. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let lx = 0,
      ly = 0,
      lt = 0,
      v = 0;
    const start = (e: TouchEvent) => {
      lx = e.touches[0].clientX;
      ly = e.touches[0].clientY;
      lt = performance.now();
      v = 0;
    };
    const move = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = lx - t.clientX,
        dy = ly - t.clientY;
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      const now = performance.now();
      v = d / Math.max(1, now - lt);
      lx = t.clientX;
      ly = t.clientY;
      lt = now;
      if (d !== 0) {
        e.preventDefault();
        go(target.current + d * 1.3, false);
      }
    };
    const end = () => go(target.current + v * 180, true);
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
    };
  }, [go]);

  /* Arrow keys. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        goTo(activeRef.current + 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(activeRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  const m = REELS[active];
  const chapter = LOCKED_SEASON[m.chapterIdx];
  const rank = RANK.get(m.slug);

  return (
    <section
      ref={rootRef}
      data-lenis-prevent
      aria-roledescription="carousel"
      aria-label={`${N} episodes from @li_locked.in`}
      className="relative grid h-full grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] overflow-hidden"
    >
      {/* Billboard — the chapter's photo, slow push-in */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.div
            key={chapter.id}
            className="absolute inset-0 md:left-[18%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            <motion.img
              src={asset(chapter.backdrop.src)}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: chapter.backdrop.pos }}
              initial={{ scale: 1.04 }}
              animate={{ scale: 1.14 }}
              transition={{ duration: 24, ease: "linear" }}
            />
          </motion.div>
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(90deg, #0b0b0b 0%, #0b0b0b 16%, rgba(11,11,11,0.85) 32%, rgba(11,11,11,0.3) 58%, rgba(11,11,11,0.15) 80%, rgba(11,11,11,0.45) 100%)",
              "linear-gradient(0deg, #0b0b0b 0%, #0b0b0b 30%, rgba(11,11,11,0.6) 48%, rgba(11,11,11,0) 66%)",
              "linear-gradient(180deg, rgba(11,11,11,0.6) 0%, rgba(11,11,11,0) 18%)",
            ].join(","),
          }}
        />
      </div>

      {/* Hero: copy left, the episode playing right */}
      <div className="relative z-10 grid min-h-0 grid-cols-[minmax(0,1fr)] px-5 pt-20 md:px-14 md:pt-24 [@media(max-height:740px)]:pt-16">
        <div className="relative flex min-h-0 max-w-[min(100%,46rem)] md:max-w-[40vw] flex-col justify-end pb-2">
          <p className="flex items-center gap-2.5 font-grotesk text-base font-semibold tracking-[0.2em] text-white/90 [@media(max-height:740px)]:hidden">
            <LIMark className="size-8" />
            SERIES
          </p>
          <h1 className="mt-3 font-anton text-[clamp(2.8rem,7vw,7rem)] uppercase leading-[0.88] text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.5)]">
            We locked in.
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 font-grotesk text-sm text-white/85 sm:mt-3 sm:text-base md:text-lg">
            <span>Jun 2025 – Oct 2026</span>
            <span>{N} episodes</span>
            <a
              href={PROFILE.links.instagram}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
            >
              {PROFILE.links.instagramHandle}
              <ArrowUpRight className="size-4" />
            </a>
          </p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={m.slug}
              aria-live="polite"
              className="mt-4 max-w-2xl md:mt-5"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {rank && rank <= 10 && (
                  <span className="flex items-center gap-2 font-grotesk text-base font-semibold text-white md:text-lg">
                    <span className="flex flex-col items-center rounded-[3px] bg-[var(--accent)] px-1 py-0.5 font-black leading-none">
                      <span className="text-[10px] tracking-wide">TOP</span>
                      <span className="text-sm">10</span>
                    </span>
                    #{rank} most played
                  </span>
                )}
                {m.views && (
                  <span className="font-grotesk text-base font-semibold text-[var(--accent-2)] md:text-lg">
                    {m.views} plays
                  </span>
                )}
                <span className="font-grotesk text-base text-white/70 md:text-lg">
                  Day {m.day} · {m.date}
                </span>
              </div>
              <h2 className="mt-2 font-grotesk text-[clamp(1.4rem,3.4vh,2.3rem)] font-bold leading-tight text-white">
                {order === "chrono" && (
                  <span className="text-white/55">E{active + 1} </span>
                )}
                {m.title}
              </h2>
              {m.caption && (
                <p className="mt-1.5 hidden line-clamp-2 font-grotesk text-lg leading-snug text-white/80 md:block">
                  “{m.caption}”
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap gap-3 md:mt-5">
            {!m.posterOnly && (
              <button
                type="button"
                onClick={() => setSound((s) => !s)}
                data-cursor-hover
                className="inline-flex min-h-12 items-center gap-2.5 rounded-md bg-white px-4 font-grotesk text-[17px] font-bold sm:px-6 text-black transition-opacity duration-200 hover:opacity-80 md:min-h-14 md:px-8 md:text-lg"
              >
                {sound ? (
                  <VolumeX className="size-6" />
                ) : (
                  <Play className="size-6 fill-black" />
                )}
                {sound ? (
                  "Mute"
                ) : (
                  <>
                    Play<span className="hidden sm:inline"> with sound</span>
                  </>
                )}
              </button>
            )}
            <a
              href={`https://www.instagram.com/reel/${m.code}/`}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[rgba(109,109,110,0.7)] px-4 font-grotesk sm:px-6 text-[17px] font-bold text-white transition-colors duration-200 hover:bg-[rgba(109,109,110,0.45)] md:min-h-14 md:px-8 md:text-lg"
            >
              <span className="hidden sm:inline">Watch on</span> Instagram{" "}
              <ArrowUpRight className="size-6" />
            </a>
          </div>
        </div>
      </div>

      {/* The stage — right side, top to bottom, set in from the edge */}
      <div className="pointer-events-none absolute bottom-16 right-[7vw] top-20 z-30 hidden md:block">
        <div className="pointer-events-auto relative h-full">
          {REELS.map((r, i) =>
            Math.abs(i - active) <= 3 ? (
              <StageItem
                key={r.slug}
                r={r}
                isActive={i === active}
                playing={i === active && settled === active && !phone}
                sound={sound}
                smooth={smooth}
                center={centers[i]}
                pitch={pitch}
                progress={progress}
                onSound={() => setSound((s) => !s)}
                onPick={() => window.open(igUrl(r), "_blank", "noopener")}
              />
            ) : null,
          )}
        </div>
      </div>

      {/* The row */}
      <div className="relative z-20 pb-2 md:pb-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 md:flex-nowrap md:px-14">
          <label className="relative inline-flex shrink-0 items-center">
            <span className="sr-only">Sort episodes</span>
            <select
              value={order}
              onChange={(e) => changeOrder(e.target.value as Order)}
              data-cursor-hover
              className="min-h-11 cursor-pointer appearance-none rounded-[4px] border border-white/45 bg-black/60 py-2 pl-4 pr-10 font-grotesk text-[17px] font-semibold text-white backdrop-blur transition-colors hover:border-white focus:border-white focus:outline-none"
            >
              <option value="chrono">Chronological</option>
              <option value="popular">Most popular</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 size-4 text-white" />
          </label>
          <div className="min-w-0 flex-1 basis-full md:basis-auto md:max-w-[min(46vw,780px)]">
            <Timeline
              reels={REELS}
              smooth={smooth}
              centers={centers}
              active={active}
              onPick={goTo}
            />
          </div>
        </div>

        <div
          ref={rowRef}
          className="relative mt-3 overflow-hidden pb-[calc(var(--card-h)*0.12)] pt-[calc(var(--card-h)*0.08)] [--card-h:clamp(160px,26vh,270px)] [perspective:1400px] md:mt-4"
        >
          <motion.div className="relative flex w-max items-end" style={{ x }}>
            {REELS.map((r, i) => (
              <RowCard
                key={r.slug}
                r={r}
                index={i}
                isActive={i === active}
                playInline={phone && i === active && settled === active}
                sound={sound}
                smooth={smooth}
                center={centers[i]}
                pitch={pitch}
                progress={progress}
                onPick={() => {
                  if (i === active) window.open(igUrl(r), "_blank", "noopener");
                  else goTo(i);
                }}
                itemRef={(el) => {
                  itemRefs.current[i] = el;
                }}
                cardRef={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
