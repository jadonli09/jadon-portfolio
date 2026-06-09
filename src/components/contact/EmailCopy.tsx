"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";
import { PROFILE } from "@/lib/data";

const EMAIL = PROFILE.email;
const RESET_DELAY = 1600;

type State = "idle" | "copied" | "error";

export function EmailCopy({ className }: { className?: string }) {
  const [state, setState] = useState<State>("idle");

  const copy = useCallback(async () => {
    if (state !== "idle") return;

    if (!navigator?.clipboard?.writeText) {
      // Fallback: open mailto directly
      window.location.href = `mailto:${EMAIL}`;
      return;
    }

    try {
      await navigator.clipboard.writeText(EMAIL);
      setState("copied");
      setTimeout(() => setState("idle"), RESET_DELAY);
    } catch {
      // Clipboard failed — fail silently; mailto link is still there
      setState("error");
      setTimeout(() => setState("idle"), RESET_DELAY);
    }
  }, [state]);

  return (
    <div className={cn("inline-flex items-center gap-3 md:gap-4", className)}>
      {/* The email address itself as a mailto link */}
      <a
        href={`mailto:${EMAIL}`}
        className="font-mono text-sm tracking-tight text-[var(--fg)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)] md:text-base"
        data-cursor-hover
      >
        {EMAIL}
      </a>

      {/* Copy button */}
      <motion.button
        onClick={copy}
        aria-label={state === "copied" ? "Email copied!" : "Copy email address"}
        disabled={state !== "idle"}
        whileHover={{ scale: state === "idle" ? 1.08 : 1 }}
        whileTap={{ scale: 0.94 }}
        data-cursor-hover
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
          state === "idle" &&
            "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
          state === "copied" &&
            "border-emerald-500/60 bg-emerald-500/10 text-emerald-400",
          state === "error" &&
            "border-[var(--accent-2)]/60 text-[var(--accent-2)]"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === "copied" ? (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <Check className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <Copy className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Copied confirmation label */}
      <AnimatePresence>
        {state === "copied" && (
          <motion.span
            key="label"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-[0.68rem] uppercase tracking-widest text-emerald-400"
          >
            Copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
