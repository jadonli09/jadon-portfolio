"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";
import { MCQS, type DemoMcq } from "@/lib/demos/acornprep";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

function Practice({ q, onNext }: { q: DemoMcq; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const graded = picked !== null;
  const correct = picked === q.answer;

  return (
    <div data-demo="acorn-practice" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left — stimulus + metadata, as the product lays it out */}
      <div className="border border-[var(--line)] bg-[var(--bg)] p-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {q.course} · {q.unit} · {q.difficulty}
        </p>
        {q.stimulus ? (
          <p className="mt-5 text-sm leading-[1.9] text-[var(--muted)]">{q.stimulus}</p>
        ) : null}
      </div>

      {/* Right — stem, choices, verdict */}
      <div className="flex flex-col gap-3">
        <p className="text-base leading-relaxed text-[var(--fg)]">{q.stem}</p>

        {q.choices.map((c) => {
          const isAnswer = c.label === q.answer;
          const isPicked = c.label === picked;
          return (
            <button
              key={c.label}
              type="button"
              disabled={graded}
              onClick={() => setPicked(c.label)}
              data-cursor-hover
              className={cn(
                "flex items-center gap-4 border px-5 py-4 text-left transition-colors duration-200",
                !graded && "border-[var(--line)] hover:border-[var(--accent)]",
                graded && isAnswer && "border-[var(--accent)] text-[var(--fg)]",
                graded && !isAnswer && "border-[var(--line)] opacity-40",
              )}
            >
              <span className="font-mono text-xs text-[var(--muted)]">{c.label}.</span>
              <span className="flex-1 text-sm">{c.text}</span>
              {graded && isAnswer ? <Check className="size-4 text-[var(--accent)]" /> : null}
              {graded && isPicked && !isAnswer ? <X className="size-4 text-[var(--muted)]" /> : null}
            </button>
          );
        })}

        <AnimatePresence>
          {graded ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-2 border border-[var(--line)] bg-[var(--bg)] p-5"
            >
              <p className="mission-display text-lg text-[var(--accent)]">
                {correct ? "Nailed it." : "Not quite."}
              </p>
              <p className="mt-3 text-sm leading-[1.9] text-[var(--muted)]">{q.explanation}</p>
              <button
                type="button"
                onClick={() => {
                  setPicked(null);
                  onNext();
                }}
                data-cursor-hover
                className="btn-brackets mt-5"
              >
                Next question
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AcornDemo() {
  const [i, setI] = useState(0);
  return <Practice q={MCQS[i % MCQS.length]} onNext={() => setI((n) => n + 1)} />;
}
