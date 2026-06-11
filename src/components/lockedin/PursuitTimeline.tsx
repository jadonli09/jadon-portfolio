"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Pause, Play, Volume2 } from "lucide-react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { PURSUIT, PROFILE } from "@/lib/data";
import type {
  PursuitChapter,
  PursuitLogMoment,
  PursuitQuoteMoment,
  PursuitVideoMoment,
} from "@/lib/data";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

/* Spine geometry — single source for line + dot alignment.
 * Mobile: fixed 26px from the container's left edge. Desktop: centered. */
const SPINE_LEFT = "left-[26px] md:left-1/2";

function reelUrl(code: string) {
  return `https://www.instagram.com/reel/${code}/`;
}

function dayLabel(day: number) {
  return `Day ${String(day).padStart(3, "0")}`;
}

/* ─── Dot on the spine ─────────────────────────────────────────── */
function SpineDot({ accent, pulse = false }: { accent: string; pulse?: boolean }) {
  return (
    <span
      className={cn(
        "absolute top-7 z-10 -translate-x-1/2 rounded-full",
        SPINE_LEFT,
        pulse && "animate-pulse"
      )}
      style={{
        width: 11,
        height: 11,
        background: "var(--bg)",
        border: `2px solid ${accent}`,
        boxShadow: `0 0 12px ${accent}66`,
      }}
      aria-hidden
    />
  );
}

