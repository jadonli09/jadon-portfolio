"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { FEED, WATCHED_HANDLES, RUN_STATS, STORY_SHOT } from "@/lib/demos/hermes";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

const STAGES = [
  { id: 0, label: "Ingest", note: "93 accounts, one real run" },
  { id: 1, label: "Extract", note: "Claude pulls the meeting out" },
  { id: 2, label: "Publish", note: "One story, every weekday" },
] as const;

const RUN_STAT_ROWS = [
  { value: String(RUN_STATS.clubsProcessed), label: "Clubs processed" },
  { value: String(RUN_STATS.postsScraped), label: "Posts scraped" },
  { value: String(RUN_STATS.newPosts), label: "New posts" },
  { value: String(RUN_STATS.duplicatesSkipped), label: "Duplicates skipped" },
  { value: String(RUN_STATS.extractionFailures), label: "Extraction failures" },
  { value: `~${RUN_STATS.durationSeconds}s`, label: "Run time" },
] as const;

export function HermesPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [stage, setStage] = useState(0);

  // Play through once on scroll-in, then leave it to the reader.
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = window.setTimeout(() => setStage(1), 1600);
    const b = window.setTimeout(() => setStage(2), 3400);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [inView]);

  return (
    <div ref={ref} data-demo="hermes">
      {/* Stage selector */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            data-stage={s.id}
            aria-pressed={stage === s.id}
            onClick={() => setStage(s.id)}
            data-cursor-hover
            className={cn(
              "border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-colors",
              stage === s.id
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]",
            )}
          >
            {s.label}
          </button>
        ))}
        <span className="ml-2 font-mono text-[0.65rem] text-[var(--muted)]">
          {STAGES[stage].note}
        </span>
      </div>

      <div className="min-h-[26rem] border border-[var(--line)] bg-[var(--bg)] p-6">
        <AnimatePresence mode="wait">
          {/* ── Ingest: the real roster + real telemetry from one run ── */}
          {stage === 0 ? (
            <motion.div
              key="ingest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="mb-9 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
                {RUN_STAT_ROWS.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col gap-1 border-l-[1.5px] border-[var(--accent)] pl-3"
                  >
                    <p className="mission-display text-xl text-[var(--fg)]">{s.value}</p>
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="eyebrow mb-3">
                {WATCHED_HANDLES.length} accounts polled — 2026-08-28 run
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {WATCHED_HANDLES.map((h) => (
                  <span key={h} className="font-mono text-[0.6rem] text-[var(--muted)]">
                    @{h}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : null}

          {/* ── Extract: caption → structured row ── */}
          {stage === 1 ? (
            <motion.div
              key="extract"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col gap-3"
            >
              <p className="eyebrow mb-1">Hermes&apos;s own extraction test cases</p>
              {FEED.map((f, i) => (
                <motion.div
                  key={f.caption}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.1 }}
                  className="grid grid-cols-1 items-center gap-3 border-b border-[var(--line)] pb-3 md:grid-cols-[1fr_auto_1.2fr]"
                >
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">
                      {f.handle ? `@${f.handle}` : `Test case ${i + 1}`}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--muted)] opacity-60">
                      {f.caption}
                    </p>
                  </div>
                  <span className="hidden font-mono text-[var(--accent)] md:block">→</span>
                  {f.extracted ? (
                    <p className="font-mono text-[0.7rem] leading-relaxed text-[var(--fg)]">
                      {f.extracted.room} · {f.extracted.time}
                      <span className="text-[var(--muted)]"> — {f.extracted.what}</span>
                    </p>
                  ) : (
                    <p className="font-mono text-[0.7rem] text-[var(--muted)]">
                      no meeting — dropped
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : null}

          {/* ── Publish: the story that goes out ── */}
          {stage === 2 ? (
            <motion.div
              key="publish"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(STORY_SHOT)}
                alt="A Hermes daily club-schedule story as posted to @msjclubs"
                loading="lazy"
                decoding="async"
                className="max-h-[24rem] w-auto border border-[var(--line)]"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
