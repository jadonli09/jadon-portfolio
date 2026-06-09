"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { COURT } from "@/lib/data";
import { Play, Globe } from "lucide-react";

/** Designed video-placeholder frame — never a real photo. */
function VideoPlaceholderFrame() {
  return (
    <div className="relative aspect-[9/16] w-full max-w-[280px] overflow-hidden border border-[var(--accent)] bg-[var(--bg-2)] md:max-w-[320px]">
      {/* Scan-line texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,91,31,0.15) 3px, rgba(255,91,31,0.15) 4px)",
        }}
        aria-hidden
      />

      {/* Corner marks */}
      {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((c, i) => (
        <span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute h-5 w-5 border-[var(--accent)] ${c}`}
        />
      ))}

      {/* Central play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/20"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Play className="size-7 fill-[var(--accent)] text-[var(--accent)]" />
        </motion.div>

        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
          DouYin Clip
        </span>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--accent)] bg-[var(--bg)] px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
            Viral · China
          </span>
          <Globe className="size-3 text-[var(--accent)]" />
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        <motion.span
          className="h-2 w-2 rounded-full bg-[var(--accent)]"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          aria-hidden
        />
        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)]">
          Viral
        </span>
      </div>
    </div>
  );
}

/** Animated stat number block. */
function StatBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className="flex flex-col gap-2">
      {/* Big counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-anton leading-none text-[var(--accent)]"
          style={{ fontSize: "clamp(4rem, 14vw, 9rem)", lineHeight: 0.9 }}>
          <Counter to={500} suffix="k+" duration={2.2} />
        </p>
      </motion.div>

      {/* Label */}
      <motion.p
        className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--muted)]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        {COURT.douyin.label}
      </motion.p>
    </div>
  );
}

export function CourtDouyin() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-2)] py-20 md:py-28">
      {/* Background court-dot motif */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--accent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        {/* Section eyebrow */}
        <Reveal>
          <div className="mb-10 flex items-center gap-4 md:mb-14">
            <span className="eyebrow text-[var(--accent)]">Going Global</span>
            <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
          </div>
        </Reveal>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24 lg:items-center">
          {/* Left: video frame */}
          <Reveal>
            <div className="flex justify-center md:justify-start">
              <TiltCard max={8}>
                <VideoPlaceholderFrame />
              </TiltCard>
            </div>
          </Reveal>

          {/* Right: stat + copy */}
          <div className="flex flex-col gap-8">
            <StatBlock />

            <Reveal delay={0.35}>
              <div className="border-l-4 border-[var(--accent)] pl-6">
                <p className="font-display text-xl italic leading-snug text-[var(--fg)] opacity-90 md:text-2xl lg:text-3xl">
                  "{COURT.douyin.note}"
                </p>
              </div>
            </Reveal>

            {/* Supporting detail */}
            <Reveal delay={0.5}>
              <p className="font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
                A spontaneous gym moment captured and uploaded to DouYin — China's leading
                short-video platform — garnered half a million likes, putting Jadon on a
                global stage far beyond the hardwood.
              </p>
            </Reveal>

            {/* Stat pills */}
            <RevealGroup className="flex flex-wrap gap-3" stagger={0.08} delayChildren={0.6}>
              {[
                { label: "Platform", value: "DouYin" },
                { label: "Reach", value: "Global" },
                { label: "Likes", value: "500k+" },
              ].map((pill) => (
                <motion.div
                  key={pill.label}
                  className="border border-[var(--line)] px-4 py-2 hover:border-[var(--accent)] transition-colors duration-300"
                  data-cursor-hover
                  whileHover={{ scale: 1.03 }}
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                    {pill.label}
                  </p>
                  <p className="mt-0.5 font-anton text-lg leading-none text-[var(--fg)]">
                    {pill.value}
                  </p>
                </motion.div>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
