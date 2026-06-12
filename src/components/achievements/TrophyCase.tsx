"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
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
   Year ordering — parse the first 4-digit year; ranges sort
   by their start year so "2021–23" sorts with 2021.
───────────────────────────────────────────────────────────── */

function yearKey(year: string): number {
  // Match first 4-digit year string (handles "2021", "2021–23", "2023–26", etc.)
  const match = year.match(/\d{4}/);
  if (match) return parseInt(match[0], 10);
  // Legacy grade/label fallbacks (should not appear with new data, but keep safe)
  const LEGACY: Record<string, number> = {
    "Pre-HS": 2016,
    "Age 12": 2021,
    "7–8th": 2021,
    "8th": 2022,
    "9th": 2023,
    "10th": 2024,
    "Ongoing": 2099,
  };
  return LEGACY[year] ?? 2050;
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
          ? "border-transparent text-white"
          : "border-[var(--line)] bg-[#fffdf7] text-[var(--muted)] hover:text-[var(--fg)]",
      )}
      style={
        active
          ? {
              background: color ?? "var(--accent)",
              borderColor: "transparent",
              boxShadow: `0 2px 8px ${color ? `${color}44` : "rgba(176,124,30,0.3)"}`,
            }
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
          active ? "bg-black/20 text-white" : "bg-[var(--line)] text-[var(--muted)]",
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
   Trophy card — cream cards with coloured left border on ivory
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
      className="group relative overflow-hidden rounded-xl p-4 md:p-5 transition-shadow duration-300"
      style={{
        background: "#fffdf7",
        borderTop: "1px solid rgba(34,28,16,0.08)",
        borderRight: "1px solid rgba(34,28,16,0.08)",
        borderBottom: "1px solid rgba(34,28,16,0.08)",
        borderLeft: `3px solid ${color}`,
        boxShadow: "0 2px 10px rgba(34,28,16,0.05)",
      }}
    >
      {/* Hover shine in category colour — subtle on light bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(115deg, transparent 30%, ${color}08 50%, transparent 70%)`,
        }}
        aria-hidden
      />

      {/* Hover: warm shadow lift */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 8px 24px rgba(34,28,16,0.10), 0 2px 6px ${color}20` }}
        aria-hidden
      />

      {/* Top row: icon + year */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Category icon */}
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${color}14`, border: `1px solid ${color}28` }}
          >
            <CatIcon cat={trophy.cat} color={color} size={15} />
          </div>

          {/* Year */}
          <span
            className="font-mono text-[0.58rem] uppercase tracking-[0.22em]"
            style={{ color }}
          >
            {trophy.year}
          </span>
        </div>

        {/* Category chip */}
        <span
          className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.52rem] uppercase tracking-widest"
          style={{ background: `${color}14`, color }}
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
        style={{ background: `linear-gradient(90deg, transparent, ${color}66, transparent)` }}
        aria-hidden
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   "The shape of six years" — Year Skyline
   Stacked bars per year colored by category, animate on scroll.
───────────────────────────────────────────────────────────── */

type YearBar = {
  year: string;
  total: number;
  segments: { cat: TrophyCat; count: number; color: string }[];
};

function buildYearBars(): YearBar[] {
  // Collect unique years in sorted order
  const yearSet = new Set<string>();
  for (const t of TROPHIES) yearSet.add(t.year);

  const years = Array.from(yearSet).sort((a, b) => yearKey(a) - yearKey(b));

  return years.map((year) => {
    const items = TROPHIES.filter((t) => t.year === year);
    const catCounts: Partial<Record<TrophyCat, number>> = {};
    for (const t of items) {
      catCounts[t.cat] = (catCounts[t.cat] ?? 0) + 1;
    }
    const segments = ALL_CATS.filter((c) => (catCounts[c] ?? 0) > 0).map((cat) => ({
      cat,
      count: catCounts[cat]!,
      color: CAT_META[cat].color,
    }));
    return { year, total: items.length, segments };
  });
}

