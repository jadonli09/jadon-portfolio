"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { asset } from "@/lib/base";
import { EASE_OUT } from "@/lib/fluid";
import type { Beat } from "@/lib/built-story";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   ScrollStage — the product pins, the story scrolls past it.

   The pattern Apple's iPhone and iPad pages are built on: one product stays
   fixed in view while short beats scroll by beside it, and the product changes
   to match whichever beat you are reading. Scrolling IS the control.

   Two things it buys, and the second is the point:

     · It feels interactive without asking for a click. The reader's own scroll
       drives the product through its features.
     · It forces the copy short. A beat is a two-word label and one line —
       there is no room for a paragraph, so the paragraph does not get written.

   Below `lg` there is no pinning: a sticky column inside a single-column
   layout just scrolls with everything else and reads as a bug. Small screens
   get each beat with its own screen inline, which is the same story told
   linearly.
   ──────────────────────────────────────────────────────────────────── */


/** All AcornPrep beats fill the same 16:10 frame, on desktop and mobile. */
const STAGE_ASPECT = "1280/800";

function isPortrait(aspect?: string) {
  if (!aspect) return false;
  const [w, h] = aspect.split("/").map(Number);
  return Boolean(w && h && w / h < 0.95);
}

/** The breakpoint at which the stage actually pins. Matches `lg:` in the JSX. */
const PINNED_QUERY = "(min-width: 1024px)";

