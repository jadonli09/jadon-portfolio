"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Heart, MessageCircle, Share2, ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Magnetic } from "@/components/primitives/Magnetic";
import { LOCKED } from "@/lib/data";

const { douyin } = LOCKED;

function DouyinCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <TiltCard max={6} className="w-full max-w-[340px]">
      <div
        ref={ref}
        className="relative aspect-[9/16] w-full overflow-hidden border border-[var(--accent-2)]"
        style={{
          background:
            "linear-gradient(160deg, #0d0d18 0%, #12091a 40%, #070d18 100%)",
        }}
      >
        {/* Scan-lines texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(61,240,255,0.15) 2px, rgba(61,240,255,0.15) 3px)",
          }}
          aria-hidden
        />

        {/* Gradient overlay — pink/cyan cross */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 15%, rgba(255,61,129,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(61,240,255,0.14) 0%, transparent 60%)",
          }}
          aria-hidden
        />

        {/* Corner brackets */}
        {[
          "top-2 left-2 border-t-2 border-l-2",
          "top-2 right-2 border-t-2 border-r-2",
          "bottom-2 left-2 border-b-2 border-l-2",
          "bottom-2 right-2 border-b-2 border-r-2",
        ].map((cls, i) => (
          <span
            key={i}
            aria-hidden
            className={`pointer-events-none absolute h-5 w-5 border-[var(--accent-2)] ${cls}`}
          />
        ))}

        {/* Top label */}
        <div className="absolute left-0 right-0 top-0 border-b border-[var(--accent-2)]/30 bg-[var(--bg)]/60 px-4 py-2.5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[var(--accent-2)]">
              DouYin · China
            </span>
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              aria-hidden
            />
          </div>
        </div>

        {/* Central big number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <motion.p
            className="font-anton leading-none text-[var(--accent)]"
            style={{ fontSize: "clamp(5rem, 18vw, 7.5rem)", lineHeight: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {douyin.likes}
          </motion.p>
          <motion.p
            className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Likes
          </motion.p>

          {/* Pulse ring */}
          <motion.div
            className="absolute h-32 w-32 rounded-full border border-[var(--accent)]/30"
            animate={inView ? { scale: [1, 1.4, 1.8], opacity: [0.4, 0.15, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            aria-hidden
          />
          <motion.div
            className="absolute h-32 w-32 rounded-full border border-[var(--accent)]/20"
            animate={inView ? { scale: [1, 1.6, 2.2], opacity: [0.3, 0.1, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.1 }}
            aria-hidden
          />
        </div>

        {/* Stat pills — bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--accent-2)]/30 bg-[var(--bg)]/70 px-4 py-4 backdrop-blur-sm">
          <div className="flex justify-between">
            {[
              { Icon: Heart, value: douyin.likes, label: "Likes" },
              { Icon: MessageCircle, value: douyin.comments, label: "Comments" },
              { Icon: Share2, value: douyin.shares, label: "Shares" },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="size-3.5 text-[var(--accent)]" />
                <span className="font-mono text-[0.65rem] font-bold text-[var(--fg)]">{value}</span>
                <span className="font-mono text-[0.5rem] uppercase tracking-wider text-[var(--muted)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Handle strip */}
        <div className="absolute left-4 top-10 mt-1">
          <span className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--fg)]/50">
            {douyin.creator}
          </span>
        </div>
      </div>
    </TiltCard>
  );
}

export function LockedDouyinFeature() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--accent) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
        aria-hidden
      />

      {/* Left cyan glow */}
      <div
        className="pointer-events-none absolute -left-60 top-1/4 h-[500px] w-[500px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, var(--accent-2) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-9">
        {/* Eyebrow */}
        <Reveal>
          <div className="mb-12 flex items-center gap-4 md:mb-16">
            <span className="eyebrow text-[var(--accent-2)]">Viral Moment</span>
            <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20 lg:items-center lg:gap-28">
          {/* Left: designed card */}
          <Reveal>
            <div className="flex justify-center md:justify-start">
              <DouyinCard />
            </div>
          </Reveal>

          {/* Right: copy */}
          <div className="flex flex-col gap-8">
            {/* Big counter re-emphasis */}
            <Reveal>
              <div className="flex flex-col gap-1">
                <p
                  className="font-anton leading-none text-[var(--accent)]"
                  style={{ fontSize: "clamp(4rem, 12vw, 8rem)", lineHeight: 0.9 }}
                >
                  <Counter to={569} suffix="k" duration={2.2} />
                </p>
                <p className="font-mono text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                  Likes · one DouYin clip
                </p>
              </div>
            </Reveal>

            {/* Pull quote */}
            <Reveal delay={0.2}>
              <div className="border-l-2 border-[var(--accent)] pl-5">
                <p className="font-display text-xl italic leading-snug text-[var(--fg)] opacity-90 md:text-2xl lg:text-3xl">
                  "{douyin.note}"
                </p>
              </div>
            </Reveal>

            {/* Supporting copy */}
            <Reveal delay={0.35}>
              <p className="font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
                Reposted by <span className="text-[var(--fg)]">{douyin.creator}</span> — a 3.7M-follower
                hoops account — and seen across China. Basketball energy, no borders.
              </p>
            </Reveal>

            {/* Stat pills */}
            <RevealGroup className="flex flex-wrap gap-3" stagger={0.07} delayChildren={0.45}>
              {[
                { Icon: Heart, value: douyin.likes, label: "Likes" },
                { Icon: MessageCircle, value: douyin.comments, label: "Comments" },
                { Icon: Share2, value: douyin.shares, label: "Shares" },
              ].map(({ Icon, value, label }) => (
                <motion.div
                  key={label}
                  className="group border border-[var(--line)] px-4 py-3 transition-colors duration-300 hover:border-[var(--accent)]"
                  data-cursor-hover
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-3.5 text-[var(--accent)] transition-colors group-hover:text-[var(--accent)]" />
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                      {label}
                    </p>
                  </div>
                  <p className="mt-1 font-anton text-xl leading-none text-[var(--fg)]">{value}</p>
                </motion.div>
              ))}
            </RevealGroup>

            {/* CTA */}
            <Reveal delay={0.6}>
              <Magnetic strength={0.35}>
                <a
                  href={douyin.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className="group inline-flex items-center gap-3 border border-[var(--accent-2)] px-6 py-3 font-mono text-sm uppercase tracking-[0.2em] text-[var(--accent-2)] transition-all duration-300 hover:bg-[var(--accent-2)] hover:text-[var(--bg)]"
                >
                  Watch on DouYin
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
