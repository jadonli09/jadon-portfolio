"use client";

import { motion } from "motion/react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
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

export function LeadershipHero() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-0 pt-36 md:px-9 md:pt-48">
      {/* Eyebrow + grid line */}
      <Reveal>
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow text-[var(--accent)]">04 — Leadership &amp; Events</span>
          <span className="eyebrow hidden text-[var(--muted)] sm:block">ASB President · Class of 2027 · MSJ</span>
        </div>
      </Reveal>

      {/* Thick gold top rule */}
      <GoldRule delay={0.15} className="mt-3 w-full" />

      {/* Main poster headline */}
      <div className="mt-6 md:mt-8">
        <KineticHeadline
          as="h1"
          text="Elected to lead, every year."
          className="font-anton display-xl w-full uppercase tracking-tight text-[var(--fg)]"
          delay={0.2}
        />
      </div>

      {/* Intro deck + accent block */}
      <div className="mt-8 grid grid-cols-1 gap-8 border-t border-[var(--line)] pt-8 md:mt-10 md:grid-cols-[1fr_auto] md:gap-16">
        <Reveal delay={0.3}>
          <p className="font-serif-i max-w-2xl text-xl italic leading-snug text-[var(--fg)] opacity-90 md:text-2xl">
            {LEADERSHIP.intro}
          </p>
        </Reveal>

        {/* Poster accent block — roman numeral / index */}
        <Reveal delay={0.4}>
          <div className="hidden md:flex md:flex-col md:items-end md:justify-end">
            <div className="border border-[rgba(212,175,106,0.4)] px-6 py-4 text-right">
              <p className="font-anton text-5xl uppercase leading-none tracking-widest text-[var(--accent)]">
                IV
              </p>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
                World&nbsp;Four
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom ornament row — elected-office stats, not car meet */}
      <Reveal delay={0.5}>
        <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 md:mt-8">
          <span className="eyebrow text-[var(--muted)]">
            Class of 2027&nbsp;·&nbsp;Mission San Jose H.S.&nbsp;·&nbsp;Fremont, CA
          </span>
          <span className="eyebrow hidden text-[var(--accent)] sm:block">
            3× Class President&nbsp;·&nbsp;ASB President&nbsp;·&nbsp;2 Club VPs
          </span>
        </div>
      </Reveal>

      {/* Subtle decorative corner marks */}
      <div aria-hidden className="pointer-events-none">
        <span className="absolute left-5 top-36 font-mono text-[0.5rem] text-[var(--accent)] opacity-30 md:left-9 md:top-48">
          ◈
        </span>
        <span className="absolute right-5 top-36 font-mono text-[0.5rem] text-[var(--accent)] opacity-30 md:right-9 md:top-48">
          ◈
        </span>
      </div>
    </section>
  );
}
