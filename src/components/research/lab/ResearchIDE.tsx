"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Folder, FileText, Terminal as TermIcon } from "lucide-react";
import { VolcanoPlot } from "@/components/research/VolcanoPlot";
import { PipelineFlow } from "@/components/research/PipelineFlow";
import { AwardsPanel } from "@/components/research/AwardsPanel";
import { ProgramsGrid } from "@/components/research/ProgramsGrid";
import { Counter } from "@/components/primitives/Counter";
import { RESEARCH } from "@/lib/data";
import { asset } from "@/lib/base";
import { fireToast, toggleMutate } from "./bus";
import { cn } from "@/lib/cn";

// ── command + content model ───────────────────────────────────────────────────

type ViewId = "help" | "tree" | "readme" | "whoami" | "volcano" | "project" | "awards" | "field" | "stats";
type Tone = "fg" | "muted" | "accent" | "cyan" | "err";

type Entry =
  | { id: number; kind: "cmd"; text: string }
  | { id: number; kind: "out"; lines: { text: string; tone?: Tone }[] }
  | { id: number; kind: "view"; view: ViewId };

const VIEW_FILE: Record<ViewId, string> = {
  help: "help",
  tree: "ls ~/research",
  readme: "README.md",
  whoami: "whoami",
  volcano: "volcano.plot",
  project: "project/gout-rnaseq.md",
  awards: "awards/results.json",
  field: "field/programs.md",
  stats: "stats.json",
};

// Explorer tree — every leaf maps to a command.
const TREE: { label: string; cmd: string; depth: number; folder?: boolean }[] = [
  { label: "README.md", cmd: "readme", depth: 0 },
  { label: "whoami", cmd: "whoami", depth: 0 },
  { label: "volcano.plot", cmd: "volcano", depth: 0 },
  { label: "project", cmd: "project", depth: 0, folder: true },
  { label: "gout-rnaseq.md", cmd: "project", depth: 1 },
  { label: "methodology.sh", cmd: "methodology", depth: 1 },
  { label: "awards", cmd: "awards", depth: 0, folder: true },
  { label: "usabo.json", cmd: "awards", depth: 1 },
  { label: "uk-bbo.json", cmd: "awards", depth: 1 },
  { label: "acsef.json", cmd: "awards", depth: 1 },
  { label: "field", cmd: "field", depth: 0, folder: true },
  { label: "ysjc.md", cmd: "field", depth: 1 },
  { label: "prism.md", cmd: "field", depth: 1 },
  { label: "stem-pac.md", cmd: "field", depth: 1 },
  { label: "umass.md", cmd: "field", depth: 1 },
  { label: "stats.json", cmd: "stats", depth: 0 },
];

// canonical command names for autocomplete
const COMMAND_NAMES = [
  "help", "ls", "clear", "readme", "whoami", "volcano", "project",
  "methodology", "awards", "field", "stats", "mutate", "exit",
];

const TONE_CLASS: Record<Tone, string> = {
  fg: "text-[var(--fg)]",
  muted: "text-[var(--muted)]",
  accent: "text-[var(--accent)]",
  cyan: "text-[var(--accent-2)]",
  err: "text-[var(--hot)]",
};

const BOOT: { text: string; tone?: Tone; at: number }[] = [
  { text: "deg-console v3.0 · research IDE", tone: "accent", at: 100 },
  { text: "booting kernel ............ ok", tone: "muted", at: 240 },
  { text: "mounting /achievements .... ok", tone: "muted", at: 380 },
  { text: "indexed: 1 project · 3 olympiad results · 4 programs", tone: "muted", at: 540 },
  { text: " ", at: 600 },
  { text: "This page is a terminal — nothing is shown until you ask for it.", tone: "fg", at: 720 },
  { text: "It does not scroll on its own; you drive it with commands.", tone: "fg", at: 720 },
  { text: " ", at: 760 },
  { text: "→ type  help  to list commands, or  ls  to browse the achievements.", tone: "accent", at: 900 },
];

const SUGGEST: Record<string, string[]> = {
  default: ["help", "ls", "volcano", "project", "awards", "field"],
  volcano: ["project", "awards", "field", "stats"],
  project: ["awards", "field", "methodology", "stats"],
  awards: ["project", "field", "stats", "volcano"],
  field: ["project", "awards", "stats", "volcano"],
  stats: ["project", "awards", "field", "readme"],
  readme: ["volcano", "project", "awards", "field"],
  whoami: ["project", "awards", "field", "ls"],
  help: ["ls", "volcano", "project", "awards"],
  tree: ["volcano", "project", "awards", "field"],
};