export function ScrollStage({
  beats,
  name,
  header,
  aside,
}: {
  beats: Beat[];
  name: string;
  /**
   * The chapter's own heading block. It rides INSIDE the pinned screen rather
   * than above the runway: pinned a screenful below its own header, the stage
   * left half a screen of white between the two, and the section read as two
   * things with a hole between them instead of one composition.
   */
  header?: React.ReactNode;
  /**
   * Extra content for the right column, under the beat line. Single-beat
   * sections only, and really only the portrait one: a 9:16 phone leaves a
   * column of empty page beside it that one short line cannot fill, so
   * everything the section has to say goes there instead of below.
   */
  aside?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const runwayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [stickyTop, setStickyTop] = useState(0);
  const single = beats.length === 1;

  /*
    Progress through the runway: 0 when its top meets the top of the screen —
    the moment the stage pins — and 1 when its bottom does, the moment the
    stage lets go. Everything below is a function of this one number, so the
    picture, the lit beat and the list's position can never disagree.
  */
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  /**
   * How far the list has to move: its own height, less the window's. Mapped to
   * a full transform STRING — a bare number is not a valid `transform`, and
   * Motion rejects the keyframe rather than guessing a unit.
   */
  const listShift = useTransform(
    scrollYProgress,
    (v) => `translate3d(0, ${(-v * travel).toFixed(2)}px, 0)`,
  );

  /**
   * Dimming only makes sense where the stage pins. Below `lg` each beat sits
   * with its own screen, so there is no "the product is showing THIS one" to
   * point at — greying the other beats there just reads as disabled.
   */
  useEffect(() => {
    const mq = window.matchMedia(PINNED_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /**
   * The lit beat, from the same progress value that moves the list. Reading it
   * off the scroll rather than off each beat's box is what lets the beats sit
   * as close together as they like: their spacing stops being the thing that
   * decides when the picture changes.
   */
  useEffect(() => {
    if (single || !pinned) return;
    const step = 1 / beats.length;
    return scrollYProgress.on("change", (v) => {
      const i = Math.min(beats.length - 1, Math.max(0, Math.floor(v / step)));
      setActive(i);
    });
  }, [single, pinned, beats.length, scrollYProgress]);

  /**
   * Where the pinned screen sits.
   *
   * It used to be a full-viewport box with its contents centred, and that box
   * begins at the TOP OF THE RUNWAY — so before anything pinned, the heading
   * and product sat half a screen down from where the section starts, with the
   * same emptiness underneath. Half a screen of white, twice, for a section
   * that is otherwise packed.
   *
   * Now the sticky element is only as tall as its content and is offset by the
   * space that would have been above it. Identical once pinned — the
   * composition still holds the middle of the screen — but on the way in it
   * begins exactly where the section does.
   */
  useEffect(() => {
    const el = screenRef.current;
    if (!el || single || !pinned) {
      setStickyTop(0);
      return;
    }
    const measure = () =>
      setStickyTop(Math.max(0, Math.round((window.innerHeight - el.offsetHeight) / 2)));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [single, pinned]);

  /** The list's travel, measured — not assumed from a line count. */
  useEffect(() => {
    const el = listRef.current;
    if (!el || single) return;
    const ro = new ResizeObserver(() => {
      const windowH = el.parentElement?.clientHeight ?? 0;
      setTravel(Math.max(0, el.scrollHeight - windowH));
    });
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [single, pinned]);

  /* ── One screen: no pinning to do. Product and line, side by side. ── */
  if (single) {
    const b = beats[0];
    const portrait = isPortrait(b.aspect);
    return (
      <>
        {header}
        <div
        /*
          The runway ref is attached in BOTH branches. `useScroll` is a hook, so
          it always runs — and pointing it at a ref this branch never attached
          made Motion warn that the target was defined but not hydrated. Here
          the progress it reports is simply unused.
        */
        ref={runwayRef}
        className={cn(
          "mt-9 grid grid-cols-1 gap-8 lg:gap-16",
          // With an aside the right column is a stack, so it aligns to the top
          // of the frame; on its own it is one line, which centres against it.
          aside ? "items-start" : "items-center",
          // The track is sized here, NOT by a max-width on the child. An `auto`
          // track sized by a `w-full` child is circular, and the frame collapses
          // to nothing. A 9:16 story also needs phone width or it becomes a
          // two-thousand-pixel tower.
          //
          // The portrait frame is narrow enough to sit beside its line from
          // `md`; the landscape one needs a wider track, so it waits for `lg`.
          portrait ? "md:grid-cols-[19rem_1fr]" : "lg:grid-cols-[36rem_1fr]",
        )}
      >
        <div className={cn("w-full", portrait && "mx-auto max-w-[19rem] md:mx-0")}>
          <Frame beats={beats} active={0} name={name} aspect={b.aspect} />
        </div>
        <div>
          <p className="t-label text-[var(--accent)]">{b.label}</p>
          {/*
            A single beat gets the big size. There is only one line in this
            section, so at `t-head` it left a third of the row empty to its
            right — the line has to be large enough to hold the space its own
            layout gives it.
          */}
          <p className="t-title mt-3 max-w-2xl">{b.line}</p>
          {aside}
        </div>
        </div>
      </>
    );
  }

  /* ── Several screens ─────────────────────────────────────────────
     Above `lg` this is a pinned viewport, not a sticky column.

     A sticky column only holds still while its SIBLING is taller than the
     screen, so with the beats packed tight the picture slid away with them.
     Here the section owns a runway of scroll instead: one screenful is pinned
     to the top of it, the picture sits in that pinned screen and never moves,
     and the beats are translated upward through a window beside it as the
     runway is consumed. Scrolling moves the words; the product only changes.

     Below `lg` none of this applies — each beat carries its own screen and the
     whole thing is an ordinary column.
     ─────────────────────────────────────────────────────────────── */
  return (
    <div
      ref={runwayRef}
      className="lg:relative"
      // Progress still reaches every beat; a shorter runway keeps browsing brisk.
      style={pinned ? { height: `calc(100svh + ${(beats.length - 1) * 40}svh)` } : undefined}
    >
      {/* A column, held at the middle of the screen as a whole — heading and
          stage travel together for the length of the runway. */}
      <div
        ref={screenRef}
        className="lg:sticky lg:flex lg:flex-col"
        style={pinned ? { top: stickyTop } : undefined}
      >
        {header}
        <div className="mt-8 grid w-full grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-[1.45fr_0.75fr] lg:gap-12">
          <div className="hidden lg:block">
            <Frame beats={beats} active={active} name={name} aspect={STAGE_ASPECT} />
          </div>

          {/* The window. Its height is what decides how many beats are legible
              at once; the list inside it is packed tight, so the gaps between
              lines never grow with the screen. */}
          <div className="lg:h-[22rem] lg:overflow-hidden">
            <motion.div
              ref={listRef}
              className="flex flex-col lg:gap-10"
              style={pinned ? { transform: listShift } : undefined}
            >
              {beats.map((b, i) => (
                <div
                  key={b.label}
                  className="flex flex-col justify-center py-6 md:grid md:grid-cols-2 md:items-center md:gap-8 lg:block lg:py-0"
                >
                  <div className="mb-4 md:mb-0 lg:hidden">
                    <Frame beats={[b]} active={0} name={name} aspect={STAGE_ASPECT} />
                  </div>

                  <motion.div
                    // The beat you are reading is lit; the others recede. This
                    // is the whole feedback loop of the section, so it must be
                    // unmistakable but never slow: 240ms.
                    animate={{ opacity: !pinned || active === i ? 1 : 0.32 }}
                    transition={{ duration: 0.24, ease: EASE_OUT }}
                  >
                    <p className="t-label text-[var(--accent)]">{b.label}</p>
                    <p className="t-head mt-2.5 max-w-sm">{b.line}</p>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tutor keeps its close-up; the other captures retain their earlier scale and full image. */
function Frame({ beats, active, name, aspect }: {
  beats: Beat[];
  active: number;
  name: string;
  aspect?: string;
}) {
  return (
    <div className="relative w-full" style={{ aspectRatio: aspect ?? STAGE_ASPECT }}>
      {beats.map((b, i) => {
        const focused = Boolean(b.zoom);
        // Preserve the old media width: .575 * (chapterWidth - 64px).
        // The wider tutor column is (1.45 / 2.2) * (chapterWidth - 48px),
        // so the old width inside it is 87.2414% - 9.2px.
        return (
          <motion.div key={b.shot} className="absolute inset-0 grid place-items-center"
            initial={false}
            animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : .985 }}
            transition={{ duration: .28, ease: EASE_OUT }}>
            <div className={cn(
              "relative aspect-[16/10] w-full",
              focused
                ? "overflow-hidden rounded-xl [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.04))_drop-shadow(0_18px_40px_rgba(0,0,0,0.16))]"
                : "lg:w-[calc(87.2414%_-_9.2px)]",
            )}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(b.shot)} alt={`${name} — ${b.label.toLowerCase()}`}
                loading={i === 0 ? "eager" : "lazy"} decoding="async" draggable={false}
                className={cn("absolute inset-0 h-full w-full", focused ? "object-cover" : "rounded-xl object-contain [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.04))_drop-shadow(0_18px_40px_rgba(0,0,0,0.16))]")}
                style={focused ? { objectPosition: b.position, transformOrigin: b.origin, transform: `scale(${b.zoom})` } : undefined} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
