"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { LEADERSHIP } from "@/lib/data";

type EventItem = (typeof LEADERSHIP.events)[number];

/** Render a note's **bold** markers as gold emphasis. */
function NoteText({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((seg, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[var(--accent)]">
            {seg}
          </strong>
        ) : (
          <span key={i}>{seg}</span>
        )
      )}
    </>
  );
}

/**
 * One ledger row — brutalist table treatment. The whole row inverts to
 * solid gold (black type) on hover/expand; the metric rides the right edge.
 */
function LedgerRow({
  event,
  index,
  isOpen,
  onToggle,
}: {
  event: EventItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const inverted = hovered || isOpen;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
      }}
      className="border-b-2 border-[rgba(212,175,106,0.35)]"
    >
      <button
        type="button"
        data-cursor-hover
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={isOpen}
        className="relative w-full cursor-pointer text-left transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
        style={{ background: inverted ? "var(--accent)" : "transparent" }}
      >
        <div className="flex items-baseline gap-4 px-1 py-5 md:gap-8 md:px-3 md:py-6">
          {/* Giant ghost numeral */}
          <span
            aria-hidden
            className="hidden w-16 shrink-0 select-none font-anton text-[2.6rem] leading-none tracking-tight sm:block md:w-24 md:text-[3.4rem]"
            style={{
              color: "transparent",
              WebkitTextStroke: inverted ? "1px rgba(12,10,8,0.8)" : "1px rgba(212,175,106,0.45)",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Title + window */}
          <span className="flex-1">
            <span
              className="block font-anton text-[1.4rem] uppercase leading-none tracking-tight md:text-[2.2rem]"
              style={{ color: inverted ? "#0c0a08" : "var(--fg)" }}
            >
              {event.title}
            </span>
            <span
              className="mt-1.5 block font-mono text-[0.58rem] uppercase tracking-[0.25em]"
              style={{ color: inverted ? "rgba(12,10,8,0.65)" : "var(--muted)" }}
            >
              {event.window} · {isOpen ? "— close" : "+ open"}
            </span>
          </span>

          {/* Metric — right edge, huge */}
          <span
            className="shrink-0 text-right font-anton text-[1.3rem] leading-none tracking-tight md:text-[2.4rem]"
            style={{ color: inverted ? "#0c0a08" : "var(--accent)" }}
          >
            {event.metric}
          </span>
        </div>
      </button>

      {/* Expanded note — keyed to the row, kept on asphalt for contrast */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-1 pb-7 pt-1 sm:pl-20 md:pl-28">
              {/* The story — bold words run gold */}
              <p className="max-w-3xl text-sm leading-relaxed text-[var(--fg)] opacity-85 md:text-base">
                <NoteText text={event.note} />
              </p>

              {/* Line-item facts — sub-ledger cells */}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {event.facts.map((f) => (
                  <div
                    key={f.label}
                    className="border-l-2 border-[var(--accent)] bg-[var(--bg-2)] py-2 pl-3.5 pr-5"
                  >
                    <p className="font-anton text-xl leading-none text-[var(--accent)] md:text-2xl">
                      {f.value}
                    </p>
                    <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                      {f.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Video link — rows that have footage */}
              {"video" in event && event.video && (
                <a
                  href={event.video.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className="mt-5 inline-flex items-center gap-2.5 border border-[rgba(212,175,106,0.5)] bg-[var(--bg-2)] px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--accent)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[#0c0a08]"
                >
                  <span aria-hidden>▶</span>
                  {event.video.label}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * EventsGrid — "The Range" as a brutalist full-bleed ledger.
 * Solid gold header band, heavy rules, row-inversion hovers: deliberately
 * table-like, the visual opposite of the editorial office cards above it.
 */
export function EventsGrid() {
  const { events } = LEADERSHIP;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-20 md:mt-32" aria-labelledby="events-grid-heading">
      {/* Solid gold header band — full bleed */}
      <Reveal>
        <div className="flex items-center justify-between gap-4 bg-[var(--accent)] px-5 py-2.5 md:px-9">
          <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#0c0a08]">
            Event Log — {events.length} entries
          </span>
          <span className="hidden font-mono text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#0c0a08] sm:block">
            FY 2023 → 2027 · audited
          </span>
        </div>
      </Reveal>

      <div className="mx-auto max-w-7xl px-5 md:px-9">
        {/* Oversized headline, hard against the band */}
        <h2 id="events-grid-heading" className="sr-only">
          The Range — event ledger
        </h2>
        <Reveal>
          <p
            aria-hidden
            className="mt-6 font-anton uppercase leading-[0.92] tracking-tight text-[var(--fg)] md:mt-8"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
          >
            The&nbsp;Range<span className="text-[var(--accent)]">.</span>
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-3 max-w-2xl font-serif-i text-base italic text-[var(--fg)] opacity-70 md:text-lg">
            From 500-person protests to 262-player scavenger hunts — every line item, on the record.
          </p>
        </Reveal>

        {/* The ledger */}
        <RevealGroup
          className="mt-8 border-t-2 border-[rgba(212,175,106,0.35)] md:mt-10"
          stagger={0.05}
          delayChildren={0.05}
        >
          {events.map((ev, i) => (
            <LedgerRow
              key={ev.title}
              event={ev}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
            />
          ))}
        </RevealGroup>

        {/* Ledger footer — running totals */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-baseline justify-between gap-3 py-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              Σ — 13 fundraisers · $5,520.40 raised · 3 Homecomings · 1 graduation
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--accent)]">
              balance: in his favor
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