// ── component ─────────────────────────────────────────────────────────────────

export function ResearchIDE() {
  const [log, setLog] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [tabs, setTabs] = useState<ViewId[]>([]);
  const [active, setActive] = useState<ViewId | null>(null);
  const [suggest, setSuggest] = useState<string[]>(SUGGEST.default);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = () => ++idRef.current;

  // boot sequence
  useEffect(() => {
    const timers = BOOT.map((b) =>
      window.setTimeout(() => {
        setLog((l) => [...l, { id: nextId(), kind: "out", lines: [{ text: b.text, tone: b.tone }] }]);
      }, b.at),
    );
    const focus = window.setTimeout(() => inputRef.current?.focus(), 950);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(focus);
    };
  }, []);

  // keep terminal pinned to newest output
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  // ⌘K / Ctrl-K focuses the prompt
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

  const pushCmd = (text: string) => setLog((l) => [...l, { id: nextId(), kind: "cmd", text }]);
  const pushOut = (lines: { text: string; tone?: Tone }[]) =>
    setLog((l) => [...l, { id: nextId(), kind: "out", lines }]);
  const pushView = (view: ViewId) => {
    setLog((l) => [...l, { id: nextId(), kind: "view", view }]);
    setActive(view);
    setTabs((t) => (t.includes(view) ? t : [...t, view]));
  };

  const exec = (raw: string) => {
    const line = raw.trim();
    if (!line) return;
    pushCmd(line);
    setHistory((h) => [...h, line].slice(-50));
    setHistIdx(null);

    const tokens = line.toLowerCase().split(/\s+/);
    let head = tokens[0];
    const arg = tokens.slice(1).join(" ").replace(/^\.?\//, "").replace(/\/$/, "");
    if (["open", "cat", "cd", "view", "go", "goto", "run", "less", "vim", "nano"].includes(head) && arg) {
      head = arg.replace(/\//g, "").replace(/\.(md|json|sh|plot|tsx)$/, "");
    } else {
      head = head.replace(/\.(md|json|sh|plot|tsx)$/, "");
    }

    let key = "default";
    switch (head) {
      case "help":
      case "?":
      case "man":
      case "commands":
        pushView("help"); key = "help"; break;
      case "ls":
      case "dir":
      case "tree":
      case "sections":
        pushView("tree"); key = "tree"; break;
      case "clear":
      case "cls":
        setLog([]); setActive(null); return;
      case "readme":
      case "intro":
      case "start":
        pushView("readme"); key = "readme"; break;
      case "whoami":
      case "about":
      case "me":
        pushView("whoami"); key = "whoami"; break;
      case "volcano":
      case "plot":
      case "deg":
        pushView("volcano"); key = "volcano";
        pushOut([{ text: "→ hover the glowing points to inspect genes. up = lime, down = cyan.", tone: "muted" }]);
        break;
      case "project":
      case "gout-rnaseq":
      case "rnaseq":
      case "rna-seq":
      case "gout":
        pushView("project"); key = "project"; break;
      case "methodology":
      case "method":
        pushView("project"); key = "project";
        window.setTimeout(() => window.dispatchEvent(new CustomEvent("lab:open-methodology")), 80);
        pushOut([{ text: "→ expanded the full 8-step methodology + key mediators.", tone: "muted" }]);
        break;
      case "awards":
      case "results":
      case "usabo":
      case "bbo":
      case "uk-bbo":
      case "acsef":
      case "olympiads":
      case "competitions":
        pushView("awards"); key = "awards";
        pushOut([{ text: "→ click any award row to expand the full breakdown.", tone: "muted" }]);
        break;
      case "field":
      case "programs":
      case "ysjc":
      case "prism":
      case "stem-pac":
      case "stempac":
      case "umass":
      case "teaching":
      case "outreach":
        pushView("field"); key = "field"; break;
      case "stats":
      case "numbers":
      case "receipts":
        pushView("stats"); key = "stats"; break;
      case "mutate":
      case "mutation":
        toggleMutate(); break;
      case "konami":
        fireToast("try it on your keyboard ;)", "lime"); break;
      case "sudo":
        pushOut([{ text: "nice try. you already have root here.", tone: "accent" }]); break;
      case "exit":
      case "quit":
      case "home":
      case "..":
        pushOut([{ text: "returning to portfolio…", tone: "cyan" }]);
        window.setTimeout(() => { window.location.href = asset("/"); }, 350);
        return;
      default:
        pushOut([
          { text: `command not found: ${tokens[0]}`, tone: "err" },
          { text: "type  help  for the list of commands.", tone: "muted" },
        ]);
    }
    setSuggest(SUGGEST[key] ?? SUGGEST.default);
  };

  // file-tree / chip / tab clicks all route through exec
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
        const hit = COMMAND_NAMES.find((c) => c.startsWith(tok));
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
      {/* ── title bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--bg-2)]/70 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-3 rounded-full bg-[var(--hot)]" />
            <span className="size-3 rounded-full bg-[#ffd23c]" />
            <span className="size-3 rounded-full bg-[var(--accent)]" />
          </span>
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            data-cursor-hover
            className="md:pointer-events-none flex items-center gap-2 text-[0.62rem] uppercase tracking-widest text-[var(--muted)]"
          >
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

      {/* ── body: explorer + terminal ─────────────────────────── */}
      <div className="relative flex min-h-0 flex-1">
        {/* explorer */}
        <aside
          className={cn(
            "flex w-60 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--bg-2)]/40 backdrop-blur",
            "max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-30 max-md:w-56 max-md:transition-transform",
            sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          )}
          style={{ marginTop: 0 }}
        >
          <p className="border-b border-[var(--line)] px-3 py-2 text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            Explorer
          </p>
          <div className="flex items-center gap-1.5 px-3 py-2 text-[0.62rem] text-[var(--muted)]">
            <ChevronRight className="size-3" /> ~/research
          </div>
          <div className="flex-1 overflow-y-auto term-scroll pb-3">
            {TREE.map((t, i) => (
              <button
                key={i}
                data-cursor-hover
                onClick={() => { run(t.cmd); setSidebarOpen(false); }}
                className="group flex w-full items-center gap-1.5 py-1 pr-2 text-left text-[0.7rem] text-[var(--muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--fg)]"
                style={{ paddingLeft: `${0.75 + t.depth * 0.9}rem` }}
              >
                {t.folder ? (
                  <Folder className="size-3.5 shrink-0 text-[var(--accent-2)]" />
                ) : (
                  <FileText className="size-3.5 shrink-0 text-[var(--muted)] group-hover:text-[var(--accent)]" />
                )}
                {t.label}
              </button>
            ))}
          </div>
          <a
            href={asset("/")}
            data-cursor-hover
            className="border-t border-[var(--line)] px-3 py-2 text-[0.6rem] uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            ← exit to portfolio
          </a>
        </aside>

        {/* terminal column */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* tab bar */}
          <div className="flex items-stretch gap-px overflow-x-auto border-b border-[var(--line)] bg-[var(--bg)]/40 term-scroll">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              data-cursor-hover
              className="flex items-center px-3 text-[var(--muted)] md:hidden"
              aria-label="toggle explorer"
            >
              ☰
            </button>
            {tabs.length === 0 ? (
              <span className="px-3 py-2 text-[0.62rem] uppercase tracking-widest text-[var(--muted)]">terminal — bash</span>
            ) : (
              tabs.map((t) => (
                <button
                  key={t}
                  data-cursor-hover
                  onClick={() => run(t)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap border-r border-[var(--line)] px-3 py-2 text-[0.66rem] transition-colors",
                    active === t ? "bg-[var(--bg-2)]/70 text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]",
                  )}
                >
                  <FileText className="size-3" style={{ color: active === t ? "var(--accent)" : undefined }} />
                  {VIEW_FILE[t]}
                </button>
              ))
            )}
          </div>

          {/* output stream */}
          <div
            ref={logRef}
            onClick={(e) => { if (e.target === e.currentTarget) inputRef.current?.focus(); }}
            className="ide-stream term-scroll flex-1 overflow-y-auto px-4 py-4 text-[0.8rem] leading-relaxed md:px-6"
          >
            {log.map((e) => (
              <div key={e.id} className="mb-1">
                {e.kind === "cmd" && (
                  <p className="flex gap-2">
                    <span className="shrink-0 text-[var(--accent)]">visitor@deg-console:~/research$</span>
                    <span className="text-[var(--fg)]">{e.text}</span>
                  </p>
                )}
                {e.kind === "out" &&
                  e.lines.map((ln, i) => (
                    <p key={i} className={cn("whitespace-pre-wrap", TONE_CLASS[ln.tone ?? "muted"])}>
                      {ln.text}
                    </p>
                  ))}
                {e.kind === "view" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="my-2 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-2)]/35"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg-2)]/50 px-3 py-1.5">
                      <span className="flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
                        <FileText className="size-3 text-[var(--accent)]" />
                        {VIEW_FILE[e.view]}
                      </span>
                      <span className="text-[0.55rem] uppercase tracking-widest text-[var(--muted)]">rendered</span>
                    </div>
                    <div className="p-4 md:p-5">
                      <ViewBody view={e.view} run={run} />
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
              <button
                key={s}
                data-cursor-hover
                onClick={() => run(s)}
                className="rounded-md border border-[var(--line)] px-2 py-0.5 text-[0.66rem] text-[var(--muted)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] hover:text-[var(--accent)]"
              >
                {s}
              </button>
            ))}
          </div>

          {/* prompt */}
          <label
            className="flex cursor-text items-center gap-2 border-t border-[var(--line)] bg-[var(--bg-2)]/40 px-4 py-3 md:px-6"
            onClick={() => inputRef.current?.focus()}
            data-cursor-hover
          >
            <span className="shrink-0 text-[0.8rem]">
              <span className="text-[var(--accent)]">visitor@deg-console</span>
              <span className="text-[var(--muted)]">:~/research$</span>
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="terminal command input"
              placeholder="type a command…  (help · ls · volcano · project · awards · field)"
              className="w-full bg-transparent text-[0.8rem] text-[var(--fg)] outline-none placeholder:text-[var(--muted)]/60"
              style={{ caretColor: "var(--accent)" }}
            />
          </label>
        </main>
      </div>

      {/* ── status bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--bg-2)]/70 px-3 py-1 text-[0.58rem] uppercase tracking-widest text-[var(--muted)] backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-[var(--accent)]">⎇ research/gout-model</span>
          <span className="hidden sm:inline">bash</span>
          <span className="hidden md:inline">UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Tab ↹ autocomplete · ↑↓ history</span>
          <span>
            type <span className="text-[var(--accent)]">help</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── content views ─────────────────────────────────────────────────────────────

function ViewBody({ view, run }: { view: ViewId; run: (cmd: string) => void }) {
  switch (view) {
    case "volcano":
      return (
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">differential expression</span>
            <span className="text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">mouse gout model</span>
          </div>
          <VolcanoPlot />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 border-t border-[var(--line)] pt-3">
            <Legend color="#bcff46" label="up-regulated" />
            <Legend color="#4fe6ee" label="down-regulated" />
            <Legend color="#3a4250" label="ns" />
          </div>
        </div>
      );
    case "project":
      return <PipelineFlow />;
    case "awards":
      return <AwardsPanel />;
    case "field":
      return <ProgramsGrid />;
    case "stats":
      return <StatsView />;
    case "readme":
      return <ReadmeView run={run} />;
    case "whoami":
      return <WhoamiView />;
    case "tree":
      return <TreeView run={run} />;
    case "help":
    default:
      return <HelpView run={run} />;
  }
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[0.6rem] text-[var(--muted)]">{label}</span>
    </span>
  );
}

function StatsView() {
  const tiles = [
    { v: 26, suffix: "/50", prefix: "", label: "USABO Open", sub: "top ~15% nationally" },
    { v: 10, suffix: "%", prefix: "top ", label: "UK BBO Silver", sub: "international field" },
    { v: 3, suffix: "rd", prefix: "", label: "ACSEF · BCOM", sub: "Computational Biology" },
    { v: 8, suffix: "", prefix: "", label: "YSJC students", sub: "Biology dept · founder" },
    { v: 1, suffix: " wk", prefix: "", label: "R training", sub: "Dr. Younice · Stanford" },
    { v: 5, suffix: "", prefix: "", label: "AP 5s", sub: "Bio · Stats · more" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {tiles.map((t) => (
        <div key={t.label} className="glass-2 rounded-lg p-4">
          <span className="text-2xl font-black tabular-nums md:text-3xl" style={{ color: "var(--accent)" }}>
            <Counter to={t.v} suffix={t.suffix} prefix={t.prefix} duration={1.4} />
          </span>
          <p className="mt-1.5 text-[0.7rem] font-semibold text-[var(--fg)]">{t.label}</p>
          <p className="text-[0.58rem] text-[var(--muted)]">{t.sub}</p>
        </div>
      ))}
    </div>
  );
}

function ReadmeView({ run }: { run: (cmd: string) => void }) {
  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="flow-display text-[clamp(1.6rem,4vw,2.6rem)] text-[var(--fg)]">
        Reading the <span className="text-glow" style={{ color: "var(--accent)" }}>genome</span> of pain.
      </h2>
      <p className="text-[0.82rem] leading-relaxed text-[var(--muted)]">{RESEARCH.intro}</p>
      <p className="text-[0.78rem] leading-relaxed text-[var(--muted)]">
        This console holds Jadon&apos;s STEM work: a self-built RNA-seq pipeline on a mouse gout model,
        national + international biology olympiad results, and the programs he runs. Summon any of it
        with a command.
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {["volcano", "project", "awards", "field", "stats"].map((c) => (
          <ChipRun key={c} cmd={c} run={run} />
        ))}
      </div>
    </div>
  );
}

function WhoamiView() {
  const rows = [
    ["name", "Jadon Li"],
    ["role", "bio researcher · builder · student leader"],
    ["school", "Mission San Jose HS, Fremont · class of 2027"],
    ["focus", "RNA-seq · differential expression · pain biology"],
    ["tools", "R · DESeq2 · limma · ggplot2 · GSEA"],
    ["olympiads", "USABO HM · UK BBO Silver · ACSEF 3rd"],
  ];
  return (
    <div className="space-y-1 text-[0.8rem]">
      {rows.map(([k, v]) => (
        <p key={k} className="flex flex-wrap gap-2">
          <span className="w-24 shrink-0 text-[var(--accent)]">{k}</span>
          <span className="text-[var(--fg)]">{v}</span>
        </p>
      ))}
    </div>
  );
}

function TreeView({ run }: { run: (cmd: string) => void }) {
  return (
    <div className="text-[0.78rem]">
      <p className="text-[var(--accent-2)]">~/research</p>
      {TREE.map((t, i) => (
        <button
          key={i}
          data-cursor-hover
          onClick={() => run(t.cmd)}
          className="group flex w-full items-center gap-2 py-0.5 text-left transition-colors hover:text-[var(--accent)]"
          style={{ paddingLeft: `${0.5 + t.depth * 1.2}rem` }}
        >
          <span className="text-[var(--muted)]">{t.depth === 0 ? "├─" : "│  ├─"}</span>
          <span className={t.folder ? "text-[var(--accent-2)]" : "text-[var(--muted)] group-hover:text-[var(--accent)]"}>
            {t.label}{t.folder ? "/" : ""}
          </span>
        </button>
      ))}
      <p className="mt-3 text-[0.7rem] text-[var(--muted)]">click a file, or type its name (e.g. <span className="text-[var(--accent)]">project</span>).</p>
    </div>
  );
}

function HelpView({ run }: { run: (cmd: string) => void }) {
  const groups: { title: string; items: [string, string][] }[] = [
    {
      title: "view achievements",
      items: [
        ["volcano", "the interactive differential-expression plot"],
        ["project", "the mouse-gout RNA-seq science-fair project"],
        ["awards", "USABO, UK Biology Olympiad, ACSEF"],
        ["field", "teaching, outreach & the competition pipeline"],
        ["stats", "the numbers, at a glance"],
      ],
    },
    {
      title: "navigate",
      items: [
        ["ls", "list every file in the explorer"],
        ["readme", "what this is + where to start"],
        ["whoami", "the short bio"],
        ["clear", "wipe the terminal"],
      ],
    },
    {
      title: "system",
      items: [
        ["mutate", "🧬 flip the mutant colourway"],
        ["exit", "back to the rest of the portfolio"],
      ],
    },
  ];
  return (
    <div className="space-y-4 text-[0.78rem]">
      <p className="text-[var(--muted)]">
        Type a command and press <span className="text-[var(--accent)]">Enter</span>. <span className="text-[var(--accent)]">Tab</span> autocompletes,
        <span className="text-[var(--accent)]"> ↑/↓</span> walk history. You can also click files in the explorer.
      </p>
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1 text-[0.58rem] uppercase tracking-[0.2em] text-[var(--accent)]">{g.title}</p>
          <div className="space-y-0.5">
            {g.items.map(([cmd, desc]) => (
              <button
                key={cmd}
                data-cursor-hover
                onClick={() => run(cmd)}
                className="group flex w-full items-baseline gap-3 text-left"
              >
                <span className="w-24 shrink-0 text-[var(--fg)] group-hover:text-[var(--accent)]">{cmd}</span>
                <span className="text-[var(--muted)]">{desc}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChipRun({ cmd, run }: { cmd: string; run: (cmd: string) => void }) {
  return (
    <button
      data-cursor-hover
      onClick={() => run(cmd)}
      className="rounded-md border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2.5 py-1 text-[0.68rem] text-[var(--accent)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_22%,transparent)]"
    >
      {cmd}
    </button>
  );
}
