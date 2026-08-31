"use client";

import { useEffect, useRef, useState } from "react";
import { ALL_SECTIONS, GROUPS, type SectionId } from "./sections";
import { jumpTo } from "./lab/bus";
import { cn } from "@/lib/cn";

export function ResearchNav() {
  const [active, setActive] = useState<SectionId>(ALL_SECTIONS[0].id);
  const [openGroup, setOpenGroup] = useState<string>(GROUPS[0].id);
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
        const id = hit.target.id as SectionId;
        setActive(id);
        const group = GROUPS.find((g) => g.sections.some((s) => s.id === id));
        if (group) setOpenGroup(group.id);
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
    const firstGroupId = GROUPS[0].id;
    const lastGroupId = GROUPS.find((g) => g.sections.some((s) => s.id === last.id))?.id;
    let rafId: number | null = null;

    function apply() {
      rafId = null;
      const doc = document.documentElement;
      const nearBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 120;
      const nearTop = window.scrollY <= 8;
      if (nearBottom) {
        setActive(last.id);
        if (lastGroupId) setOpenGroup(lastGroupId);
      } else if (nearTop) {
        setActive(first.id);
        setOpenGroup(firstGroupId);
      }
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
    const group = GROUPS.find((g) => g.sections.some((s) => s.id === id));
    if (group) setOpenGroup(group.id);
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
        <div className="pointer-events-auto flex flex-col gap-4">
          {GROUPS.map((g) => {
            const open = openGroup === g.id;
            return (
              <div
                key={g.id}
                className={cn(
                  "flex flex-col gap-1.5",
                  // Group has no heading by design (see NavGroup.label), so a
                  // hairline stands in for one — otherwise its entries render
                  // flush under whichever group sits above and read as part
                  // of it, collapsed or not.
                  g.label === null && "mt-2 border-t border-[var(--line)] pt-3",
                )}
              >
                {g.label ? (
                  <button
                    type="button"
                    onClick={() => setOpenGroup(open ? "" : g.id)}
                    aria-expanded={open}
                    className={cn(
                      "text-left font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                      open ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--fg)]",
                    )}
                  >
                    {g.label}
                  </button>
                ) : null}
                {(open || g.label === null) &&
                  g.sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(s.id);
                      }}
                      aria-current={active === s.id ? "true" : undefined}
                      className={cn(
                        "-ml-2 rounded-sm py-0.5 pl-2 text-[0.8rem] transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                        active === s.id
                          ? "border-l border-[var(--accent)] text-[var(--fg)]"
                          : "border-l border-transparent text-[var(--muted)] hover:text-[var(--fg)]",
                      )}
                    >
                      {s.label}
                    </a>
                  ))}
              </div>
            );
          })}
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
            className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--accent)]">
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
                    className="rounded-sm text-[1.05rem] text-[var(--fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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
