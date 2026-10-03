"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { PosterHeading } from "@/components/ui/poster-heading";
import { ClipCard } from "@/components/civic/ClipCard";
import { asset } from "@/lib/base";
import { CIVIC } from "@/lib/data";
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

/** Short cinematic cuts he directed — posters link out to the reels on IG. */
const CUTS = [
  { title: "Winter Ball promo", tag: "A 30-second teaser", reel: "DSglzCBEeN2" },
  { title: "Prom promo", tag: "K-drama style, 500+ likes in a day", reel: "DXvK5pNthck" },
  { title: "Charity fashion show promo", reel: "DWX7JmHDKzJ" },
] as const;

/* ── Main section ──────────────────────────────────────────────── */

export function CivicBroadcast() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-9 md:py-16">
      <PosterHeading
        title="The school, on the record"
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
            <figcaption className="absolute inset-x-0 bottom-0 border-t border-[var(--line)] bg-[var(--bg)]/85 px-3 py-2 text-sm text-[var(--fg)] backdrop-blur">
              L2 Vid, the team behind MSJTV
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
              className="group inline-flex w-fit items-center gap-2 font-grotesk text-2xl font-bold uppercase tracking-[-1px] transition-colors duration-300 hover:text-[var(--accent)]"
            >
              MSJTV
              <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
            <p className="text-base leading-relaxed text-[var(--muted)]">
              As part of <strong className="text-[var(--fg)]">L2 Videography</strong>, Jadon{" "}
              <strong className="text-[var(--fg)]">directs and edits MSJTV</strong>{" "}— the school&apos;s monthly
              broadcast of events, recaps, and opportunities — and{" "}
              <strong className="text-[var(--fg)]">directs the cinematic short films</strong>{" "}the committee is known
              for. MSJTV is only one of L2 Vid&apos;s jobs; the initiatives below are ones he started this year.
            </p>
            <p className="text-base leading-relaxed text-[var(--muted)]">
              <span className="font-semibold text-[var(--accent)]">Anchors:</span>{" "}Jadon Li &amp; Hanna R.
              (juniors), Luis H. &amp; Jennifer L. (seniors).
            </p>
            {/* Season 3 — episode guide, links out to YouTube */}
            <div className="mt-1">
              {EPISODES.map((e) => (
                <a
                  key={e.id}
                  href={`https://www.youtube.com/watch?v=${e.id}`}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-[var(--line)] py-2.5 transition-colors hover:bg-[var(--bg-2)]"
                >
                  <span className="text-base font-semibold text-[var(--accent)]">
                    Season 3, Episode {e.n}
                  </span>
                  <span
                    aria-hidden
                    className="h-px"
                    style={{ background: "repeating-linear-gradient(90deg, var(--line) 0 3px, transparent 3px 7px)" }}
                  />
                  <span className="flex items-center gap-2 font-mono text-sm text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]">
                    {e.dur}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Cinematic cuts — posters that open the reels on Instagram */}
      <div className="mt-12 md:mt-16">
        <Reveal>
          <h3 className="font-grotesk text-2xl font-bold uppercase tracking-[-1px] md:text-3xl">Cinematic cuts</h3>
          <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-[var(--muted)]">
            {CIVIC.awards.slice(0, 2).join(". ")}.
          </p>
        </Reveal>
        <RevealGroup
          data-lenis-prevent
          className="-mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
          stagger={0.08}
          delayChildren={0.05}
        >
          {CUTS.map((c) => (
            <motion.div key={c.reel} variants={revealUp} className="w-[80%] shrink-0 snap-start sm:w-auto">
              <ClipCard
                href={`https://www.instagram.com/reel/${c.reel}/`}
                poster={`/embeds/cut-${c.reel}.jpg`}
                title={c.title}
                meta={"tag" in c ? c.tag : undefined}
                aspect="16 / 9"
              />
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
