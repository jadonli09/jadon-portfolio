"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "motion/react";
import { ArrowUpRight, Radio } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { PosterHeading } from "@/components/ui/poster-heading";
import { ReelCard } from "@/components/civic/IgEmbed";
import { asset } from "@/lib/base";
import { EASE, revealUp } from "@/lib/motion";

/* ── Data — MSJTV / Leadership II "L2 Vid" ─────────────────────── */

const CHANNEL = "https://www.youtube.com/@msjtvbroadcast";

/** Season 3 episodes — the monthly broadcast on @msjtvbroadcast (episode guide). */
const EPISODES = [
  { n: 1, id: "o-_p8whGt90", dur: "7:30" },
  { n: 2, id: "GKvMXHRuT5Y", dur: "9:04" },
  { n: 3, id: "WCsW-niyA2Q", dur: "9:29" },
  { n: 4, id: "QVekfQ1pPbc", dur: "5:28" },
] as const;

/** What L2 Vid makes — compact chips. */
const TAGS = ["Drone at Homecoming", "Homecoming Recap", "Cinematic Promo", "Teacher Interviews"] as const;

/** Short cinematic cuts he directed — widely complimented. Embedded from IG. */
const CUTS = [
  { title: "Winter Ball Promo", tag: "Teaser · 0:30", reel: "DSglzCBEeN2" },
  { title: "Prom Promo", tag: "K-drama · 500+ likes in a day", reel: "DXvK5pNthck" },
  { title: "Charity Fashion Show Promo", tag: "Event promo", reel: "DWX7JmHDKzJ" },
] as const;

/* ── Main section ──────────────────────────────────────────────── */

export function CivicBroadcast() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-9 md:py-16">
      <PosterHeading
        label="Broadcast · L2 Videography"
        title="The school, on the record"
        meta="MSJTV · Season 3"
        className="mb-8 md:mb-10"
      />

      {/* Team photo (left) + intro, tags & episode guide (right) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start md:gap-10">
        <Reveal>
          <figure className="relative overflow-hidden border border-[var(--line)] shadow-lg">
            <img
              src={asset("/img/l2-vid-team.jpg")}
              alt="The L2 Videography team in front of the Mission mural"
              className="aspect-[4/3] w-full object-cover object-[center_38%]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--bg)]/85 px-3 py-2 backdrop-blur">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                L2 Vid — the team behind MSJTV
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                <Radio className="size-3" /> On air
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-4">
            <div className="h-[2px] w-12 bg-[var(--accent)]" />
            <a
              href={CHANNEL}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="group inline-flex w-fit items-center gap-2 text-lg font-semibold tracking-wide transition-colors duration-300 hover:text-[var(--accent)]"
            >
              / MSJTV
              <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              As part of <strong className="text-[var(--fg)]">L2 Videography</strong>, Jadon{" "}
              <strong className="text-[var(--fg)]">directs and edits MSJTV</strong> — the school&apos;s monthly
              broadcast of events, recaps, and opportunities — and{" "}
              <strong className="text-[var(--fg)]">directs the cinematic short films</strong> the committee is known
              for. MSJTV is only one of L2 Vid&apos;s jobs; the initiatives below are ones he started this year.
            </p>
            <p className="text-[0.82rem] leading-relaxed text-[var(--muted)]">
              <span className="font-semibold text-[var(--accent)]">Anchors</span> · Jadon Li &amp; Hanna R.
              (juniors), Luis H. &amp; Jennifer L. (seniors).
            </p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <span
                  key={t}
                  className="border border-[var(--line)] bg-[var(--bg-2)] px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-wide text-[var(--muted)]"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Season 3 — episode guide, links out to YouTube */}
            <div className="mt-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]/70">
                  Season 3 · episodes
                </span>
                <a
                  href={CHANNEL}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  @msjtvbroadcast ↗
                </a>
              </div>
              {EPISODES.map((e) => (
                <a
                  key={e.id}
                  href={`https://www.youtube.com/watch?v=${e.id}`}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-[var(--line)] py-2 transition-colors hover:bg-[var(--bg-2)]"
                >
                  <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                    S3 · E{e.n}
                  </span>
                  <span
                    aria-hidden
                    className="h-px"
                    style={{ background: "repeating-linear-gradient(90deg, var(--line) 0 3px, transparent 3px 7px)" }}
                  />
                  <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]">
                    {e.dur}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Cinematic cuts — IG reels in themed clip frames */}
      <div className="mt-12 md:mt-16">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="text-base font-medium tracking-wider md:text-lg">CINEMATIC CUTS</span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[var(--muted)]">
              short films he directed
            </span>
          </div>
        </Reveal>
        <RevealGroup
          className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
          delayChildren={0.05}
        >
          {CUTS.map((c) => (
            <motion.div key={c.reel} variants={revealUp}>
              <ReelCard reel={c.reel} title={c.title} tag={c.tag} />
            </motion.div>
          ))}
        </RevealGroup>
      </div>

      <Reveal delay={0.2}>
        <motion.div
          className="mt-10 h-[1px] bg-[var(--line)] md:mt-14"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        />
      </Reveal>
    </section>
  );
}
