"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { KineticHeadline } from "@/components/primitives/KineticHeadline";
import { LEADERSHIP } from "@/lib/data";

type EventItem = (typeof LEADERSHIP.events)[number];

function EventRow({
  event,
  index,
  isActive,
  onToggle,
}: {
  event: EventItem;
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="group relative"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      <button
        type="button"
        data-cursor-hover
        onClick={onToggle}
        aria-expanded={isActive}
        className="w-full cursor-pointer border-b border-[var(--line)] py-5 text-left transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] md:py-7"
      >
        <div className="flex items-center justify-between gap-6">
          {/* Index */}
          <span className="w-8 shrink-0 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] opacity-50">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Title — big, gold on active */}
          <span
            className={`flex-1 font-anton text-[1.6rem] uppercase leading-none tracking-tight transition-colors duration-300 md:text-[2.5rem] lg:text-[3rem] ${
              isActive ? "text-[var(--accent)]" : "text-[var(--fg)] group-hover:text-[var(--accent)]"
            }`}
          >
            {event.title}
          </span>

          {/* Window badge */}
          <span className="hidden shrink-0 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] sm:block">
            {event.window}
          </span>

          {/* Arrow */}
          <motion.div
            animate={{ rotate: isActive ? 90 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 text-[var(--accent)]"
            aria-hidden
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        </div>

        {/* Mobile window */}
        <span className="mt-1 block pl-14 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] sm:hidden">
          {event.window}
        </span>
      </button>

      {/* Expandable note */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-b border-[var(--line)] pb-5 pl-14 pt-4">
              {/* Gold accent line */}
              <motion.div
                className="mb-3 h-px w-12 bg-[var(--accent)]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              <p className="max-w-2xl font-grotesk text-base leading-relaxed text-[var(--fg)] opacity-80 md:text-lg">
                {event.note}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function EventsLedger() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { events } = LEADERSHIP;

  function toggle(i: number) {
    setActiveIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section
      className="mx-auto mt-20 max-w-7xl px-5 md:mt-32 md:px-9"
      aria-labelledby="events-ledger-heading"
    >
      {/* Section header */}
      <Reveal>
        <div className="flex items-baseline justify-between border-b border-[var(--fg)] pb-4">
          <div className="flex items-baseline gap-6">
            <span className="eyebrow text-[var(--accent)]">Event Ledger</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
              {events.length}&nbsp;roles
            </span>
          </div>
          <span className="eyebrow hidden text-[var(--muted)] sm:block">
            Hover / tap to expand
          </span>
        </div>
      </Reveal>

      <div className="mt-6 md:mt-8" id="events-ledger-heading">
        <KineticHeadline
          as="h2"
          text="The Full Record."
          className="font-anton text-[2.8rem] uppercase leading-none tracking-tight text-[var(--fg)] md:text-[5rem]"
          delay={0.05}
        />
      </div>

      {/* Ledger list */}
      <RevealGroup
        className="mt-8 divide-y divide-[var(--line)] md:mt-10"
        stagger={0.06}
        delayChildren={0.1}
      >
        {events.map((ev, i) => (
          <EventRow
            key={ev.title}
            event={ev}
            index={i}
            isActive={activeIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </RevealGroup>

      {/* Footer note */}
      <Reveal delay={0.2}>
        <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          Class President three years running · ASB President 2026–2027 · Mission San Jose H.S.
        </p>
      </Reveal>
    </section>
  );
}
