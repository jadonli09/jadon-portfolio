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

// Linear-view x position, anchored at the Psp-OMI cut rather than at bp 0. A
// plasmid cut at `cut.pos` runs cut.pos -> bp (wrap) -> 0 -> cut.pos, so the
// cut becomes BOTH ends of the linear track, not the origin.
const rel = (bp: number) =>
  ((bp - FUS_PLASMID.cut.pos + FUS_PLASMID.bp) % FUS_PLASMID.bp) / FUS_PLASMID.bp;

// Linear-view label row (0/1) for non-reporter features, alternated by rank in
// start-bp order rather than by declaration order in FUS_PLASMID.features —
// the declared array isn't sorted by start, so indexing off it directly left
// "ori" and "lacZα (fragment)" sharing a row and colliding. Sorting by raw
// `start` still matches left-to-right order after cut-anchoring, because
// every feature sits entirely on one side of the cut (none straddle it), so
// the anchoring shift is a single monotonic translation.
const LABEL_ROW: Record<string, number> = {};
FUS_PLASMID.features
  .filter((f) => f.kind !== "reporter")
  .slice()
  .sort((a, b) => a.start - b.start)
  .forEach((f, i) => {
    LABEL_ROW[f.name] = i % 2;
  });

// Linear-view render order, left to right by cut-anchored position, so DOM
// order (and therefore Tab order, at tabIndex=0) matches the visual reading
// order of the track. The circular view keeps declaration order — there is
// no single "correct" reading order around a closed loop.
const LINEAR_ORDER: Feature[] = [...FUS_PLASMID.features].sort((a, b) => a.start - b.start);

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

// A permanent, at-rest emphasis for the reporter gene, PLUS a further,
// visibly distinct bump on hover/focus that applies to every feature
// (including the reporter) — so mRFP at rest is not visually identical to
// mRFP focused.
const BASE_WIDTH: Record<Feature["kind"], number> = { reporter: 12, marker: 10, backbone: 10 };
const ACTIVE_WIDTH_BONUS = 4;
const REST_GLOW_PX = 4;
const ACTIVE_GLOW_PX = 9;

function featureVisual(f: Feature, active: boolean) {
  const strokeWidth = BASE_WIDTH[f.kind] + (active ? ACTIVE_WIDTH_BONUS : 0);
  const glow = active ? ACTIVE_GLOW_PX : f.kind === "reporter" ? REST_GLOW_PX : 0;
  const filter = glow > 0 ? `drop-shadow(0 0 ${glow}px ${KIND_COLOR[f.kind]})` : undefined;
  return { strokeWidth, filter };
}

export function PlasmidRing() {
  const [hovered, setHovered] = useState<Feature | null>(null);
  const [focused, setFocused] = useState<Feature | null>(null);
  const [linear, setLinear] = useState(false);
  const titleId = useId();
  const active = focused ?? hovered;
  const shown = active ?? FUS_PLASMID.features[0];
  const cutA = ang(FUS_PLASMID.cut.pos);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
      <div className="w-full max-w-[320px] shrink-0">
        {linear ? (
          <svg
            viewBox={`0 0 ${W} 104`}
            className="w-full"
            role="img"
            aria-labelledby={titleId}
          >
            <title id={titleId}>
              {FUS_PLASMID.name}, linearized at {FUS_PLASMID.cut.name}
            </title>
            <line x1={10} y1={48} x2={W - 10} y2={48} stroke="var(--line)" strokeWidth={10} />
            {LINEAR_ORDER.map((f) => {
              const x0 = 10 + rel(f.start) * (W - 20);
              const x1 = 10 + rel(f.end) * (W - 20);
              const on = active?.name === f.name;
              const { strokeWidth, filter } = featureVisual(f, on);
              // Non-reporter labels alternate between two rows. All at one y overlapped:
              // ori/lacZα and HygR/trpC collide at this viewBox width.
              const labelY = f.kind === "reporter" ? 30 : LABEL_ROW[f.name] === 0 ? 66 : 80;
              return (
                <g key={f.name}>
                  <line
                    x1={x0}
                    y1={48}
                    x2={x1}
                    y2={48}
                    stroke={KIND_COLOR[f.kind]}
                    strokeWidth={strokeWidth}
                    onMouseEnter={() => setHovered(f)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setFocused(f)}
                    onBlur={() => setFocused(null)}
                    tabIndex={0}
                    style={{ cursor: "pointer", filter }}
                  />
                  <text
                    x={(x0 + x1) / 2}
                    y={labelY}
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
            {/* the cut is both ends of the linear molecule — mark it at each edge */}
            <line x1={10} y1={38} x2={10} y2={58} stroke="var(--hot)" strokeWidth={2} />
            <line x1={W - 10} y1={38} x2={W - 10} y2={58} stroke="var(--hot)" strokeWidth={2} />
            <text x={2} y={14} fontSize="6.5" fill="var(--hot)" textAnchor="start" fontFamily="monospace">
              {FUS_PLASMID.cut.name}
            </text>
            <text x={W - 2} y={14} fontSize="6.5" fill="var(--hot)" textAnchor="end" fontFamily="monospace">
              {FUS_PLASMID.cut.name}
            </text>
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
              const on = active?.name === f.name;
              const { strokeWidth, filter } = featureVisual(f, on);
              return (
                <g key={f.name}>
                  <path
                    d={arcPath(CX, CY, R, a0, a1)}
                    fill="none"
                    stroke={KIND_COLOR[f.kind]}
                    strokeWidth={strokeWidth}
                    tabIndex={0}
                    onMouseEnter={() => setHovered(f)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setFocused(f)}
                    onBlur={() => setFocused(null)}
                    style={{ cursor: "pointer", filter }}
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
        <p className="font-mono text-[0.7rem] tracking-[0.14em] text-[var(--muted)]">
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
            "self-start rounded-sm border px-3 py-2 font-mono text-[0.65rem] tracking-[0.12em] transition-colors",
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
