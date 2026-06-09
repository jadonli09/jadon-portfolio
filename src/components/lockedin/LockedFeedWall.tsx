"use client";

import { Reveal } from "@/components/primitives/Reveal";
import { LOCKED } from "@/lib/data";
import { NativeVideoTile } from "@/components/lockedin/NativeVideoTile";
import { ReelTile } from "@/components/lockedin/ReelTile";

/* ─── Native cooking-video feed strip ─────────────────────────── */
export function LockedNativeFeed() {
  return (
    <section className="relative py-16 md:py-24" id="feed">
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        <Reveal>
          <div className="mb-10 flex items-center gap-4 md:mb-14">
            <span className="eyebrow text-[var(--accent)]">In the Kitchen</span>
            <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
            <span className="eyebrow text-[var(--muted)]">
              {LOCKED.videos.length} native videos
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-12 max-w-xl font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Cooking feasts — plays right here, no redirect needed. Hover to preview, tap to
            play.
          </p>
        </Reveal>
      </div>

      {/* Native videos — 3-up horizontal strip, 9:16 tiles */}
      <div className="mx-auto max-w-[1400px] px-3 md:px-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
          {LOCKED.videos.map((v, i) => (
            <NativeVideoTile
              key={v.src}
              src={v.src}
              poster={v.poster}
              label={v.label}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Instagram embeds grid ────────────────────────────────────── */
export function LockedInstagramGrid() {
  return (
    <section className="relative py-16 md:py-24" id="reels">
      {/* Ambient pink glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        <Reveal>
          <div className="mb-6 flex items-center gap-4 md:mb-8">
            <span className="eyebrow text-[var(--accent)]">Straight from @li_locked.in</span>
            <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
            <span className="eyebrow text-[var(--muted)]">
              {LOCKED.reels.length} reels
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-12 max-w-xl font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Live Instagram embeds — basketball, vlogs, cooking, and the grind. The white IG
            card inside is intentional; the frame around it is the design.
          </p>
        </Reveal>
      </div>

      {/* 1-col mobile → 2-col sm → 3-col lg; min ~326 px per embed */}
      <div className="mx-auto max-w-[1400px] px-3 md:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 lg:gap-6">
          {LOCKED.reels.map((reel, i) => (
            <ReelTile key={reel.code} code={reel.code} url={reel.url} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Legacy combined export — kept so any existing import of LockedFeedWall still compiles.
 * The page now mounts LockedNativeFeed + LockedInstagramGrid separately for better
 * section organisation; this wrapper renders both in sequence.
 */
export function LockedFeedWall() {
  return (
    <>
      <LockedNativeFeed />
      <LockedInstagramGrid />
    </>
  );
}
