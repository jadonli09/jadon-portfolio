"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { LEADERSHIP } from "@/lib/data";

/** Abstract supercar silhouette — hand-drawn SVG. Low, wide, sleek profile. */
function SupercarSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Main body — aggressive low wedge profile */}
      <path
        d="M80 220
           L120 220
           C140 220 160 210 175 195
           L220 150
           L310 118
           L440 95
           C490 88 540 82 590 80
           C640 78 700 80 760 85
           L860 95
           L940 110
           L980 125
           L1010 148
           L1040 170
           L1060 190
           L1080 205
           L1100 215
           L1120 220
           L80 220Z"
        fill="url(#carGold)"
        opacity="0.85"
      />
      {/* Cabin greenhouse — long raked roofline */}
      <path
        d="M370 118
           L400 72
           C415 55 440 45 470 42
           L600 38
           L720 40
           C750 41 775 50 795 65
           L830 95
           L370 118Z"
        fill="url(#carGoldDark)"
        opacity="0.6"
      />
      {/* Front splitter */}
      <path
        d="M80 220 L100 225 L175 225 L175 220Z"
        fill="var(--accent)"
        opacity="0.5"
      />
      {/* Rear diffuser */}
      <path
        d="M1100 215 L1100 228 L1030 228 L1030 220Z"
        fill="var(--accent)"
        opacity="0.5"
      />
      {/* Front wheel arch */}
      <ellipse cx="240" cy="222" rx="68" ry="20" fill="#0c0a08" />
      <ellipse cx="240" cy="222" rx="52" ry="15" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="240" cy="222" rx="24" ry="7" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
      {/* Front tire */}
      <ellipse cx="240" cy="226" rx="60" ry="16" fill="#1a1612" stroke="none" />

      {/* Rear wheel arch */}
      <ellipse cx="940" cy="222" rx="80" ry="20" fill="#0c0a08" />
      <ellipse cx="940" cy="222" rx="62" ry="15" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="940" cy="222" rx="28" ry="7" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
      {/* Rear tire */}
      <ellipse cx="940" cy="226" rx="72" ry="17" fill="#1a1612" stroke="none" />

      {/* Side vent */}
      <path d="M500 160 L520 140 L560 140 L540 160Z" fill="var(--accent)" opacity="0.25" />
      {/* Window highlight */}
      <path
        d="M415 95 L435 68 L600 60 L720 62 L790 82 L415 95Z"
        fill="white"
        opacity="0.04"
      />
      {/* LED headlight strip */}
      <path d="M118 195 L145 175 L165 172 L170 178 L142 200Z" fill="var(--accent)" opacity="0.7" />
      {/* Tail light */}
      <path d="M1060 190 L1075 180 L1090 182 L1088 198 L1065 200Z" fill="#6e1f2a" opacity="0.9" />

      {/* Ground shadow */}
      <ellipse cx="600" cy="240" rx="520" ry="12" fill="black" opacity="0.5" />

      {/* Gradient defs */}
      <defs>
        <linearGradient id="carGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6b5a30" stopOpacity="0.6" />
          <stop offset="35%" stopColor="#d4af6a" stopOpacity="0.9" />
          <stop offset="65%" stopColor="#c9a45a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4a3a1a" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="carGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a2e14" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8a7040" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#2a2010" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Stat card for the poster grid — used for secondary stats. */
