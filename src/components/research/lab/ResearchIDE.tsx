"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Folder, FileText, Terminal as TermIcon } from "lucide-react";
import { VolcanoPlot } from "@/components/research/VolcanoPlot";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";
import { fireToast, toggleMutate } from "./bus";
import { AWARDS, AWARD_VIZ, CITATION, DEG_COUNTS, HEATMAP, IMAGES, PAIN_MEDIATORS, PATHWAYS, PCA, PIPELINE, PROFILE, PROGRAMS, PROJECT, RESOURCES, RESULTS, STATS, STAT_BARS, USABO_MEDAL, USABO_MEDAL_INFO, type Award, type Program } from "./content";
import { AsciiArt, AsciiMeter, AsciiPanel, CodeBlock, DirListing, Heatmap, ImagePreview, JsonView, KeyVals, MdHeading, Prose, ScatterPlot, TermTable } from "./term";

// ── model ─────────────────────────────────────────────────────────────────────

type Tone = "fg" | "muted" | "accent" | "cyan" | "err";

type Entry =
  | { id: number; kind: "cmd"; text: string; path: string }
  | { id: number; kind: "out"; lines: { text: string; tone?: Tone }[] }
  | { id: number; kind: "view"; token: string };

type Dir = "root" | "project" | "awards" | "field";

const TONE_CLASS: Record<Tone, string> = {
  fg: "text-[var(--fg)]",
  muted: "text-[var(--muted)]",
  accent: "text-[var(--accent)]",
  cyan: "text-[var(--accent-2)]",
  err: "text-[var(--hot)]",
};

// bare word / filename → render token
const TOKEN_FOR: Record<string, string> = {
  readme: "readme", "readme.md": "readme", intro: "readme",
  whoami: "whoami", about: "whoami", bio: "whoami",
  neofetch: "neofetch", fetch: "neofetch",
  stats: "stats", "stats.json": "stats", numbers: "stats",
  project: "project", "gout-rnaseq": "project", "gout-rnaseq.md": "project", rnaseq: "project", "rna-seq": "project", gout: "project",
  methodology: "methodology", method: "methodology", "methodology.sh": "methodology", pipeline: "methodology",
  genes: "genes", mediators: "genes", "pain-mediators": "genes", "deg-results.tsv": "genes",
  degs: "degcounts", deg: "degcounts", counts: "degcounts", "deg-counts": "degcounts", "deg-counts.tsv": "degcounts",
  abstract: "abstract", "abstract.txt": "abstract",
  volcano: "volcano", plot: "volcano", "volcano.plot": "volcano", volcanos: "volcano",
  poster: "poster", board: "poster", "science-fair-poster.png": "poster",
  photo: "photo", selfie: "photo", me: "photo", "science-fair": "photo", fair: "photo", "me.jpg": "photo",
  design: "design", "sample-design": "design", "sample-design.png": "design", samples: "design",
  question: "project", hypothesis: "project", purpose: "project",
  results: "results", "results.md": "results", findings: "results", conclusion: "results",
  pathways: "pathways", "pathways.tsv": "pathways", gsea: "pathways", enrichment: "pathways", go: "pathways",
  heatmap: "heatmap", "heatmap.png": "heatmap", expr: "heatmap", expression: "heatmap",
  pca: "pca", "pca.plot": "pca", clustering: "pca",
  citation: "citation", "citation.bib": "citation", cite: "citation", bib: "citation", bibtex: "citation",
  resources: "resources", "resources.md": "resources", links: "resources", refs: "resources", tools: "resources",
  awards: "awards", competitions: "awards", olympiads: "awards",
  usabo: "award:usabo", "usabo.json": "award:usabo",
  bbo: "award:bbo", "uk-bbo": "award:bbo", ukbbo: "award:bbo", "uk-bbo.json": "award:bbo",
  acsef: "award:acsef", "acsef.json": "award:acsef",
  field: "programs", programs: "programs", outreach: "programs", teaching: "programs",
  ysjc: "program:ysjc", "ysjc.md": "program:ysjc",
  prism: "program:prism", "prism.md": "program:prism",
  stempac: "program:stempac", "stem-pac": "program:stempac", "stem-pac.md": "program:stempac",
  umass: "program:umass", "umass.md": "program:umass",
};

const FILE_TOKENS = new Set(["readme", "stats", "project", "methodology", "genes", "degcounts", "abstract", "volcano", "results", "pathways", "heatmap", "pca", "citation", "resources", "poster", "photo", "design"]);
const isFileToken = (t: string) => FILE_TOKENS.has(t) || t.startsWith("award:") || t.startsWith("program:");

function frameLabel(token: string): string {
  const [base, arg] = token.split(":");
  if (base === "award") return `awards/${AWARDS.find((a) => a.id === arg)?.file ?? "?.json"}`;
  if (base === "program") return `field/${PROGRAMS.find((p) => p.id === arg)?.file ?? "?.md"}`;
  if (base === "ls") return `ls ${arg === "root" ? "~/research" : `${arg}/`}`;
  return {
    help: "help", tree: "tree ~/research", neofetch: "neofetch", whoami: "whoami",
    readme: "README.md", stats: "stats.json", awards: "ls awards/", programs: "ls field/",
    project: "project/gout-rnaseq.md", methodology: "project/methodology.sh",
    genes: "project/pain-mediators.tsv", degcounts: "project/deg-counts.tsv", abstract: "project/abstract.txt",
    volcano: "project/volcano.plot", results: "project/results.md", pathways: "project/pathways.tsv",
    heatmap: "project/heatmap.png", pca: "project/pca.plot", citation: "project/citation.bib",
    design: "project/sample-design.png", poster: "science-fair-poster.png", photo: "me-at-poster.jpg",
    resources: "resources.md",
  }[base] ?? token;
}

