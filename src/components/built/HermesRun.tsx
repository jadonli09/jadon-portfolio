"use client";

import { RiseGroup, RiseItem } from "@/components/built/Rise";
import { RUN_STATS } from "@/lib/demos/hermes";

/* ────────────────────────────────────────────────────────────────────
   One real Hermes run, as six numbers and three words.

   Replaces a three-tab demo that reproduced the output sheet row by row. The
   rows were real, but a table of five extractions is not a picture of what
   Hermes does — the run's shape is. Every figure here is Hermes's own
   telemetry from the 2026-08-28 run, unchanged.
   ──────────────────────────────────────────────────────────────────── */

const ROWS = [
  // `clubsProcessed` is Hermes's own field name; the roster it counts is clubs
  // plus ASB, the class accounts and sports teams, so the label reads
  // "Accounts". msjhsasb.org's 87 counts clubs only — a different figure.
  { value: String(RUN_STATS.clubsProcessed), label: "Accounts" },
  { value: String(RUN_STATS.postsScraped), label: "Posts scraped" },
  { value: String(RUN_STATS.newPosts), label: "New" },
  { value: String(RUN_STATS.duplicatesSkipped), label: "Duplicates" },
  { value: String(RUN_STATS.extractionFailures), label: "Failures" },
  { value: `~${RUN_STATS.durationSeconds}s`, label: "Run time" },
];

export function HermesRun() {
  return (
    <div className="mt-8 border-t border-[var(--line)] pt-7">
      {/* The stage names used to repeat here as pills. They are the whole
          subject of the flow diagram above now, so what is left is the thing
          the diagram cannot show: one real run's numbers. */}
      <p className="t-label">One run · 2026-08-28</p>

      <RiseGroup className="mt-6 grid grid-cols-3 gap-x-6 gap-y-6 lg:grid-cols-6">
        {ROWS.map((r) => (
          <RiseItem key={r.label}>
            <p className="t-num text-[1.5rem] leading-none">{r.value}</p>
            <p className="t-small mt-1.5 text-[0.72rem] leading-tight">{r.label}</p>
          </RiseItem>
        ))}
      </RiseGroup>
    </div>
  );
}
