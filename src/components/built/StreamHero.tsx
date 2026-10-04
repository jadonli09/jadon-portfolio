"use client";

import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { asset } from "@/lib/base";
import { EASE_OUT, prefersReducedMotion, scrollTargetFor } from "@/lib/fluid";
import { cn } from "@/lib/cn";
import { PROJECTS } from "@/lib/data";

/* ────────────────────────────────────────────────────────────────────
   StreamHero — the headline on the left, a wall of real screens on the right.

   Every card is something that is actually live, at its own shape and at full
   colour: this page is white on purpose so the screenshots carry all of it.
   Text and screens never share space, so nothing needs a scrim. The wall
   drifts in two columns; hovering holds it still and names the product, and a
   click goes to that product's chapter. On a phone the same screens run as
   one row under the headline.
   ──────────────────────────────────────────────────────────────────── */

type Shot = { src: string; aspect: number; slug: string; alt: string };

/** `aspect` is the file's real width ÷ height, so nothing is cropped to a house format. */
const SHOTS: Record<string, Shot> = {
  mcq: { src: "/embeds/stream/acorn-mcq.jpg", aspect: 1.7729, slug: "acornprep", alt: "AcornPrep MCQ practice" },
  story: { src: "/embeds/stream/hermes-story.jpg", aspect: 0.5625, slug: "hermes", alt: "A Hermes schedule story" },
  cuesheet: { src: "/embeds/stream/cuesheet.jpg", aspect: 1.7131, slug: "cuesheet", alt: "CueSheet" },
  tutor: { src: "/embeds/stream/acorn-tutor.jpg", aspect: 0.6663, slug: "acornprep", alt: "AcornPrep AI tutor" },
  asb: { src: "/embeds/stream/asb.jpg", aspect: 1.6, slug: "msjhs-asb", alt: "MSJHS ASB" },
  reader: { src: "/embeds/stream/notebook-reader.jpg", aspect: 1.4299, slug: "notebookli", alt: "NotebookLI reader" },
  frq: { src: "/embeds/stream/acorn-frq.jpg", aspect: 1.7927, slug: "acornprep", alt: "AcornPrep free-response grading" },
  makes: { src: "/embeds/stream/msjmakes.jpg", aspect: 1.6, slug: "msj-makes", alt: "MSJ Makes" },
  tips: { src: "/embeds/stream/acorn-tips.jpg", aspect: 1.5534, slug: "acornprep", alt: "AcornPrep study modes" },
  ysj: { src: "/embeds/stream/ysj.jpg", aspect: 1.6, slug: "youth-stem-journal", alt: "Youth STEM Journal" },
  acorn: { src: "/embeds/stream/acornprep.jpg", aspect: 1.6, slug: "acornprep", alt: "AcornPrep" },
  site: { src: "/embeds/stream/jadonli.jpg", aspect: 1.6, slug: "jadonli-com", alt: "jadonli.com" },
};

/** One portrait per column, and no product twice in a row. */
const COLUMNS = [
  { shots: ["mcq", "story", "asb", "reader", "tips", "site"], seconds: 64, reverse: false },
  { shots: ["cuesheet", "tutor", "makes", "frq", "ysj", "acorn"], seconds: 76, reverse: true },
];
const ROW = ["acorn", "story", "cuesheet", "reader", "tutor", "asb", "mcq", "makes", "ysj", "frq", "site", "tips"];

const NAME = Object.fromEntries(PROJECTS.map((p) => [p.slug, p.name]));

/** One masked line of the display headline. */
function Line({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    // Size lands here, not on the inner text: the clip box and its em-based
    // padding have to scale with the line, or a larger line gets cropped.
    <span className={cn("block overflow-hidden pb-[0.09em] -mb-[0.09em]", className)}>
      <motion.span
        className="block"
        initial={{ transform: "translateY(105%)" }}
        animate={{ transform: "translateY(0%)" }}
        transition={{ duration: 0.62, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function StreamHero() {
  const lenis = useLenis();

  /** Same jump the Dock makes: an absolute target, because Lenis's own `scrollTo(el)` lands short inside World. */
  const jump = (e: React.MouseEvent, slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    e.preventDefault();
    // The more-projects strip focuses whichever card the hash names, so the
    // hash has to change even though the scroll is ours. Cleared first so a
    // second click on the same product still re-focuses it.
    for (const hash of ["", `#${slug}`]) {
      history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    if (lenis) lenis.scrollTo(scrollTargetFor(el));
    else window.scrollTo({ top: scrollTargetFor(el), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  /** A track holds its shots twice so the loop can wrap; the second copy is for the eye only. */
  const card = (id: string, copy: number, row: boolean) => {
    const s = SHOTS[id];
    return (
      <div key={`${id}-${copy}`} className={row ? "shrink-0 pr-3" : "pb-4"}>
        <a
          href={`#${s.slug}`}
          onClick={(e) => jump(e, s.slug)}
          aria-hidden={copy > 0}
          tabIndex={copy > 0 ? -1 : undefined}
          aria-label={`${NAME[s.slug]}: jump to it`}
          className="stream-card group"
          style={row ? { height: "9.5rem", aspectRatio: s.aspect } : { aspectRatio: s.aspect }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(s.src)} alt={s.alt} draggable={false} className="h-full w-full object-cover" />
          <span className="stream-name">{NAME[s.slug]}</span>
        </a>
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-28 md:px-9 md:pt-36 lg:h-[min(90svh,54rem)] lg:min-h-[38rem] lg:grid-cols-2 lg:items-center lg:gap-14 lg:pt-0">
        <div>
          <h1 className="t-display">
            <Line delay={0.08} className="text-[1.2em]">
              Ship it.
            </Line>
            <Line delay={0.16} className="text-[0.6em] lg:whitespace-nowrap lg:text-[0.5em]">
              <span className="text-[var(--muted)]">Then ship the next one.</span>
            </Line>
          </h1>
          <motion.p
            className="t-body mt-7 text-[1.25rem] md:mt-9 md:text-[1.375rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <span className="t-num">{PROJECTS.length}</span> products,{" "}
            <span className="t-num">2,200+</span> people using them.
          </motion.p>
        </div>

        {/* THE WALL — two columns drifting opposite ways */}
        <motion.div
          className="stream-wall stream-fade-y hidden h-full grid-cols-2 gap-4 overflow-hidden lg:grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {COLUMNS.map((col, i) => (
            <div
              key={i}
              className="stream-track"
              style={{ animation: `stream-up ${col.seconds}s linear infinite ${col.reverse ? "reverse" : ""}` }}
            >
              {[0, 1].map((copy) => col.shots.map((id) => card(id, copy, false)))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* THE ROW — the same screens, one line, for narrow screens */}
      <div className="stream-wall stream-fade-x mt-10 overflow-hidden py-4 lg:hidden">
        <div className="stream-track flex w-max" style={{ animation: "stream-left 70s linear infinite" }}>
          {[0, 1].map((copy) => ROW.map((id) => card(id, copy, true)))}
        </div>
      </div>
    </section>
  );
}