function frameTag(label: string): string {
  if (label.endsWith(".json")) return "json";
  if (label.endsWith(".md")) return "markdown";
  if (label.endsWith(".tsv")) return "tsv";
  if (label.endsWith(".sh")) return "shell";
  if (label.endsWith(".plot")) return "figure";
  if (label.endsWith(".txt")) return "text";
  if (label.startsWith("ls") || label.startsWith("tree")) return "dir";
  return "stdout";
}

const SUGGEST: Record<string, string[]> = {
  default: ["help", "poster", "photo", "results", "volcano", "awards"],
  help: ["ls", "volcano", "project", "awards"],
  tree: ["volcano", "project", "awards", "field"],
  ls: ["usabo", "project", "awards", "field"],
  awards: ["usabo", "bbo", "acsef", "project"],
  award: ["awards", "genes", "project", "volcano"],
  programs: ["ysjc", "prism", "stem-pac", "umass"],
  program: ["field", "project", "awards", "stats"],
  project: ["results", "heatmap", "pathways", "pca", "genes", "volcano"],
  methodology: ["genes", "results", "volcano", "pathways"],
  genes: ["heatmap", "volcano", "pathways", "results"],
  abstract: ["results", "genes", "volcano", "project"],
  volcano: ["heatmap", "genes", "pathways", "pca"],
  results: ["heatmap", "pathways", "pca", "volcano"],
  pathways: ["heatmap", "genes", "pca", "volcano"],
  heatmap: ["pca", "pathways", "genes", "volcano"],
  pca: ["heatmap", "volcano", "pathways", "results"],
  citation: ["resources", "results", "project", "awards"],
  resources: ["citation", "project", "genes", "awards"],
  poster: ["photo", "volcano", "heatmap", "design"],
  photo: ["poster", "results", "project", "awards"],
  design: ["volcano", "degs", "genes", "project"],
  degcounts: ["volcano", "genes", "heatmap", "pathways"],
  stats: ["awards", "project", "field", "neofetch"],
  readme: ["volcano", "project", "awards", "field"],
  whoami: ["neofetch", "project", "awards", "field"],
  neofetch: ["whoami", "project", "awards", "stats"],
};

const HINT: Record<string, { text: string; tone?: Tone }> = {
  volcano: { text: "→ real per-tissue plots up top · `genes` for the pain mediators · `degs` for the counts" },
  awards: { text: "→ open one: `usabo` · `bbo` · `acsef`  (or `cat awards/usabo.json`)" },
  programs: { text: "→ open one: `ysjc` · `prism` · `stem-pac` · `umass`" },
  project: { text: "→ dig in: `results` · `volcano` · `heatmap` · `pathways` · `design` · `poster`" },
  poster: { text: "→ open specific figures: `volcano` · `heatmap` · `design` · `pathways`" },
  photo: { text: "→ `poster` for the full board · `results` for the findings" },
  design: { text: "→ `volcano` for per-tissue DEG counts · `genes` for the pain mediators" },
  degcounts: { text: "→ `volcano` shows these graphically · `genes` lists the pain mediators" },
  methodology: { text: "→ `genes` for the differential-expression hits, then `pathways`" },
  genes: { text: "→ `heatmap` to see these across tissues · `pathways` for enrichment" },
  results: { text: "→ the graphs behind it: `heatmap` · `pca` · `pathways` · `volcano`" },
  pathways: { text: "→ `heatmap` for the gene-level view · `genes` for the hit list" },
  heatmap: { text: "→ note gout·spine mirrors gout·joint — the spinal-cord signal. `pca` next" },
  pca: { text: "→ gout samples cluster apart from controls. `heatmap` for gene detail" },
};

// explorer tree
const EXPLORER: { label: string; cmd: string; depth: number; folder?: boolean }[] = [
  { label: "README.md", cmd: "readme", depth: 0 },
  { label: "whoami", cmd: "whoami", depth: 0 },
  { label: "neofetch", cmd: "neofetch", depth: 0 },
  { label: "stats.json", cmd: "stats", depth: 0 },
  { label: "resources.md", cmd: "resources", depth: 0 },
  { label: "science-fair-poster.png", cmd: "poster", depth: 0 },
  { label: "me-at-poster.jpg", cmd: "photo", depth: 0 },
  { label: "project", cmd: "project", depth: 0, folder: true },
  { label: "gout-rnaseq.md", cmd: "project", depth: 1 },
  { label: "results.md", cmd: "results", depth: 1 },
  { label: "methodology.sh", cmd: "methodology", depth: 1 },
  { label: "sample-design.png", cmd: "design", depth: 1 },
  { label: "deg-counts.tsv", cmd: "degs", depth: 1 },
  { label: "pain-mediators.tsv", cmd: "genes", depth: 1 },
  { label: "pathways.tsv", cmd: "pathways", depth: 1 },
  { label: "heatmap.png", cmd: "heatmap", depth: 1 },
  { label: "volcano.plot", cmd: "volcano", depth: 1 },
  { label: "pca.plot", cmd: "pca", depth: 1 },
  { label: "citation.bib", cmd: "citation", depth: 1 },
  { label: "awards", cmd: "awards", depth: 0, folder: true },
  { label: "usabo.json", cmd: "usabo", depth: 1 },
  { label: "uk-bbo.json", cmd: "bbo", depth: 1 },
  { label: "acsef.json", cmd: "acsef", depth: 1 },
  { label: "field", cmd: "field", depth: 0, folder: true },
  { label: "ysjc.md", cmd: "ysjc", depth: 1 },
  { label: "prism.md", cmd: "prism", depth: 1 },
  { label: "stem-pac.md", cmd: "stempac", depth: 1 },
  { label: "umass.md", cmd: "umass", depth: 1 },
];

