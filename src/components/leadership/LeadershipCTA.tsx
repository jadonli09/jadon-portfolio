"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Magnetic } from "@/components/primitives/Magnetic";
import { Reveal } from "@/components/primitives/Reveal";
import { PROFILE } from "@/lib/data";

export function LeadershipCTA() {
  return (
    <section className="relative mx-auto mt-20 max-w-7xl px-5 pb-24 md:mt-32 md:px-9 md:pb-36">
      {/* Top rule */}
      <motion.div
        className="mb-12 h-px bg-gradient-to-r from-[var(--accent)] to-transparent opacity-40"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        {/* Left: closing line */}
        <Reveal>
          <div className="max-w-xl">
            <span className="eyebrow text-[var(--muted)]">Contact</span>
            <p className="mt-3 font-display text-3xl font-semibold leading-snug text-[var(--fg)] md:text-5xl">
              Want to talk leadership,
              <br />
              <span className="italic text-[var(--accent)]">events, or ideas?</span>
            </p>
          </div>
        </Reveal>

        {/* Right: Magnetic CTA buttons */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <a
                href={`mailto:${PROFILE.email}`}
                data-cursor-hover
                className="group inline-flex items-center gap-3 border border-[rgba(212,175,106,0.5)] bg-[var(--bg-2)] px-7 py-4 font-mono text-xs uppercase tracking-widest text-[var(--accent)] transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Email Jadon
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>

            <Magnetic strength={0.35}>
              <a
                href={PROFILE.links.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group inline-flex items-center gap-3 border border-[var(--line)] px-7 py-4 font-mono text-xs uppercase tracking-widest text-[var(--muted)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {PROFILE.links.instagramHandle}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>

            <Magnetic strength={0.35}>
              <Link
                href="/about"
                data-cursor-hover
                className="group inline-flex items-center gap-3 border border-[var(--line)] px-7 py-4 font-mono text-xs uppercase tracking-widest text-[var(--muted)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                About Jadon
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
