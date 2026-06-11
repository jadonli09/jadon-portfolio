"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { Photo } from "@/components/primitives/Photo";
import { BallIcon, PebbleGrain, RimNet, SeamArcs, HalfCourt } from "@/components/court/BallMotifs";
import { COURT } from "@/lib/data";
import { cn } from "@/lib/cn";

/**
 * Career timeline rendered as the seams of a basketball.
 * The whole section sits inside a giant ghosted pebble-leather ball; the spine
 * is one continuous seam channel that bows left/right toward each era card;
 * every node is a mini ball; the final seam drops the ball through a net.
 * Game photos from each era are embedded directly in the cards.
 */

type EraPhoto = { src: string; alt: string; tag: string; pos: string };

/** Game photo per era, keyed by role. `pos` = object-position keeping the player in frame. */
const ERA_PHOTOS: Record<string, EraPhoto> = {
  "AAU Basketball": {
    src: "/img/aau-basketball.jpg",
    alt: "Jadon driving baseline in a Trust AAU jersey, #27",
    tag: "AAU · Trust №27",
    pos: "22% 40%",
  },
  "Freshman Co-Captain": {
    src: "/img/frosh-bbal.jpg",
    alt: "Jadon pushing the break for MSJ Freshman basketball, #20",
    tag: "Frosh · №20",
    pos: "center 30%",
  },
  "JV Co-Captain": {
    src: "/img/jv-bbal.jpg",
    alt: "Jadon surveying the defense for MSJ JV basketball, #12",
    tag: "JV · №12",
    pos: "center 32%",
  },
  "Varsity · started first 5": {
    src: "/img/var-bbal2.jpg",
    alt: "Jadon attacking off the dribble for MSJ Varsity, #20",
    tag: "Varsity · №20",
    pos: "center 32%",
  },
  "NCS Champion": {
    src: "/img/var-bbal1.jpg",
    alt: "Jadon extending for a layup through contact in the NCS title season",
    tag: "Title Run · №20",
    pos: "center 28%",
  },
};

/**
 * One stretch of seam between two nodes. Rendered per row with
 * preserveAspectRatio="none" so it spans the row's exact height; the channel
 * bows toward the era card. Three passes: dark groove, leather ridge, and a
 * scroll-drawn bright seam line.
 */
function SeamSegment({
  bulge,
  inView,
  delay,
}: {
  bulge: "left" | "right" | "none";
  inView: boolean;
  delay: number;
}) {
  const x = bulge === "right" ? 84 : bulge === "left" ? 16 : 50;
  const d =
    bulge === "none"
      ? "M 50 0 L 50 100"
      : `M 50 0 C 50 16, ${x} 20, ${x} 50 C ${x} 80, 50 84, 50 100`;
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      {/* Channel groove */}
      <path d={d} stroke="#050505" strokeWidth={9} fill="none" vectorEffect="non-scaling-stroke" opacity={0.9} />
      {/* Leather ridge */}
      <path d={d} stroke="var(--accent)" strokeWidth={11} fill="none" vectorEffect="non-scaling-stroke" opacity={0.18} />
      {/* Bright seam — draws on as you scroll */}
      <motion.path
        d={d}
        stroke="var(--accent)"
        strokeWidth={2.5}
        fill="none"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={inView ? { pathLength: 1, opacity: 0.9 } : {}}
        transition={{ duration: 1, delay, ease: "easeOut" }}
      />
    </svg>
  );
}