const FS: Record<Dir, { perms: string; size: string; name: string; kind: "dir" | "exec" | "file" }[]> = {
  root: [
    { perms: "drwxr-xr-x", size: "4.0K", name: "project", kind: "dir" },
    { perms: "drwxr-xr-x", size: "4.0K", name: "awards", kind: "dir" },
    { perms: "drwxr-xr-x", size: "4.0K", name: "field", kind: "dir" },
    { perms: "-rw-r--r--", size: "2.1K", name: "README.md", kind: "file" },
    { perms: "-rw-r--r--", size: "0.6K", name: "stats.json", kind: "file" },
    { perms: "-rw-r--r--", size: "1.3K", name: "resources.md", kind: "file" },
    { perms: "-rw-r--r--", size: "2.4M", name: "science-fair-poster.png", kind: "file" },
    { perms: "-rw-r--r--", size: "1.1M", name: "me-at-poster.jpg", kind: "file" },
    { perms: "-rwxr-xr-x", size: "1.2K", name: "whoami", kind: "exec" },
    { perms: "-rwxr-xr-x", size: "1.8K", name: "neofetch", kind: "exec" },
  ],
  project: [
    { perms: "-rw-r--r--", size: "3.4K", name: "gout-rnaseq.md", kind: "file" },
    { perms: "-rw-r--r--", size: "1.6K", name: "results.md", kind: "file" },
    { perms: "-rwxr-xr-x", size: "1.1K", name: "methodology.sh", kind: "exec" },
    { perms: "-rw-r--r--", size: "240K", name: "sample-design.png", kind: "file" },
    { perms: "-rw-r--r--", size: "0.4K", name: "deg-counts.tsv", kind: "file" },
    { perms: "-rw-r--r--", size: "0.7K", name: "pain-mediators.tsv", kind: "file" },
    { perms: "-rw-r--r--", size: "1.1K", name: "pathways.tsv", kind: "file" },
    { perms: "-rw-r--r--", size: "0.7K", name: "abstract.txt", kind: "file" },
    { perms: "-rwxr-xr-x", size: "82K", name: "heatmap.png", kind: "exec" },
    { perms: "-rwxr-xr-x", size: "81K", name: "volcano.plot", kind: "exec" },
    { perms: "-rwxr-xr-x", size: "12K", name: "pca.plot", kind: "exec" },
    { perms: "-rw-r--r--", size: "0.5K", name: "citation.bib", kind: "file" },
  ],
  awards: AWARDS.map((a) => ({ perms: "-rw-r--r--", size: "0.8K", name: a.file, kind: "file" as const })),
  field: PROGRAMS.map((p) => ({ perms: "-rw-r--r--", size: "1.0K", name: p.file, kind: "file" as const })),
};

function resolveDir(a: string): Dir | null {
  const x = a.replace(/\/$/, "");
  if (x === "" || x === "~" || x === ".." || x === "/" || x === ".") return x === ".." ? "root" : "root";
  if (x === "awards" || x === "competitions") return "awards";
  if (x === "field" || x === "programs") return "field";
  if (x === "project") return "project";
  return null;
}

// ── component ─────────────────────────────────────────────────────────────────