/* ─── Keystone moment — native video that plays in place ───────── */
function MomentVideoCard({
  m,
  accent,
  side,
}: {
  m: PursuitVideoMoment;
  accent: string;
  /** which side of the desktop spine the card sits on */
  side: "left" | "right";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [engaged, setEngaged] = useState(false); // user clicked → sound on
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const hoverIn = useCallback(() => {
    const v = videoRef.current;
    if (!v || engaged || !canHover || reducedMotion) return;
    v.muted = true;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, [engaged, canHover, reducedMotion]);

  const hoverOut = useCallback(() => {
    const v = videoRef.current;
    if (!v || engaged) return;
    v.pause();
    setPlaying(false);
  }, [engaged]);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (engaged && playing) {
      v.pause();
      setPlaying(false);
      setEngaged(false);
    } else {
      v.muted = false;
      v.play().then(() => {
        setPlaying(true);
        setEngaged(true);
      }).catch(() => {});
    }
  }, [engaged, playing]);

  const landscape = m.aspect === "landscape";

  return (
    <div className="relative">
      <SpineDot accent={accent} />
      <Connector side={side} accent={accent} />

      <div
        className={cn(
          "grid pl-14 md:pl-0",
          "md:grid-cols-2 md:gap-x-16 lg:gap-x-20"
        )}
      >
        {/* Day marker — opposite column, desktop only */}
        <div
          className={cn(
            "hidden md:flex md:flex-col md:justify-start md:pt-6",
            side === "left" ? "md:order-2 md:items-start" : "md:order-1 md:items-end md:text-right"
          )}
          aria-hidden
        >
          <p
            className="font-anton uppercase leading-none opacity-25"
            style={{ color: accent, fontSize: "clamp(3.2rem, 6.5vw, 6.5rem)" }}
          >
            {dayLabel(m.day)}
          </p>
          <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--muted)]">
            {m.date}
          </p>
          <p className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--muted)] opacity-80">
            <span style={{ color: accent }}>{m.views}</span> plays
          </p>
        </div>

        {/* Card */}
        <motion.div
          className={cn(
            side === "left"
              ? "md:order-1 md:justify-self-end"
              : "md:order-2 md:justify-self-start",
            landscape ? "w-full max-w-2xl" : "w-full max-w-[22rem] lg:max-w-[25rem]"
          )}
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mobile date row */}
          <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)] md:hidden">
            <span style={{ color: accent }}>{dayLabel(m.day)}</span> · {m.date}
          </p>

          <div
            className="group relative overflow-hidden rounded-2xl bg-[var(--bg-2)] transition-shadow duration-500"
            style={{ border: `1px solid color-mix(in srgb, ${accent} 45%, transparent)` }}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            {/* Frame top bar */}
            <div
              className="flex items-center justify-between border-b px-3.5 py-2.5"
              style={{ borderColor: `color-mix(in srgb, ${accent} 30%, transparent)` }}
            >
              <span
                className="font-mono text-[0.58rem] uppercase tracking-[0.25em]"
                style={{ color: accent }}
              >
                {playing ? "● playing" : "▶ plays here"}
              </span>
              <a
                href={reelUrl(m.code)}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="flex items-center gap-1 font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]"
                aria-label={`Watch "${m.title}" on Instagram`}
              >
                IG
                <ArrowUpRight className="size-2.5" />
              </a>
            </div>

            {/* Video */}
            <div
              className={cn("relative w-full cursor-pointer", landscape ? "aspect-video" : "aspect-[9/16]")}
              onClick={toggle}
              data-cursor-hover
            >
              <video
                ref={videoRef}
                src={asset(`/vid/pursuit/${m.slug}.mp4`)}
                poster={asset(`/vid/pursuit/${m.slug}.jpg`)}
                muted
                playsInline
                loop
                preload="none"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Dim gradient, lifts while playing */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 transition-opacity duration-500",
                  playing ? "opacity-15" : "opacity-60"
                )}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,10,12,0.55) 0%, transparent 30%, transparent 65%, rgba(10,10,12,0.85) 100%)",
                }}
                aria-hidden
              />
              {/* Play / pause control */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                  playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                )}
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm"
                  style={{
                    border: `1px solid ${accent}`,
                    background: `color-mix(in srgb, ${accent} 16%, transparent)`,
                  }}
                >
                  {playing ? (
                    <Pause className="size-5" style={{ color: accent, fill: accent }} strokeWidth={0} />
                  ) : (
                    <Play className="size-5 translate-x-0.5" style={{ color: accent, fill: accent }} strokeWidth={0} />
                  )}
                </span>
              </div>
              {/* Sound hint */}
              <div className="pointer-events-none absolute bottom-2.5 right-3">
                <Volume2
                  className={cn("size-3.5 transition-opacity duration-300", engaged ? "opacity-80" : "opacity-30")}
                  style={{ color: engaged ? accent : "var(--muted)" }}
                  aria-hidden
                />
              </div>
            </div>

            {/* Card text */}
            <div className="px-4 pb-4 pt-3.5 md:px-5 md:pb-5">
              <h3 className="font-anton text-xl uppercase leading-tight text-[var(--fg)] md:text-2xl">
                {m.title}
              </h3>
              <p className="mt-1.5 font-grotesk text-[0.82rem] italic leading-relaxed text-[var(--muted)]">
                “{m.caption}”
              </p>
              <div className="mt-3 flex items-center gap-4 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                <span>
                  <span style={{ color: accent }}>{m.views}</span> plays
                </span>
                <span>{m.likes} likes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Connector tick — ties a card to the spine ────────────────── */
function Connector({ side, accent }: { side: "left" | "right"; accent: string }) {
  return (
    <>
      {/* Mobile: short tick from the left rail to the content */}
      <span
        aria-hidden
        className="absolute left-[26px] top-[33px] h-px w-[26px] md:hidden"
        style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
      />
      {/* Desktop: tick from the center spine toward the card */}
      <span
        aria-hidden
        className="absolute top-[33px] hidden h-px md:block"
        style={{
          width: "clamp(2.5rem, 5vw, 4.5rem)",
          ...(side === "left"
            ? { right: "50%", background: `linear-gradient(to left, ${accent}, transparent)` }
            : { left: "50%", background: `linear-gradient(to right, ${accent}, transparent)` }),
        }}
      />
    </>
  );
}

