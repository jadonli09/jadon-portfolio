"use client";

import { CHAPTERS } from "@/lib/data";
import { StoryChapter } from "./StoryChapter";
import { ChapterRail } from "./ChapterRail";

/** The connected chapters of the story, threaded by the ChapterRail. */
export function StorySpine() {
  return (
    <div className="relative">
      <ChapterRail />
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-24 md:px-9 md:pt-32">
        <p className="eyebrow mb-4">The story</p>
        <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight text-[#f4f1ea] md:text-5xl">
          One person, told in seven chapters. Read straight through — or dig into any of them.
        </h2>
      </div>
      {CHAPTERS.map((c, i) => (
        <StoryChapter key={c.id} chapter={c} index={i} />
      ))}
    </div>
  );
}
