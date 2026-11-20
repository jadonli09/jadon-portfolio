"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { asset } from "@/lib/base";

export type TabShot = {
  label: string;
  line: string;
  src: string;
  alt: string;
  /** shown in a plain browser bar; omit when the picture already has its own frame */
  url?: string;
  /** a wide screen sits whole instead of filling the frame */
  contain?: boolean;
};

/**
 * Feature tabs that advance on their own. Each tab carries a progress bar that
 * fills while its screen is up; hovering or focusing the block holds it, and
 * pressing a tab jumps there. Screens crossfade with a small settle.
 */
export function CycleTabs({ items, ms = 4800, tone = "dark" }: { items: TabShot[]; ms?: number; tone?: "dark" | "light" }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (held || reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % items.length), ms);
    return () => clearTimeout(t);
  }, [i, held, reduce, ms, items.length, tick]);

  const go = (n: number) => {
    setI(n);
    setTick((t) => t + 1);
  };

  const track = tone === "dark" ? "bg-white/20" : "bg-black/15";

  return (
    <div onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
      <button type="button" onClick={() => go((i + 1) % items.length)} data-cursor-hover aria-label={`Next screen. Showing: ${items[i].label}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-[#f4f4f1] text-left" data-ui>
        {items.map((s, n) => (
          <span
            key={s.src}
            aria-hidden={n !== i}
            className="absolute inset-0 flex flex-col transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: n === i ? 1 : 0, scale: n === i ? "1" : "1.02" }}
          >
            {s.url ? (
              <span className="flex h-8 shrink-0 items-center gap-3 bg-[#e6e7e2] px-4 text-[0.875rem] text-[#3c4a40]">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#c9ccc4]" />
                  <span className="size-2.5 rounded-full bg-[#c9ccc4]" />
                  <span className="size-2.5 rounded-full bg-[#c9ccc4]" />
                </span>
                <span>{s.url}</span>
              </span>
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(s.src)} alt={s.alt} loading="lazy" className={`min-h-0 w-full flex-1 object-top ${s.contain ? "bg-[#f6f2ea] object-contain" : "object-cover"}`} />
          </span>
        ))}
      </button>

      <div role="tablist" aria-label="Screens" className="mt-5 grid grid-cols-3 gap-x-5 gap-y-4 sm:[grid-template-columns:var(--cols)]" style={{ "--cols": `repeat(${Math.min(items.length, 5)}, minmax(0, 1fr))` } as React.CSSProperties}>
        {items.map((s, n) => (
          <button
            key={s.label}
            type="button"
            role="tab"
            aria-selected={n === i}
            onClick={() => go(n)}
            data-cursor-hover
            className={`group flex min-h-11 flex-col gap-2 text-left transition-opacity duration-300 ${n === i ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
          >
            <span className={`relative block h-[3px] w-full overflow-hidden ${track}`}>
              <span
                key={`${i}-${tick}-${held}`}
                className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                style={{
                  width: n < i ? "100%" : n === i ? undefined : "0%",
                  animation: n === i && !held && !reduce ? `ac-fill ${ms}ms linear forwards` : undefined,
                  ...(n === i && (held || reduce) ? { width: "100%" } : {}),
                }}
              />
            </span>
            <span className="text-[1.0625rem] font-semibold leading-tight">{s.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-[3em] max-w-[60ch] text-[1.0625rem] leading-snug opacity-85" aria-live="polite">
        {items[i].line}
      </p>
    </div>
  );
}
