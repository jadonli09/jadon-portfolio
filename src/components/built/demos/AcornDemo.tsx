"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";
import { MCQS, FRQ, CARDS, type DemoMcq, type RubricItem } from "@/lib/demos/acornprep";
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
              // `aria-disabled` + a click guard, not `disabled`: a real
              // `disabled` attribute drops keyboard focus to <body> the instant
              // an answer is graded, so the reader is thrown out of the demo at
              // exactly the moment the result appears.
              aria-disabled={graded}
              onClick={() => {
                if (graded) return;
                setPicked(c.label);
              }}
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

        {/* The live region is mounted from the start, empty, so the verdict is
            an update inside an existing region rather than a region that
            appears with content — the latter is announced unreliably. */}
        <div role="status">
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
    </div>
  );
}

function RubricRow({ item, delay }: { item: RubricItem; delay: number }) {
  const earned = item.earned > 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="border border-[var(--line)] bg-[var(--bg)] p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm text-[var(--fg)]">
          {earned ? (
            <Check className="size-3.5 text-[var(--accent)]" />
          ) : (
            <X className="size-3.5 text-[var(--muted)]" />
          )}
          {item.title}
        </span>
        <span className="shrink-0 border border-[var(--accent)] px-2 py-0.5 font-mono text-[0.6rem] text-[var(--accent)]">
          {item.earned}/{item.outOf}
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{item.justification}</p>

      {item.quote ? (
        <p className="mt-3 border-l-2 border-[var(--accent)] bg-[var(--bg-2)] px-3 py-2 font-mono text-[0.7rem] italic leading-relaxed text-[var(--muted)]">
          &ldquo;{item.quote}&rdquo;
        </p>
      ) : null}
    </motion.div>
  );
}

function Grade() {
  return (
    <div data-demo="acorn-grade" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left — the prompt and what the student wrote */}
      <div className="border border-[var(--line)] bg-[var(--bg)] p-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          {FRQ.exam}
        </p>
        <p className="mt-5 text-sm leading-[1.9] text-[var(--muted)]">{FRQ.prompt}</p>
        <p className="mt-6 border-t border-[var(--line)] pt-5 font-mono text-[0.8rem] leading-[1.9] text-[var(--fg)]">
          {FRQ.response}
        </p>
      </div>

      {/* Right — the rubric, item by item */}
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="mission-display text-2xl">Your results</span>
          <span className="border border-[var(--line)] px-3 py-1 font-mono text-xs text-[var(--fg)]">
            {FRQ.scored} / {FRQ.total} ({Math.round((FRQ.scored / FRQ.total) * 100)}%)
          </span>
        </div>

        {FRQ.parts.map((p, pi) => (
          <div key={p.part} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--accent)]">
                Part {p.part}
              </span>
              <span className="font-mono text-[0.65rem] text-[var(--muted)]">
                {p.earned}/{p.outOf} pts
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--muted)]">{p.summary}</p>
            {p.items.map((item, ii) => (
              <RubricRow key={item.title} item={item} delay={pi * 0.15 + ii * 0.1} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Review() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = CARDS[i % CARDS.length];

  return (
    <div data-demo="acorn-review" className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        data-cursor-hover
        className="flex min-h-[14rem] w-full max-w-2xl items-center justify-center border border-[var(--line)] bg-[var(--bg)] px-8 py-10 text-center transition-colors hover:border-[var(--accent)]"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={`${i}-${flipped}`}
            initial={{ opacity: 0, rotateX: -35 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 35 }}
            transition={{ duration: 0.35, ease: EASE }}
            // Card backs are captured verbatim, blank line between the
            // definition and its bullets; without pre-line they run together.
            className="whitespace-pre-line text-base leading-relaxed text-[var(--fg)]"
          >
            {flipped ? card.back : card.front}
          </motion.span>
        </AnimatePresence>
      </button>

      <div className="flex items-center gap-6 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--muted)]">
        <span>{flipped ? "Back" : "Front"} · click to flip</span>
        <button
          type="button"
          data-cursor-hover
          onClick={() => {
            setFlipped(false);
            setI((n) => n + 1);
          }}
          className="text-[var(--fg)] transition-opacity hover:opacity-70"
        >
          Next card →
        </button>
      </div>
    </div>
  );
}

const FACES = [
  { id: "practice", label: "Practice", note: "Answer one" },
  { id: "grade", label: "Grade", note: "Watch it mark an FRQ" },
  { id: "review", label: "Review", note: "Flip a card" },
] as const;

export function AcornDemo() {
  const [face, setFace] = useState<(typeof FACES)[number]["id"]>("practice");
  const [i, setI] = useState(0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {FACES.map((f) => (
          <button
            key={f.id}
            type="button"
            data-demo-face={f.id}
            aria-pressed={face === f.id}
            onClick={() => setFace(f.id)}
            data-cursor-hover
            className={cn(
              "border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-colors",
              face === f.id
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-2 font-mono text-[0.65rem] text-[var(--muted)]">
          {FACES.find((f) => f.id === face)!.note}
        </span>
      </div>

      {face === "practice" ? (
        <Practice q={MCQS[i % MCQS.length]} onNext={() => setI((n) => n + 1)} />
      ) : null}
      {face === "grade" ? <Grade /> : null}
      {face === "review" ? <Review /> : null}
    </div>
  );
}
