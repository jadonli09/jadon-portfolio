"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Delete } from "lucide-react";
import { GATES, isOpen, type Gate, type GateId } from "@/lib/gate";
import { LOCKED_SEASON } from "@/lib/data";
import { asset } from "@/lib/base";

/**
 * A keypad lock in the streaming look of the Locked In page: a dim wall of
 * episode covers, the LI mark, a row of code boxes, and letter tiles to tap.
 * Wrong code shakes the boxes and clears them; the right one fills them red
 * and the screen fades away. Config (code, tiles, prompt) lives in lib/gate.ts.
 */

const COVERS = LOCKED_SEASON.flatMap((c) => c.episodes)
  .filter((e) => e.aspect !== "landscape")
  .map((e) => asset(`/vid/pursuit/${e.slug}.jpg`));

export function KeypadGate({ id }: { id: GateId }) {
  const gate: Gate = GATES[id];
  const code: string = gate.kind === "keypad" ? gate.code : "";
  const prompt: string = gate.kind === "keypad" ? gate.prompt : "";
  const tiles = useMemo<string[]>(() => (gate.kind === "keypad" ? gate.tiles.split("") : []), [gate]);

  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState("");
  const [wrong, setWrong] = useState(0);
  const [solved, setSolved] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Already let in → step aside.
  useEffect(() => {
    if (isOpen(id)) queueMicrotask(() => setOpen(true));
  }, [id]);

  // While locked, the page behind can't scroll or take focus.
  useEffect(() => {
    if (open) return;
    const root = rootRef.current;
    const others = root
      ? Array.from(document.body.children).filter((el) => el !== root && el.tagName !== "SCRIPT")
      : [];
    others.forEach((el) => el.setAttribute("inert", ""));
    document.documentElement.style.overflow = "hidden";
    return () => {
      others.forEach((el) => el.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // The entry lives in a ref as well, so quick taps never read a stale value.
  const entryRef = useRef("");
  const solvedRef = useRef(false);
  const set = (v: string) => {
    entryRef.current = v;
    setEntry(v);
  };

  const press = useCallback(
    (ch: string) => {
      if (solvedRef.current || entryRef.current.length >= code.length) return;
      const next = entryRef.current + ch;
      set(next);
      if (next.length < code.length) return;
      if (next === code) {
        solvedRef.current = true;
        setSolved(true);
        try {
          localStorage.setItem(gate.key, "1");
        } catch {}
        window.setTimeout(() => setOpen(true), 1100);
      } else {
        window.setTimeout(() => {
          setWrong((w) => w + 1);
          set("");
        }, 280);
      }
    },
    [code, gate.key]
  );

  const back = useCallback(() => {
    if (!solvedRef.current) set(entryRef.current.slice(0, -1));
  }, []);

  // Typing works too.
  useEffect(() => {
    if (open) return;
    const onKey = (e: KeyboardEvent) => {
      const ch = e.key.toUpperCase();
      if (tiles.includes(ch)) press(ch);
      else if (e.key === "Backspace") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, tiles, press, back]);

  if (open) return null;

  return (
    <div
      ref={rootRef}
      data-gate={id}
      data-lenis-prevent
      className="fixed inset-0 z-[65] flex items-center justify-center overflow-hidden bg-[#0b0b0b] px-5 text-white"
      style={{ opacity: solved ? 0 : 1, transition: "opacity 0.5s ease 0.6s" }}
    >
      {/* A dim, tilted wall of episode covers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[20%] grid rotate-[-8deg] grid-cols-6 gap-3 opacity-45 sm:grid-cols-8">
          {Array.from({ length: 48 }, (_, i) => COVERS[i % COVERS.length]).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="aspect-[9/16] w-full rounded-md object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(11,11,11,0.6),#0b0b0b_85%)]" />
      </div>

      <motion.div
        className="relative w-full max-w-[26rem] text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <svg viewBox="0 0 64 64" className="mx-auto size-14" aria-hidden>
          <rect width="64" height="64" rx="14" fill="#e50914" />
          <g fill="#fff">
            <rect x="16" y="14" width="8.5" height="36" />
            <rect x="16" y="41.5" width="17" height="8.5" />
            <rect x="39" y="14" width="8.5" height="36" />
          </g>
        </svg>
        <h1 className="mt-6 font-grotesk text-[clamp(1.6rem,6vw,2.2rem)] font-bold leading-tight">{prompt}</h1>

        {/* Code boxes */}
        <motion.div
          key={wrong}
          className="mt-7 flex justify-center gap-3"
          animate={wrong ? { x: [0, -12, 12, -8, 8, -3, 0] } : undefined}
          transition={{ duration: 0.45 }}
          aria-live="polite"
          aria-label={`${entry.length} of ${code.length} entered`}
        >
          {code.split("").map((_, i) => {
            const ch = entry[i];
            return (
              <span
                key={i}
                className={`flex size-16 items-center justify-center rounded-md border-2 font-anton text-3xl transition-colors duration-200 sm:size-[4.5rem] ${
                  solved
                    ? "border-[#e50914] bg-[#e50914] text-white"
                    : ch
                      ? "border-white bg-white/10 text-white"
                      : i === entry.length
                        ? "border-white/80 text-white/0"
                        : "border-white/30 text-white/0"
                }`}
              >
                {ch ?? "•"}
              </span>
            );
          })}
        </motion.div>

        {/* The pad */}
        <div className="mx-auto mt-8 grid max-w-[20rem] grid-cols-4 gap-2.5 sm:gap-3">
          {tiles.map((ch, i) => (
            <motion.button
              key={ch}
              type="button"
              onClick={() => press(ch)}
              data-cursor-hover
              aria-label={ch}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.025, type: "spring", bounce: 0.25, duration: 0.45 }}
              whileTap={{ scale: 0.92 }}
              className="flex aspect-square items-center justify-center rounded-lg bg-white/[0.08] font-anton text-2xl text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/20 hover:ring-white/40 sm:text-[1.7rem]"
            >
              {ch}
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          onClick={back}
          data-cursor-hover
          disabled={!entry || solved}
          className="mx-auto mt-5 inline-flex min-h-12 items-center gap-2 rounded-md px-5 font-grotesk text-base font-semibold text-white/75 transition-colors hover:text-white disabled:opacity-0"
        >
          <Delete className="size-5" /> Delete
        </button>
      </motion.div>
    </div>
  );
}
