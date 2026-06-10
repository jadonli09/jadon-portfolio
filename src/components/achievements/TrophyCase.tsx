"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TROPHIES, CAT_META, type TrophyCat, type Trophy } from "@/lib/data";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { Reveal } from "@/components/primitives/Reveal";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */

type FilterCat = "all" | TrophyCat;
type ViewMode = "timeline" | "domain";

/* ─────────────────────────────────────────────────────────────
   Year ordering — canonical chronological sort key
───────────────────────────────────────────────────────────── */

const YEAR_ORDER: Record<string, number> = {
  "Pre-HS": 0,
  "Age 12": 1,
  "7–8th": 2,
  "8th": 3,
  "9th": 4,
  "Summer '24": 5,
  "10th": 6,
  "Summer '25": 7,
  "2025": 8,
  "2025–26": 9,
  "2026": 10,
  "Ongoing": 11,
};

function yearKey(year: string): number {
  if (year in YEAR_ORDER) return YEAR_ORDER[year];
  // Numeric fallback
  const n = parseInt(year, 10);
  return isNaN(n) ? 999 : n;
}

function sortTrophies(trophies: Trophy[]): Trophy[] {
  return [...trophies].sort((a, b) => yearKey(a.year) - yearKey(b.year));
}

/* ─────────────────────────────────────────────────────────────
   Category filter pills
───────────────────────────────────────────────────────────── */

const ALL_CATS: TrophyCat[] = [
  "academic",
  "research",
  "civic",
  "built",
  "leadership",
  "court",
  "personal",
];

function FilterPill({
  id,
  label,
  color,
  count,
  active,
  onClick,
}: {
  id: FilterCat;
  label: string;
  color: string | null;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      data-cursor-hover
      whileTap={{ scale: 0.94 }}
      className={cn(
        "relative flex items-center gap-2 rounded-full border px-4 py-1.5",
        "font-mono text-[0.62rem] uppercase tracking-widest",
        "transition-all duration-200",
        active
          ? "border-transparent text-[#0a0907]"
          : "border-[var(--line)] bg-[var(--bg-2)] text-[var(--muted)] hover:text-[var(--fg)]",
      )}
      style={
        active
          ? { background: color ?? "var(--accent)", borderColor: "transparent" }
          : { borderColor: color ? `${color}44` : "var(--line)" }
      }
    >
      {/* Coloured dot when inactive */}
      {!active && color && (
        <span
          className="inline-block size-1.5 shrink-0 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
      )}
      {label}
      <span
        className={cn(
          "inline-flex min-w-[1.2rem] items-center justify-center rounded-full px-1 text-[0.5rem] font-bold",
          active ? "bg-black/20 text-[#0a0907]" : "bg-[var(--line)] text-[var(--muted)]",
        )}
      >
        {count}
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Category SVG icon (compact, 18 px)
───────────────────────────────────────────────────────────── */

function CatIcon({ cat, color, size = 16 }: { cat: TrophyCat; color: string; size?: number }) {
  const s = size;
  if (cat === "court") {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.2" />
        <path d="M8 1.5C8 1.5 5.5 4.5 5.5 8s2.5 6.5 2.5 6.5" stroke={color} strokeWidth="1" />
        <path d="M8 1.5C8 1.5 10.5 4.5 10.5 8s-2.5 6.5-2.5 6.5" stroke={color} strokeWidth="1" />
        <path d="M1.5 8h13" stroke={color} strokeWidth="1" />
      </svg>
    );
  }
  if (cat === "civic") {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="4" width="12" height="8" rx="1.5" stroke={color} strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2.5" stroke={color} strokeWidth="1" />
        <circle cx="8" cy="8" r="1" fill={color} />
      </svg>
    );
  }
  if (cat === "research") {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M6 2v5L11 12v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 2v5L5 12v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M4.5 5.5h7" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <path d="M4.5 10.5h7" stroke={color} strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }
  if (cat === "leadership") {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2.5l1.5 3.5 3.5.5-2.5 2.5.5 3.5L8 11l-3 1.5.5-3.5L3 6.5l3.5-.5z"
          stroke={color}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (cat === "built") {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="2" width="5" height="5" rx="1" stroke={color} strokeWidth="1.2" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke={color} strokeWidth="1.2" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke={color} strokeWidth="1.2" />
        <rect x="9" y="9" width="5" height="5" rx="1" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }
  if (cat === "personal") {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 13.5S2.5 10 2.5 6A3.5 3.5 0 018 3.1 3.5 3.5 0 0113.5 6C13.5 10 8 13.5 8 13.5z"
          stroke={color}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // academic — trophy cup
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5 2h6v6c0 2.5-1.5 3.5-3 3.5S5 10.5 5 8z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M11 4c1.5 0 2.5 1 2.5 2.5S12.5 9 11 8.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M5 4c-1.5 0-2.5 1-2.5 2.5S3.5 9 5 8.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M6.5 11.5v2M9.5 11.5v2" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M4.5 13.5h7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Trophy card (colour-coded, left-border accent)
───────────────────────────────────────────────────────────── */

function TrophyCard({ trophy, index }: { trophy: Trophy; index: number }) {
  const meta = CAT_META[trophy.cat];
  const color = meta.color;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.35, ease: EASE, delay: Math.min(index * 0.03, 0.25) }}
      data-cursor-hover
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "border border-[var(--line)] bg-[var(--bg-2)]",
        "p-4 md:p-5 transition-shadow duration-300",
      )}
      style={{
        borderLeftColor: `${color}66`,
        borderLeftWidth: "3px",
      }}
    >
      {/* Hover shine in category colour */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(115deg, transparent 30%, ${color}10 50%, transparent 70%)`,
        }}
        aria-hidden
      />

      {/* Top row: icon + year */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Category icon */}
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${color}18`, border: `1px solid ${color}33` }}
          >
            <CatIcon cat={trophy.cat} color={color} size={15} />
          </div>

          {/* Year */}
          <span
            className="font-mono text-[0.58rem] uppercase tracking-[0.22em]"
            style={{ color: color }}
          >
            {trophy.year}
          </span>
        </div>

        {/* Category chip */}
        <span
          className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.52rem] uppercase tracking-widest"
          style={{ background: `${color}18`, color: color }}
        >
          {meta.label}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-display text-sm leading-snug tracking-tight md:text-base"
        style={{ color: "var(--fg)" }}
      >
        {trophy.title}
      </h3>

      {/* Detail */}
      <p className="mt-1.5 font-mono text-[0.68rem] leading-relaxed text-[var(--muted)]">
        {trophy.detail}
      </p>

      {/* Bottom shimmer in cat colour */}
      <div
        className="absolute inset-x-0 bottom-0 h-px translate-y-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }}
        aria-hidden
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TIMELINE view — grouped by year with a vertical spine
───────────────────────────────────────────────────────────── */

