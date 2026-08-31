"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";

// Deterministic volcano plot points — hardcoded for SSR stability.
// x = log2(foldChange), y = -log10(pValue)
// Significant threshold: |x| > 1.5 AND y > 2

type PointDir = "up" | "down" | "ns";

type VPoint = {
  x: number;
  y: number;
  sig: boolean;
  dir: PointDir;
  label: string;
};

// 110 illustrative scatter points covering the volcano shape
const RAW: readonly [number, number, string][] = [
  // non-significant center mass
  [-0.3, 0.4, "Actb"],   [-0.1, 0.8, "Gapdh"],  [0.2, 0.5, "Tubb3"],
  [0.4, 1.1, "Hsp90a"],  [-0.5, 0.9, "Ppia"],   [0.1, 0.3, "B2m"],
  [-0.7, 1.4, "Eef1a"],  [0.6, 1.2, "Rplp0"],   [-0.2, 0.7, "Rrm1"],
  [0.3, 0.6, "Psmd4"],   [-0.4, 1.0, "Ube2d"],  [0.5, 0.4, "Cops5"],
  [-0.8, 1.6, "Trim25"], [-0.1, 1.3, "Skp1"],   [0.7, 1.0, "Cul1"],
  [0.2, 1.5, "Nedd8"],   [-0.6, 0.2, "Ube3a"],  [0.8, 0.8, "Usp14"],
  [-0.3, 1.8, "Fbxw7"],  [0.4, 0.3, "Huwe1"],   [1.0, 1.9, "Map2k1"],
  [-1.0, 1.7, "Mapk8"],  [0.9, 1.0, "Egfr"],    [-0.9, 0.6, "Fgfr1"],
  [1.1, 1.6, "Kras"],    [-1.1, 1.3, "Braf"],   [0.6, 0.7, "Araf"],
  [-0.5, 0.5, "Raf1"],   [1.2, 1.8, "Mek1"],    [-1.2, 1.4, "Jnk1"],
  [0.3, 1.1, "Erk1"],    [-0.3, 1.0, "Erk2"],   [0.8, 0.2, "P38"],
  [-0.8, 0.3, "P38b"],   [1.3, 1.7, "Akt1"],    [-1.3, 1.2, "Pten"],
  // borderline (not significant)
  [1.4, 1.9, "Ptgs2b"],  [-1.4, 1.85, "Ptpn11"], [1.3, 1.95, "Ripk1b"],
  [-1.3, 1.9, "Stat3b"], [1.35, 1.98, "Irak1b"],
  [-0.1, 0.1, "Gadd45"], [0.3, 0.2, "Cdkn1a"],  [0.5, 1.7, "Tp53"],
  [-0.4, 1.6, "Rb1"],    [0.7, 1.5, "Ccnd1"],   [-0.7, 1.9, "Cdk4"],
  [0.2, 1.9, "E2f1"],    [-0.2, 0.9, "Myc"],    [0.6, 0.6, "Mdm2"],
  [-0.9, 0.7, "Brca1"],
  // UPREGULATED (x > 1.5, y > 2) — magenta
  [1.6, 2.2, "Cxcl1"],  [1.8, 3.1, "Il6"],    [2.0, 4.5, "Il1b"],
  [2.3, 5.8, "Tnf"],    [1.9, 3.8, "Cxcl2"],  [2.6, 6.2, "Ptgs2"],
  [1.7, 2.5, "Nlrp3"],  [3.1, 7.1, "Il18"],   [2.8, 5.4, "Casp1"],
  [1.6, 2.8, "Ccl2"],   [2.2, 4.1, "Mmp9"],   [3.4, 6.8, "Mmp3"],
  [1.7, 3.0, "Nos2"],   [2.5, 4.9, "Ripk3"],  [1.8, 2.3, "Irak1"],
  [2.1, 3.6, "Traf6"],  [2.9, 5.1, "Ikbkb"],  [1.6, 2.1, "Myd88"],
  [3.7, 7.4, "Nfkb1"],  [2.4, 4.3, "Rela"],   [1.7, 2.7, "Jak2"],
  [2.0, 3.4, "Stat3"],  [1.6, 2.2, "Cxcl10"], [2.8, 4.7, "Csf1"],
  [3.2, 6.0, "Ptx3"],   [2.1, 3.3, "Ccl7"],   [1.9, 2.9, "S100a8"],
  [4.1, 7.8, "S100a9"],
  // DOWNREGULATED (x < -1.5, y > 2) — teal
  [-1.6, 2.3, "Adipoq"], [-2.0, 3.2, "Pparg"],  [-2.4, 5.0, "Socs1"],
  [-1.8, 2.8, "Il10"],   [-2.7, 6.1, "Foxo3"],  [-1.7, 2.6, "Tgfb1"],
  [-3.0, 6.9, "Sirt1"],  [-2.2, 4.2, "Nrf2"],   [-1.6, 2.4, "Hmox1"],
  [-2.9, 5.5, "Ikbkg"],  [-3.5, 7.2, "Dusp1"],  [-2.1, 3.7, "Dusp6"],
  [-1.7, 2.9, "Ptpn1"],  [-2.6, 4.8, "Arg1"],   [-1.9, 3.0, "Mrc1"],
  [-2.3, 4.4, "Cd163"],  [-3.1, 5.8, "Trem2"],  [-1.6, 2.2, "Cybb"],
  [-2.5, 5.2, "Smad7"],  [-1.8, 2.7, "Irs1"],   [-2.0, 3.5, "Insr"],
  [-3.8, 7.6, "Scd1"],   [-2.2, 4.0, "Fasn"],   [-1.7, 2.5, "Acaca"],
  [-2.4, 4.6, "Pdk4"],
];

