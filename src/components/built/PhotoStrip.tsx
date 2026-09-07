"use client";

import { RiseGroup, RiseItem } from "@/components/built/Rise";
import { Photo } from "@/components/primitives/Photo";
import { cn } from "@/lib/cn";

export type StripPhoto = { src: string; alt: string; caption: string };

/* ────────────────────────────────────────────────────────────────────
   Four photographs from the build, in a strip.

   Half the height the old grid took: 16:10 frames rather than 4:3, captions
   trimmed to one line, and the whole block starting straight after the product
   instead of behind its own heading. The photographs are the graphic — they do
   not need a label announcing that photographs follow.
   ──────────────────────────────────────────────────────────────────── */

export function PhotoStrip({ photos }: { photos: StripPhoto[] }) {
  return (
    <RiseGroup
      // Columns track the count, so removing a photograph closes the row
      // rather than leaving a hole where the fourth used to be.
      className={cn(
        "mt-12 grid grid-cols-2 gap-3 border-t border-[var(--line)] pt-8 lg:gap-4",
        photos.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
      )}
      delayChildren={0.04}
    >
      {photos.map((p) => (
        <RiseItem key={p.src}>
          <figure>
            <div className="canvas aspect-[16/10] overflow-hidden">
              <Photo src={p.src} alt={p.alt} />
            </div>
            <figcaption className="t-small mt-2 truncate text-[0.72rem]" title={p.caption}>
              {p.caption}
            </figcaption>
          </figure>
        </RiseItem>
      ))}
    </RiseGroup>
  );
}