export function ResearchIDE() {
  const [log, setLog] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [tabs, setTabs] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [suggest, setSuggest] = useState<string[]>(SUGGEST.default);
  const [cwd, setCwd] = useState<Dir>("root");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = () => ++idRef.current;

  const promptPath = (d: Dir) => (d === "root" ? "~/research" : `~/research/${d}`);

  useEffect(() => {
    const boot: { text: string; tone?: Tone; at: number }[] = [
      { text: "deg-console v3.1 · research IDE", tone: "accent", at: 100 },
      { text: "booting kernel ............ ok", tone: "muted", at: 230 },
      { text: "mounting /research ........ ok", tone: "muted", at: 360 },
      { text: "indexed: 1 poster · GSE190138 · 3 tissues · 9 pain mediators · 3 awards · 4 programs", tone: "muted", at: 520 },
      { text: " ", at: 580 },
      { text: "This page is a terminal. Nothing is shown until you ask for it.", tone: "fg", at: 700 },
      { text: "Try a command — file outputs render like a real IDE.", tone: "fg", at: 700 },
      { text: " ", at: 740 },
      { text: "→ start with  poster  ·  photo  ·  results  ·  volcano  ·  or  help  to see it all", tone: "accent", at: 880 },
    ];
    const timers = boot.map((b) =>
      window.setTimeout(() => setLog((l) => [...l, { id: nextId(), kind: "out", lines: [{ text: b.text, tone: b.tone }] }]), b.at),
    );
    const focus = window.setTimeout(() => inputRef.current?.focus(), 920);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(focus);
    };
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const out = (lines: { text: string; tone?: Tone }[]) => setLog((l) => [...l, { id: nextId(), kind: "out", lines }]);
  const show = (token: string) => {
    setLog((l) => [...l, { id: nextId(), kind: "view", token }]);
    if (isFileToken(token)) {
      setActive(token);
      setTabs((t) => (t.includes(token) ? t : [...t, token].slice(-8)));
    }
    const base = token.split(":")[0];
    if (HINT[base]) out([{ text: HINT[base].text, tone: HINT[base].tone ?? "muted" }]);
    setSuggest(SUGGEST[base] ?? SUGGEST.default);
  };

  const exec = (raw: string) => {
    const line = raw.trim();
    if (!line) return;
    const path = promptPath(cwd);
    setLog((l) => [...l, { id: nextId(), kind: "cmd", text: line, path }]);
    setHistory((h) => [...h, line].slice(-60));
    setHistIdx(null);

    const t = line.toLowerCase();
    const parts = t.split(/\s+/);
    const head = parts[0];
    const arg = parts.slice(1).join(" ").trim();
    const basename = (s: string) => s.replace(/.*\//, "").replace(/\/$/, "");

    switch (head) {
      case "help": case "?": case "man": case "commands": case "--help":
        show("help"); return;
      case "clear": case "cls":
        setLog([]); setActive(null); return;
      case "ls": case "dir": case "ll": {
        const d = arg ? resolveDir(arg) : cwd;
        if (d === null) { out([{ text: `ls: cannot access '${arg}': No such directory`, tone: "err" }]); return; }
        show(`ls:${d}`); setSuggest(SUGGEST.ls); return;
      }
      case "tree": show("tree"); setSuggest(SUGGEST.tree); return;
      case "pwd": out([{ text: promptPath(cwd), tone: "fg" }]); return;
      case "cd": {
        const d = resolveDir(arg || "~");
        if (d === null) { out([{ text: `cd: no such directory: ${arg}`, tone: "err" }]); return; }
        setCwd(d);
        out([{ text: promptPath(d), tone: "muted" }]);
        return;
      }
      case "cat": case "open": case "less": case "more": case "view": case "vim": case "nano": case "run": case "./": {
        const tok = TOKEN_FOR[basename(arg)];
        if (tok) { show(tok); return; }
        out([{ text: `${head}: ${arg || "?"}: No such file`, tone: "err" }]); return;
      }
      case "history":
        out(history.length ? history.map((h, i) => ({ text: `${String(i + 1).padStart(3, " ")}  ${h}`, tone: "muted" as Tone })) : [{ text: "(no history yet)", tone: "muted" }]);
        return;
      case "echo": out([{ text: arg, tone: "fg" }]); return;
      case "date": out([{ text: new Date().toString(), tone: "muted" }]); return;
      case "neofetch": case "fetch": show("neofetch"); setSuggest(SUGGEST.neofetch); return;
      case "whoami": case "about": case "me": show("whoami"); return;
      case "readme": case "intro": case "start": show("readme"); return;
      case "mutate": case "mutation": toggleMutate(); return;
      case "konami": case "cheat": fireToast("try it on your keyboard ;)", "lime"); return;
      case "sudo": out([{ text: "nice try — you already have root here. (try `mutate`)", tone: "accent" }]); return;
      case "exit": case "quit": case "logout":
        out([{ text: "logging out → returning to the portfolio…", tone: "cyan" }]);
        window.setTimeout(() => { window.location.href = asset("/"); }, 350);
        return;
      default: {
        const tok = TOKEN_FOR[basename(head)] ?? TOKEN_FOR[head];
        if (tok) { show(tok); return; }
        out([
          { text: `command not found: ${head}`, tone: "err" },
          { text: "type  help  for the command list, or  ls  to browse.", tone: "muted" },
        ]);
      }
    }
  };

  const run = (cmd: string) => {
    exec(cmd);
    inputRef.current?.focus();
  };

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      exec(value);
      setValue("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const tok = value.trim().toLowerCase();
      if (tok) {
        const pool = ["help", "ls", "tree", "clear", "neofetch", "whoami", "readme", "resources", "stats", "poster", "photo", "project", "results", "methodology", "design", "degs", "genes", "pathways", "heatmap", "volcano", "pca", "citation", "abstract", "awards", "usabo", "bbo", "acsef", "field", "ysjc", "prism", "stem-pac", "umass", "mutate", "exit"];
        const hit = pool.find((c) => c.startsWith(tok));
        if (hit) setValue(hit);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setValue(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const idx = histIdx + 1;
      if (idx >= history.length) { setHistIdx(null); setValue(""); }
      else { setHistIdx(idx); setValue(history[idx]); }
    }
  }

  return (
    <div className="flex h-full flex-col font-mono text-[var(--fg)]">
      {/* title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--bg-2)]/70 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-3 rounded-full bg-[var(--hot)]" />
            <span className="size-3 rounded-full bg-[#ffd23c]" />
            <span className="size-3 rounded-full bg-[var(--accent)]" />
          </span>
          <button onClick={() => setSidebarOpen((s) => !s)} data-cursor-hover className="flex items-center gap-2 text-[0.62rem] uppercase tracking-widest text-[var(--muted)] md:pointer-events-none">
            <TermIcon className="size-3.5 text-[var(--accent)]" />
            jadon.li — research IDE
          </button>
        </div>
        <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
          <span className="dot-live" />
          <span className="hidden sm:inline">online</span>
          <span className="hidden md:inline">· ⌘K</span>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1">
        {/* explorer */}
        <aside
          className={cn(
            "flex w-60 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--bg-2)]/40 backdrop-blur",
            "max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-30 max-md:w-56 max-md:transition-transform",
            sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          )}
        >
          <p className="border-b border-[var(--line)] px-3 py-2 text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">Explorer</p>
          <div className="flex items-center gap-1.5 px-3 py-2 text-[0.62rem] text-[var(--muted)]">
            <ChevronRight className="size-3" /> ~/research
          </div>
          <div className="term-scroll flex-1 overflow-y-auto pb-3" data-lenis-prevent>
            {EXPLORER.map((it, i) => (
              <button
                key={i}
                data-cursor-hover
                onClick={() => { run(it.cmd); setSidebarOpen(false); }}
                className="group flex w-full items-center gap-1.5 py-1 pr-2 text-left text-[0.7rem] text-[var(--muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--fg)]"
                style={{ paddingLeft: `${0.75 + it.depth * 0.9}rem` }}
              >
                {it.folder ? <Folder className="size-3.5 shrink-0 text-[var(--accent-2)]" /> : <FileText className="size-3.5 shrink-0 text-[var(--muted)] group-hover:text-[var(--accent)]" />}
                {it.label}
              </button>
            ))}
          </div>
          <a href={asset("/")} data-cursor-hover className="border-t border-[var(--line)] px-3 py-2 text-[0.6rem] uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
            ← exit to portfolio
          </a>
        </aside>

        {/* terminal column */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* tab bar */}
          <div className="term-scroll flex items-stretch gap-px overflow-x-auto border-b border-[var(--line)] bg-[var(--bg)]/40" data-lenis-prevent>
            <button onClick={() => setSidebarOpen((s) => !s)} data-cursor-hover className="flex items-center px-3 text-[var(--muted)] md:hidden" aria-label="toggle explorer">☰</button>
            {tabs.length === 0 ? (
              <span className="px-3 py-2 text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">terminal — deg-sh</span>
            ) : (
              tabs.map((tk) => (
                <button
                  key={tk}
                  data-cursor-hover
                  onClick={() => run(tk.includes(":") ? tk.split(":")[1] : tk)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap border-r border-[var(--line)] px-3 py-2 text-[0.66rem] transition-colors",
                    active === tk ? "bg-[var(--bg-2)]/70 text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]",
                  )}
                >
                  <FileText className="size-3" style={{ color: active === tk ? "var(--accent)" : undefined }} />
                  {frameLabel(tk).split("/").pop()}
                </button>
              ))
            )}
          </div>

          {/* output stream */}
          <div
            ref={logRef}
            data-lenis-prevent
            onClick={(e) => { if (e.target === e.currentTarget) inputRef.current?.focus(); }}
            className="ide-stream term-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 text-[0.8rem] leading-relaxed md:px-6"
          >
            {/* masthead — the page's clear title, first thing in the stream */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 border-b border-[var(--line)] pb-4"
            >
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-[var(--muted)]">03 — The Scientist</p>
              <p className="font-display mt-1.5 text-4xl leading-none text-[var(--fg)] md:text-6xl">
                RESEARCH<span className="text-[var(--accent)]">.</span>
              </p>
              <p className="mt-2.5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                Gout pain in the genome — RNA-seq · DEG console
              </p>
            </motion.div>
            {log.map((e) => (
              <div key={e.id} className="mb-1">
                {e.kind === "cmd" && (
                  <p className="flex flex-wrap gap-x-2">
                    <span className="shrink-0">
                      <span className="text-[var(--accent)]">visitor@deg-console</span>
                      <span className="text-[var(--muted)]">:{e.path}$</span>
                    </span>
                    <span className="text-[var(--fg)]">{e.text}</span>
                  </p>
                )}
                {e.kind === "out" && e.lines.map((ln, i) => (
                  <p key={i} className={cn("whitespace-pre-wrap", TONE_CLASS[ln.tone ?? "muted"])}>{ln.text}</p>
                ))}
                {e.kind === "view" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="my-2 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-2)]/35"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg-2)]/50 px-3 py-1.5">
                      <span className="flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                        <FileText className="size-3 text-[var(--accent)]" />
                        {frameLabel(e.token)}
                      </span>
                      <span className="text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">{frameTag(frameLabel(e.token))}</span>
                    </div>
                    <div className="p-4 md:p-5">
                      <ViewBody token={e.token} />
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* suggestions */}
          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--line)] px-4 py-2 md:px-6">
            <span className="text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">try</span>
            {suggest.map((s) => (
              <button key={s} data-cursor-hover onClick={() => run(s)} className="rounded-md border border-[var(--line)] px-2 py-0.5 text-[0.66rem] text-[var(--muted)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:text-[var(--accent)]">
                {s}
              </button>
            ))}
          </div>

          {/* prompt */}
          <label className="flex cursor-text items-center gap-2 border-t border-[var(--line)] bg-[var(--bg-2)]/40 px-4 py-3 md:px-6" onClick={() => inputRef.current?.focus()} data-cursor-hover>
            <span className="shrink-0 text-[0.8rem]">
              <span className="text-[var(--accent)]">visitor@deg-console</span>
              <span className="text-[var(--muted)]">:{promptPath(cwd)}$</span>
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="terminal command input"
              placeholder="type a command…  (help · ls · usabo · genes · volcano · neofetch)"
              className="w-full bg-transparent text-[0.8rem] text-[var(--fg)] outline-none placeholder:text-[var(--muted)]/60"
              style={{ caretColor: "var(--accent)" }}
            />
          </label>
        </main>
      </div>

      {/* status bar */}
      <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--bg-2)]/70 px-3 py-1 text-[0.58rem] uppercase tracking-widest text-[var(--muted)] backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-[var(--accent)]">⎇ research/gout-model</span>
          <span className="hidden sm:inline">deg-sh</span>
          <span className="hidden md:inline">UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Tab ↹ complete · ↑↓ history · cd/ls/cat</span>
          <span>type <span className="text-[var(--accent)]">help</span></span>
        </div>
      </div>
    </div>
  );
}

