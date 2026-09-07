"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageStreamHero, type StreamImage } from "@/components/ui/image-stream-hero";
import { LiquidGlass, LiquidGlassFilter } from "@/components/ui/liquid-glass";
import { StatFigure } from "@/components/built/StatFigure";
import { asset } from "@/lib/base";
import { EASE_OUT } from "@/lib/fluid";
import { PROFILE, PROJECTS } from "@/lib/data";

/* ────────────────────────────────────────────────────────────────────
   StreamHero — twelve real screens rushing the viewer.

   Every card is something that is actually live, at its own shape and whole:
   AcornPrep's practice, grading, tutor and study surfaces plus its home page;
   NotebookLI's reader; a Hermes story; and the viewport screenshots of
   CueSheet, the ASB site, the Youth STEM Journal, MSJ Makes and this site.
   No stock, no placeholder gradients — the corridor IS the portfolio, and the
   headline standing in the middle of it is the only thing that isn't a
   screenshot.
   ──────────────────────────────────────────────────────────────────── */

/**
 * Every card carries its own shape. `aspect` is the file's real width ÷ height,
 * so nothing is cropped to fit a house format: the tutor screen and the Hermes
 * story ride the corridor as portraits, the browser captures as landscapes.
 *
 * Order matters: the two rails walk this list together, so neighbours in the
 * array end up beside each other in depth. Interleaved by product AND by
 * shape, so no stretch of the corridor is all one colour or all one format.
 */
const STREAM: StreamImage[] = [
  { src: "/embeds/stream/acorn-mcq.jpg", aspect: 1.7729, alt: "AcornPrep MCQ practice" },
  { src: "/embeds/stream/hermes-story.jpg", aspect: 0.5625, alt: "A Hermes schedule story" },
  { src: "/embeds/stream/cuesheet.jpg", aspect: 1.7131, alt: "CueSheet" },
  { src: "/embeds/stream/acorn-tutor.jpg", aspect: 0.6663, alt: "AcornPrep AI tutor" },
  { src: "/embeds/stream/asb.jpg", aspect: 1.6, alt: "MSJHS ASB" },
  { src: "/embeds/stream/notebook-reader.jpg", aspect: 1.4299, alt: "NotebookLI reader" },
  { src: "/embeds/stream/acorn-frq.jpg", aspect: 1.7927, alt: "AcornPrep free-response grading" },
  { src: "/embeds/stream/msjmakes.jpg", aspect: 1.6, alt: "MSJ Makes" },
  { src: "/embeds/stream/acorn-tips.jpg", aspect: 1.5534, alt: "AcornPrep study modes" },
  { src: "/embeds/stream/ysj.jpg", aspect: 1.6, alt: "Youth STEM Journal" },
  { src: "/embeds/stream/acornprep.jpg", aspect: 1.6, alt: "AcornPrep" },
  { src: "/embeds/stream/jadonli.jpg", aspect: 1.6, alt: "jadonli.com" },
].map((i) => ({ ...i, src: asset(i.src) }));

/**
 * Three figures, and no fourth. `08` is the length of PROJECTS rather than a
 * literal, so adding a ninth product cannot leave a stale number on the page.
 *
 * "People using them" is the whole fleet, not AcornPrep alone: ~500 on
 * AcornPrep, ~1,500 on the ASB site, ~100 on MSJ Makes, and the remainder
 * across CueSheet, the Journal and NotebookLI. AcornPrep's own 500+ still
 * appears once, in its chapter — this is the sum, which is a different claim.
 */
const TELEMETRY = [
  { value: String(PROJECTS.length).padStart(2, "0"), label: "Products shipped" },
  { value: "2,200+", label: "People using them" },
  { value: "#1", label: "Google result" },
];