function StatCard({
  value,
  label,
  hero = false,
}: {
  value: string;
  label: string;
  hero?: boolean;
}) {
  return (
    <div
      className={`group relative flex flex-col justify-end border border-[var(--line)] p-5 transition-colors duration-500 hover:border-[var(--accent)] md:p-7 ${hero ? "border-[rgba(212,175,106,0.6)] bg-[var(--bg-2)]" : "bg-[var(--bg-2)]"}`}
    >
      {/* Corner mark */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-0.5 w-10 bg-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <p
        className={`font-anton leading-none text-[var(--fg)] ${hero ? "text-[2.2rem] md:text-[3.2rem]" : "text-[1.8rem] md:text-[2.4rem]"}`}
      >
        {value}
      </p>
      <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </p>
    </div>
  );
}

/** Photo/video placeholder frame — implies footage without using assets. */
function FootageFrame() {
  return (
    <div className="relative aspect-video w-full overflow-hidden border border-[rgba(212,175,106,0.3)] bg-[var(--bg-2)]">
      {/* Gradient mesh interior */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 30% 40%, rgba(212,175,106,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 75% 60%, rgba(110,31,42,0.18) 0%, transparent 55%),
            linear-gradient(160deg, #120e08 0%, #1e1710 50%, #0c0a08 100%)
          `,
        }}
      />

      {/* Frame corner marks */}
      <span aria-hidden className="absolute left-3 top-3 block h-5 w-5 border-l border-t border-[var(--accent)] opacity-50" />
      <span aria-hidden className="absolute right-3 top-3 block h-5 w-5 border-r border-t border-[var(--accent)] opacity-50" />
      <span aria-hidden className="absolute bottom-3 left-3 block h-5 w-5 border-b border-l border-[var(--accent)] opacity-50" />
      <span aria-hidden className="absolute bottom-3 right-3 block h-5 w-5 border-b border-r border-[var(--accent)] opacity-50" />

      {/* Label content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {/* Stylized play ring */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(212,175,106,0.4)]">
          <div className="ml-1 h-0 w-0 border-b-[7px] border-l-[12px] border-t-[7px] border-b-transparent border-l-[var(--accent)] border-t-transparent opacity-60" />
        </div>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
          @msjmeets · Nov 8, 2025
        </p>
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[var(--accent)] opacity-50">
          Event footage
        </p>
      </div>

      {/* Scanline texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,175,106,0.6) 2px, rgba(212,175,106,0.6) 3px)",
        }}
      />
    </div>
  );
}

export function CarMeetShowpiece() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax: silhouette drifts slightly as we scroll through the section
  const silhouetteY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const silhouetteScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 0.98]);
  // The big number scales up on scroll
  const bigNumScale = useTransform(scrollYProgress, [0, 0.4], [0.92, 1]);

  const { carMeet } = LEADERSHIP;

  return (
    <section
      ref={sectionRef}
      className="relative mt-20 overflow-hidden md:mt-32"
      aria-labelledby="car-meet-title"
    >
      {/* ── Full-bleed background with layered gradient mesh ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% 0%, rgba(212,175,106,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 15% 60%, rgba(212,175,106,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 40% 35% at 85% 40%, rgba(110,31,42,0.12) 0%, transparent 50%),
            linear-gradient(180deg, #0c0a08 0%, #100e0a 40%, #0c0a08 100%)
          `,
        }}
      />

      {/* Asphalt texture pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(212,175,106,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top gold border line */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.1 }}
      />

      <div className="relative px-5 py-20 md:px-9 md:py-32">
        <div className="mx-auto max-w-7xl">
          {/* ── Header cluster ── */}
          <div className="relative z-10">
            <Reveal>
              <div className="flex flex-wrap items-center gap-4">
                <span className="eyebrow text-[var(--accent)]">First in MSJ History</span>
                <span className="eyebrow text-[var(--muted)]">·</span>
                <span className="eyebrow text-[var(--muted)]">{carMeet.date}</span>
                <span className="eyebrow text-[var(--muted)]">·</span>
                <span className="eyebrow text-[var(--accent)]">@msjmeets</span>
              </div>
            </Reveal>

            {/* Massive poster title */}
            <div className="mt-4">
              <KineticHeadline
                as="h2"
                text="MSJ CAR MEET"
                className="font-anton display-xl uppercase tracking-tight text-[var(--fg)]"
                delay={0.1}
              />
            </div>

            {/* Pitch line */}
            <Reveal delay={0.3}>
              <p className="mt-4 max-w-2xl font-serif-i text-lg italic text-[var(--fg)] opacity-80 md:text-xl">
                {carMeet.pitch}
              </p>
            </Reveal>
          </div>

          {/* ── SVG Supercar — parallax scroll ── */}
          <motion.div
            style={{ y: silhouetteY, scale: silhouetteScale }}
            className="pointer-events-none relative z-0 -mx-5 mt-8 md:-mx-9 md:mt-10"
            aria-hidden
          >
            <SupercarSilhouette className="w-full opacity-90" />
          </motion.div>

          {/* ── Hero stat — $35M+ ── */}
          <div className="relative z-10 -mt-4 md:-mt-8">
            <Reveal>
              <div className="flex flex-wrap items-end gap-3">
                <motion.div style={{ scale: bigNumScale }} className="origin-left">
                  <p className="font-anton leading-none text-[var(--accent)]"
                     style={{ fontSize: "clamp(5rem, 18vw, 16rem)" }}>
                    <Counter to={35} prefix="$" suffix="M+" duration={2.2} />
                  </p>
                </motion.div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-1 font-mono text-sm uppercase tracking-widest text-[var(--muted)]">
                In cars on the lot · {carMeet.date}
              </p>
            </Reveal>
          </div>

          {/* ── Pagani callout — special pull-quote ── */}
          <Reveal delay={0.15}>
            <div className="mt-8 border-l-2 border-[var(--accent)] py-2 pl-6 md:mt-10 md:pl-8">
              <p className="font-anton text-[2rem] uppercase leading-tight text-[var(--fg)] md:text-[3.5rem]">
                One Pagani.
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                $3.5M — the centerpiece
              </p>
            </div>
          </Reveal>

          {/* ── Stats grid ── */}
          <RevealGroup
            className="mt-10 grid grid-cols-2 gap-px bg-[var(--line)] sm:grid-cols-3 md:mt-14 md:grid-cols-5"
            stagger={0.06}
            delayChildren={0.1}
          >
            {/* 60+ Cars */}
            <StatCard value="60+" label="Cars on the lot" />
            {/* ~200 Attendees */}
            <StatCard value="~200" label="Attendees" />
            {/* 50+ Volunteers */}
            <StatCard value="50+" label="Volunteers" />
            {/* 32,000 emails */}
            <StatCard value="32K" label="FUSD families emailed" />
            {/* 7AM–5PM */}
            <StatCard value="10h" label="Setup to cleanup" />
          </RevealGroup>

          {/* ── Body text + footage frame ── */}
          <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-[1fr_1.1fr] md:gap-12">
            <Reveal delay={0.1}>
              <div className="space-y-5">
                <p className="text-base leading-relaxed text-[var(--fg)] opacity-[0.85] md:text-lg">
                  {carMeet.body}
                </p>

                {/* Bottom detail badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "6 student core team",
                    "2 faculty",
                    "Parent foundation",
                    "Car ramps · speed bump protection",
                    "Small-biz booths",
                    "Food vendors",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--line)] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Handle link */}
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                  <span className="inline-block h-px w-8 bg-[var(--accent)]" />
                  @msjmeets
                </p>
              </div>
            </Reveal>

            {/* Footage placeholder */}
            <Reveal delay={0.2}>
              <FootageFrame />
            </Reveal>
          </div>

          {/* ── Animated counters row — cinematic numbers ── */}
          <div className="mt-14 border-t border-[var(--line)] pt-10 md:mt-20 md:pt-14">
            <Reveal>
              <p className="eyebrow mb-8 text-[var(--accent)]">By the numbers</p>
            </Reveal>

            <RevealGroup
              className="grid grid-cols-2 divide-x divide-[var(--line)] border border-[var(--line)] sm:grid-cols-3 md:grid-cols-6"
              stagger={0.05}
              delayChildren={0.05}
            >
              {/* $35M+ animated */}
              <div className="group relative px-4 py-7 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-9">
                <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="font-anton text-[2rem] leading-none text-[var(--accent)] md:text-[2.8rem]">
                  <Counter to={35} prefix="$" suffix="M+" duration={2} />
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  Cars on lot
                </p>
              </div>
              {/* 60+ Cars */}
              <div className="group relative px-4 py-7 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-9">
                <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="font-anton text-[2rem] leading-none text-[var(--fg)] md:text-[2.8rem]">
                  <Counter to={60} suffix="+" duration={1.6} />
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  Cars
                </p>
              </div>
              {/* $3.5M Pagani */}
              <div className="group relative px-4 py-7 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-9">
                <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="font-anton text-[2rem] leading-none text-[var(--accent)] md:text-[2.8rem]">
                  $3.5M
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  One Pagani
                </p>
              </div>
              {/* 200 Attendees */}
              <div className="group relative px-4 py-7 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-9">
                <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="font-anton text-[2rem] leading-none text-[var(--fg)] md:text-[2.8rem]">
                  <Counter to={200} prefix="~" duration={1.8} />
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  Attendees
                </p>
              </div>
              {/* 50+ Volunteers */}
              <div className="group relative px-4 py-7 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-9">
                <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="font-anton text-[2rem] leading-none text-[var(--fg)] md:text-[2.8rem]">
                  <Counter to={50} suffix="+" duration={1.5} />
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  Volunteers
                </p>
              </div>
              {/* 32,000 emails */}
              <div className="group relative px-4 py-7 transition-colors hover:bg-[var(--bg-2)] md:px-6 md:py-9">
                <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="font-anton text-[2rem] leading-none text-[var(--fg)] md:text-[2.8rem]">
                  <Counter to={32000} duration={2.2} />
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                  FUSD families
                </p>
              </div>
            </RevealGroup>
          </div>
        </div>
      </div>

      {/* Bottom gold border line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
    </section>
  );
}
