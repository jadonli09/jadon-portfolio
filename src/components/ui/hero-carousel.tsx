"use client";

// A full-bleed editorial hero driven by a filmstrip.
//
// Every card shares one top edge. The focused card unfurls to full height while
// its neighbours stay clipped to half, so the strip reads as a row of cropped
// heads with one complete portrait standing in the middle of it. Changing the
// focus re-grades the whole background to that image.
//
// Geometry is measured, never hard-coded: one ResizeObserver reads the stage and
// every size below is a ratio of it, so the same component is pixel-identical in
// a 600px preview box and on a 4K display.
//
// Imports come from `motion/react` rather than `framer-motion`: this project
// ships Motion v12, which is the same library under its current package name.
// Adding `framer-motion` alongside it would install a second copy of the same
// animation runtime.
import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/cn";

export interface HeroCarouselItem {
  /** Stable key; falls back to the index. @default undefined */
  id?: string | number;
  /** Headline for the active slide. Newlines become separate reveal lines. */
  title: string;
  /** Image URL, used both in the card and as the graded background. */
  image: string;
  /** Byline printed beside the headline, e.g. "BY AURELIA STUDIO." @default undefined */
  credit?: string;
  /** Right-aligned facts, e.g. ["SAT NOV 15", "5-10 PM", "MIAMI"]. @default undefined */
  meta?: string[];
  /**
   * CSS colour the background is graded to. The photo keeps its luminance and
   * takes this hue, which is what makes the backdrop swing on every change.
   * @default "#8a8a8a"
   */
  accent?: string;
  /** Optional link opened when the focused card is clicked again. */
  href?: string;
  /**
   * Revealed under the card when it is hovered or focused. The card grows by
   * the band's height rather than the image shrinking into it, so the preview
   * above never changes size and never crops. @default undefined
   */
  caption?: { name: string; when?: string };
}

export interface HeroCarouselProps {
  /** Slides, in strip order. */
  items: HeroCarouselItem[];
  /** Focused slide when controlled. Leave unset for internal state. @default undefined */
  index?: number;
  /** Focused slide on mount when uncontrolled. @default 0 */
  defaultIndex?: number;
  /** Fires on every focus change, from any input. @default undefined */
  onIndexChange?: (index: number) => void;
  /** Wordmark in the middle of the top bar. @default undefined */
  brand?: React.ReactNode;
  /** Renders the "Back" control when provided. @default undefined */
  onBack?: () => void;
  /** Renders the "Menu" control when provided. @default undefined */
  onMenu?: () => void;
  /** Advance on a timer. Pauses on hover, drag and focus. @default false */
  autoplay?: boolean;
  /** Milliseconds between autoplay steps. @default 4000 */
  autoplayDelay?: number;
  /**
   * Blur applied to the enlarged backdrop, in px.
   *
   * The reference art is abstract, so it needs none. A screenshot does: blown
   * up to cover the stage, its own headings land at display size behind the
   * real headline and the two fight. Blurring turns it back into the colour
   * field the grade expects. @default 0
   */
  backgroundBlur?: number;
  /**
   * Card width ÷ height. The reference strip is 3:4 portraits; a strip of
   * browser captures wants 16:10 so the whole page shows. The image is drawn
   * at exactly this ratio, so `object-cover` crops nothing. @default 0.75
   */
  cardAspect?: number;
  /**
   * Height of the hover caption band, as a fraction of card height.
   * @default 0.26
   */
  captionRatio?: number;
  /** Rendered above the strip for the focused item, in place of the meta row. */
  renderDetail?: (item: HeroCarouselItem, index: number) => React.ReactNode;
  /**
   * Fades the top and bottom edges to white so a dark full-bleed band can sit
   * inside a white page without a hard seam. Height in px. @default 0
   */
  fadeEdges?: number;
  /** Extra classes for the stage. @default undefined */
  className?: string;
}

/* Ratios lifted from the reference layout, all relative to the stage box. */
const CARD_H = 0.264; // active card height ÷ stage height
const GAP = 0.038; // gap ÷ card width
const STRIP_TOP = 0.5; // strip's shared top edge, down the stage
const TITLE = 0.067; // headline cap size ÷ stage height
const LABEL = 0.0103; // small mono label ÷ stage height
const PAD = 0.017; // page gutter ÷ stage width
const RAIL = 0.2; // progress rail width ÷ stage width

/** Wheel distance that commits to a step, and the lockout after one. */
const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN = 420;

