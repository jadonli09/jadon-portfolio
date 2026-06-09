"use client";

import { Reveal } from "@/components/primitives/Reveal";
import { LOCKED } from "@/lib/data";
import { NativeVideoTile } from "@/components/lockedin/NativeVideoTile";
import { ReelTile } from "@/components/lockedin/ReelTile";

type TileEntry =
  | { kind: "video"; src: string; poster: string; label: string; globalIndex: number }
  | { kind: "reel"; code: string; url: string; globalIndex: number };

/** Interleave videos and reels into a single ordered list for the wall */
function buildTiles(): TileEntry[] {
  const videos = LOCKED.videos.map((v, i) => ({
    kind: "video" as const,
    ...v,
    globalIndex: i,
  }));
  const reels = LOCKED.reels.map((r, i) => ({
    kind: "reel" as const,
    ...r,
    globalIndex: i,
  }));

  // Interleave: 1 video, 3 reels, 1 video, 3 reels, 1 video, remaining reels
  const tiles: TileEntry[] = [];
  let vi = 0;
  let ri = 0;
  while (vi < videos.length || ri < reels.length) {
    if (vi < videos.length) {
      tiles.push(videos[vi]);
      vi++;
    }
    for (let k = 0; k < 3 && ri < reels.length; k++, ri++) {
      tiles.push(reels[ri]);
    }
  }
  return tiles;
}

const TILES = buildTiles();

export function LockedFeedWall() {
  return (
    <section className="relative py-16 md:py-24" id="feed">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        <Reveal>
          <div className="mb-10 flex items-center gap-4 md:mb-14">
            <span className="eyebrow text-[var(--accent)]">The Feed</span>
            <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
            <span className="eyebrow text-[var(--muted)]">
              {LOCKED.videos.length} native · {LOCKED.reels.length} reels
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-12 max-w-xl font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Cooking feasts and reel moments — the whole feed in one wall. Native videos play
            right here; reel tiles link to Instagram.
          </p>
        </Reveal>
      </div>

      {/* The wall — responsive columns: 2 mobile, 3 md, 4 lg, 5 xl */}
      <div className="mx-auto max-w-[1800px] px-3 md:px-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-3">
          {TILES.map((tile, i) =>
            tile.kind === "video" ? (
              <NativeVideoTile
                key={`video-${tile.globalIndex}`}
                src={tile.src}
                poster={tile.poster}
                label={tile.label}
                index={i}
              />
            ) : (
              <ReelTile
                key={`reel-${tile.globalIndex}`}
                code={tile.code}
                url={tile.url}
                index={i}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
