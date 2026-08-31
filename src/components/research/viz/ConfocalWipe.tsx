"use client";

import { useCallback, useRef, useState } from "react";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";
import { FUS_PANELS } from "../lab/content";

type StrainKey = keyof typeof FUS_PANELS;
const ORDER: StrainKey[] = ["t8996", "fo47", "neg"];

export function ConfocalWipe() {
  const [strain, setStrain] = useState<StrainKey>("t8996");
  const [pct, setPct] = useState(55);
  const stageRef = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const panel = FUS_PANELS[strain];

  const setFromClientX = useCallback((clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    setPct(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPct(0);
    else if (e.key === "End") setPct(100);
    else return;
    e.preventDefault();
  }

  return (
    <figure className="m-0 border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-2.5">
        <div className="flex gap-1" role="group" aria-label="Strain">
          {ORDER.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setStrain(k)}
              aria-pressed={strain === k}
              className={cn(
                "rounded-sm border px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                strain === k
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[#10040a]"
                  : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              {FUS_PANELS[k].label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[var(--muted)]">
          drag, or use ← →
        </span>
      </div>

      <div
        ref={stageRef}
        role="slider"
        tabIndex={0}
        aria-label={`Reveal RFP channel — ${panel.label}, ${panel.note}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)}% RFP merge`}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          if (activePointer.current !== null) return;
          activePointer.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (activePointer.current === e.pointerId) setFromClientX(e.clientX);
        }}
        onPointerUp={(e) => {
          if (activePointer.current === e.pointerId) activePointer.current = null;
        }}
        onPointerCancel={(e) => {
          if (activePointer.current === e.pointerId) activePointer.current = null;
        }}
        data-lenis-prevent
        style={{ aspectRatio: "208 / 205" }}
        className={cn(
          "relative w-full cursor-ew-resize touch-none select-none overflow-hidden bg-black",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[var(--accent)]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(panel.bf)}
          alt={`Brightfield confocal image — ${panel.label}`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(panel.merge)}
          alt={`RFP merge — ${panel.label}, ${panel.note}`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
        />
        <span className="pointer-events-none absolute bottom-2 left-2 rounded-sm bg-black/60 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#b9c2ce]">
          Brightfield
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-black/60 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[var(--accent)]">
          RFP merge
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-[var(--accent)]"
          style={{ left: `${pct}%`, boxShadow: "0 0 18px var(--accent)" }}
        >
          <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)] bg-black/70" />
        </div>
      </div>
    </figure>
  );
}