function TimelineDot({ color }: { color: string }) {
  return (
    <div
      className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2"
      style={{ borderColor: color, background: "var(--bg)", boxShadow: `0 0 12px ${color}44` }}
    >
      <div className="size-2.5 rounded-full" style={{ background: color }} />
    </div>
  );
}

function TimelineView({ trophies }: { trophies: Trophy[] }) {
  // Group by year in canonical order
  const groups = useMemo(() => {
    const map = new Map<string, Trophy[]>();
    for (const t of trophies) {
      const existing = map.get(t.year);
      if (existing) {
        existing.push(t);
      } else {
        map.set(t.year, [t]);
      }
    }
    // Sort years
    const entries = Array.from(map.entries()).sort(
      ([ya], [yb]) => yearKey(ya) - yearKey(yb),
    );
    return entries;
  }, [trophies]);

  // Dominant colour per year group (most common category)
  function groupColor(items: Trophy[]): string {
    const counts: Partial<Record<TrophyCat, number>> = {};
    for (const t of items) {
      counts[t.cat] = (counts[t.cat] ?? 0) + 1;
    }
    const dominant = (Object.entries(counts) as [TrophyCat, number][]).sort(
      ([, a], [, b]) => b - a,
    )[0][0];
    return CAT_META[dominant].color;
  }

  return (
    <div className="relative">
      {/* Vertical spine */}
      <div
        className="pointer-events-none absolute left-[15px] top-0 bottom-0 w-px"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--accent) 8%, var(--line) 90%, transparent)",
          opacity: 0.4,
        }}
        aria-hidden
      />

      <div className="flex flex-col gap-14 pl-12">
        <AnimatePresence mode="popLayout">
          {groups.map(([year, items], gi) => {
            const color = groupColor(items);
            return (
              <motion.div
                key={year}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.4, ease: EASE, delay: gi * 0.04 }}
                className="relative"
              >
                {/* Dot on spine */}
                <div className="absolute -left-12 top-0 flex items-start">
                  <TimelineDot color={color} />
                </div>

                {/* Year label */}
                <div className="mb-5 flex items-baseline gap-4">
                  <h3
                    className="font-display text-2xl md:text-3xl leading-none tracking-tight"
                    style={{ color }}
                  >
                    {year}
                  </h3>
                  <span className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
                    {items.length} {items.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                {/* Cards grid for this year */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((t, i) => (
                    <TrophyCard
                      key={`${t.year}-${t.title}`}
                      trophy={t}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DOMAIN view — grouped by category
───────────────────────────────────────────────────────────── */

function DomainView({ trophies }: { trophies: Trophy[] }) {
  const groups = useMemo(() => {
    return ALL_CATS.map((cat) => ({
      cat,
      meta: CAT_META[cat],
      items: sortTrophies(trophies.filter((t) => t.cat === cat)),
    })).filter((g) => g.items.length > 0);
  }, [trophies]);

  return (
    <div className="flex flex-col gap-12">
      <AnimatePresence mode="popLayout">
        {groups.map((group, gi) => (
          <motion.div
            key={group.cat}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: EASE, delay: gi * 0.05 }}
          >
            {/* Domain header */}
            <div
              className="mb-5 flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: `${group.meta.color}10`, border: `1px solid ${group.meta.color}28` }}
            >
              <div
                className="flex size-8 items-center justify-center rounded-lg"
                style={{ background: `${group.meta.color}22` }}
              >
                <CatIcon cat={group.cat} color={group.meta.color} size={17} />
              </div>
              <h3
                className="font-display text-xl md:text-2xl leading-none tracking-tight"
                style={{ color: group.meta.color }}
              >
                {group.meta.label}
              </h3>
              <span
                className="ml-auto font-mono text-[0.58rem] uppercase tracking-widest"
                style={{ color: `${group.meta.color}aa` }}
              >
                {group.items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((t, i) => (
                <TrophyCard key={`${t.year}-${t.title}`} trophy={t} index={i} />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Colour legend strip (always visible)
───────────────────────────────────────────────────────────── */

function ColourLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {ALL_CATS.map((cat) => {
        const meta = CAT_META[cat];
        return (
          <div key={cat} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2 rounded-full"
              style={{ background: meta.color }}
              aria-hidden
            />
            <span className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)]">
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */

export function TrophyCase() {
  const [activeFilter, setActiveFilter] = useState<FilterCat>("all");
  const [view, setView] = useState<ViewMode>("timeline");

  // Filtered + sorted trophies
  const filtered = useMemo(() => {
    const base =
      activeFilter === "all"
        ? TROPHIES
        : TROPHIES.filter((t) => t.cat === activeFilter);
    return sortTrophies(base);
  }, [activeFilter]);

  function countFor(cat: FilterCat): number {
    if (cat === "all") return TROPHIES.length;
    return TROPHIES.filter((t) => t.cat === cat).length;
  }

  const activeCatColor =
    activeFilter !== "all" ? CAT_META[activeFilter].color : null;

  return (
    <section className="border-b border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">

        {/* ── Section header ──────────────────────────────────── */}
        <Reveal className="mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Trophy Vault</p>
              <h2 className="mt-3 font-display text-[2rem] leading-[0.95] tracking-tight md:text-[3.2rem]">
                The archive.
              </h2>
              <p className="mt-2 font-mono text-xs text-[var(--muted)]">
                {filtered.length} of {TROPHIES.length} entries · across 7 domains
              </p>
            </div>

            {/* View toggle */}
            <div
              className="flex self-start items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg-2)] p-1 md:self-auto"
            >
              {(["timeline", "domain"] as const).map((mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setView(mode)}
                  data-cursor-hover
                  className={cn(
                    "rounded-full px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-widest transition-colors duration-200",
                    view === mode
                      ? "bg-[var(--accent)] text-[#0a0907]"
                      : "text-[var(--muted)] hover:text-[var(--fg)]",
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {mode === "timeline" ? "By Year" : "By Domain"}
                </motion.button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Colour legend ───────────────────────────────────── */}
        <Reveal delay={0.05} className="mb-8">
          <ColourLegend />
        </Reveal>

        {/* ── Filter pills ────────────────────────────────────── */}
        <Reveal delay={0.1} className="mb-12">
          <div className="flex flex-wrap gap-2">
            <FilterPill
              id="all"
              label="All"
              color={null}
              count={countFor("all")}
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
            {ALL_CATS.map((cat) => (
              <FilterPill
                key={cat}
                id={cat}
                label={CAT_META[cat].label}
                color={CAT_META[cat].color}
                count={countFor(cat)}
                active={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
              />
            ))}
          </div>
        </Reveal>

        {/* ── Active filter indicator ─────────────────────────── */}
        <AnimatePresence>
          {activeFilter !== "all" && activeCatColor && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="h-px flex-1" style={{ background: `${activeCatColor}44` }} />
              <span
                className="font-mono text-[0.6rem] uppercase tracking-widest"
                style={{ color: activeCatColor }}
              >
                Showing: {CAT_META[activeFilter as TrophyCat].label}
              </span>
              <button
                onClick={() => setActiveFilter("all")}
                data-cursor-hover
                className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
              >
                ✕ Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content ────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {view === "timeline" ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <TimelineView trophies={filtered} />
            </motion.div>
          ) : (
            <motion.div
              key="domain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <DomainView trophies={filtered} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ─────────────────────────────────────── */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center font-mono text-sm text-[var(--muted)]"
            >
              No entries in this category yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