// ── content views ─────────────────────────────────────────────────────────────

function ViewBody({ token }: { token: string }) {
  const [base, arg] = token.split(":");
  switch (base) {
    case "help": return <HelpView />;
    case "tree": return <TreeView />;
    case "ls": return <DirListing entries={FS[(arg as Dir) ?? "root"]} />;
    case "neofetch": return <Neofetch />;
    case "whoami": return <WhoamiView />;
    case "readme": return <ReadmeView />;
    case "awards": return <AwardsIndex />;
    case "award": return <AwardView id={arg} />;
    case "programs": return <ProgramsIndex />;
    case "program": return <ProgramView id={arg} />;
    case "project": return <ProjectView />;
    case "methodology": return <MethodologyView />;
    case "genes": return <GenesView />;
    case "degcounts": return <DegCountsView />;
    case "abstract": return <AbstractView />;
    case "results": return <ResultsView />;
    case "pathways": return <PathwaysView />;
    case "heatmap": return <Heatmap samples={HEATMAP.samples} rows={HEATMAP.rows} />;
    case "pca": return <ScatterPlot groups={PCA.groups} points={PCA.points} />;
    case "citation": return <CodeBlock lang="project/citation.bib" lines={CITATION.split("\n").map((l, i) => <span key={i}>{l}</span>)} />;
    case "resources": return <ResourcesView />;
    case "poster": return <PosterView />;
    case "photo": return <ImagePreview {...IMAGES.photo} />;
    case "design": return <DesignView />;
    case "stats": return <StatsView />;
    case "volcano": return <VolcanoView />;
    default: return <HelpView />;
  }
}

function DegCountsView() {
  return (
    <TermTable
      caption="# deg-counts.tsv — DEGs per tissue (MSU vs PBS · FDR<0.05, |log2FC|>0.3)"
      head={["tissue", "up", "down", "total"]}
      rows={DEG_COUNTS.map((d) => [
        <span key="t" className="text-[var(--fg)]">{d.tissue}</span>,
        <span key="u" className="font-semibold tabular-nums" style={{ color: "var(--accent)" }}>{d.up.toLocaleString()} ▲</span>,
        <span key="d" className="font-semibold tabular-nums" style={{ color: "var(--accent-2)" }}>{d.down.toLocaleString()} ▼</span>,
        <span key="s" className="tabular-nums text-[var(--muted)]">{(d.up + d.down).toLocaleString()}</span>,
      ])}
    />
  );
}

