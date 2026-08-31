"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PAPER } from "@/lib/demos/notebookli";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Splits a sentence so each defined term becomes its own clickable span. */
function annotate(
  sentence: string,
  terms: string[],
  onPick: (t: string) => void,
  active: string | null,
) {
  if (terms.length === 0) return sentence;
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return sentence.split(pattern).map((chunk, i) => {
    const hit = terms.find((t) => t.toLowerCase() === chunk.toLowerCase());
    if (!hit) return <span key={i}>{chunk}</span>;
    return (
      <button
        key={i}
        type="button"
        data-term={hit}
        onClick={() => onPick(hit)}
        data-cursor-hover
        className={cn(
          "underline decoration-dotted underline-offset-4 transition-colors",
          active === hit ? "text-[var(--accent)]" : "text-[var(--fg)] hover:text-[var(--accent)]",
        )}
      >
        {chunk}
      </button>
    );
  });
}

export function NotebookReader() {
  const [term, setTerm] = useState<string | null>(null);
  const [cited, setCited] = useState<number | null>(null);

  const termNames = PAPER.terms.map((t) => t.term);
  const definition = PAPER.terms.find((t) => t.term === term);

  return (
    <div data-demo="notebookli" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
      {/* Left — the paper */}
      <div className="border border-[var(--line)] bg-[var(--bg)] p-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {PAPER.title}
        </p>
        <p className="mt-5 text-sm leading-[2.1] text-[var(--muted)]">
          {PAPER.sentences.map((s, i) => (
            <span
              key={i}
              data-sentence={i}
              className={cn(
                "transition-colors duration-500",
                cited === i && "bg-[var(--selection)] text-[var(--fg)]",
              )}
            >
              {annotate(s, termNames, setTerm, term)}{" "}
            </span>
          ))}
        </p>
      </div>

      {/* Right — definition in place, then the asks */}
      <div className="flex flex-col gap-4">
        <div className="min-h-[8rem] border border-[var(--line)] bg-[var(--bg)] p-5">
          <AnimatePresence mode="wait">
            {definition ? (
              <motion.div
                key={definition.term}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="mission-display text-lg text-[var(--accent)]">{definition.term}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {definition.definition}
                </p>
              </motion.div>
            ) : (
              <p key="hint" className="text-sm text-[var(--muted)]">
                Tap any underlined term to define it without leaving the paragraph.
              </p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-2">
          {PAPER.asks.map((a) => (
            <button
              key={a.question}
              type="button"
              data-ask
              onClick={() => setCited(a.citesSentence)}
              data-cursor-hover
              className="border border-[var(--line)] px-4 py-3 text-left text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
            >
              {a.question}
            </button>
          ))}

          <AnimatePresence>
            {cited !== null ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="border-l-2 border-[var(--accent)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
              >
                {PAPER.asks.find((a) => a.citesSentence === cited)?.answer}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
