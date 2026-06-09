"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { Reveal } from "@/components/primitives/Reveal";
import { Magnetic } from "@/components/primitives/Magnetic";
import { PROFILE } from "@/lib/data";

export function LockedFollowCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      {/* Large ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        aria-hidden
      />

      {/* Cyan secondary glow */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, var(--accent-2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 text-center md:px-9">
        {/* Eyebrow */}
        <Reveal>
          <span className="eyebrow text-[var(--accent)]">Follow the grind</span>
        </Reveal>

        {/* Big kinetic headline */}
        <div className="mt-6">
          <KineticHeadline
            as="h2"
            text="Come watch"
            className="font-anton display-xl block uppercase text-[var(--fg)] leading-none"
            delay={0.05}
          />
          <div style={{ fontSize: "clamp(3rem, 12vw, 11rem)", lineHeight: 0.9 }}>
            <KineticHeadline
              as="h2"
              text="it happen."
              className="font-anton block uppercase leading-none text-[var(--accent)]"
              delay={0.22}
            />
          </div>
        </div>

        {/* Sub copy */}
        <Reveal delay={0.55}>
          <p className="mx-auto mt-8 max-w-md font-grotesk text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Basketball, cooking, study tips, travel — all of it, in public. New posts most weeks.
            No filters on the process.
          </p>
        </Reveal>

        {/* CTA buttons */}
        <Reveal delay={0.72}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:mt-12">
            <Magnetic strength={0.4}>
              <a
                href={PROFILE.links.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="group inline-flex items-center gap-3 bg-[var(--accent)] px-8 py-4 font-mono text-sm uppercase tracking-[0.18em] text-[var(--bg)] transition-all duration-300 hover:brightness-110"
              >
                Follow {PROFILE.links.instagramHandle}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>

            <Magnetic strength={0.3}>
              <a
                href="#feed"
                data-cursor-hover
                className="group inline-flex items-center gap-3 border border-[var(--line)] px-8 py-4 font-mono text-sm uppercase tracking-[0.18em] text-[var(--muted)] transition-all duration-300 hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]"
              >
                Back to feed
              </a>
            </Magnetic>
          </div>
        </Reveal>

        {/* Decorative divider line */}
        <motion.div
          className="mx-auto mt-16 h-px bg-[var(--accent)] opacity-20"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "40rem", originX: 0.5 }}
          aria-hidden
        />
      </div>
    </section>
  );
}