function VolcanoView() {
  return (
    <div className="space-y-4">
      <ImagePreview {...IMAGES.volcanos} aspect="2 / 1" />
      <DegCountsView />
      <div>
        <p className="mb-2 text-[0.72rem] text-[var(--muted)]">$ ./volcano.plot --interactive <span className="text-[var(--muted)]/60"># illustrative re-render — hover the points</span></p>
        <div className="max-w-xl"><VolcanoPlot /></div>
        <div className="mt-3 flex flex-wrap items-center justify-start gap-x-5 gap-y-1.5 border-t border-[var(--line)] pt-3">
          <Legend color="#bcff46" label="up-regulated" />
          <Legend color="#4fe6ee" label="down-regulated" />
          <Legend color="#3a4250" label="ns" />
        </div>
      </div>
    </div>
  );
}

function GenesView() {
  return (
    <TermTable
      caption="# pain-mediators.tsv — key pain mediators (Result 6 · all up-regulated under MSU)"
      head={["gene", "reg", "role"]}
      rows={PAIN_MEDIATORS.map((g) => [
        <span key="g" className="font-semibold" style={{ color: "var(--accent)" }}>{g.gene}</span>,
        <span key="r" className="text-[0.68rem] font-bold" style={{ color: "var(--accent)" }}>UP ▲</span>,
        <span key="n" className="text-[var(--muted)]">{g.role}</span>,
      ])}
    />
  );
}

function MethodologyView() {
  const lines = [
    <span key="0"><span className="text-[var(--muted)]">#!/usr/bin/env deg-sh</span></span>,
    <span key="1"><span className="text-[var(--muted)]"># mouse-gout RNA-seq → differential expression → pain mediators</span></span>,
    <span key="2"> </span>,
    ...PIPELINE.map((s, i) => (
      <span key={`s${i}`}>
        <span style={{ color: "var(--accent)" }}>{s.n}</span>{"  "}
        <span className="text-[var(--fg)]">run --step {s.step}</span>
        <span className="text-[var(--muted)]">{"  ".repeat(Math.max(1, 22 - s.step.length))}# {s.detail}</span>
      </span>
    )),
  ];
  return <CodeBlock lang="project/methodology.sh" lines={lines} />;
}

function ProjectView() {
  return (
    <div className="max-w-2xl space-y-3">
      <MdHeading>{PROJECT.title}</MdHeading>
      <p className="text-[0.7rem] text-[var(--muted)]">
        {PROJECT.id} · <span style={{ color: "var(--accent)" }}>{PROJECT.award}</span> · mentor {PROJECT.mentor}
      </p>
      <KeyVals
        rows={[
          ["method", PROJECT.method],
          ["organism", PROJECT.organism],
          ["tissues", PROJECT.tissues],
          ["control", PROJECT.control],
          ["treatment", PROJECT.treatment],
        ]}
      />
      <div>
        <p className="text-[0.72rem] text-[var(--accent)]">## research question</p>
        <Prose>{PROJECT.question}</Prose>
      </div>
      <div>
        <p className="text-[0.72rem] text-[var(--accent)]">## hypothesis</p>
        <Prose>{PROJECT.hypothesis}</Prose>
      </div>
      <Prose>{PROJECT.abstract}</Prose>
      <div>
        <p className="text-[0.72rem] text-[var(--muted)]"><span className="text-[var(--accent)]">## </span>files in project/</p>
        <p className="mt-1 font-mono text-[0.72rem] leading-relaxed text-[var(--muted)]">
          <span className="text-[var(--accent)]">results.md</span> · <span className="text-[var(--accent)]">design</span> ·{" "}
          <span className="text-[var(--accent)]">volcano</span> · <span className="text-[var(--accent)]">heatmap</span> ·{" "}
          <span className="text-[var(--accent)]">pathways</span> · <span className="text-[var(--accent)]">pca</span> ·{" "}
          <span className="text-[var(--accent)]">genes</span> · <span className="text-[var(--accent)]">poster</span>
        </p>
      </div>
    </div>
  );
}

function PosterView() {
  return (
    <div className="space-y-2">
      <ImagePreview {...IMAGES.poster} aspect="4 / 3" maxW="max-w-xl" />
      <p className="text-[0.7rem] text-[var(--muted)]"># the full board — zoom in your browser, or open figures: `volcano` · `heatmap` · `design` · `pathways`</p>
    </div>
  );
}

function DesignView() {
  return (
    <div className="max-w-xl space-y-3">
      <ImagePreview {...IMAGES.designTable} aspect="5 / 1" />
      <KeyVals
        pad={9}
        rows={[
          ["tissues", "ankle joint · DRG · spinal cord"],
          ["groups", "PBS (control) · MSU (gout)"],
          ["design", "3 tissues × 2 conditions × replicates"],
          ["dataset", "GSE190138 (NCBI GEO)"],
        ]}
      />
    </div>
  );
}

function AbstractView() {
  return (
    <div className="max-w-2xl space-y-2">
      <Prose>{PROJECT.abstract}</Prose>
      <p className="text-[0.72rem] text-[var(--accent-2)]">— {PROJECT.award}</p>
    </div>
  );
}

function ResultsView() {
  return (
    <div className="max-w-2xl space-y-3">
      {RESULTS.map((r) => (
        <div key={r.heading}>
          <p className="text-[0.82rem] font-bold text-[var(--fg)]"><span className="text-[var(--accent)]">## </span>{r.heading}</p>
          <Prose>{r.body}</Prose>
        </div>
      ))}
      <p className="pt-1 text-[0.72rem] text-[var(--muted)]"># see the graphs: `heatmap` · `pca` · `pathways` · `volcano`</p>
    </div>
  );
}

