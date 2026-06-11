"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toggleMutate, type ToastTone } from "./bus";

type Toast = { id: number; text: string; tone: ToastTone };

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

// typed-keyword factoids — find them by just... typing
const FACTOIDS: { key: string; text: string; tone: ToastTone }[] = [
  { key: "gout", text: "🧫 gout = monosodium urate crystals firing the NLRP3 inflammasome", tone: "hot" },
  { key: "pcr", text: "🔬 PCR doubles your DNA each cycle — 30 cycles ≈ a billion-fold", tone: "cyan" },
  { key: "deseq", text: "📊 DESeq2 models read counts with a negative-binomial fit", tone: "lime" },
  { key: "jadon", text: "👋 you found me. thanks for poking around.", tone: "lime" },
];

const TONE_CLASS: Record<ToastTone, string> = {
  lime: "text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_45%,transparent)]",
  cyan: "text-[var(--accent-2)] border-[color-mix(in_srgb,var(--accent-2)_45%,transparent)]",
  hot: "text-[var(--hot)] border-[color-mix(in_srgb,var(--hot)_45%,transparent)]",
};

/**
 * Hidden delights: the Konami code flips the world into "mutation mode," and
 * typing certain words anywhere drops a one-line bio factoid. Renders the toast
 * stack and listens for `lab:toast` events fired elsewhere (command palette).
 */
export function LabEasterEggs() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let nextId = 1;
    const push = (text: string, tone: ToastTone) => {
      const id = nextId++;
      setToasts((t) => [...t, { id, text, tone }].slice(-3));
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
    };

    let konamiPos = 0;
    let buffer = "";

    const onKey = (e: KeyboardEvent) => {
      // ignore typing inside inputs/textareas
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // konami
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === KONAMI[konamiPos]) {
        konamiPos += 1;
        if (konamiPos === KONAMI.length) {
          konamiPos = 0;
          toggleMutate();
        }
      } else {
        konamiPos = k === KONAMI[0] ? 1 : 0;
      }

      // keyword buffer
      if (/^[a-z]$/.test(k)) {
        buffer = (buffer + k).slice(-12);
        const hit = FACTOIDS.find((f) => buffer.endsWith(f.key));
        if (hit) {
          buffer = "";
          push(hit.text, hit.tone);
        }
      }
    };

    const onToast = (e: Event) => {
      const d = (e as CustomEvent).detail as { text: string; tone: ToastTone };
      push(d.text, d.tone);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("lab:toast", onToast as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lab:toast", onToast as EventListener);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[80] flex flex-col items-end gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={`max-w-xs rounded-lg border bg-[var(--bg-2)]/95 px-4 py-2.5 font-mono text-[0.7rem] leading-snug shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur ${TONE_CLASS[t.tone]}`}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
