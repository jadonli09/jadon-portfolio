"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FUS_PLASMID } from "../lab/content";

type Feature = (typeof FUS_PLASMID.features)[number];

const KIND_COLOR: Record<Feature["kind"], string> = {
  reporter: "var(--accent)",
  marker: "var(--accent-2)",
  backbone: "var(--muted)",
};

const W = 360;
const CX = W / 2;
const CY = W / 2;
const R = 118;
const TAU = Math.PI * 2;

const ang = (bp: number) => (bp / FUS_PLASMID.bp) * TAU - Math.PI / 2;

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

export function PlasmidRing() {
  const [hovered, setHovered] = useState<Feature | null>(null);
  const [linear, setLinear] = useState(false);
  const titleId = useId();
  const shown = hovered ?? FUS_PLASMID.features[0];
  const cutA = ang(FUS_PLASMID.cut.pos);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
      <div className="w-full max-w-[320px] shrink-0">
        {linear ? (
          <svg
            viewBox={`0 0 ${W} 96`}
            className="w-full"
            role="img"
            aria-labelledby={titleId}
          >
            <title id={titleId}>
              {FUS_PLASMID.name}, linearized at {FUS_PLASMID.cut.name}
            </title>
            <line x1={10} y1={48} x2={W - 10} y2={48} stroke="var(--line)" strokeWidth={10} />
            {FUS_PLASMID.features.map((f) => {
              const x0 = 10 + (f.start / FUS_PLASMID.bp) * (W - 20);
              const x1 = 10 + (f.end / FUS_PLASMID.bp) * (W - 20);
              return (
                <g key={f.name}>
                  <line
                    x1={x0}
                    y1={48}
                    x2={x1}
                    y2={48}
                    stroke={KIND_COLOR[f.kind]}
                    strokeWidth={f.kind === "reporter" || hovered?.name === f.name ? 13 : 10}
                    onMouseEnter={() => setHovered(f)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(f)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    style={{
                      cursor: "pointer",
                      filter:
                        f.kind === "reporter" || hovered?.name === f.name
                          ? `drop-shadow(0 0 6px ${KIND_COLOR[f.kind]})`
                          : undefined,
                    }}
                  />
                  <text
                    x={(x0 + x1) / 2}
                    y={f.kind === "reporter" ? 30 : 72}
                    fontSize="7.5"
                    fill={KIND_COLOR[f.kind]}
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {f.name}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <svg viewBox={`0 0 ${W} ${W}`} className="w-full" role="img" aria-labelledby={titleId}>
            <title id={titleId}>
              {FUS_PLASMID.name} plasmid map, {FUS_PLASMID.bp} base pairs
            </title>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth={10} />
            {[0, 1000, 2000, 3000, 4000, 5000].map((bp) => {
              const a = ang(bp);
              return (
                <g key={bp}>
                  <line
                    x1={CX + (R + 9) * Math.cos(a)}
                    y1={CY + (R + 9) * Math.sin(a)}
                    x2={CX + (R + 15) * Math.cos(a)}
                    y2={CY + (R + 15) * Math.sin(a)}
                    stroke="var(--muted)"
                    strokeWidth={1}
                  />
                  <text
                    x={CX + (R + 26) * Math.cos(a)}
                    y={CY + (R + 26) * Math.sin(a)}
                    fontSize="7"
                    fill="var(--muted)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="monospace"
                  >
                    {bp}
                  </text>
                </g>
              );
            })}
            {FUS_PLASMID.features.map((f) => {
              const a0 = ang(f.start);
              const a1 = ang(f.end);
              const mid = (a0 + a1) / 2;
              const on = hovered?.name === f.name;
              return (
                <g key={f.name}>
                  <path
                    d={arcPath(CX, CY, R, a0, a1)}
                    fill="none"
                    stroke={KIND_COLOR[f.kind]}
                    strokeWidth={f.kind === "reporter" || on ? 13 : 10}
                    tabIndex={0}
                    onMouseEnter={() => setHovered(f)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(f)}
                    onBlur={() => setHovered(null)}
                    style={{
                      cursor: "pointer",
                      filter:
                        f.kind === "reporter" || on
                          ? `drop-shadow(0 0 6px ${KIND_COLOR[f.kind]})`
                          : undefined,
                    }}
                  />
                  <text
                    x={CX + (R - 30) * Math.cos(mid)}
                    y={CY + (R - 30) * Math.sin(mid)}
                    fontSize={f.kind === "reporter" ? "9" : "7.5"}
                    fontWeight={f.kind === "reporter" ? 700 : 500}
                    fill={KIND_COLOR[f.kind]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="monospace"
                    pointerEvents="none"
                  >
                    {f.name}
                  </text>
                </g>
              );
            })}
            <line
              x1={CX + (R - 20) * Math.cos(cutA)}
              y1={CY + (R - 20) * Math.sin(cutA)}
              x2={CX + (R + 20) * Math.cos(cutA)}
              y2={CY + (R + 20) * Math.sin(cutA)}
              stroke="var(--hot)"
              strokeWidth={2}
            />
          </svg>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">
          {FUS_PLASMID.name} · {FUS_PLASMID.bp.toLocaleString()} bp
        </p>
        <div className="min-h-[4.5rem]">
          <p className="font-mono text-[0.95rem] text-[var(--fg)]">{shown.name}</p>
          <p className="mt-1 text-[0.9rem] leading-relaxed text-[var(--muted)]">
            {shown.note || `${shown.start}–${shown.end} bp`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setLinear((v) => !v)}
          aria-pressed={linear}
          className={cn(
            "self-start rounded-sm border px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
            linear
              ? "border-[var(--hot)] text-[var(--hot)]"
              : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]",
          )}
        >
          {linear ? "Show the circular plasmid" : `Linearize with ${FUS_PLASMID.cut.name}`}
        </button>
      </div>
    </div>
  );
}