function PathwaysView() {
  return (
    <TermTable
      caption="# pathways.tsv — top GO enrichment categories (up-regulated under MSU)"
      head={["pathway", "reg", "enrichment", "from"]}
      rows={PATHWAYS.map((p) => {
        const w = 12;
        const fill = Math.round(Math.min(1, Math.abs(p.nes) / 3) * w);
        const col = p.dir === "up" ? "var(--accent)" : "var(--accent-2)";
        return [
          <span key="n" className="text-[var(--fg)]">{p.pathway}</span>,
          <span key="r" className="text-[0.68rem] font-bold" style={{ color: col }}>{p.dir.toUpperCase()}</span>,
          <span key="b" className="whitespace-pre"><span style={{ color: col }}>{"█".repeat(fill)}</span><span className="text-[var(--muted)]/40">{"░".repeat(w - fill)}</span></span>,
          <span key="s" className="text-[var(--muted)]">{p.source}</span>,
        ];
      })}
    />
  );
}

function ResourcesView() {
  const KIND: Record<string, string> = { tool: "var(--accent)", data: "var(--accent-2)", text: "var(--accent-2)", mentor: "var(--hot)", link: "var(--accent)" };
  return (
    <div className="space-y-1.5 text-[0.78rem]">
      <p className="mb-1 text-[var(--muted)]"># tools, mentors & references behind the work</p>
      {RESOURCES.map((r) => (
        <p key={r.label} className="flex flex-wrap items-baseline gap-x-2.5">
          <span className="shrink-0 rounded px-1.5 text-[0.5rem] uppercase tracking-widest" style={{ color: KIND[r.kind] ?? "var(--muted)", border: "1px solid var(--line)" }}>{r.kind}</span>
          <span className="shrink-0 font-semibold text-[var(--fg)]">{r.label}</span>
          <span className="text-[var(--muted)]">— {r.detail}</span>
        </p>
      ))}
    </div>
  );
}

function AwardsIndex() {
  return (
    <TermTable
      caption="# awards/ — 3 results, single academic year"
      head={["year", "award", "result", "open with"]}
      rows={AWARDS.map((a) => [
        <span key="y" className="text-[var(--muted)]">{a.year}</span>,
        <span key="n" className="text-[var(--fg)]">{a.name}</span>,
        <span key="r" className="font-semibold" style={{ color: "var(--accent)" }}>{a.result}</span>,
        <span key="c" className="text-[var(--accent-2)]">{a.id}</span>,
      ])}
    />
  );
}

function AwardView({ id }: { id: string }) {
  const a = AWARDS.find((x) => x.id === id) as Award | undefined;
  if (!a) return <Prose>award not found.</Prose>;
  const viz = AWARD_VIZ[a.id];
  return (
    <div className="space-y-3">
      <JsonView data={{ award: a.name, result: a.result, year: a.year, ...a.fields }} />
      {a.id === "usabo" ? (
        <AsciiPanel title="// honors">
          <AsciiArt art={USABO_MEDAL} info={USABO_MEDAL_INFO} />
        </AsciiPanel>
      ) : viz ? (
        <AsciiPanel title="// scorecard">
          {viz.map((m, i) => <AsciiMeter key={i} {...m} />)}
        </AsciiPanel>
      ) : null}
      <div className="border-t border-[var(--line)] pt-2">
        <p className="text-[0.72rem] text-[var(--accent)]">{"// analysis"}</p>
        <Prose>{a.summary}</Prose>
        <Prose>{a.detail}</Prose>
      </div>
    </div>
  );
}

function StatsView() {
  return (
    <div className="space-y-3">
      <JsonView data={STATS} />
      <AsciiPanel title="// standing across competitions">
        {STAT_BARS.map((m, i) => <AsciiMeter key={i} {...m} />)}
      </AsciiPanel>
    </div>
  );
}

function ProgramsIndex() {
  return (
    <TermTable
      caption="# field/ — teaching, outreach & the competition pipeline"
      head={["role", "program", "open with"]}
      rows={PROGRAMS.map((p) => [
        <span key="r" className="text-[var(--accent-2)]">{p.role}</span>,
        <span key="n" className="text-[var(--fg)]">{p.name}</span>,
        <span key="c" className="text-[var(--accent)]">{p.id === "stempac" ? "stem-pac" : p.id}</span>,
      ])}
    />
  );
}

function ProgramView({ id }: { id: string }) {
  const p = PROGRAMS.find((x) => x.id === id) as Program | undefined;
  if (!p) return <Prose>program not found.</Prose>;
  return (
    <div className="max-w-2xl space-y-3">
      <MdHeading>{p.name}</MdHeading>
      <p className="text-[0.72rem] text-[var(--accent-2)]">{p.role}</p>
      <KeyVals rows={Object.entries(p.meta).map(([k, v]) => [k, v])} pad={12} />
      {p.body.map((b, i) => <Prose key={i}>{b}</Prose>)}
      {p.list && (
        <ul className="space-y-1 border-l border-[var(--line)] pl-3">
          {p.list.map((l, i) => (
            <li key={i} className="text-[0.76rem]">
              <span className="text-[var(--accent)]">▸ {l.label}</span>
              <span className="text-[var(--muted)]"> — {l.text}</span>
            </li>
          ))}
        </ul>
      )}
      {p.image && <ImagePreview {...p.image} />}
    </div>
  );
}

function ReadmeView() {
  return (
    <div className="max-w-2xl space-y-3">
      <MdHeading>Reading the genome of pain</MdHeading>
      <Prose>{PROJECT.abstract}</Prose>
      <Prose>
        This console holds Jadon&apos;s STEM work — a self-built RNA-seq pipeline, biology-olympiad results, and the
        programs he runs. It is a terminal: nothing shows until you summon it.
      </Prose>
      <p className="text-[0.74rem] text-[var(--muted)]">
        <span className="text-[var(--accent)]">## </span>quick start
      </p>
      <KeyVals
        pad={10}
        rows={[
          ["ls", "list every file"],
          ["volcano", "render the DEG plot"],
          ["genes", "the DESeq2 results table"],
          ["usabo", "one award (or `awards` for all)"],
          ["neofetch", "system readout"],
        ]}
      />
    </div>
  );
}