/* Film grain, as a self-contained SVG so the component carries no assets. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  brand,
  onBack,
  onMenu,
  autoplay = false,
  autoplayDelay = 4000,
  backgroundBlur = 0,
  cardAspect = 0.75,
  captionRatio = 0.26,
  renderDetail,
  fadeEdges = 0,
  className,
}: HeroCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex);
  const [dragging, setDragging] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const reduced = useReducedMotion();

  const last = items.length - 1;
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last));

  const go = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, last));
      if (controlled === undefined) setUncontrolled(clamped);
      if (clamped !== index) onIndexChange?.(clamped);
    },
    [controlled, index, last, onIndexChange],
  );

  // One observer feeds every measurement below.
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  /*
    Every card is the same size and shows its whole image. The reference clips
    unfocused cards to half height, which works for portraits of faces; it does
    not work for a screenshot, where the bottom half of the page is the half
    that gets cut. Emphasis moves to brightness and a lift instead, and the
    caption band is what changes height.
  */
  const cardH = clamp(box.h * CARD_H, 96, 360);
  const cardW = cardH * cardAspect;
  const capH = Math.round(cardH * captionRatio);
  const gap = Math.max(4, Math.round(cardW * GAP));
  const step = cardW + gap;
  const pad = Math.max(16, Math.round(box.w * PAD));
  const label = Math.max(9, Math.round(box.h * LABEL));
  /** Hover wins over focus, so pointing at a neighbour previews that one. */
  const shown = hovered ?? index;

  // Centre the focused card: the track slides, the card never moves itself.
  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW],
  );
  const x = useMotionValue(0);
  const target = xFor(index);

  const swing = reduced ? { duration: 0 } : { duration: 0.7, ease: "easeOut" as const };
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 34, mass: 0.9 };

  // The track is driven by a motion value rather than an `animate` prop so a
  // drag that starts mid-spring reads the real position, not where the spring
  // was headed - otherwise the release snaps a card off.
  React.useEffect(() => {
    if (dragging) return;
    const run = animate(x, target, spring);
    return () => run.stop();
    // `spring` is a literal, so `reduced` (all it derives from) stands in for it.
  }, [target, dragging, reduced, x]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wheel and trackpad. Both axes step the strip.
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let acc = 0;
    let until = 0;

    const onWheel = (e: WheelEvent) => {
      // Trackpads report the dominant axis; take whichever is stronger.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      // Scroll chaining: once the strip is against an end, hand the gesture
      // back to the page. Without this a full-height carousel is a scroll trap
      // with no way past it.
      const stuck = (delta > 0 && index === last) || (delta < 0 && index === 0);
      if (stuck) {
        acc = 0;
        return;
      }
      e.preventDefault();
      const now = e.timeStamp;
      if (now < until) return;
      acc += delta;
      if (Math.abs(acc) < WHEEL_THRESHOLD) return;
      go(index + Math.sign(acc));
      acc = 0;
      until = now + WHEEL_COOLDOWN;
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [go, index, last]);

  React.useEffect(() => {
    if (!autoplay || paused || dragging || items.length < 2) return;
    const id = window.setTimeout(
      () => go(index === last ? 0 : index + 1),
      autoplayDelay,
    );
    return () => window.clearTimeout(id);
  }, [autoplay, autoplayDelay, dragging, go, index, items.length, last, paused]);

  const active = items[index];
  if (!active) return null;

  const lines = active.title.split("\n");
  const accent = active.accent ?? "#8a8a8a";

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="More projects"
      onKeyDown={(e) => {
        const keys: Record<string, number> = {
          ArrowLeft: index - 1,
          ArrowRight: index + 1,
          Home: 0,
          End: last,
        };
        if (!(e.key in keys)) return;
        e.preventDefault();
        go(keys[e.key]!);
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "relative h-full min-h-[24rem] w-full select-none overflow-hidden bg-black text-white",
        "outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/40",
        className,
      )}
    >
      {/* ── Background: the focused photo, blown up and re-hued to its accent ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={swing}
        >
          <motion.img
            src={active.image}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={backgroundBlur ? { filter: `blur(${backgroundBlur}px)` } : undefined}
            initial={{ scale: reduced ? 1.28 : 1.42 }}
            animate={{ scale: 1.28 }}
            transition={reduced ? { duration: 0 } : { duration: 6, ease: "linear" }}
          />
          {/* Keep the photo's luminance, take the accent's hue. */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: accent, mixBlendMode: "color" }}
          />
          <div
            className="absolute inset-0 opacity-55"
            style={{ backgroundColor: accent, mixBlendMode: "multiply" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility wash + grain, above the swap so they never flicker. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      {/* Soft seams. A full-bleed dark band dropped into a white page meets it
          at a hard line; these dissolve the two edges into each other. */}
      {fadeEdges ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-white to-transparent"
            style={{ height: fadeEdges }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white to-transparent"
            style={{ height: fadeEdges }}
          />
        </>
      ) : null}

      {/* ── Top bar: a centred cluster, not edge-to-edge ── */}
      <div
        className="absolute inset-x-0 flex items-center justify-center"
        style={{
          top: Math.max(16, box.h * 0.029),
          gap: `${Math.max(20, box.w * 0.06)}px`,
        }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="opacity-90 transition-opacity hover:opacity-100"
            style={{ fontSize: label * 1.15 }}
          >
            <span aria-hidden>↖</span> Back
          </button>
        ) : null}
        {brand ? (
          <div
            className="font-semibold tracking-[0.06em]"
            style={{ fontSize: label * 1.35 }}
          >
            {brand}
          </div>
        ) : null}
        {onMenu ? (
          <button
            type="button"
            onClick={onMenu}
            className="opacity-90 transition-opacity hover:opacity-100"
            style={{ fontSize: label * 1.15 }}
          >
            Menu <span aria-hidden>☰</span>
          </button>
        ) : null}
      </div>

      {/* ── Headline block, sitting just above the strip's top edge ── */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col justify-end"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.028),
        }}
      >
        <div className="flex w-full flex-wrap items-end gap-x-[6vw] gap-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h2
              key={index}
              className="font-semibold leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: Math.max(24, Math.round(box.h * TITLE)) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              {lines.map((line, i) => (
                // Each line wipes up from behind its own edge.
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </AnimatePresence>

          {active.credit ? (
            <motion.p
              key={`credit-${index}`}
              className="font-mono uppercase tracking-[0.14em] opacity-80"
              style={{ fontSize: label }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {active.credit}
            </motion.p>
          ) : null}

          {/* A caller-supplied block wins over the plain facts row, so the
              focused product can show its own detail rather than three words. */}
          {renderDetail ? (
            <motion.div
              key={`detail-${index}`}
              className="ml-auto"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.45, delay: 0.12 }}
            >
              {renderDetail(active, index)}
            </motion.div>
          ) : active.meta?.length ? (
            <div
              className="ml-auto flex items-end"
              style={{ gap: `${Math.max(16, box.w * 0.055)}px` }}
            >
              {active.meta.map((fact, i) => (
                <motion.span
                  key={`${index}-${fact}`}
                  className="whitespace-nowrap font-mono uppercase tracking-[0.14em] opacity-80"
                  style={{ fontSize: label }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.45, delay: 0.12 + i * 0.06 }
                  }
                >
                  {fact}
                </motion.span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ── The strip: one shared top edge, every card whole ── */}
      <div
        className="absolute inset-x-0"
        style={{ top: `${STRIP_TOP * 100}%`, height: cardH + capH }}
      >
        <motion.div
          className="flex items-start"
          style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            // Land on whatever card the release sits nearest, nudged by throw
            // velocity so a flick clears more than one card.
            const thrown = x.get() + info.velocity.x * 0.12;
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step));
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {items.map((item, i) => {
            const lit = shown === i;
            return (
              <motion.button
                key={item.id ?? i}
                type="button"
                aria-label={item.title.replace(/\n/g, " ")}
                aria-current={i === index}
                onPointerEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onClick={() => {
                  // First click focuses; a click on the already-focused card
                  // opens it. A drag never reaches here — Motion swallows it.
                  if (i !== index) return go(i);
                  if (item.href) window.open(item.href, "_blank", "noopener");
                }}
                className="relative shrink-0 overflow-hidden rounded-md bg-white/5 text-left"
                style={{ width: cardW }}
                // The card grows DOWNWARD by the caption's height. The image
                // above it never changes size, so the preview stays whole and
                // stays put while the label slides out from under it.
                animate={{ height: lit && item.caption ? cardH + capH : cardH }}
                transition={spring}
              >
                <div className="relative w-full overflow-hidden" style={{ height: cardH }}>
                  {/* Drawn at exactly the card's ratio, so cover crops nothing. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  {/* Unlit cards sit back a touch without going grey. */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 bg-black"
                    animate={{ opacity: lit ? 0 : 0.34 }}
                    transition={spring}
                  />
                </div>

                {item.caption ? (
                  <motion.div
                    className="flex w-full items-center justify-between gap-3 overflow-hidden bg-white px-3 text-black"
                    style={{ height: capH }}
                    animate={{ opacity: lit ? 1 : 0 }}
                    transition={spring}
                  >
                    <span
                      className="truncate font-semibold tracking-[-0.01em]"
                      style={{ fontSize: label * 1.5 }}
                    >
                      {item.caption.name}
                    </span>
                    {item.caption.when ? (
                      <span
                        className="shrink-0 font-mono uppercase tracking-[0.12em] opacity-60"
                        style={{ fontSize: label }}
                      >
                        {item.caption.when}
                      </span>
                    ) : null}
                  </motion.div>
                ) : null}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* ── Position rail ── */}
      <div
        className="absolute"
        style={{
          left: pad,
          // Lifted clear of the bottom fade. Sitting inside it, the rail was
          // washed to near-white on a near-white gradient and stopped being
          // readable at exactly the moment it says where you are.
          bottom: Math.max(14, box.h * 0.022) + fadeEdges * 0.5,
          width: box.w * RAIL,
        }}
      >
        <div
          className="flex justify-between font-mono tabular-nums opacity-80"
          style={{ fontSize: label }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="relative mt-2 h-px w-full bg-white/25">
          <motion.div
            className="absolute inset-y-0 bg-white"
            style={{ width: `${100 / items.length}%` }}
            animate={{ left: `${(index / items.length) * 100}%` }}
            transition={spring}
          />
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;