/** Ball node pinned where two seam stretches meet. The champion node glows. */
function NodeBall({ isChampion }: { isChampion: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
      whileHover={{ rotate: 24, scale: 1.15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      data-cursor-hover
    >
      {isChampion ? (
        <motion.div
          className="rounded-full"
          animate={{ boxShadow: ["0 0 0 0 rgba(255,91,31,0.5)", "0 0 0 14px rgba(255,91,31,0)"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        >
          <BallIcon className="size-9 md:size-11" />
        </motion.div>
      ) : (
        <BallIcon className="size-6 md:size-8" />
      )}
    </motion.div>
  );
}

/** Era card — game photo panel + the story. Trading-card energy. */
function NodeCard({
  item,
  photo,
  hovered,
  isChampion,
}: {
  item: (typeof COURT.timeline)[number];
  photo?: EraPhoto;
  hovered: boolean;
  isChampion: boolean;
}) {
  return (
    <>
      {/* Accent top bar */}
      <motion.div
        className="absolute left-0 top-0 z-10 h-0.5 w-full bg-[var(--accent)]"
        initial={{ scaleX: isChampion ? 1 : 0, originX: 0 }}
        animate={{ scaleX: hovered || isChampion ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden
      />

      {/* Pebble grain on photo-less cards keeps them leather */}
      {!photo && <PebbleGrain className="text-[var(--accent)] opacity-[0.06]" />}

      <div className={cn("grid", photo && "md:grid-cols-[42%_1fr]")}>
        {/* ── Embedded game photo ── */}
        {photo && (
          <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--line)] md:aspect-auto md:border-b-0 md:border-r">
            <motion.div
              className="absolute inset-0"
              animate={{ filter: hovered ? "grayscale(0%)" : "grayscale(55%)", scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <Photo src={photo.src} alt={photo.alt} style={{ objectPosition: photo.pos }} />
            </motion.div>

            {/* Orange duotone wash */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(160deg, rgba(255,91,31,0.22) 0%, transparent 55%)",
                mixBlendMode: "screen",
              }}
              aria-hidden
            />

            {/* Ball-curvature ghost arc across the photo */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-35" aria-hidden>
              <path d="M -8 88 Q 50 66 108 88" stroke="var(--accent)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* Era tag chip — scoreboard plate */}
            <div className="absolute bottom-0 left-0 bg-[var(--accent)] px-2.5 py-1">
              <span className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.18em] text-black">
                {photo.tag}
              </span>
            </div>
          </div>
        )}

        {/* ── Story ── */}
        <div className="relative px-5 py-5 md:px-6 md:py-6">
          {/* Diagonal energy line on champion card */}
          {isChampion && (
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(118deg, var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 28px)",
              }}
              aria-hidden
            />
          )}

          <p
            className={cn(
              "font-anton text-xl uppercase leading-tight tracking-wide md:text-2xl",
              isChampion ? "text-[var(--accent)]" : "text-[var(--fg)]"
            )}
          >
            {item.role}
          </p>

          <p className="mt-3 font-grotesk text-sm leading-relaxed text-[var(--muted)]">
            {item.note}
          </p>

          {/* Tags row */}
          <div className="mt-4 flex flex-wrap gap-2">
            {isChampion && (
              <div className="inline-flex items-center gap-1.5 border border-[var(--accent)] px-3 py-1">
                <BallIcon className="size-3" />
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--accent)]">
                  NCS Title · School &amp; District First
                </span>
              </div>
            )}
            {item.role === "JV Co-Captain" && (
              <div className="inline-flex items-center gap-1.5 border border-[var(--muted)] px-3 py-1">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  .500 League Record
                </span>
              </div>
            )}
            {item.role === "AAU Basketball" && (
              <div className="inline-flex items-center gap-1.5 border border-[var(--muted)] px-3 py-1">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Hopkins A-Team · 8th Grade
                </span>
              </div>
            )}
            {item.role === "Varsity Summer League" && (
              <div className="inline-flex items-center gap-1.5 border border-orange-400/50 px-3 py-1">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-orange-400">
                  3 Tournaments · Bay Club
                </span>
              </div>
            )}
            {item.role.includes("Varsity · started") && (
              <div className="inline-flex items-center gap-1.5 border border-orange-400/50 px-3 py-1">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-orange-400">
                  Bench Energy = Team Synergy
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** One row of the seam: era card on one side, period marker opposite, seam bowing toward the card. */
function TimelineNode({
  item,
  index,
  isLast,
}: {
  item: (typeof COURT.timeline)[number];
  index: number;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const isChampion = item.role === "NCS Champion";
  const cardOnRight = index % 2 === 0;
  const photo = ERA_PHOTOS[item.role];

  const card = (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      data-cursor-hover
      className={cn(
        "group relative overflow-hidden border transition-colors duration-300",
        isChampion ? "border-[var(--accent)]" : "border-[var(--line)]",
        "bg-[var(--bg-2)] hover:border-[var(--accent)]"
      )}
      whileHover={{ y: -3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
    >
      <NodeCard item={item} photo={photo} hovered={hovered} isChampion={isChampion} />
    </motion.div>
  );

  /* Giant ghosted period marker — jersey-number typography */
  const period = (
    <div className={cn("pt-1", cardOnRight ? "pr-3 text-right md:pr-7" : "pl-3 text-left md:pl-7")}>
      <span
        className={cn(
          "font-anton text-[clamp(1.6rem,3.4vw,3rem)] uppercase leading-none tracking-wide",
          isChampion ? "text-[var(--accent)] opacity-80" : "text-[var(--fg)] opacity-25"
        )}
      >
        {item.period}
      </span>
      <div
        className={cn(
          "mt-3 h-px w-16 bg-[var(--accent)] opacity-40",
          cardOnRight ? "ml-auto" : ""
        )}
        aria-hidden
      />
    </div>
  );

  return (
    <motion.li
      ref={ref}
      className="relative grid grid-cols-[3.5rem_1fr] md:grid-cols-[1fr_9rem_1fr]"
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Desktop left column */}
      <div className="hidden md:block">
        {cardOnRight ? period : <div className="pb-14 pt-1">{card}</div>}
      </div>

      {/* Seam spine */}
      <div className="relative">
        <SeamSegment
          bulge={isLast ? "none" : cardOnRight ? "right" : "left"}
          inView={inView}
          delay={0.3}
        />
        <NodeBall isChampion={isChampion} />
      </div>

      {/* Desktop right column */}
      <div className="hidden md:block">
        {cardOnRight ? <div className="pb-14 pt-1">{card}</div> : period}
      </div>

      {/* Mobile: period + card stacked right of the seam */}
      <div className="pb-12 pl-4 pt-0 md:hidden">
        <span
          className={cn(
            "mb-2 block font-anton text-xl uppercase leading-none",
            isChampion ? "text-[var(--accent)] opacity-90" : "text-[var(--fg)] opacity-30"
          )}
        >
          {item.period}
        </span>
        {card}
      </div>
    </motion.li>
  );
}

/** The finish: the seam runs out of leather and the ball drops through the net. */
function SwishFinish() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    // Mobile: centred under the left-hand seam spine (3.5rem col → centre 1.75rem); desktop: page centre
    <div ref={ref} className="relative ml-[-1.25rem] mt-6 flex w-fit flex-col items-center md:mx-auto">
      <motion.div
        initial={{ y: -34, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10"
      >
        <BallIcon className="size-7 md:size-8" />
      </motion.div>
      <RimNet className="-mt-3 w-24 text-[var(--accent)] opacity-80 md:w-28" />
      <span className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[var(--muted)]">
        And the ball goes in.
      </span>
    </div>
  );
}

export function CourtTimeline() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20 md:px-9 md:py-28">
      {/* ── Giant ghost basketball the timeline lives inside ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(1500px,175vw)] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 38% 30%, rgba(255,91,31,0.10) 0%, rgba(255,91,31,0.035) 52%, transparent 71%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden rounded-full text-[var(--accent)] opacity-[0.05]">
          <PebbleGrain />
        </div>
        <SeamArcs className="absolute inset-0 h-full w-full text-[var(--accent)] opacity-[0.06]" strokeWidth={1.5} />
      </div>

      {/* Section header */}
      <div className="relative mb-16 grid grid-cols-1 gap-8 md:mb-20 md:grid-cols-2 md:gap-12">
        <Reveal>
          <div>
            <span className="eyebrow text-[var(--accent)]">The Journey — Seam by Seam</span>
            <h2 className="mt-3 font-anton text-[clamp(2.4rem,8vw,5.5rem)] uppercase leading-none tracking-tight text-[var(--fg)]">
              Career<br />Timeline
            </h2>
            <p className="mt-4 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              <BallIcon className="size-4" />
              Six chapters stitched around one ball
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-col justify-end md:pb-2">
            <p className="font-grotesk text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Follow the seam — from grade-school AAU hardwood to an NCS Championship stage.
              A broken arm in 7th grade. A Hopkins A-team spot in 8th. JV dinners that turned
              teammates into a unit. A bench seat that taught him more than the starting lineup.
            </p>
            <HalfCourt className="mt-6 w-48 text-[var(--accent)] opacity-50" />
          </div>
        </Reveal>
      </div>

      {/* ── The seam ── */}
      <ul className="relative">
        {COURT.timeline.map((item, i) => (
          <TimelineNode
            key={item.role}
            item={item}
            index={i}
            isLast={i === COURT.timeline.length - 1}
          />
        ))}
      </ul>

      <SwishFinish />
    </section>
  );
}
