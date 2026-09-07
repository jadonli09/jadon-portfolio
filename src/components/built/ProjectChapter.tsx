"use client";

import { ArrowUpRight } from "lucide-react";
import { Rise } from "@/components/built/Rise";
import { ScrubLine } from "@/components/built/ScrubLine";
import { ScrollStage } from "@/components/built/ScrollStage";
import { StatFigure } from "@/components/built/StatFigure";
import { STORIES } from "@/lib/built-story";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   One flagship project.

   What this used to be: a number, a name, a tagline, a 120-word paragraph, a
   screenshot, four stat tiles, a stack row, a button, a photo row and a
   hand-built imitation of the product. Roughly four screens, most of it prose.

   What it is now: a name, a scrubbed tagline, one line of context, and the
   real product pinned beside its own features. The paragraph is gone — its
   content survives as the beats in `built-story.ts`, which is the same
   information at a tenth of the word count and with a picture attached to
   each claim.
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
    underneath: the figures, the stack, the link, and whatever the caller
    passed as children. Every other chapter keeps them in a row below, where
    a wide screenshot has already used the width.
  */
  const beside =
    !stage && story.beats.length === 1 && isPortrait(story.beats[0].aspect);

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

      <div className={cn("flex flex-wrap items-center gap-2", !beside && "lg:ml-auto")}>
        {project.stack.map((s) => (
          <span key={s} className="pill">
            {s}
          </span>
        ))}
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor-hover
          className="btn btn-primary ml-2"
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
      className="scroll-mt-20 border-t border-[var(--line)]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">
        {/* ── Header ── */}
        <Rise>
          <p className="t-label flex items-center gap-3">
            <span className="tabular-nums">{String(index).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-[var(--line-2)]" />
            <span>{project.name}</span>
            {project.launched ? (
              <>
                <span className="h-px w-8 bg-[var(--line-2)]" />
                <span>{project.launched}</span>
              </>
            ) : null}
          </p>
        </Rise>

        <ScrubLine text={project.tagline} className="mt-5 max-w-4xl" />

        <Rise delay={0.05}>
          <p className="t-body mt-4 max-w-xl">{story.lede}</p>
        </Rise>

        {/* ── The product, pinned, with its features scrolling past ── */}
        {stage ?? (
          <ScrollStage
            beats={story.beats}
            name={project.name}
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
