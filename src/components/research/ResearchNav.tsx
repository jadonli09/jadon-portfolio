"use client";

import { useEffect, useRef, useState } from "react";
import { ALL_SECTIONS, GROUPS, type SectionId } from "./sections";
import { jumpTo } from "./lab/bus";
import { cn } from "@/lib/cn";

export function ResearchNav() {
  const [active, setActive] = useState<SectionId>(ALL_SECTIONS[0].id);
  const [sheet, setSheet] = useState(false);
  const sheetTriggerRef = useRef<HTMLButtonElement | null>(null);
  const sheetCloseRef = useRef<HTMLButtonElement | null>(null);

  // Active section — the entry whose heading most recently crossed the top third.
  useEffect(() => {
    const els = ALL_SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!hit) return;
        setActive(hit.target.id as SectionId);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Floor/ceiling fallback — the observer only fires on intersection CHANGES,
  // so if the last heading never enters the "-12%/-70%" band (not enough
  // scroll room below it), `active` freezes on the second-to-last section
  // forever. A throttled scroll listener forces the last entry once we're
  // pinned to the bottom, and the first entry once we're pinned to the top.
  // The observer stays the primary mechanism; this only covers the two ends.
  useEffect(() => {
    const first = ALL_SECTIONS[0];
    const last = ALL_SECTIONS[ALL_SECTIONS.length - 1];
    let rafId: number | null = null;

    function apply() {
      rafId = null;
      const doc = document.documentElement;
      const nearBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 120;
      const nearTop = window.scrollY <= 8;
      if (nearBottom) setActive(last.id);
      else if (nearTop) setActive(first.id);
    }

    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(apply);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Mobile sheet: Escape closes it, focus moves in on open and returns to
  // the button that opened it on close.
  useEffect(() => {
    if (!sheet) return;
    sheetCloseRef.current?.focus();
    const trigger = sheetTriggerRef.current;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSheet(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [sheet]);

  const index = ALL_SECTIONS.findIndex((s) => s.id === active);
  const activeLabel = ALL_SECTIONS[index]?.label ?? "";
  const progress = ((index + 1) / ALL_SECTIONS.length) * 100;

  function go(id: SectionId) {
    setActive(id);
    jumpTo(id);
    setSheet(false);
  }

  return (
    <>
      {/* ── desktop rail ───────────────────────────────────────── */}
      <nav
        aria-label="Sections"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-dvh w-56 flex-col justify-center pl-6 lg:flex"
      >
        {/* Seven stops fit without collapsing, so nothing here hides anything
            and the labels can be read at arm's length. */}
        <div className="pointer-events-auto flex flex-col gap-5">
          {GROUPS.map((g, gi) => (
            <div
              key={g.id}
              className={cn(
                "flex flex-col gap-2",
                // Group has no heading by design (see NavGroup.label), so a
                // hairline stands in for one — otherwise its entries render
                // flush under whichever group sits above and read as part of
                // it. The first group has nothing above it to separate from.
                g.label === null && gi > 0 && "border-t border-[var(--line)] pt-4",
              )}
            >
              {g.label ? (
                <p className="text-[0.88rem] leading-tight text-[var(--muted)] opacity-70">
                  {g.label}
                </p>
              ) : null}
              {g.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(s.id);
                  }}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn(
                    "-ml-2 rounded-sm py-1 pl-3 text-[1rem] leading-tight transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                    active === s.id
                      ? "border-l-2 border-[var(--accent)] text-[var(--fg)]"
                      : "border-l-2 border-transparent text-[var(--muted)] hover:text-[var(--fg)]",
                  )}
                >
                  {s.label}
                </a>
              ))}
            </div>
          ))}
          <div className="mt-3 h-px w-24 bg-[var(--line)]" aria-hidden="true">
            <div
              className="h-px bg-[var(--accent)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </nav>

      {/* ── mobile bar ─────────────────────────────────────────── */}
      <div className="sticky top-[3.25rem] z-40 border-y border-[var(--line)] bg-[var(--bg)]/92 backdrop-blur lg:hidden">
        <button
          ref={sheetTriggerRef}
          type="button"
          onClick={() => setSheet(true)}
          aria-expanded={sheet}
          className="flex w-full items-center justify-between px-4 py-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <span className="text-[0.85rem] text-[var(--fg)]">{activeLabel}</span>
          <span className="font-mono text-[0.65rem] tabular-nums text-[var(--muted)]">
            {index + 1} / {ALL_SECTIONS.length}
          </span>
        </button>
      </div>

      {sheet ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Section index"
          className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg)] px-6 py-8 lg:hidden"
          data-lenis-prevent
        >
          <button
            ref={sheetCloseRef}
            type="button"
            onClick={() => setSheet(false)}
            className="mb-7 min-h-[2.75rem] text-[1rem] text-[var(--muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Close
          </button>
          <div className="flex flex-col gap-6">
            {GROUPS.map((g) => (
              <div
                key={g.id}
                className={cn(
                  "flex flex-col gap-2",
                  g.label === null && "border-t border-[var(--line)] pt-5",
                )}
              >
                {g.label ? (
                  <p className="text-[0.92rem] text-[var(--muted)] opacity-70">
                    {g.label}
                  </p>
                ) : null}
                {g.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(s.id);
                    }}
                    className="rounded-sm py-1.5 text-[1.15rem] text-[var(--fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