/* ─── Log row — a framed feed entry dotted on the line ─────────── */
function LogRow({
  m,
  accent,
  side,
}: {
  m: PursuitLogMoment;
  accent: string;
  side: "left" | "right";
}) {
  return (
    <div className="relative">
      <SpineDot accent={`color-mix(in srgb, ${accent} 70%, var(--muted))`} />
      <Connector side={side} accent={`color-mix(in srgb, ${accent} 55%, transparent)`} />
      <div className="grid pl-14 md:grid-cols-2 md:gap-x-16 md:pl-0 lg:gap-x-20">
        <motion.div
          className={cn(
            "w-full max-w-[26rem]",
            side === "left"
              ? "md:order-1 md:justify-self-end"
              : "md:order-2 md:justify-self-start"
          )}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href={reelUrl(m.code)}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="group block rounded-xl px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 md:px-5 md:py-4"
            style={{
              border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
              background: `color-mix(in srgb, var(--bg-2) 72%, transparent)`,
            }}
          >
            {/* Header: day chip · date ······ plays */}
            <div className="flex items-center gap-2.5">
              <span
                className="rounded-full border px-2 py-[0.2rem] font-mono text-[0.52rem] uppercase tracking-[0.22em]"
                style={{
                  color: accent,
                  borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
                }}
              >
                {dayLabel(m.day)}
              </span>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                {m.date}
              </span>
              {m.views && (
                <span className="ml-auto font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                  <span style={{ color: accent }}>{m.views}</span> plays
                </span>
              )}
            </div>
            <p className="mt-2.5 font-grotesk text-sm leading-relaxed text-[var(--fg)]/85 transition-colors duration-200 group-hover:text-[var(--fg)] md:text-[0.95rem]">
              {m.text}
              <ArrowUpRight className="ml-1.5 inline size-3 opacity-0 transition-opacity duration-200 group-hover:opacity-70" />
            </p>
          </a>
        </motion.div>
        <div className={side === "left" ? "hidden md:block md:order-2" : "hidden md:block md:order-1"} aria-hidden />
      </div>
    </div>
  );
}

/* ─── Pull-quote moment ────────────────────────────────────────── */
function QuoteBlock({ m, accent }: { m: PursuitQuoteMoment; accent: string }) {
  return (
    <div className="relative">
      <SpineDot accent={accent} />
      <Reveal>
        <div className="pl-14 md:mx-auto md:max-w-2xl md:pl-8 md:pt-14 md:text-center">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--muted)]">
            <span style={{ color: accent }}>{dayLabel(m.day)}</span> · {m.date}
          </p>
          <a
            href={reelUrl(m.code)}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="mt-4 block"
          >
            <p className="font-hand text-2xl leading-snug md:text-4xl" style={{ color: accent }}>
              “{m.text}”
            </p>
          </a>
        </div>
      </Reveal>
    </div>
  );
}

