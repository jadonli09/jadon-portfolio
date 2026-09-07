"use client";

import { ArrowUpRight } from "lucide-react";
import { Rise } from "@/components/built/Rise";
import { ScrubLine } from "@/components/built/ScrubLine";
import { ScrollStage } from "@/components/built/ScrollStage";
import { StatFigure } from "@/components/built/StatFigure";
import { asset } from "@/lib/base";
import { STORIES } from "@/lib/built-story";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   One flagship project.

   What this used to be: a number, a name, a tagline, a 120-word paragraph, a
   screenshot, four stat tiles, a stack row, a button, a photo row and a
   hand-built imitation of the product. Roughly four screens, most of it prose.

   What it is now: the product's own mark and NAME at full size, its tagline as
   the line under it, one line of context, and the real product pinned beside
   its own features. The paragraph is gone — its content survives as the beats
   in `built-story.ts`, which is the same information at a tenth of the word
   count and with a picture attached to each claim.

   The name leads because the name is what a reader needs to leave with. The
   tagline is the better sentence, but "Unconventionally productive AP study
   tools" at 54px told you what it does while never quite telling you what it
   is called; the mark and the name do that in the space the tagline used to
   fill alone.
   ──────────────────────────────────────────────────────────────────── */

/** A portrait screen is tall enough that the section's facts can sit beside it. */
function isPortrait(aspect?: string) {
  if (!aspect) return false;
  const [w, h] = aspect.split("/").map(Number);
  return Boolean(w && h && w / h < 0.95);
}

export function ProjectChapter({
  project,
  index,
  stage,
  children,
}: {
  project: Project;
  index: number;
  /**
   * Replaces the pinned screen-and-beats stage. Hermes uses it: the product
   * has no interface to pin, so its section shows the pipeline instead.
   */
  stage?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const story = STORIES[project.slug];

  /*
    A single portrait screen — Hermes's story — leaves a tall column of empty
    page to its right that one line of copy cannot fill. So everything the
    section still has to say moves up into that column instead of stacking
    underneath: the figures, the link, and whatever the caller passed as
    children. Every other chapter keeps them in a row below, where a wide
    screenshot has already used the width.
  */
  const beside =
    !stage && story.beats.length === 1 && isPortrait(story.beats[0].aspect);

  /*
    The eyebrow no longer prints the product's name: the name is the heading
    directly beneath it now, and a chapter that says "ACORNPREP" twice in two
    lines is just noise. What is left is the position in the sequence and the
    date, which the heading does not carry.
  */
  const header = (
    <div>
      <Rise>
        <p className="t-label flex items-center gap-3">
          <span className="tabular-nums">{String(index).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-[var(--line-2)]" />
          <span>{project.launched ?? project.domain}</span>
        </p>
      </Rise>

      <Rise delay={0.03}>
        <h2 className="t-title mt-4 flex items-center gap-3 md:gap-4">
          {project.logo ? (
            /*
              The product's real mark, pulled from its own site. Decorative:
              the name is right beside it in text, so announcing the logo as
              well would read the product's name twice to a screen reader.

              Sized in `em` so it tracks the heading rather than a fixed pixel
              value, `w-auto` so a wordmark (MSJ Makes) is not squashed into a
              square, and rounded because two of these marks are app icons with
              their own filled ground.
            */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset(project.logo)}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-[0.92em] w-auto max-w-[1.5em] shrink-0 rounded-[0.18em] object-contain"
            />
          ) : null}
          {project.name}
        </h2>
      </Rise>

      {/*
        The tagline, demoted from the statement line to the caption under the
        name — and held to ONE line. `--ch` is its own length, which is what
        lets `.t-oneline` shrink the step just enough to keep a trailing word
        like "tools." from falling onto a line of its own.
      */}
      <ScrubLine
        text={project.tagline}
        baseClass="t-oneline"
        className="mt-3 font-medium text-[var(--fg)]"
        style={{ "--ch": project.tagline.length } as React.CSSProperties}
      />

      <Rise delay={0.05}>
        <p className="t-body mt-3 max-w-xl">{story.lede}</p>
      </Rise>
    </div>
  );

  const facts = (
    <Rise
      className={cn(
        "flex flex-wrap items-center gap-x-10 gap-y-6",
        beside
          ? "mt-8 border-t border-[var(--line)] pt-7"
          : "mt-12 border-t border-[var(--line)] pt-8",
      )}
    >
      {project.stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1">
          <p className="t-num text-[1.65rem] leading-none">
            <StatFigure value={s.value} />
          </p>
          <p className="t-small text-[0.75rem] leading-tight">{s.label}</p>
        </div>
      ))}

      {/*
        No stack pills. "React · TypeScript · AI grading" is a list of things
        every one of these is built out of — it separated no product from any
        other, and it sat in the row where the figures, which do, have to be
        read. The record still carries `stack`; this page just stops printing it.
      */}
      <div className={cn("flex items-center", !beside && "lg:ml-auto")}>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor-hover
          className="btn btn-primary"
        >
          {project.domain} <ArrowUpRight className="size-4" />
        </a>
      </div>
    </Rise>
  );

  return (
    <section
      id={project.slug}
      data-chapter={project.slug}
      /*
        No rule above the FIRST chapter. The hero's corridor already dissolves
        into the page through a long scrim, and a hairline drawn across the end
        of that fade puts back exactly the seam the fade exists to remove.
      */
      className={cn("scroll-mt-20", index > 1 && "border-t border-[var(--line)]")}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24",
          // The first chapter runs straight on from the hero. The corridor
          // already ends in a long fade to white, so a full section's padding
          // on top of that is a second empty screen doing nothing.
          index === 1 && "pt-8 md:pt-10",
        )}
      >
        {/*
          The header goes INSIDE the stage when the stage pins, so the two
          arrive as one composition. Left outside it, the pinned screenful is
          centred in a viewport that begins below the header — which put half a
          screen of white between the tagline and the product, and another half
          underneath it. A custom stage (Hermes) does not pin, so its header
          simply sits above.
        */}
        {stage ? (
          <>
            {header}
            {stage}
          </>
        ) : (
          <ScrollStage
            beats={story.beats}
            name={project.name}
            header={header}
            aside={
              beside ? (
                <>
                  {facts}
                  {children}
                </>
              ) : undefined
            }
          />
        )}

        {beside ? null : (
          <>
            {facts}
            {children}
          </>
        )}
      </div>
    </section>
  );
}
