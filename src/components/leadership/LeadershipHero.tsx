"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { Photo } from "@/components/primitives/Photo";
import { LEADERSHIP } from "@/lib/data";

/** Gold line that animates in from the left — reusable accent. */
function GoldRule({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  return (
    <motion.div
      className={`h-px bg-[var(--accent)] ${className}`}
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

/** The three class-officer years — one frame per term, like a contact sheet. */
const TERM_PANELS = [
  {
    src: "/img/classofficer-freshman.jpg",
    alt: "Freshman class officers in Santa hats by the school calendar mural",
    year: "9th",
    label: "Freshman slate",
    pos: "50% 42%",
    lift: "md:translate-y-6",
  },
  {
    src: "/img/classofficer-sophomore.jpg",
    alt: "Sophomore class officers on the rally stage, Jadon on the mic",
    year: "10th",
    label: "On the mic",
    pos: "22% 38%",
    lift: "md:translate-y-3",
  },
  {
    src: "/img/classofficer-junior.jpg",
    alt: "Junior class officers with the 'Never Second, 2027' sign",
    year: "11th",
    label: "Never second",
    pos: "50% 40%",
    lift: "md:translate-y-0",
  },
];

/** One gold-framed film frame — duotone at rest, colour on hover. */
function TermFrame({
  panel,
  index,
}: {
  panel: (typeof TERM_PANELS)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.figure
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.95, delay: 0.45 + index * 0.16, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${panel.lift}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
    >
      <div className="border border-[rgba(212,175,106,0.5)] bg-[var(--bg-2)] p-1 md:p-1.5">
        <div className="relative overflow-hidden border border-[rgba(212,175,106,0.25)]">
          <motion.div
            className="aspect-[4/3]"
            animate={{
              filter: hovered
                ? "grayscale(0%) sepia(0%) contrast(1)"
                : "grayscale(55%) sepia(14%) contrast(1.06)",
              scale: hovered ? 1.03 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Photo
              src={panel.src}
              alt={panel.alt}
              priority
              className="object-cover"
              style={{ objectPosition: panel.pos }}
            />
          </motion.div>

          {/* Bottom scrim — keeps the overlapping headline legible */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
            style={{ background: "linear-gradient(to top, rgba(12,10,8,0.7) 0%, transparent 100%)" }}
          />

          {/* Year tab */}
          <span className="absolute left-0 top-0 bg-[var(--accent)] px-2 py-1 font-mono text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#0c0a08]">
            {panel.year}
          </span>
        </div>
      </div>
      <figcaption className="mt-1.5 px-0.5 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-[var(--muted)] md:text-[0.55rem]">
        {panel.label}
      </figcaption>
    </motion.figure>
  );
}

/**
 * The three class-officer terms as a staggered contact-sheet triptych —
 * 9th, 10th, 11th — each frame stepping up toward the present, with an
 * oxblood "3×" seal pinned over the strip.
 */
function MastheadTriptych({ parallaxY }: { parallaxY?: MotionValue<number> }) {
  return (
    <motion.div style={parallaxY ? { y: parallaxY } : undefined} className="relative">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {TERM_PANELS.map((p, i) => (
          <TermFrame key={p.year} panel={p} index={i} />
        ))}
      </div>

      {/* Oxblood seal — pinned over the strip's top-right corner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: 24 }}
        animate={{ opacity: 1, scale: 1, rotate: 12 }}
        transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-2 -top-6 z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full text-center md:-right-5 md:-top-7 md:h-24 md:w-24"
        style={{
          background: "var(--accent-2)",
          boxShadow: "0 8px 22px rgba(0,0,0,0.5)",
        }}
      >
        <span aria-hidden className="absolute inset-1.5 rounded-full border border-[rgba(245,236,216,0.5)]" />
        <p className="font-anton text-lg leading-none text-[#f5ecd8] md:text-2xl">3×</p>
        <p className="mt-0.5 px-1.5 font-mono text-[0.4rem] uppercase tracking-[0.15em] text-[rgba(245,236,216,0.85)] md:px-2 md:text-[0.5rem] md:tracking-[0.2em]">
          class president
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * LeadershipHero — the masthead. The headline and the ASB officer photo
 * interlock like a magazine cover: "ELECTED TO LEAD," runs clear, the
 * gold-framed team panel sits into the right of the poster, and
 * "EVERY YEAR." stamps across the bottom of the photo.
 */
export function LeadershipHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -36]);

  return (
    <section ref={sectionRef} className="relative mx-auto max-w-7xl px-5 pb-0 pt-36 md:px-9 md:pt-44">
      {/* Eyebrow + grid line */}
      <Reveal>
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow text-[var(--accent)]">04 — Leadership &amp; Events</span>
          <span className="eyebrow hidden text-[var(--muted)] sm:block">ASB President · Class of 2027 · MSJ</span>
        </div>
      </Reveal>

      {/* Thick gold top rule */}
      <GoldRule delay={0.15} className="mt-3 w-full" />

      {/* ── The masthead composition ───────────────────────────────── */}
      <div className="relative mt-6 md:mt-8">
        {/* Line 1 — runs clear above the photo */}
        <div className="relative z-10">
          <KineticHeadline
            as="h1"
            text="Elected to lead,"
            balance={false}
            className="font-anton display-xl uppercase tracking-tight text-[var(--fg)]"
            delay={0.2}
          />
        </div>

        {/* Term triptych — desktop: set into the right of the poster */}
        <div className="relative z-0 mt-6 md:mt-2 md:flex md:justify-end md:pr-2">
          <div className="w-full md:w-[68%] md:max-w-[820px]">
            <MastheadTriptych parallaxY={photoY} />
          </div>
        </div>

        {/* Line 2 — stamps across the lower-left of the strip */}
        <div className="relative z-10 mt-2 md:-mt-[clamp(3rem,7vw,7rem)]">
          <KineticHeadline
            as="h2"
            text="every year."
            balance={false}
            className="font-anton display-xl uppercase tracking-tight text-[var(--fg)] [text-shadow:0_4px_32px_rgba(12,10,8,0.85)]"
            delay={0.45}
          />
        </div>
      </div>

      {/* Intro deck */}
      <div className="mt-8 border-t border-[var(--line)] pt-8 md:mt-10">
        <Reveal delay={0.3}>
          <p className="font-serif-i max-w-2xl text-xl italic leading-snug text-[var(--fg)] opacity-90 md:text-2xl">
            {LEADERSHIP.intro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
