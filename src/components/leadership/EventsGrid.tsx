"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { LEADERSHIP } from "@/lib/data";

type EventItem = (typeof LEADERSHIP.events)[number];

/** Individual event card in the grid — metric prominent, note on hover/tap. */
function EventCard({
  event,
  index,
}: {
  event: EventItem;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
      }}
      className="group relative"
    >
      <button
        type="button"
        data-cursor-hover
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="relative w-full cursor-pointer overflow-hidden border border-[var(--line)] bg-[var(--bg-2)] p-6 text-left transition-colors duration-400 hover:border-[rgba(212,175,106,0.5)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] md:p-7"
      >
        {/* Gold bar top accent — reveals on hover */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-[var(--accent)] to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: open ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Index + window row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[var(--muted)] opacity-50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
            {event.window}
          </span>
        </div>

        {/* Metric — the big number / headline stat */}
        {event.metric !== "—" && (
          <p
            className="mt-3 font-anton leading-none tracking-tight text-[var(--accent)]"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
          >
            {event.metric}
          </p>
        )}

        {/* Event title */}
        <p
          className={`font-anton uppercase leading-tight tracking-tight text-[var(--fg)] transition-colors duration-300 group-hover:text-[var(--accent)] ${event.metric !== "—" ? "mt-1 text-[1.1rem] md:text-[1.3rem]" : "mt-3 text-[1.5rem] md:text-[2rem]"}`}
        >
          {event.title}
        </p>

        {/* Tap hint */}
        <p className="mt-3 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
          {open ? "▲ less" : "▼ story"}
        </p>
      </button>

      {/* Expandable note */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border border-t-0 border-[rgba(212,175,106,0.3)] bg-[var(--bg-2)] px-6 pb-6 pt-4 md:px-7 md:pb-7">
              <div className="mb-3 h-px w-8 bg-[var(--accent)] opacity-60" />
              <p className="text-sm leading-relaxed text-[var(--fg)] opacity-80 md:text-base">
                {event.note}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * EventsGrid — a rich, interactive ledger showing Jadon's range and volume
 * as an operator. Each card leads with its metric; tap reveals the note.
 */
export function EventsGrid() {
  const { events } = LEADERSHIP;

  return (
    <section
      className="mx-auto mt-20 max-w-7xl px-5 md:mt-32 md:px-9"
      aria-labelledby="events-grid-heading"
    >
      {/* Section header */}
      <Reveal>
        <div className="flex items-baseline justify-between border-b border-[var(--fg)] pb-4">
          <div className="flex items-baseline gap-6">
            <span className="eyebrow text-[var(--accent)]">Event Log</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              {events.length}&nbsp;entries
            </span>
          </div>
          <span className="eyebrow hidden text-[var(--muted)] sm:block">
            Tap to expand
          </span>
        </div>
      </Reveal>

      {/* Section headline */}
      <div className="mt-5 md:mt-6" id="events-grid-heading">
        <KineticHeadline
          as="h2"
          text="The Range."
          className="font-anton text-[2.8rem] uppercase leading-none tracking-tight text-[var(--fg)] md:text-[5.5rem]"
          delay={0.05}
        />
      </div>

      <Reveal delay={0.15}>
        <p className="mt-4 max-w-2xl font-serif-i text-base italic text-[var(--fg)] opacity-70 md:text-lg">
          From 500-person protests to 262-player scavenger hunts — running at scale across every dimension.
        </p>
      </Reveal>

      {/* Event cards grid */}
      <RevealGroup
        className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-3 xl:grid-cols-4"
        stagger={0.06}
        delayChildren={0.05}
      >
        {events.map((ev, i) => (
          <EventCard key={ev.title} event={ev} index={i} />
        ))}
      </RevealGroup>

      {/* Footer note */}
      <Reveal delay={0.2}>
        <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          Class President ×3&nbsp;·&nbsp;ASB President 2026–2027&nbsp;·&nbsp;Mission San Jose H.S.
        </p>
      </Reveal>
    </section>
  );
}
