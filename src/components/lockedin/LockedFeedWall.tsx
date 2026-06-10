"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { LOCKED } from "@/lib/data";
import { NativeVideoTile } from "@/components/lockedin/NativeVideoTile";

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

/* ─── Phone-shaped reel frame ──────────────────────────────────── */
type PhoneFrameProps = {
  code: string;
  url: string;
  index: number;
  /** "pink" | "cyan" — which neon colour to use for the border glow */
  accent?: "pink" | "cyan";
  /** rotational tilt applied to the outer wrapper for editorial energy */
  tilt?: number;
};

function PhoneFrame({ code, url, index, accent = "pink", tilt = 0 }: PhoneFrameProps) {
  const glowColor =
    accent === "cyan" ? "rgba(61,240,255,0.55)" : "rgba(255,61,129,0.55)";
  const borderColor =
    accent === "cyan" ? "var(--accent-2)" : "var(--accent)";
  const textColor =
    accent === "cyan" ? "text-[var(--accent-2)]" : "text-[var(--accent)]";
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      style={{ rotate: tilt }}
      initial={{ opacity: 0, y: 52, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="group relative flex flex-col overflow-hidden rounded-3xl"
        style={{
          border: `1.5px solid ${borderColor}`,
          boxShadow: `0 0 0 1.5px transparent`,
        }}
        whileHover={{
          scale: 1.035,
          y: -6,
          boxShadow: `0 0 32px 4px ${glowColor}, 0 0 0 1.5px ${borderColor}`,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        data-cursor-hover
      >
        {/* Phone top bar — handle + index + external link */}
        <div
          className="flex items-center justify-between border-b px-3.5 py-2.5"
          style={{ borderColor: `color-mix(in srgb, ${borderColor} 40%, transparent)` }}
        >
          {/* Camera notch + handle */}
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full opacity-80"
              style={{ background: borderColor }}
              aria-hidden
            />
            <span className={`font-mono text-[0.58rem] uppercase tracking-[0.25em] ${textColor}`}>
              @li_locked.in
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Index pill */}
            <span className="font-mono text-[0.48rem] uppercase tracking-widest text-[var(--muted)]">
              {numStr}
            </span>
            {/* External link */}
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="group/link flex items-center gap-0.5 font-mono text-[0.48rem] uppercase tracking-widest text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]"
              aria-label="Watch reel on Instagram"
            >
              <ArrowUpRight className="size-2.5 opacity-70 transition-opacity group-hover/link:opacity-100" />
            </a>
          </div>
        </div>

        {/* Reel iframe — fixed height, no scroll */}
        <div className="relative w-full overflow-hidden" style={{ height: 560 }}>
          <iframe
            src={`https://www.instagram.com/reel/${code}/embed/`}
            loading="lazy"
            scrolling="no"
            frameBorder={0}
            allowTransparency
            allow="encrypted-media"
            title={`Instagram reel ${code}`}
            className="h-full w-full"
            style={{ border: 0 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Featured row — 2-up large tiles ─────────────────────────── */
type FeaturedReelProps = {
  code: string;
  url: string;
  index: number;
  accent?: "pink" | "cyan";
  tilt?: number;
};

function FeaturedReel({ code, url, index, accent = "pink", tilt = 0 }: FeaturedReelProps) {
  const glowColor =
    accent === "cyan" ? "rgba(61,240,255,0.6)" : "rgba(255,61,129,0.6)";
  const borderColor =
    accent === "cyan" ? "var(--accent-2)" : "var(--accent)";
  const textColor =
    accent === "cyan" ? "text-[var(--accent-2)]" : "text-[var(--accent)]";
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      style={{ rotate: tilt }}
      initial={{ opacity: 0, y: 60, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full"
    >
      <motion.div
        className="group relative flex flex-col overflow-hidden rounded-3xl"
        style={{
          border: `2px solid ${borderColor}`,
        }}
        whileHover={{
          scale: 1.025,
          y: -8,
          boxShadow: `0 0 48px 8px ${glowColor}, 0 0 0 2px ${borderColor}`,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        data-cursor-hover
      >
        {/* Phone top bar */}
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: `color-mix(in srgb, ${borderColor} 35%, transparent)` }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: borderColor, boxShadow: `0 0 8px ${glowColor}` }}
              aria-hidden
            />
            <span className={`font-mono text-[0.65rem] uppercase tracking-[0.28em] ${textColor}`}>
              @li_locked.in
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)]">
              {numStr}
            </span>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className={`flex items-center gap-1 font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]`}
              aria-label="Watch reel on Instagram"
            >
              Watch
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>

        {/* Reel iframe — taller for featured treatment */}
        <div className="relative w-full overflow-hidden" style={{ height: 680 }}>
          <iframe
            src={`https://www.instagram.com/reel/${code}/embed/`}
            loading="lazy"
            scrolling="no"
            frameBorder={0}
            allowTransparency
            allow="encrypted-media"
            title={`Featured Instagram reel ${code}`}
            className="h-full w-full"
            style={{ border: 0 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Mini marquee divider ─────────────────────────────────────── */
function FeedDivider() {
  const items = [
    "the feed",
    "@li_locked.in",
    "locked in",
    "all reels",
    "follow along",
  ];
  return (
    <div className="relative my-10 overflow-hidden border-y border-[var(--line)] bg-[var(--bg-2)] py-3 md:my-14">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20"
        style={{ background: "linear-gradient(to right, var(--bg-2), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20"
        style={{ background: "linear-gradient(to left, var(--bg-2), transparent)" }}
        aria-hidden
      />
      {/* Manual inline marquee — avoid importing Marquee since we need reverse */}
      <div className="flex w-full overflow-hidden" aria-hidden>
        <span
          className="marquee-track"
          style={{ animationDuration: "18s", animationDirection: "reverse" }}
        >
          {[...items, ...items].map((it, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--accent-2)]">
              {it}
              <span className="opacity-40">◈</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

/* ─── Instagram reel wall (redesigned) ────────────────────────── */
export function LockedInstagramGrid() {
  // Separate featured (first 2) from mosaic (remaining 8)
  const featured = LOCKED.reels.slice(0, 2);
  const mosaic = LOCKED.reels.slice(2);

  return (
    <section className="relative py-16 md:py-24" id="reels">
      {/* Ambient pink glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 opacity-[0.07]"
        style={{
          background: "radial-gradient(ellipse, var(--accent) 0%, transparent 65%)",
          filter: "blur(90px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        {/* Section header */}
        <Reveal>
          <div className="mb-8 flex items-center gap-4 md:mb-10">
            <span className="eyebrow text-[var(--accent)]">The feed</span>
            <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
            <span className="eyebrow text-[var(--muted)]">
              straight from @li_locked.in
            </span>
          </div>
        </Reveal>

        {/* ── FEATURED ROW — 2 large phone-framed reels ── */}
        <Reveal delay={0.1}>
          <p className="mb-10 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--accent)]">
            ✦ Featured
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:gap-10 lg:gap-14">
          {featured.map((reel, i) => (
            <FeaturedReel
              key={reel.code}
              code={reel.code}
              url={reel.url}
              index={i}
              accent={i % 2 === 0 ? "pink" : "cyan"}
              tilt={i % 2 === 0 ? -1.2 : 1.2}
            />
          ))}
        </div>

        {/* ── Divider marquee between featured and mosaic ── */}
        <FeedDivider />

        {/* ── MOSAIC GRID — remaining 8 reels ── */}
        <Reveal delay={0.05}>
          <p className="mb-8 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)]">
            ◈ All reels
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {mosaic.map((reel, i) => {
            // Alternating vertical offset on even/odd columns for editorial mosaic feel
            const isOddCol = i % 2 === 1;
            const accent: "pink" | "cyan" = i % 3 === 1 ? "cyan" : "pink";
            // Slight alternating tilt for editorial energy, very subtle
            const tilt = i % 4 === 0 ? -0.8 : i % 4 === 2 ? 0.8 : i % 4 === 1 ? 0.5 : -0.5;

            return (
              <div
                key={reel.code}
                className={isOddCol ? "md:translate-y-6" : ""}
              >
                <PhoneFrame
                  code={reel.code}
                  url={reel.url}
                  index={i + 2}
                  accent={accent}
                  tilt={tilt}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Legacy combined export — kept so any existing import of LockedFeedWall still compiles.
 */
export function LockedFeedWall() {
  return (
    <>
      <LockedNativeFeed />
      <LockedInstagramGrid />
    </>
  );
}