const YEAR_BARS = buildYearBars();
const MAX_TOTAL = Math.max(...YEAR_BARS.map((b) => b.total));
const BAR_MAX_HEIGHT = 160; // px

function YearSkyline({
  onYearClick,
}: {
  onYearClick: (year: string) => void;
}) {
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "start 30%"],
  });
  const barOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <div ref={containerRef} className="mt-16 mb-14">
      <Reveal>
        <p className="eyebrow mb-1">The shape of six years</p>
        <p className="font-mono text-[0.65rem] text-[var(--muted)] mb-8">
          Entries per year, stacked by domain — click a year to filter the archive below.
        </p>
      </Reveal>

      <motion.div
        style={{ opacity: barOpacity }}
        className="flex items-end gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide"
      >
        {YEAR_BARS.map((bar, bi) => {
          const totalHeight = (bar.total / MAX_TOTAL) * BAR_MAX_HEIGHT;
          const isHovered = hoveredYear === bar.year;

          return (
            <div
              key={bar.year}
              className="flex flex-col items-center gap-2 min-w-[40px] sm:min-w-[52px] md:min-w-[64px]"
            >
              {/* Hover tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="pointer-events-none whitespace-nowrap rounded-md px-2.5 py-1.5 text-white"
                    style={{
                      background: "var(--fg)",
                      boxShadow: "0 4px 12px rgba(34,28,16,0.15)",
                    }}
                  >
                    <span className="font-mono text-[0.58rem] font-bold">
                      {bar.year}: {bar.total} {bar.total === 1 ? "entry" : "entries"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stacked bar */}
              <button
                data-cursor-hover
                onClick={() => onYearClick(bar.year)}
                onMouseEnter={() => setHoveredYear(bar.year)}
                onMouseLeave={() => setHoveredYear(null)}
                onFocus={() => setHoveredYear(bar.year)}
                onBlur={() => setHoveredYear(null)}
                className="relative flex w-full flex-col-reverse overflow-hidden rounded-t focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  height: `${BAR_MAX_HEIGHT}px`,
                  cursor: "pointer",
                }}
                aria-label={`${bar.year}: ${bar.total} entries — click to filter`}
              >
                {/* Segments animate scaleY from bottom */}
                {bar.segments.map((seg, si) => {
                  const segHeight = (seg.count / MAX_TOTAL) * BAR_MAX_HEIGHT;
                  return (
                    <motion.div
                      key={seg.cat}
                      title={`${CAT_META[seg.cat].label}: ${seg.count}`}
                      style={{
                        height: `${segHeight}px`,
                        background: seg.color,
                        transformOrigin: "bottom center",
                        flexShrink: 0,
                        opacity: isHovered ? 1 : 0.85,
                        filter: isHovered ? "brightness(1.05)" : "none",
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                        delay: bi * 0.06 + si * 0.03,
                      }}
                    />
                  );
                })}

                {/* Hover overlay */}
                {isHovered && (
                  <div
                    className="absolute inset-0 rounded-t"
                    style={{ background: "rgba(34,28,16,0.07)" }}
                    aria-hidden
                  />
                )}
              </button>

              {/* Year label */}
              <span
                className="font-mono text-[0.52rem] uppercase tracking-wider"
                style={{ color: isHovered ? "var(--accent)" : "var(--muted)" }}
              >
                {bar.year.replace("–", "–")}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Color key */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {ALL_CATS.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2 shrink-0 rounded-sm"
              style={{ background: CAT_META[cat].color }}
              aria-hidden
            />
            <span className="font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)]">
              {CAT_META[cat].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TIMELINE view — grouped by year with a vertical spine
───────────────────────────────────────────────────────────── */

function TimelineDot({ color }: { color: string }) {
  return (
    <div
      className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2"
      style={{
        borderColor: color,
        background: "#fffdf7",
        boxShadow: `0 2px 8px ${color}30`,
      }}
    >
      <div className="size-2.5 rounded-full" style={{ background: color }} />
    </div>
  );
}

function TimelineView({
  trophies,
  focusYear,
}: {
  trophies: Trophy[];
  focusYear: string | null;
}) {
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
    const entries = Array.from(map.entries()).sort(([ya], [yb]) => yearKey(ya) - yearKey(yb));
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
    )[0][0] as TrophyCat;
    return CAT_META[dominant].color;
  }

  return (
    <div className="relative">
      {/* Vertical spine */}
      <div
        className="pointer-events-none absolute left-[15px] top-0 bottom-0 w-px"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(176,124,30,0.35) 8%, rgba(34,28,16,0.12) 90%, transparent)",
        }}
        aria-hidden
      />

      <div className="flex flex-col gap-14 pl-12">
        <AnimatePresence mode="popLayout">
          {groups.map(([year, items], gi) => {
            const color = groupColor(items);
            const isFocused = focusYear === year;
            return (
              <motion.div
                key={year}
                layout
                id={`year-${year}`}
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
                    className={cn(
                      "font-display text-2xl md:text-3xl leading-none tracking-tight transition-colors duration-300",
                      isFocused ? "underline underline-offset-4" : "",
                    )}
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
              style={{
                background: `${group.meta.color}0c`,
                border: `1px solid ${group.meta.color}22`,
              }}
            >
              <div
                className="flex size-8 items-center justify-center rounded-lg"
                style={{ background: `${group.meta.color}18` }}
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
                style={{ color: `${group.meta.color}99` }}
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
   Colour legend strip
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
  const [focusYear, setFocusYear] = useState<string | null>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

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
    activeFilter !== "all" ? CAT_META[activeFilter as TrophyCat].color : null;

  // Handle year click from skyline
  const handleYearClick = useCallback((year: string) => {
    // Switch to timeline view & scroll to that year
    setView("timeline");
    setActiveFilter("all");
    setFocusYear(year);

    // Scroll to archive section
    if (archiveRef.current) {
      archiveRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // After scroll, scroll to the year group element
    setTimeout(() => {
      const el = document.getElementById(`year-${year}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Clear focus highlight after a moment
      setTimeout(() => setFocusYear(null), 1800);
    }, 400);
  }, []);

  return (
    <section className="border-b border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">

        {/* ── Year Skyline graphic ─────────────────────────────── */}
        <YearSkyline onYearClick={handleYearClick} />

        {/* ── Section header ──────────────────────────────────── */}
        <Reveal className="mb-10" >
          <div ref={archiveRef} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">the archive</p>
              <h2 className="mt-3 font-display text-[2rem] leading-[0.95] tracking-tight md:text-[3.2rem]">
                Every experience and achievement.
              </h2>
              <p className="mt-2 font-mono text-xs text-[var(--muted)]">
                {filtered.length} of {TROPHIES.length} entries · across 7 domains
              </p>
            </div>

            {/* View toggle */}
            <div
              className="flex self-start items-center gap-1 rounded-full border border-[var(--line)] p-1 md:self-auto"
              style={{ background: "#fffdf7" }}
            >
              {(["timeline", "domain"] as const).map((mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setView(mode)}
                  data-cursor-hover
                  className={cn(
                    "rounded-full px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-widest transition-colors duration-200",
                    view === mode
                      ? "text-white"
                      : "text-[var(--muted)] hover:text-[var(--fg)]",
                  )}
                  style={
                    view === mode
                      ? { background: "var(--accent)", boxShadow: "0 2px 6px rgba(176,124,30,0.3)" }
                      : {}
                  }
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
              <div className="h-px flex-1" style={{ background: `${activeCatColor}33` }} />
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
              <TimelineView trophies={filtered} focusYear={focusYear} />
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
