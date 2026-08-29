"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { TROPHIES, AP_FIVES, CAT_META, SCORES } from "@/lib/data";

/* ── Domain Spectrum Band ─────────────────────────────────────
   A single horizontal bar showing proportion of entries per
   category — an at-a-glance "what he spends his life on."
──────────────────────────────────────────────────────────────── */

type TrophyCat = keyof typeof CAT_META;
const ALL_CATS = Object.keys(CAT_META) as TrophyCat[];

function DomainSpectrumBand() {
  const total = TROPHIES.length;
  const segments = ALL_CATS.map((cat) => ({
    cat,
    meta: CAT_META[cat],
    count: TROPHIES.filter((t) => t.cat === cat).length,
  })).filter((s) => s.count > 0);

  return (
    <div className="mt-14">
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--muted)] mb-3">
        Domain spectrum — {total} entries across {segments.length} domains
      </p>

      {/* The bar */}
      <div className="flex h-5 w-full overflow-hidden rounded-full shadow-[0_2px_8px_rgba(34,28,16,0.1)]">
        {segments.map((seg, i) => {
          const widthPct = (seg.count / total) * 100;
          return (
            <motion.div
              key={seg.cat}
              title={`${seg.meta.label}: ${seg.count} entries`}
              className="group relative h-full cursor-default"
              style={{ width: `${widthPct}%`, background: seg.meta.color }}
              initial={{ scaleX: 0, transformOrigin: "left center" }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
            >
              {/* Hover tooltip */}
              <div
                className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{
                  background: seg.meta.color,
                  boxShadow: "0 4px 12px rgba(34,28,16,0.15)",
                }}
              >
                <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white">
                  {seg.meta.label}: {seg.count}
                </span>
                {/* Arrow */}
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
                  style={{ borderTopColor: seg.meta.color }}
                  aria-hidden
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend below bar */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <div key={seg.cat} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2 shrink-0 rounded-full"
              style={{ background: seg.meta.color }}
              aria-hidden
            />
            <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
              {seg.meta.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bright decorative arcs (light-appropriate) ───────────────── */

function BrightArcs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Warm ivory vignette — light, not dark */}
      <div
        className="absolute -right-[15%] -top-[20%] h-[90vh] w-[70vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(176,124,30,0.06) 0%, rgba(176,124,30,0.02) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Thin gold arc — subtle on light */}
      <svg
        className="absolute right-0 top-0 h-full w-full"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.12 }}
      >
        <motion.ellipse
          cx="1100"
          cy="180"
          rx="480"
          ry="380"
          stroke="#b07c1e"
          strokeWidth="0.8"
          fill="none"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.ellipse
          cx="1100"
          cy="180"
          rx="300"
          ry="240"
          stroke="#8a5f10"
          strokeWidth="0.5"
          fill="none"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}

/* ── Hero section ─────────────────────────────────────────────── */

export function AchievementsHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const totalAwards = TROPHIES.length;
  const totalFives = AP_FIVES.length;

  return (
    <section ref={ref} className="relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-20">
      <BrightArcs />

      <motion.div style={{ y }} className="relative z-10 mx-auto max-w-7xl px-5 md:px-9">
        {/* Eyebrow */}
        <Reveal>
          <p className="eyebrow" style={{ color: "var(--accent)" }}>
            the archive
          </p>
        </Reveal>

        {/* Kinetic headline */}
        <KineticHeadline
          as="h1"
          text={"Experiences\u00A0& Achievements."}
          delay={0.08}
          className="mt-5 font-display display-xl"
        />

        {/* Deck copy */}
        <Reveal delay={0.3} className="mt-8 max-w-lg">
          <p className="font-mono text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Every score, every medal, every title —{" "}
            <span style={{ color: "var(--fg)" }}>every experience and achievement in one place</span>.
            Not a brag sheet. A record.
          </p>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={0.45} className="mt-12 flex flex-wrap gap-5">
          {[
            { value: totalAwards.toString(), label: "Total entries" },
            { value: totalFives.toString(), label: "AP fives" },
            { value: SCORES.find((s) => s.label === "ACT")!.value, label: "ACT composite" },
            { value: SCORES.find((s) => s.label === "SAT")!.value, label: "SAT score" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 border-l-2 border-[var(--accent)] pl-4"
              style={{ borderColor: "var(--accent)" }}
            >
              <span
                className="font-mono text-2xl font-bold leading-none md:text-3xl"
                style={{ color: "var(--accent)" }}
              >
                {stat.value}
              </span>
              <span className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>

        {/* Domain spectrum band */}
        <Reveal delay={0.55} className="max-w-2xl">
          <DomainSpectrumBand />
        </Reveal>

        {/* Thin gold divider */}
        <Reveal delay={0.65} className="mt-10">
          <div
            className="h-px w-24"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-2), transparent)",
            }}
          />
        </Reveal>
      </motion.div>
    </section>
  );
}
