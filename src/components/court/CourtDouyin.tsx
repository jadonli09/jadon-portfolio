"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { COURT } from "@/lib/data";
import { RimNet, NetMesh } from "@/components/court/BallMotifs";
import { ExternalLink, Heart, MessageCircle } from "lucide-react";

/** Glass backboard mount — shooter's square framing the clip, rim + net hung beneath. */
function Backboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative border-2 border-white/25 bg-white/[0.04] p-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(255,255,255,0.03)] backdrop-blur-[1px] md:p-6">
        {/* Mounting bolts */}
        {["left-1.5 top-1.5", "right-1.5 top-1.5", "bottom-1.5 left-1.5", "bottom-1.5 right-1.5"].map((c) => (
          <span
            key={c}
            aria-hidden
            className={`pointer-events-none absolute size-1.5 rounded-full bg-white/25 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)] ${c}`}
          />
        ))}
        {/* Shooter's square */}
        <div className="border-2 border-[var(--accent)] p-2 md:p-2.5">{children}</div>
      </div>
      {/* Rim + net, hung off the board */}
      <RimNet className="-mt-1 w-28 text-[var(--accent)] drop-shadow-[0_6px_14px_rgba(255,91,31,0.25)] md:w-32" />

      {/* Live tally plate — exact counts pulled from the DouYin share API */}
      <div className="mt-3 flex items-stretch border border-[var(--line)] bg-black/50">
        <div className="flex items-center gap-2 px-4 py-2">
          <Heart className="size-3.5 fill-[var(--accent)] text-[var(--accent)]" aria-hidden />
          <span className="font-anton text-base leading-none text-[var(--fg)]">{COURT.douyin.likes}</span>
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-[var(--muted)]">Likes</span>
        </div>
        <span className="w-px bg-[var(--line)]" aria-hidden />
        <div className="flex items-center gap-2 px-4 py-2">
          <MessageCircle className="size-3.5 text-[var(--accent)]" aria-hidden />
          <span className="font-anton text-base leading-none text-[var(--fg)]">{COURT.douyin.comments}</span>
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-[var(--muted)]">Comments</span>
        </div>
      </div>
      <span className="mt-1.5 font-mono text-[0.5rem] uppercase tracking-[0.25em] text-[var(--muted)]">
        DouYin · {COURT.douyin.statsAsOf}
      </span>

      {/* Guaranteed path to the clip if the embed is blocked for a visitor */}
      <a
        href={COURT.douyin.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-hover
        className="mt-3 inline-flex items-center gap-2 border border-[var(--accent)] px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--accent)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-black"
      >
        Watch on DouYin
        <ExternalLink className="size-3" />
      </a>
    </div>
  );
}

/** The real clip — DouYin iframe player in the broadcast chrome. */
function DouyinPlayer() {
  return (
    <div className="relative aspect-[9/16] w-[256px] overflow-hidden border border-[var(--accent)] bg-[var(--bg-2)] md:w-[300px]">
      {/* The embed — same player DouYin serves for sharing */}
      <iframe
        src={`https://open.douyin.com/player/video?vid=${COURT.douyin.vid}&autoplay=0`}
        title="DouYin — Jadon vs the 网红, 569k likes"
        className="absolute inset-0 h-full w-full"
        allowFullScreen
        allow="fullscreen; encrypted-media"
        referrerPolicy="unsafe-url"
        loading="lazy"
      />

      {/* Corner broadcast marks */}
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
    </div>
  );
}

/** Animated 569k stat block. */
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
          <Counter to={569} suffix="k" duration={2.2} />
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
      {/* Background net-mesh weave */}
      <NetMesh className="text-[var(--accent)] opacity-[0.04]" gap={22} />

      {/* Diagonal energy stripe — background kinetic texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(118deg, var(--accent) 0px, var(--accent) 2px, transparent 2px, transparent 60px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        {/* Section eyebrow */}
        <Reveal>
          <div className="mb-10 flex items-center gap-4 md:mb-14">
            <span className="eyebrow text-[var(--accent)]">Going Global</span>
            <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
            <span className="eyebrow text-[var(--muted)] hidden sm:block">China · DouYin · 网红</span>
          </div>
        </Reveal>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24 lg:items-center">
          {/* Left: video frame */}
          <Reveal>
            <div className="flex justify-center md:justify-start">
              <TiltCard max={6}>
                <Backboard>
                  <DouyinPlayer />
                </Backboard>
              </TiltCard>
            </div>
          </Reveal>

          {/* Right: stat + copy */}
          <div className="flex flex-col gap-8">
            <StatBlock />

            {/* The story — richer version */}
            <Reveal delay={0.35}>
              <div className="border-l-4 border-[var(--accent)] pl-6">
                <p className="font-display text-xl italic leading-snug text-[var(--fg)] opacity-90 md:text-2xl lg:text-3xl">
                  "At a gym in China, he played with — and against — a{" "}
                  <span className="not-italic text-[var(--accent)]">网红 (influencer)</span>.
                  His game drew the camera."
                </p>
              </div>
            </Reveal>

            {/* Narrative copy */}
            <Reveal delay={0.5}>
              <p className="font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
                No setup. No broadcast deal. Just Jadon in a Chinese gym, going against a local
                sports influencer. The clip got picked up, reposted by a 3.7M-follower hoops
                account on DouYin — China's leading short-video platform — and hit{" "}
                <span className="text-[var(--fg)] font-semibold">569,000+ likes</span>. A gym
                moment that crossed a continent.
              </p>
            </Reveal>

            {/* Stat pills */}
            <RevealGroup className="flex flex-wrap gap-3" stagger={0.08} delayChildren={0.6}>
              {[
                { label: "Platform", value: "DouYin" },
                { label: "Likes", value: "569k+" },
                { label: "Reposted By", value: "3.7M acct" },
                { label: "Reach", value: "Global" },
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

            {/* Chinese character decorative block */}
            <Reveal delay={0.75}>
              <div className="flex items-center gap-4">
                <span
                  className="font-grotesk text-5xl font-black leading-none text-[var(--accent)] opacity-20 select-none"
                  aria-hidden
                >
                  网红
                </span>
                <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">
                  Internet celebrity / influencer — the person he balled against
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