/* ─── One chapter: spine segment + header + moments ────────────── */
function ChapterBlock({
  ch,
  prevAccent,
  altStart,
}: {
  ch: PursuitChapter;
  prevAccent: string;
  /** alternation carries across chapters so cards keep zig-zagging */
  altStart: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  let altIndex = altStart;

  return (
    <div ref={ref} className="relative">
      {/* Spine — dim gradient base + scroll-grown glowing overlay */}
      <div
        className={cn("absolute inset-y-0 w-px -translate-x-1/2 opacity-25", SPINE_LEFT)}
        style={{ background: `linear-gradient(to bottom, ${prevAccent}, ${ch.accent})` }}
        aria-hidden
      />
      <motion.div
        className={cn("absolute inset-y-0 w-px -translate-x-1/2 origin-top", SPINE_LEFT)}
        style={{
          background: `linear-gradient(to bottom, ${prevAccent}, ${ch.accent})`,
          boxShadow: `0 0 10px ${ch.accent}99`,
          scaleY,
        }}
        aria-hidden
      />

      {/* Chapter header */}
      <div className="relative pb-16 pt-24 md:pb-24 md:pt-36">
        {/* Ghost chapter number */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 select-none font-anton leading-none opacity-[0.05] md:top-14"
          style={{ fontSize: "clamp(8rem, 24vw, 18rem)", color: ch.accent }}
        >
          {ch.num}
        </span>

        <div className="relative pl-14 md:pl-0 md:text-center">
          <Reveal>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-[var(--muted)]">
              <span style={{ color: ch.accent }}>Chapter {ch.num}</span> — {ch.range}
            </p>
          </Reveal>
          <div className="mt-5" style={{ fontSize: "clamp(2.6rem, 7.5vw, 5.5rem)", lineHeight: 0.92 }}>
            <KineticHeadline
              as="h2"
              text={ch.title[0]}
              className="font-anton block uppercase text-[var(--fg)]"
              delay={0.05}
            />
            <div style={{ color: ch.accent }}>
              <KineticHeadline
                as="h2"
                text={ch.title[1]}
                className="font-anton block uppercase"
                delay={0.18}
              />
            </div>
          </div>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl font-grotesk text-sm leading-relaxed text-[var(--muted)] md:mx-auto md:text-base">
              {ch.narrative}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Moments */}
      <div className="flex flex-col gap-14 pb-20 md:gap-20 md:pb-28">
        {ch.moments.map((m) => {
          if (m.kind === "quote") {
            return <QuoteBlock key={m.code} m={m} accent={ch.accent} />;
          }
          const side = altIndex % 2 === 0 ? "left" : "right";
          altIndex += 1;
          if (m.kind === "video") {
            return <MomentVideoCard key={m.code} m={m} accent={ch.accent} side={side} />;
          }
          return <LogRow key={m.code} m={m} accent={ch.accent} side={side} />;
        })}
      </div>
    </div>
  );
}

/* ─── The full year, in order ──────────────────────────────────── */
export function PursuitTimeline() {
  const chapters = PURSUIT.chapters;
  // Cards (videos + logs) zig-zag in one continuous sequence across chapters.
  let altCount = 0;
  const starts = chapters.map((ch) => {
    const s = altCount;
    altCount += ch.moments.filter((m) => m.kind !== "quote").length;
    return s;
  });

  return (
    <section id="timeline" className="relative">
      <div className="mx-auto max-w-7xl px-5 md:px-9">
        {/* Day 001 opener on the spine */}
        <div className="relative pt-10 md:pt-16">
          <Reveal>
            <div className="pl-14 md:pl-0 md:text-center">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-[var(--accent)]">
                ● REC — Day 001 · Jun 6, 2025
              </p>
              <p className="mt-3 font-grotesk text-sm text-[var(--muted)] md:text-base">
                One year. Five chapters. Every date, caption, and play count below is real.
              </p>
            </div>
          </Reveal>
        </div>

        {chapters.map((ch, i) => (
          <ChapterBlock
            key={ch.id}
            ch={ch}
            prevAccent={i === 0 ? "color-mix(in srgb, var(--accent) 30%, transparent)" : chapters[i - 1].accent}
            altStart={starts[i]}
          />
        ))}

        {/* Close — the line keeps going */}
        <div className="relative pb-24 md:pb-32">
          <div
            className={cn("absolute top-0 h-16 w-px -translate-x-1/2 opacity-25", SPINE_LEFT)}
            style={{
              background: `linear-gradient(to bottom, ${chapters[chapters.length - 1].accent}, transparent)`,
            }}
            aria-hidden
          />
          <div className="pt-24 pl-14 md:pl-0 md:text-center">
            <Reveal>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-[var(--muted)]">
                Day 369 — <span className="text-[var(--accent)]">to be continued</span>
              </p>
              <a
                href={PROFILE.links.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group mt-4 inline-flex items-center gap-2 font-grotesk text-sm text-[var(--fg)]/85 transition-colors hover:text-[var(--fg)] md:text-base"
              >
                The next chapter is posting now — {PROFILE.links.instagramHandle}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