function WhoamiView() {
  return (
    <KeyVals
      pad={12}
      rows={[
        ["name", PROFILE.name],
        ["role", PROFILE.role],
        ["school", `${PROFILE.school} · '${String(PROFILE.class_of).slice(2)}`],
        ["focus", PROFILE.focus],
        ["stack", PROFILE.stack.join(" · ")],
        ["olympiads", PROFILE.olympiads.join(" · ")],
      ]}
    />
  );
}

function TreeView() {
  return (
    <div className="text-[0.78rem]">
      <p className="text-[var(--accent-2)]">~/research</p>
      {EXPLORER.map((it, i) => (
        <p key={i} className="flex gap-2" style={{ paddingLeft: `${it.depth * 1.4}rem` }}>
          <span className="text-[var(--muted)]/60">{it.depth === 0 ? "├──" : "│   └──"}</span>
          <span className={it.folder ? "text-[var(--accent-2)]" : "text-[var(--muted)]"}>{it.label}{it.folder ? "/" : ""}</span>
        </p>
      ))}
    </div>
  );
}

function Neofetch() {
  const dna = [
    "    ___    ",
    "  ╭┴─┴╮  ",
    "  │A═T│  ",
    "  ╰┬─┬╯  ",
    "  ╭┴─┴╮  ",
    "  │G≡C│  ",
    "  ╰┬─┬╯  ",
    "  │T═A│  ",
    "  ╰───╯  ",
  ];
  const specs: [string, string][] = [
    ["host", "jadon.li · Mission San Jose HS"],
    ["os", "research-os (gout-model)"],
    ["kernel", "deg-sh 3.1"],
    ["uptime", "class of 2027"],
    ["shell", "R 4.x"],
    ["dataset", "GSE190138 (PBS vs MSU)"],
    ["packages", "edgeR · ggplot2 · clusterProfiler"],
    ["de", "RNA-seq differential expression"],
    ["awards", "USABO HM · UK BBO Silver · ACSEF 3rd"],
    ["theme", "acid-lime on near-black"],
  ];
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <pre className="shrink-0 text-[0.7rem] leading-tight" style={{ color: "var(--accent)" }}>{dna.join("\n")}</pre>
      <div className="min-w-0 space-y-0.5 text-[0.76rem]">
        <p><span className="text-[var(--accent)]">visitor</span>@<span className="text-[var(--accent)]">deg-console</span></p>
        <p className="text-[var(--muted)]">-----------------</p>
        {specs.map(([k, v]) => (
          <p key={k} className="flex flex-wrap gap-x-2">
            <span className="shrink-0 text-[var(--accent-2)]" style={{ minWidth: "9ch" }}>{k}</span>
            <span className="text-[var(--fg)]">{v}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function HelpView() {
  const groups: { title: string; items: [string, string][] }[] = [
    { title: "the science-fair project", items: [
      ["poster", "🖼 the full ACSEF research poster"],
      ["photo", "🖼 Jadon in front of his board"],
      ["project", "overview of the mouse-gout RNA-seq study"],
      ["results", "the findings + why they matter"],
      ["methodology", "the edgeR pipeline (methodology.sh)"],
      ["design", "experimental design (3 tissues × PBS/MSU)"],
      ["citation", "BibTeX citation"],
    ]},
    { title: "graphs & data", items: [
      ["volcano", "real volcano plots + DEG counts"],
      ["degs", "DEGs per tissue (deg-counts.tsv)"],
      ["heatmap", "pain-mediator × tissue heatmap"],
      ["pca", "sample-clustering scatter (PCA)"],
      ["genes", "the key pain mediators (Ccl9, Ngf, …)"],
      ["pathways", "GO enrichment categories"],
    ]},
    { title: "achievements", items: [
      ["awards", "all three olympiad/fair results"],
      ["usabo · bbo · acsef", "open one award as JSON"],
      ["field", "all programs (or ysjc/prism/stem-pac/umass)"],
      ["stats", "the numbers (stats.json)"],
      ["resources", "tools, mentors & references"],
    ]},
    { title: "filesystem", items: [
      ["ls [dir]", "list a directory"],
      ["cd <dir>", "change directory (awards/field/project)"],
      ["cat <file>", "print a file (e.g. cat awards/usabo.json)"],
      ["tree", "the whole file tree"],
      ["pwd", "print working directory"],
    ]},
    { title: "system", items: [
      ["neofetch", "system + research readout"],
      ["whoami", "the short bio"],
      ["readme", "what this is + quick start"],
      ["history", "your command history"],
      ["clear", "wipe the terminal"],
      ["mutate", "🧬 flip the mutant colourway"],
      ["exit", "back to the portfolio"],
    ]},
  ];
  return (
    <div className="space-y-4 text-[0.78rem]">
      <p className="text-[var(--muted)]">
        usage: <span className="text-[var(--fg)]">&lt;command&gt; [arg]</span> · <span className="text-[var(--accent)]">Enter</span> runs, <span className="text-[var(--accent)]">Tab</span> completes, <span className="text-[var(--accent)]">↑/↓</span> history. Click files in the explorer too.
      </p>
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1 text-[0.58rem] uppercase tracking-[0.2em] text-[var(--accent)]">{g.title}</p>
          <div className="space-y-0.5">
            {g.items.map(([cmd, desc]) => (
              <p key={cmd} className="flex flex-wrap items-baseline gap-x-3">
                <span className="w-44 shrink-0 text-[var(--fg)]">{cmd}</span>
                <span className="text-[var(--muted)]">{desc}</span>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[0.6rem] text-[var(--muted)]">{label}</span>
    </span>
  );
}
