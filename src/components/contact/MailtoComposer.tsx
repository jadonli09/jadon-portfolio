"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { PROFILE } from "@/lib/data";

const EMAIL = PROFILE.email;

const TOPICS = [
  { id: "collab", label: "Collaboration", subject: "Let's collaborate", body: "Hey Jadon,\n\nI'd love to explore collaborating on something together.\n\n" },
  { id: "project", label: "Project", subject: "I have a project idea", body: "Hey Jadon,\n\nI have a project I think you'd find interesting.\n\n" },
  { id: "research", label: "Research", subject: "Research opportunity", body: "Hey Jadon,\n\nI wanted to reach out about a research opportunity.\n\n" },
  { id: "media", label: "Media / Video", subject: "Video / media work", body: "Hey Jadon,\n\nI'm interested in your media and video work.\n\n" },
  { id: "speaking", label: "Speaking", subject: "Speaking invitation", body: "Hey Jadon,\n\nI'd like to invite you to speak / present.\n\n" },
  { id: "other", label: "Other", subject: "Reaching out", body: "Hey Jadon,\n\n" },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];

/**
 * A no-backend mailto composer. Select a topic chip → compose a mailto link
 * with a pre-filled subject and body opener. No fake submit.
 */
export function MailtoComposer() {
  const [selected, setSelected] = useState<TopicId | null>(null);

  const topic = useMemo(() => TOPICS.find((t) => t.id === selected), [selected]);

  const href = useMemo(() => {
    if (!topic) return null;
    return (
      `mailto:${EMAIL}` +
      `?subject=${encodeURIComponent(topic.subject)}` +
      `&body=${encodeURIComponent(topic.body)}`
    );
  }, [topic]);

  const select = useCallback(
    (id: TopicId) => setSelected((prev) => (prev === id ? null : id)),
    []
  );

  return (
    <div className="w-full">
      {/* Label */}
      <p className="eyebrow mb-5">What&apos;s on your mind?</p>

      {/* Topic chips */}
      <div className="flex flex-wrap gap-2 md:gap-3" role="group" aria-label="Select a topic">
        {TOPICS.map((t) => {
          const active = selected === t.id;
          return (
            <motion.button
              key={t.id}
              onClick={() => select(t.id)}
              whileTap={{ scale: 0.95 }}
              aria-pressed={active}
              data-cursor-hover
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-[0.72rem] uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                active
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[#07070a] shadow-[0_0_24px_rgba(232,177,90,0.25)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]/60 hover:text-[var(--fg)]"
              )}
            >
              {t.label}
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <AnimatePresence mode="wait">
        {href ? (
          <motion.a
            key="open"
            href={href}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35 }}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-3.5 font-grotesk text-sm font-medium text-[#07070a] shadow-[0_0_32px_rgba(232,177,90,0.22)] transition-all duration-300 hover:bg-[var(--accent-2)] hover:text-white hover:shadow-[0_0_40px_rgba(217,96,63,0.28)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            <Mail className="size-4 shrink-0" />
            Open in mail app
            <ArrowUpRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--line)] px-7 py-3.5 font-grotesk text-sm text-[var(--muted)] select-none"
            aria-hidden
          >
            <Mail className="size-4 shrink-0" />
            Pick a topic above
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