function buildPoints(): VPoint[] {
  return RAW.map(([x, y, label]) => {
    const sig = Math.abs(x) > 1.5 && y > 2;
    const dir: PointDir = !sig ? "ns" : x > 0 ? "up" : "down";
    return { x, y, label, sig, dir };
  });
}

const POINTS: VPoint[] = buildPoints();

// SVG viewport constants
const VW = 480;
const VH = 320;
const PAD = { top: 20, right: 20, bottom: 44, left: 48 };
const PW = VW - PAD.left - PAD.right;
const PH = VH - PAD.top - PAD.bottom;
const XD: [number, number] = [-5, 5];
const YD: [number, number] = [0, 9];

const sx = (v: number) => PAD.left + ((v - XD[0]) / (XD[1] - XD[0])) * PW;
const sy = (v: number) => PAD.top + (1 - (v - YD[0]) / (YD[1] - YD[0])) * PH;

const X_TICKS = [-4, -2, 0, 2, 4];
const Y_TICKS = [0, 2, 4, 6, 8];

type TooltipState = {
  // position relative to figure container in px
  left: number;
  top: number;
  label: string;
  dir: PointDir;
};

export function VolcanoPlot({ className }: { className?: string }) {
  const [revealed, setRevealed] = useState(false);
  const [tip, setTip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Convert SVG viewport coords to figure-relative px using the current SVG bounding rect
  function svgToFigure(svgX: number, svgY: number): [number, number] {
    const el = svgRef.current;
    if (!el) return [0, 0];
    const rect = el.getBoundingClientRect();
    const scaleX = rect.width / VW;
    const scaleY = rect.height / VH;
    return [svgX * scaleX, svgY * scaleY];
  }

  const pBottom = sy(0);
  const pTop = sy(9);

  return (
    <figure className={cn("relative select-none", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full h-auto"
        role="img"
        aria-label="Stylized differential expression volcano plot — illustrative motif"
        onMouseLeave={() => setTip(null)}
      >
        {/* Grid */}
        <g opacity="0.35">
          {X_TICKS.map((v) => (
            <line key={`xg${v}`} x1={sx(v)} y1={pTop} x2={sx(v)} y2={pBottom}
              stroke="rgba(232,237,242,0.08)" strokeWidth="0.6" strokeDasharray="3,4" />
          ))}
          {Y_TICKS.map((v) => (
            <line key={`yg${v}`} x1={PAD.left} y1={sy(v)} x2={PAD.left + PW} y2={sy(v)}
              stroke="rgba(232,237,242,0.08)" strokeWidth="0.6" strokeDasharray="3,4" />
          ))}
        </g>

        {/* Significance threshold lines */}
        <line x1={sx(-1.5)} y1={pTop} x2={sx(-1.5)} y2={pBottom}
          stroke="var(--accent-2)" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.55" />
        <line x1={sx(1.5)} y1={pTop} x2={sx(1.5)} y2={pBottom}
          stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.55" />
        <line x1={PAD.left} y1={sy(2)} x2={PAD.left + PW} y2={sy(2)}
          stroke="var(--muted)" strokeWidth="0.8" strokeDasharray="4,4" opacity="0.4" />

        {/* Zero vertical */}
        <line x1={sx(0)} y1={pTop} x2={sx(0)} y2={pBottom}
          stroke="rgba(232,237,242,0.14)" strokeWidth="0.5" opacity="0.1" />

        {/* X tick labels */}
        {X_TICKS.map((v) => (
          <text key={`xl${v}`} x={sx(v)} y={VH - 10}
            fill="var(--muted)" fontSize="8" textAnchor="middle" fontFamily="monospace">
            {v > 0 ? `+${v}` : v}
          </text>
        ))}

        {/* Y tick labels */}
        {Y_TICKS.slice(1).map((v) => (
          <text key={`yl${v}`} x={PAD.left - 6} y={sy(v) + 3}
            fill="var(--muted)" fontSize="8" textAnchor="end" fontFamily="monospace">
            {v}
          </text>
        ))}

        {/* Axis titles */}
        <text x={VW / 2} y={VH - 1} fill="var(--muted)" fontSize="7.5"
          textAnchor="middle" fontFamily="monospace" letterSpacing="0.08em">
          {"log₂(fold change)"}
        </text>
        <text x={9} y={PAD.top + PH / 2} fill="var(--muted)" fontSize="7.5"
          textAnchor="middle" fontFamily="monospace" letterSpacing="0.08em"
          transform={`rotate(-90, 9, ${PAD.top + PH / 2})`}>
          {"−log₁₀(p)"}
        </text>

        {/* Region labels */}
        <text x={PAD.left + 8} y={pTop + 14}
          fill="var(--accent-2)" fontSize="7" fontFamily="monospace" opacity="0.75" letterSpacing="0.12em">
          DOWN
        </text>
        <text x={PAD.left + PW - 36} y={pTop + 14}
          fill="var(--accent)" fontSize="7" fontFamily="monospace" opacity="0.75" letterSpacing="0.12em">
          UP
        </text>

        {/* Scatter points */}
        {POINTS.map((p, i) => {
          const cx = sx(p.x);
          const cy = sy(p.y);
          const fill = p.dir === "up" ? "var(--accent)" : p.dir === "down" ? "var(--accent-2)" : "#3a4250";
          const baseR = p.sig ? 3 : 2;

          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={baseR}
              fill={fill}
              initial={{ opacity: 0 }}
              animate={
                revealed
                  ? p.sig
                    ? { opacity: [0.6, 1, 0.6] }
                    : { opacity: 0.32 }
                  : { opacity: 0 }
              }
              transition={
                p.sig
                  ? { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: (i % 9) * 0.18 }
                  : { delay: 0.04 + i * 0.01, duration: 0.45, ease: [0.16, 1, 0.3, 1] }
              }
              style={{
                cursor: p.sig ? "pointer" : "default",
                filter: p.sig ? `drop-shadow(0 0 5px ${fill})` : "none",
              }}
              whileHover={p.sig ? { scale: 2 } : undefined}
              onMouseEnter={p.sig ? () => {
                const [left, top] = svgToFigure(cx, cy);
                setTip({ left, top, label: p.label, dir: p.dir });
              } : undefined}
            />
          );
        })}

        {/* Highlight ring around hovered point */}
        {tip && (() => {
          const match = POINTS.find((p) => p.label === tip.label);
          if (!match) return null;
          return (
            <motion.circle
              key={`ring-${tip.label}`}
              cx={sx(match.x)}
              cy={sy(match.y)}
              r={7}
              fill="none"
              stroke={tip.dir === "up" ? "var(--accent)" : "var(--accent-2)"}
              strokeWidth="1.2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          );
        })()}
      </svg>

      {/* HTML overlay tooltip — positioned relative to figure */}
      <AnimatePresence>
        {tip && (
          <motion.div
            key="vt"
            className="pointer-events-none absolute z-20 rounded border border-[var(--line)] bg-[var(--bg-2)] px-3 py-2"
            style={{
              left: tip.left + 12,
              top: tip.top - 40,
              boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">
              {tip.dir === "up" ? "upregulated" : "downregulated"}
            </p>
            <p
              className="font-mono text-sm font-bold leading-tight"
              style={{ color: tip.dir === "up" ? "var(--accent)" : "var(--accent-2)" }}
            >
              {tip.label}
            </p>
            <p className="font-mono text-[0.5rem] text-[var(--muted)] mt-0.5 leading-tight">
              illustrative · not real data
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Figure caption */}
      <figcaption className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--muted)] text-center">
        Fig. 1 — stylized differential expression motif
      </figcaption>
    </figure>
  );
}
