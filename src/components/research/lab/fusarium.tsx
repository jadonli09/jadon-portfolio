"use client";

import { Fragment, type ReactNode } from "react";
import { FUS, FUS_CITATION, FUS_IMAGES, FUS_LOG, FUS_PLASMID, FUS_PROTOCOL, FUS_RESOURCES, FUS_RESULTS, FUS_STRAINS } from "./content";
import { CodeBlock, ImagePreview, KeyVals, MdHeading, Prose, TermTable } from "./term";

/* ═══════════ branch umass-2026 — the Fusarium RFP project, rendered ═══════════ */

export function FusProjectView() {
  return (
    <div className="max-w-2xl space-y-3">
      <MdHeading>{FUS.title}</MdHeading>
      <p className="text-[0.7rem] text-[var(--muted)]">
        {FUS.id} · <span style={{ color: "var(--accent)" }}>Ma Lab · UMass Amherst</span> · Summer 2026
      </p>
      <KeyVals
        rows={[
          ["authors", FUS.authors],
          ["affiliations", FUS.affiliations],
          ["organism", FUS.organism],
          ["disease", FUS.disease],
          ["plasmid", FUS.plasmid],
          ["method", FUS.method],
        ]}
      />
      <div>
        <p className="text-[0.72rem] text-[var(--accent)]">## the question</p>
        <Prose>{FUS.question}</Prose>
      </div>
      <Prose>{FUS.abstract}</Prose>
      <div>
        <p className="text-[0.72rem] text-[var(--muted)]"><span className="text-[var(--accent)]">## </span>files in fusarium/</p>
        <p className="mt-1 font-mono text-[0.72rem] leading-relaxed text-[var(--muted)]">
          {["protocol", "plasmid", "strains", "results", "confocal", "gel", "log", "poster", "photo", "bench"].map((f, i) => (
            <Fragment key={f}>
              {i > 0 && " · "}
              <span className="text-[var(--accent)]">{f}</span>
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}

export function ProtocolView() {
  const lines: ReactNode[] = [
    <span key="0" className="text-[var(--muted)]">#!/usr/bin/env lab-sh</span>,
    <span key="1" className="text-[var(--muted)]"># fusarium/protocol.sh — plasmid → protoplast → PEG transformation → hygromycin selection</span>,
    <span key="2"> </span>,
  ];
  FUS_PROTOCOL.forEach((s) => {
    lines.push(
      <span key={`h${s.n}`}>
        <span style={{ color: "var(--accent)" }}>{s.n.padEnd(4)}</span>
        <span className="text-[var(--fg)]">step --{s.step}</span>
        <span className="text-[var(--muted)]">{"  "}# {s.title}</span>
      </span>,
    );
    s.detail.forEach((d, j) => {
      lines.push(
        <span key={`d${s.n}${j}`}>
          <span className="text-[var(--muted)]">{"    "}$ </span>
          <span className="text-[var(--fg)]/90">{d}</span>
        </span>,
      );
    });
    lines.push(<span key={`b${s.n}`}> </span>);
  });
  lines.push(<span key="end"><span style={{ color: "var(--accent-2)" }}>echo</span><span className="text-[var(--fg)]"> &quot;check for RFP under the confocal&quot;</span></span>);
  return <CodeBlock lang="fusarium/protocol.sh" lines={lines} />;
}

/* ── plasmid ring — pCT74-mRFP drawn as an SVG map ─────────────────────────── */

const KIND_COLOR: Record<string, string> = {
  reporter: "var(--accent)",
  marker: "var(--accent-2)",
  backbone: "var(--muted)",
};

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export function PlasmidRing() {
  const W = 360;
  const cx = W / 2;
  const cy = W / 2;
  const R = 118;
  const TAU = Math.PI * 2;
  const ang = (bp: number) => (bp / FUS_PLASMID.bp) * TAU - Math.PI / 2;
  const cutA = ang(FUS_PLASMID.cut.pos);
  return (
    <div className="space-y-3">
      <p className="text-[0.72rem] text-[var(--muted)]">$ ./plasmid.map --render <span className="text-[var(--muted)]/60"># {FUS_PLASMID.name} · {FUS_PLASMID.bp.toLocaleString()} bp · hover a feature</span></p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <svg viewBox={`0 0 ${W} ${W}`} className="w-full max-w-[300px] shrink-0" role="img" aria-label={`${FUS_PLASMID.name} plasmid map, ${FUS_PLASMID.bp} base pairs`}>
          {/* backbone */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--line)" strokeWidth={10} />
          {/* tick marks every 1000 bp */}
          {[0, 1000, 2000, 3000, 4000, 5000].map((bp) => {
            const a = ang(bp);
            const x0 = cx + (R + 9) * Math.cos(a);
            const y0 = cy + (R + 9) * Math.sin(a);
            const x1 = cx + (R + 15) * Math.cos(a);
            const y1 = cy + (R + 15) * Math.sin(a);
            const tx = cx + (R + 26) * Math.cos(a);
            const ty = cy + (R + 26) * Math.sin(a);
            return (
              <g key={bp}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--muted)" strokeWidth={1} />
                <text x={tx} y={ty} fontSize="7" fill="var(--muted)" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">{bp}</text>
              </g>
            );
          })}
          {/* features */}
          {FUS_PLASMID.features.map((f) => {
            const a0 = ang(f.start);
            const a1 = ang(f.end);
            const mid = (a0 + a1) / 2;
            const lx = cx + (R - 30) * Math.cos(mid);
            const ly = cy + (R - 30) * Math.sin(mid);
            const glow = f.kind === "reporter";
            return (
              <g key={f.name} className="group">
                <path
                  d={arcPath(cx, cy, R, a0, a1)}
                  fill="none"
                  stroke={KIND_COLOR[f.kind]}
                  strokeWidth={glow ? 12 : 10}
                  strokeLinecap="butt"
                  style={glow ? { filter: "drop-shadow(0 0 6px var(--accent))" } : undefined}
                >
                  <title>{f.name}{f.note ? ` — ${f.note}` : ""} · {f.start}–{f.end}</title>
                </path>
                <text x={lx} y={ly} fontSize={glow ? "9" : "7.5"} fontWeight={glow ? 700 : 500} fill={KIND_COLOR[f.kind]} textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">{f.name}</text>
              </g>
            );
          })}
          {/* cut site */}
          <g>
            <line x1={cx + (R - 14) * Math.cos(cutA)} y1={cy + (R - 14) * Math.sin(cutA)} x2={cx + (R + 20) * Math.cos(cutA)} y2={cy + (R + 20) * Math.sin(cutA)} stroke="var(--hot)" strokeWidth={1.5} strokeDasharray="3 2" />
            <text x={cx + (R + 40) * Math.cos(cutA)} y={cy + (R + 40) * Math.sin(cutA)} fontSize="7.5" fill="var(--hot)" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">✂ {FUS_PLASMID.cut.name}</text>
          </g>
          {/* centre */}
          <text x={cx} y={cy - 8} fontSize="13" fontWeight={700} fill="var(--fg)" textAnchor="middle" fontFamily="monospace">{FUS_PLASMID.name}</text>
          <text x={cx} y={cy + 8} fontSize="8" fill="var(--muted)" textAnchor="middle" fontFamily="monospace">{FUS_PLASMID.bp.toLocaleString()} bp · circular</text>
          <text x={cx} y={cy + 22} fontSize="7" fill="var(--muted)" textAnchor="middle" fontFamily="monospace">linearized at {FUS_PLASMID.cut.name} before transformation</text>
        </svg>
        <div className="min-w-0 space-y-1 text-[0.72rem]">
          {FUS_PLASMID.features.filter((f) => f.note).map((f) => (
            <p key={f.name} className="flex gap-2">
              <span className="size-2 shrink-0 translate-y-1 rounded-full" style={{ background: KIND_COLOR[f.kind], boxShadow: f.kind === "reporter" ? "0 0 6px var(--accent)" : undefined }} />
              <span><span className="font-semibold text-[var(--fg)]">{f.name}</span> <span className="text-[var(--muted)]">— {f.note}</span></span>
            </p>
          ))}
          <p className="flex gap-2">
            <span className="size-2 shrink-0 translate-y-1 rounded-full" style={{ background: "var(--hot)" }} />
            <span><span className="font-semibold text-[var(--fg)]">{FUS_PLASMID.cut.name}</span> <span className="text-[var(--muted)]">— {FUS_PLASMID.cut.note}</span></span>
          </p>
        </div>
      </div>
      <ImagePreview {...FUS_IMAGES.plasmid} aspect="11 / 10" maxW="max-w-xs" />
    </div>
  );
}

export function StrainsView() {
  return (
    <div className="space-y-3">
      <TermTable
        caption="# strains.tsv — the three Fusarium oxysporum strains used"
        head={["strain", "source", "role"]}
        rows={FUS_STRAINS.map((s) => [
          <span key="i" className="font-semibold" style={{ color: s.id === "MRL8996" ? "var(--accent)" : "var(--fg)" }}>{s.id}</span>,
          <span key="s" className="text-[var(--fg)]">{s.source}</span>,
          <span key="n" className="text-[var(--muted)]">{s.note}</span>,
        ])}
      />
      <ImagePreview {...FUS_IMAGES.strains} aspect="2 / 1" />
    </div>
  );
}

export function GitLogView() {
  return (
    <div className="space-y-1 text-[0.76rem]">
      <p className="mb-2 text-[var(--muted)]">$ git log --oneline --reverse umass-2026 <span className="text-[var(--muted)]/60"># six weeks, as commits</span></p>
      {FUS_LOG.map((c) => (
        <p key={c.hash} className="flex flex-wrap items-baseline gap-x-2.5">
          <span className="shrink-0" style={{ color: "var(--accent-2)" }}>{c.hash}</span>
          <span className="shrink-0 text-[var(--muted)]/70">{c.date}</span>
          <span className={c.msg.startsWith("result") ? "font-semibold text-[var(--accent)]" : "text-[var(--fg)]"}>{c.msg}</span>
          {c.tag && (
            <span className="rounded px-1.5 text-[0.55rem] uppercase tracking-widest" style={{ color: "var(--hot)", border: "1px solid var(--line)" }}>
              {c.tag === "umass-2026" ? "⎇ " : "🏷 "}{c.tag}
            </span>
          )}
        </p>
      ))}
    </div>
  );
}

export function FusResultsView() {
  return (
    <div className="max-w-2xl space-y-3">
      {FUS_RESULTS.map((r) => (
        <div key={r.heading}>
          <p className="text-[0.82rem] font-bold text-[var(--fg)]"><span className="text-[var(--accent)]">## </span>{r.heading}</p>
          <Prose>{r.body}</Prose>
        </div>
      ))}
      <div className="grid gap-3 sm:grid-cols-2">
        <ImagePreview {...FUS_IMAGES.confocal} aspect="9 / 7" maxW="max-w-full" />
        <ImagePreview {...FUS_IMAGES.gel} aspect="9 / 7" maxW="max-w-full" />
      </div>
      <p className="pt-1 text-[0.72rem] text-[var(--muted)]"># the figures: `confocal` · `gel` · `pcr` · `plasmid` · `protoplast` · `poster`</p>
    </div>
  );
}

/** The microscope: confocal panels in a darkfield frame — what the whole summer was for. */
export function MicroscopeView() {
  return (
    <div className="space-y-3">
      <p className="text-[0.72rem] text-[var(--muted)]">$ microscope --confocal --channel RFP <span className="text-[var(--muted)]/60"># laser on. rfp colourway engaged</span></p>
      <div className="max-w-xl overflow-hidden rounded-lg border border-[var(--line)] bg-black p-2" style={{ boxShadow: "0 0 40px -10px var(--accent), inset 0 0 60px rgba(0,0,0,0.9)" }}>
        <ImagePreview {...FUS_IMAGES.confocal} aspect="9 / 7" maxW="max-w-full" />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.62rem] text-[var(--muted)]">
        <span><span className="inline-block size-2 rounded-full align-middle" style={{ background: "#ff3d5e", boxShadow: "0 0 6px #ff3d5e" }} /> RFP — the fungus</span>
        <span><span className="inline-block size-2 rounded-full align-middle" style={{ background: "#7dff8a", boxShadow: "0 0 6px #7dff8a" }} /> GFP — the macrophages, next</span>
        <span>rows: negative control · Fo47-RFP positive control · transformed MRL8996</span>
      </div>
      <p className="text-[0.7rem] text-[var(--muted)]"># `git checkout main` switches the laser off · `results` for what it means</p>
    </div>
  );
}

export function FusPosterView() {
  return (
    <div className="space-y-2">
      <ImagePreview {...FUS_IMAGES.poster} aspect="4 / 3" maxW="max-w-xl" />
      <p className="text-[0.7rem] text-[var(--muted)]"># the UMass poster — open figures: `confocal` · `gel` · `plasmid` · `protoplast` · `transformation` · `future`</p>
    </div>
  );
}

export function FusFigureView({ id }: { id: keyof typeof FUS_IMAGES }) {
  const ASPECT: Partial<Record<keyof typeof FUS_IMAGES, string>> = {
    confocal: "9 / 7", gel: "9 / 7", pcrGel: "2.2 / 1", plasmid: "11 / 10", strains: "2 / 1", protoplast: "2.8 / 1", transformation: "3.5 / 1", macrophage: "3.2 / 1", poster: "4 / 3",
    photo: "4 / 3", bench: "3 / 4", session: "3 / 2",
  };
  const wide = id === "protoplast" || id === "transformation" || id === "macrophage";
  return <ImagePreview {...FUS_IMAGES[id]} aspect={ASPECT[id] ?? "3 / 2"} maxW={wide ? "max-w-2xl" : "max-w-md"} />;
}

export function FusResourcesView() {
  const KIND: Record<string, string> = { tool: "var(--accent)", data: "var(--accent-2)", text: "var(--accent-2)", mentor: "var(--hot)", lab: "var(--accent)" };
  return (
    <div className="space-y-1.5 text-[0.78rem]">
      <p className="mb-1 text-[var(--muted)]"># the lab, the kit, the mentors — branch umass-2026</p>
      {FUS_RESOURCES.map((r) => (
        <p key={r.label} className="flex flex-wrap items-baseline gap-x-2.5">
          <span className="shrink-0 rounded px-1.5 text-[0.5rem] uppercase tracking-widest" style={{ color: KIND[r.kind] ?? "var(--muted)", border: "1px solid var(--line)" }}>{r.kind}</span>
          <span className="shrink-0 font-semibold text-[var(--fg)]">{r.label}</span>
          <span className="text-[var(--muted)]">— {r.detail}</span>
        </p>
      ))}
    </div>
  );
}

export function FusCitationView() {
  return <CodeBlock lang="fusarium/citation.bib" lines={FUS_CITATION.split("\n").map((l, i) => <span key={i}>{l}</span>)} />;
}

export function BranchListView({ branch }: { branch: string }) {
  const rows: [string, string, string][] = [
    ["main", "gout-model", "RNA-seq · pain mediators · ACSEF 2025"],
    ["umass-2026", "fusarium-rfp", "wet lab · RFP transformation · Ma Lab, Summer 2026"],
  ];
  return (
    <div className="space-y-1 text-[0.78rem]">
      <p className="mb-1 text-[var(--muted)]">$ git branch -v</p>
      {rows.map(([b, slug, d]) => (
        <p key={b} className="flex flex-wrap gap-x-3">
          <span className="w-4 shrink-0" style={{ color: "var(--accent)" }}>{b === branch ? "*" : " "}</span>
          <span className="w-24 shrink-0 font-semibold" style={{ color: b === branch ? "var(--accent)" : "var(--fg)" }}>{b}</span>
          <span className="w-28 shrink-0 text-[var(--accent-2)]">{slug}</span>
          <span className="text-[var(--muted)]">{d}</span>
        </p>
      ))}
      <p className="pt-1 text-[0.7rem] text-[var(--muted)]"># switch: `git checkout umass-2026` · `git checkout main` — or click ⎇ in the status bar</p>
    </div>
  );
}
