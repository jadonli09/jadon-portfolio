"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";
import { PROFILE } from "@/lib/data";

const EMAIL = PROFILE.email;
const RESET_DELAY = 1600;

type State = "idle" | "copied" | "error";

/** Legacy clipboard path for browsers where the async Clipboard API is
 *  unavailable or denied (e.g. permissions policy, older Safari). */
function legacyCopy(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

export function EmailCopy({ className }: { className?: string }) {
  const [state, setState] = useState<State>("idle");

  const copy = useCallback(async () => {
    if (state !== "idle") return;

    // The async Clipboard API can stall for seconds on a hidden permission
    // check — race it against a short deadline so the button always responds
    // instantly, falling back to the synchronous legacy path.
    let ok = false;
    if (navigator.clipboard?.writeText) {
      ok = await Promise.race([
        navigator.clipboard.writeText(EMAIL).then(
          () => true,
          () => false
        ),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 350)),
      ]);
    }
    if (!ok) ok = legacyCopy(EMAIL);

    setState(ok ? "copied" : "error");
    setTimeout(() => setState("idle"), RESET_DELAY);
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

      {/* Copied / error feedback label */}
      <AnimatePresence>
        {state !== "idle" && (
          <motion.span
            key={state}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "font-mono text-[0.68rem] uppercase tracking-widest",
              state === "copied" ? "text-emerald-400" : "text-[var(--accent-2)]"
            )}
          >
            {state === "copied" ? "Copied" : "Select & copy manually"}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