/** One masked line of the display headline. */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
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
  const acorn = PROJECTS.find((p) => p.slug === "acornprep")!;

  return (
    <section className="relative">
      <ImageStreamHero
        images={STREAM}
        cards={10}
        speed={22}
        axis={50}
        /*
          Retuned for mixed aspects. Card WIDTH now follows each image, and the
          widest here is 1.79 — so at the old exit a landscape card measured
          107cqw across and its inner edge crossed the axis, straight through
          the headline. The rails are pushed out and the exit pulled in until
          the widest card still clears the middle:

            railExit − (1.79 × exitHeight) / 2  =  70 − 37.6  =  32.4cqw
        */
        path={{ exitHeight: 42, railExit: 70 }}
        className="h-[72svh] min-h-[30rem] w-full bg-[var(--bg)] md:h-[88svh] md:min-h-[36rem]"
      >
        {/*
          The corridor converges on the vanishing point, so the middle of the
          frame is the one place it is never busy — which is exactly where the
          headline goes. The scrim is a soft radial rather than a flat wash so
          the cards stay bright at the edges where they are largest.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            // Tight enough to clear the headline and no more. A wide scrim
            // whites out the cards at the sides, which are the largest and the
            // only ones you can actually read — the whole point of the shot.
            //
            // Lifted slightly off centre so the glass pane in the lower third
            // is not fully washed out. Only slightly: pulled higher than this,
            // the lede started competing with the cards behind it on narrow
            // screens, and legibility beats refraction — every card in the
            // stream is a screenshot of a LIGHT interface, so what shows
            // through a pane over them is close to white either way.
            background:
              "radial-gradient(54% 38% at 50% 44%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
        {/* Fades tie the corridor into the white page above and below. Eased,
            not linear, and deeper than they were: a two-stop gradient put a
            visible shoulder partway down where the fade looked like it stopped.
            See `.scrim-*` in globals.css. */}
        <div
          aria-hidden
          className="scrim-down pointer-events-none absolute inset-x-0 top-0 h-32 md:h-40"
        />
        <div
          aria-hidden
          className="scrim-up pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-52"
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center md:px-9">
          <motion.p
            className="t-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            03 — Things I&apos;ve built
          </motion.p>

          <h1 className="t-display mt-5 text-balance">
            <Line delay={0.08}>Ship it.</Line>
            <Line delay={0.16}>
              <span className="text-[var(--muted)]">Then ship the next one.</span>
            </Line>
          </h1>

          <motion.p
            className="t-body mt-6 max-w-lg text-balance"
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.3 }}
          >
            Built and launched from a bedroom in Fremont. Every screen flying past is
            one of them, live right now.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.38 }}
          >
            <a
              href={acorn.url}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-hover
              className="btn btn-primary"
            >
              Visit AcornPrep
            </a>
            <a
              href={PROFILE.links.github}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-hover
              className="btn btn-glass"
            >
              View the code <ArrowUpRight className="size-4" />
            </a>
          </motion.div>

          {/*
            The three figures, ON the corridor rather than on the white page
            below it. That is the whole reason the material is here: a pane of
            glass over flat paper is an expensive rectangle, but over a moving
            wall of screenshots it refracts them, and the numbers read as
            floating in front of the work they describe.

            Transform-only entrance, on purpose. Fading this in by animating
            opacity on the wrapper would make it a backdrop root for the frame
            of the animation and flash the glass clear — see `liquid-glass.tsx`.
          */}
          <motion.dl
            /*
              Wide on purpose. The corridor converges on a vanishing point, so
              its MIDDLE is the one part with nothing in it — a narrow pane sat
              in that hole and frosted blank paper. At this width the pane
              reaches the cards on both flanks, which is where the refraction
              actually has something to bend.
            */
            /*
              Sized to the headline above it, not to the corridor. Full-bleed
              was tried and reads as a plain bar: every card in the stream is a
              screenshot of a LIGHT interface, so a blurred backdrop is white
              wherever it lands and extra width buys no extra refraction. What
              carries the material here is the bevel and the shadow.
            */
            className="mt-9 w-full max-w-[52rem] md:mt-11"
            initial={{ transform: "translateY(16px)" }}
            animate={{ transform: "translateY(0px)" }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.46 }}
          >
            <LiquidGlass contentClassName="grid grid-cols-3 divide-x divide-black/10">
              {TELEMETRY.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1.5 px-3 py-5 md:px-5 md:py-6"
                >
                  <dt className="t-num text-[1.6rem] leading-none md:text-[1.9rem]">
                    <StatFigure value={s.value} />
                  </dt>
                  <dd className="t-small vibrant text-[0.72rem] leading-tight md:text-[0.78rem]">
                    {s.label}
                  </dd>
                </div>
              ))}
            </LiquidGlass>
          </motion.dl>
        </div>
      </ImageStreamHero>

      {/* One displacement map for the page, mounted beside the only thing
          using it. */}
      <LiquidGlassFilter />
    </section>
  );
}
