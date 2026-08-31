"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_SECTIONS, resolveSection } from "./sections";
import { jumpTo, toggleMutate } from "./lab/bus";
import { FUS, FUS_CITATION, FUS_LOG, PROFILE } from "./lab/content";

type Line = { text: string; tone: "fg" | "muted" | "accent" };

const HELP: string[] = [
  "ls                 list every section on this page",
  "open <section>     scroll there and close  (alias: go, cd, cat)",
  "log                the lab notebook, dated",
  "whoami             who is typing",
  "cite               BibTeX for the poster",
  "mutate             a different colourway",
  "clear              clear this console",
  "exit               close  (or press Escape)",
];

export function Console() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { text: "research console — the page has everything; this just gets you there faster.", tone: "muted" },
    { text: "type `help`, or `ls` to see the sections.", tone: "muted" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Whatever had focus right before the console opened — restored on close.
  // The `>_` trigger unmounts while the console is open, so this can't be a
  // fixed ref to that button the way ResearchNav's always-mounted sheet
  // trigger is; capturing document.activeElement covers both the "opened by
  // clicking the trigger" case (the browser focuses a button before its
  // click handler runs, so it's already the active element here) and the
  // "opened with the ` key from elsewhere on the page" case.
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // ` toggles the console from anywhere, except while typing in a field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus moves into the console on open (the input, its primary control)
  // and returns to whatever had it beforehand on close — same shape as the
  // mobile section sheet in ResearchNav.tsx.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => {
      previouslyFocused.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const out = useCallback((next: Line[]) => setLines((prev) => [...prev, ...next]), []);

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input) return;
      out([{ text: `visitor@research:~$ ${input}`, tone: "accent" }]);
      setHistory((h) => [input, ...h]);
      setHIndex(-1);

      const [cmd, ...rest] = input.split(/\s+/);
      const arg = rest.join(" ");

      switch (cmd.toLowerCase()) {
        case "help":
        case "?":
          out(HELP.map((text) => ({ text, tone: "muted" as const })));
          return;
        case "ls":
        case "sections":
          out(ALL_SECTIONS.map((s) => ({ text: `  ${s.id.padEnd(16)} ${s.label}`, tone: "fg" as const })));
          return;
        case "open":
        case "go":
        case "goto":
        case "cd":
        case "cat": {
          const id = resolveSection(arg);
          if (!id) {
            out([{ text: `no section "${arg}" — try \`ls\``, tone: "muted" }]);
            return;
          }
          out([{ text: `→ ${id}`, tone: "accent" }]);
          setOpen(false);
          jumpTo(id);
          return;
        }
        case "log":
          out(
            FUS_LOG.map((e) => ({
              text: `  ${e.hash}  ${e.date}  ${e.msg}`,
              tone: "muted" as const,
            })),
          );
          return;
        case "whoami":
          out([
            { text: PROFILE.name, tone: "fg" },
            { text: PROFILE.role, tone: "muted" },
            { text: PROFILE.focus, tone: "muted" },
            { text: `stack: ${PROFILE.stack.join(" · ")}`, tone: "muted" },
          ]);
          return;
        case "cite":
          out(FUS_CITATION.split("\n").map((text) => ({ text, tone: "muted" as const })));
          return;
        case "mutate":
          toggleMutate();
          return;
        case "clear":
          setLines([]);
          return;
        case "exit":
        case "quit":
          setOpen(false);
          return;
        case "sudo":
          out([{ text: "you already have root here. try `mutate`.", tone: "accent" }]);
          return;
        default:
          out([{ text: `${cmd}: not found — try \`help\``, tone: "muted" }]);
      }
    },
    [out],
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(hIndex + 1, history.length - 1);
      if (i >= 0) {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIndex - 1;
      setHIndex(i);
      setValue(i >= 0 ? history[i] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const hit = ALL_SECTIONS.find((s) => s.id.startsWith(value.replace(/^open\s+/, "")));
      if (hit) setValue(`open ${hit.id}`);
    }
  }

  // The console only ever has two focusable elements: this close button and
  // the input. Forward Tab from either already lands inside the console (the
  // input is the next thing in DOM order after this button), and the input
  // already consumes Tab/Shift+Tab entirely for autocomplete above — so the
  // one gap a focus trap needs to close is Shift+Tab off this button, which
  // would otherwise walk backward into the page behind the overlay.
  function onCloseKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the research console"
        className="fixed bottom-5 right-5 z-40 rounded-sm border border-[var(--line)] bg-[var(--bg-2)]/90 px-3 py-2 font-mono text-[0.7rem] text-[var(--muted)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        &gt;_
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Research console"
      data-lenis-prevent
      className="fixed inset-x-0 bottom-0 z-50 h-[min(60dvh,26rem)] border-t border-[var(--accent)] bg-[#05060a]/97 backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">
          {FUS.id}
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          onKeyDown={onCloseKeyDown}
          className="rounded-sm font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Esc
        </button>
      </div>
      <div ref={scrollRef} className="h-[calc(100%-5.5rem)] overflow-y-auto px-4 py-3 font-mono text-[0.8rem] leading-[1.65]">
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.tone === "accent"
                ? "whitespace-pre-wrap text-[var(--accent)]"
                : l.tone === "muted"
                  ? "whitespace-pre-wrap text-[var(--muted)]"
                  : "whitespace-pre-wrap text-[var(--fg)]"
            }
          >
            {l.text}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-[var(--line)] px-4 py-2.5 font-mono text-[0.8rem]">
        <span className="text-[var(--accent)]">visitor@research:~$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="Console input"
          className="min-w-0 flex-1 bg-transparent text-[var(--fg)] outline-none"
        />
      </div>
    </div>
  );
}
