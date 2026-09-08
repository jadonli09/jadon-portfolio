"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

interface TypewriterProps {
  readonly text: string;
  readonly className?: string;
  /** Milliseconds per character. */
  readonly speed?: number;
  /** Milliseconds before the first character lands. */
  readonly delay?: number;
  /** How long the caret lingers after the last character, in milliseconds. */
  readonly holdCaret?: number;
}

/**
 * Types a line out a character at a time, terminal style.
 *
 * The full string is always in the layout — the untyped tail is only made
 * transparent, never removed. That keeps the line box and every wrap point
 * fixed at their final positions, so a balanced paragraph doesn't re-flow on
 * each keystroke. The caret is an absolutely positioned block inside a
 * zero-width box for the same reason: it must not push the tail around.
 *
 * Screen readers get the sentence once, whole, from the visually hidden copy.
 */
export function Typewriter({
  text,
  className,
  speed = 24,
  delay = 300,
  holdCaret = 2000,
}: TypewriterProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [caretGone, setCaretGone] = useState(false);

  // Reduced motion is a render-time decision, not a state write: the whole
  // line is simply already typed.
  const shown = reduced ? text.length : count;
  const showCaret = !reduced && !caretGone;

  useEffect(() => {
    if (reduced || !inView) return;
    let ticker = 0;
    let fade = 0;
    const begin = window.setTimeout(() => {
      // Counted locally rather than from previous state: a state updater must
      // stay pure, and under StrictMode a double invocation would otherwise
      // schedule the caret timeout twice.
      let typed = 0;
      setCount(0);
      setCaretGone(false);
      ticker = window.setInterval(() => {
        typed += 1;
        setCount(typed);
        if (typed >= text.length) {
          window.clearInterval(ticker);
          fade = window.setTimeout(() => setCaretGone(true), holdCaret);
        }
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(begin);
      window.clearTimeout(fade);
      window.clearInterval(ticker);
    };
  }, [inView, reduced, speed, delay, holdCaret, text]);

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.slice(0, shown)}
        {showCaret && (
          <span className="relative inline-block h-[1em] w-0 align-[-0.02em]">
            <motion.span
              className="absolute bottom-0 left-[0.05em] block h-[0.92em] w-[0.46em] bg-current"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{
                duration: 1.06,
                times: [0, 0.5, 0.5, 1],
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </span>
        )}
        <span className="opacity-0">{text.slice(shown)}</span>
      </span>
    </p>
  );
}
