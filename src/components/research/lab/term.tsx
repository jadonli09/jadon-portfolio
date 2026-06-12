"use client";

import { Fragment, type ReactNode } from "react";
import { Photo } from "@/components/primitives/Photo";

/* ── JSON with syntax highlighting (the IDE "cat file.json" look) ───────────── */

function highlight(text: string): ReactNode[] {
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<span key={k++} className="text-[var(--muted)]">{text.slice(last, m.index)}</span>);
    if (m[1] && m[2] !== undefined) {
      out.push(
        <span key={k++}>
          <span style={{ color: "var(--accent)" }}>{m[1]}</span>
          <span className="text-[var(--muted)]">{m[2]}</span>
        </span>,
      );
    } else if (m[1]) out.push(<span key={k++} style={{ color: "var(--accent-2)" }}>{m[1]}</span>);
    else if (m[3]) out.push(<span key={k++} style={{ color: "var(--hot)" }}>{m[3]}</span>);
    else if (m[4]) out.push(<span key={k++} className="text-[var(--fg)]">{m[4]}</span>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(<span key={k++} className="text-[var(--muted)]">{text.slice(last)}</span>);
  return out;
}

/** Syntax-highlighted JSON with an editor-style line-number gutter. */
export function JsonView({ data }: { data: unknown }) {
  const lines = JSON.stringify(data, null, 2).split("\n");
  return (
    <div className="term-scroll overflow-x-auto rounded border border-[var(--line)] bg-[var(--bg)]/40" data-lenis-prevent>
      <pre className="py-2 text-[0.76rem] leading-relaxed">
        {lines.map((ln, i) => (
          <div key={i} className="flex gap-3 px-3">
            <span className="w-7 shrink-0 select-none border-r border-[var(--line)] pr-2 text-right text-[var(--muted)]/45">{i + 1}</span>
            <span className="whitespace-pre">{highlight(ln)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ── ASCII block-bar meter (the "terminal graphic") ──────────────────────────── */

export function AsciiMeter({ label, frac, caption, width = 22 }: { label: string; frac: number; caption: string; width?: number }) {
  const f = Math.max(0, Math.min(1, frac));
  const fill = Math.round(f * width);
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 text-[0.74rem]">
      <span className="shrink-0 text-[var(--muted)]" style={{ minWidth: "9ch" }}>{label}</span>
      <span className="whitespace-pre">
        <span style={{ color: "var(--accent)" }}>{"█".repeat(fill)}</span>
        <span className="text-[var(--muted)]/40">{"░".repeat(width - fill)}</span>
      </span>
      <span className="text-[var(--fg)]">{caption}</span>
    </div>
  );
}

/** ASCII art (e.g. a medal) beside a labelled info list — neofetch style. */
export function AsciiArt({ art, info }: { art: string[]; info: [string, string][] }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
      <pre className="shrink-0 text-[0.72rem] leading-tight" style={{ color: "var(--accent)" }}>{art.join("\n")}</pre>
      <div className="min-w-0 space-y-0.5 self-center text-[0.76rem]">
        {info.map(([k, v]) => (
          <p key={k} className="flex flex-wrap gap-x-2">
            <span className="shrink-0 text-[var(--accent-2)]" style={{ minWidth: "7ch" }}>{k}</span>
            <span className="text-[var(--fg)]">{v}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

/* ── expression heatmap (genes × conditions, z-scores) ───────────────────────── */

export function Heatmap({ samples, rows }: { samples: string[]; rows: { gene: string; z: number[] }[] }) {
  const cell = (v: number) => {
    const t = Math.min(1, Math.abs(v) / 2);
    const rgb = v >= 0 ? "188,255,70" : "79,230,238";
    return `color-mix(in srgb, rgb(${rgb}) ${Math.round(t * 90)}%, rgba(12,18,26,0.55))`;
  };
  return (
    <div className="text-[0.72rem]">
      <p className="mb-2 text-[var(--muted)]"># expression z-scores · row = gene · col = tissue/condition</p>
      <div className="term-scroll overflow-x-auto" data-lenis-prevent>
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `5rem repeat(${samples.length}, 4.4rem)` }}>
          <span />
          {samples.map((s) => (
            <span key={s} className="px-1 text-center text-[0.55rem] uppercase tracking-wider text-[var(--muted)]">{s}</span>
          ))}
          {rows.map((r) => (
            <Fragment key={r.gene}>
              <span className="flex items-center font-semibold text-[var(--fg)]">{r.gene}</span>
              {r.z.map((v, i) => (
                <span
                  key={i}
                  className="flex h-7 items-center justify-center rounded text-[0.58rem] tabular-nums"
                  style={{ background: cell(v), color: Math.abs(v) > 1 ? "#0b0e13" : "var(--muted)" }}
                >
                  {v > 0 ? "+" : ""}{v.toFixed(1)}
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-2 text-[0.56rem] uppercase tracking-wider text-[var(--muted)]">
        <span style={{ color: "var(--accent-2)" }}>down</span>
        <span className="h-2 w-28 rounded" style={{ background: "linear-gradient(90deg, #4fe6ee, rgba(12,18,26,0.55), #bcff46)" }} />
        <span style={{ color: "var(--accent)" }}>up</span>
      </div>
    </div>
  );
}

/* ── PCA / scatter plot (SVG) ─────────────────────────────────────────────────── */

export function ScatterPlot({
  groups,
  points,
}: {
  groups: { id: string; color: string }[];
  points: { x: number; y: number; g: number }[];
}) {
  const W = 320;
  const H = 220;
  const P = { l: 28, r: 12, t: 14, b: 26 };
  const sx = (x: number) => P.l + (x / 100) * (W - P.l - P.r);
  const sy = (y: number) => H - P.b - (y / 100) * (H - P.t - P.b);
  return (
    <div>
      <p className="mb-2 text-[0.72rem] text-[var(--muted)]">$ ./pca.plot --color-by group --pc 1,2</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md" role="img" aria-label="PCA sample-clustering scatter plot">
        {[25, 50, 75].map((g) => (
          <Fragment key={g}>
            <line x1={sx(g)} y1={P.t} x2={sx(g)} y2={H - P.b} stroke="var(--line)" strokeWidth="0.5" strokeDasharray="2,3" />
            <line x1={P.l} y1={sy(g)} x2={W - P.r} y2={sy(g)} stroke="var(--line)" strokeWidth="0.5" strokeDasharray="2,3" />
          </Fragment>
        ))}
        <line x1={P.l} y1={H - P.b} x2={W - P.r} y2={H - P.b} stroke="var(--line)" />
        <line x1={P.l} y1={P.t} x2={P.l} y2={H - P.b} stroke="var(--line)" />
        {points.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill={groups[p.g].color} opacity={0.9} style={{ filter: `drop-shadow(0 0 4px ${groups[p.g].color})` }} />
        ))}
        <text x={(W + P.l) / 2} y={H - 6} fontSize="7" fill="var(--muted)" textAnchor="middle" fontFamily="monospace" letterSpacing="0.1em">PC1 →</text>
        <text x={9} y={(H - P.b + P.t) / 2} fontSize="7" fill="var(--muted)" textAnchor="middle" fontFamily="monospace" letterSpacing="0.1em" transform={`rotate(-90 9 ${(H - P.b + P.t) / 2})`}>PC2 →</text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {groups.map((g) => (
          <span key={g.id} className="flex items-center gap-1.5 text-[0.6rem] text-[var(--muted)]">
            <span className="size-2 rounded-full" style={{ background: g.color, boxShadow: `0 0 6px ${g.color}` }} />
            {g.id}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AsciiPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="text-[0.74rem]">
      <p className="mb-1.5 text-[var(--accent)]">{title}</p>
      <div className="space-y-1 rounded border border-[var(--line)] bg-[var(--bg)]/40 p-3" data-lenis-prevent>
        {children}
      </div>
    </div>
  );
}

/* ── bordered terminal table ─────────────────────────────────────────────────── */

export function TermTable({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: string;
}) {
  return (
    <div className="text-[0.76rem]">
      {caption && <p className="mb-1.5 text-[var(--muted)]">{caption}</p>}
      <div className="term-scroll overflow-x-auto" data-lenis-prevent>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {head.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap border border-[var(--line)] bg-[var(--bg-2)]/60 px-2.5 py-1 text-left font-semibold uppercase tracking-wider text-[var(--accent)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_7%,transparent)]">
                {r.map((c, j) => (
                  <td key={j} className="border border-[var(--line)] px-2.5 py-1 align-top text-[var(--fg)]">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── aligned key: value ──────────────────────────────────────────────────────── */

export function KeyVals({ rows, pad = 14 }: { rows: [string, ReactNode][]; pad?: number }) {
  return (
    <div className="space-y-0.5 text-[0.78rem]">
      {rows.map(([k, v], i) => (
        <p key={i} className="flex flex-wrap gap-x-3">
          <span className="shrink-0 text-[var(--accent)]" style={{ minWidth: `${pad}ch` }}>
            {k}
          </span>
          <span className="text-[var(--fg)]">{v}</span>
        </p>
      ))}
    </div>
  );
}

/* ── shell / R code block with line numbers ──────────────────────────────────── */

export function CodeBlock({ lang, lines }: { lang: string; lines: ReactNode[] }) {
  return (
    <div className="overflow-hidden rounded border border-[var(--line)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg-2)]/60 px-3 py-1">
        <span className="text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">{lang}</span>
      </div>
      <pre className="term-scroll overflow-x-auto px-0 py-2 text-[0.74rem] leading-relaxed" data-lenis-prevent>
        {lines.map((ln, i) => (
          <div key={i} className="flex gap-3 px-3">
            <span className="w-6 shrink-0 select-none text-right text-[var(--muted)]/60">{i + 1}</span>
            <span className="whitespace-pre-wrap">{ln}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ── markdown-ish heading + prose for rendered .md files ─────────────────────── */

export function MdHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[0.95rem] font-bold text-[var(--fg)]">
      <span className="text-[var(--accent)]"># </span>
      {children}
    </h3>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <p className="text-[0.8rem] leading-relaxed text-[var(--muted)]">{children}</p>;
}

/* ── IDE-style image preview pane ─────────────────────────────────────────────── */

export function ImagePreview({
  src,
  alt,
  caption,
  dims,
  aspect = "3 / 2",
  objectPosition = "center",
  maxW,
}: {
  src: string;
  alt: string;
  caption: string;
  dims: string;
  aspect?: string;
  objectPosition?: string;
  maxW?: string;
}) {
  const [w, h] = aspect.split(/[/ ]+/).map(Number);
  const portrait = h > w;
  // keep previews small enough that the whole image fits the terminal pane
  const cap = maxW ?? (portrait ? "max-w-[240px]" : "max-w-md");
  return (
    <figure className={`${cap} overflow-hidden rounded border border-[var(--line)]`}>
      <figcaption className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg-2)]/60 px-3 py-1 text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
        <span className="text-[var(--accent-2)]">🖼 {src.split("/").pop()}</span>
        <span>{dims} · jpeg</span>
      </figcaption>
      <div className="relative w-full bg-[var(--bg)]" style={{ aspectRatio: `${w} / ${h}` }}>
        <Photo src={src} alt={alt} priority className="object-cover" style={{ objectPosition }} />
      </div>
      <p className="px-3 py-2 text-[0.66rem] leading-snug text-[var(--muted)]">{caption}</p>
    </figure>
  );
}

/* ── directory listing (ls -la) ──────────────────────────────────────────────── */

export function DirListing({
  entries,
}: {
  entries: { perms: string; size: string; name: string; kind: "dir" | "exec" | "file" }[];
}) {
  return (
    <div className="text-[0.76rem]">
      <p className="text-[var(--muted)]">total {entries.length}</p>
      {entries.map((e) => (
        <p key={e.name} className="flex gap-3">
          <span className="text-[var(--muted)]/70">{e.perms}</span>
          <span className="w-12 shrink-0 text-right text-[var(--muted)]">{e.size}</span>
          <span
            style={{
              color:
                e.kind === "dir" ? "var(--accent-2)" : e.kind === "exec" ? "var(--accent)" : "var(--fg)",
            }}
          >
            {e.name}
            {e.kind === "dir" ? "/" : e.kind === "exec" ? "*" : ""}
          </span>
        </p>
      ))}
    </div>
  );
}
