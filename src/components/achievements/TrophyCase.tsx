"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TROPHIES, CAT_META, type TrophyCat, type Trophy } from "@/lib/data";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/primitives/Reveal";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */

type FilterCat = "all" | TrophyCat;

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

/** Single-year labels, oldest → newest — the second filter axis (year chips).
 *  Range labels like "2021–23" are left out so the chips stay clean. */
const YEARS: string[] = Array.from(new Set(TROPHIES.map((t) => t.year)))
  .filter((y) => /^\d{4}$/.test(y))
  .sort((a, b) => yearKey(a) - yearKey(b));

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
        "relative flex items-center gap-2.5 rounded-full border px-5 py-2.5",
        "font-mono text-[0.72rem] uppercase tracking-widest",
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
          className="inline-block size-2 shrink-0 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
      )}
      {label}
      <span
        className={cn(
          "inline-flex min-w-[1.45rem] items-center justify-center rounded-full px-1.5 text-[0.6rem] font-bold",
          active ? "bg-black/20 text-white" : "bg-[var(--line)] text-[var(--muted)]",
        )}
      >
        {count}
      </span>
    </motion.button>
  );
}

/* -------------------------------------------------------------
   CONSTELLATION — the archive as an interactive star-field.
   Every entry is a star, packed into an organic phyllotaxis
   cluster and coloured by domain; dot size reflects how impressive the
   entry is. Filtering by domain (pills) or year (chips) lights up the
   matching stars and wires them together; hover or tap any star to read it.
------------------------------------------------------------- */

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const VB = 600; // square viewBox
const VC = VB / 2;

/** Deterministic [0,1) value from an integer — stable across SSR/CSR. */
function hash01(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Round to 3 decimals so SVG coordinates serialize to identical strings on the
 * server and the client. Raw trig floats (17 sig-digits) hydrate-mismatch because
 * React's SSR formats them to 16 digits; 3 decimals is sub-pixel here (viewBox 600
 * mapped to ≤560px) yet renders pixel-for-pixel the same.
 */
const r3 = (v: number) => Math.round(v * 1000) / 1000;

type Star = { t: Trophy; x: number; y: number; r: number; color: string };

/** Phyllotaxis layout over the full, year-sorted archive (computed once). */
const STARS: Star[] = (() => {
  const list = sortTrophies(TROPHIES);
  const n = list.length;
  const spacing = (VB * 0.43) / Math.sqrt(n);
  return list.map((t, i) => {
    const jitterR = 1 + (hash01(i) - 0.5) * 0.14;
    const jitterA = (hash01(i + 91) - 0.5) * 0.22;
    const rad = spacing * Math.sqrt(i + 0.5) * jitterR;
    const theta = i * GOLDEN_ANGLE + jitterA;
    return {
      t,
      x: r3(VC + rad * Math.cos(theta)),
      y: r3(VC + rad * Math.sin(theta)),
      // dot size reflects how impressive the entry is (weight 1…5), not chance
      r: 4 + t.w * 1.7,
      color: CAT_META[t.cat].color,
    };
  });
})();

type Seg = { x1: number; y1: number; x2: number; y2: number; color: string };

/**
 * Minimum spanning tree (Prim's) over the active stars. The active set is always
 * one real group — every star shares the selected domain, or the selected year —
 * so the MST wires that whole group into a single connected constellation
 * (n−1 shortest edges, every star reachable, no stray fragments). The links mean
 * "these belong together," which is exactly what's true of the filtered set.
 */
function mstSegments(act: Star[]): Seg[] {
  const n = act.length;
  if (n < 2) return [];
  const inTree = new Array<boolean>(n).fill(false);
  const segs: Seg[] = [];
  inTree[0] = true;
  for (let added = 1; added < n; added++) {
    let bi = -1;
    let bj = -1;
    let bestD = Infinity;
    for (let i = 0; i < n; i++) {
      if (!inTree[i]) continue;
      for (let j = 0; j < n; j++) {
        if (inTree[j]) continue;
        const dx = act[i].x - act[j].x;
        const dy = act[i].y - act[j].y;
        const d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; bi = i; bj = j; }
      }
    }
    if (bj < 0) break;
    inTree[bj] = true;
    segs.push({ x1: act[bi].x, y1: act[bi].y, x2: act[bj].x, y2: act[bj].y, color: act[bj].color });
  }
  return segs;
}

function ConstellationView({
  activeFilter,
  focusYear,
}: {
  activeFilter: FilterCat;
  focusYear: string | null;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  const isActive = (t: Trophy) =>
    (activeFilter === "all" || t.cat === activeFilter) &&
    (focusYear === null || t.year === focusYear);
  const anyFilter = activeFilter !== "all" || focusYear !== null;

  const activeStars = STARS.filter((s) => isActive(s.t));
  const lines = anyFilter ? mstSegments(activeStars) : [];

  const detailIdx = pinned ?? hovered;
  const detail = detailIdx !== null ? STARS[detailIdx] : null;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="Constellation of every experience and achievement, coloured by domain"
      >
        {lines.map((seg, i) => (
          <line key={i} x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke={seg.color} strokeWidth={0.7} strokeOpacity={0.4} />
        ))}
        {STARS.map((s, i) => {
          const act = isActive(s.t);
          const isFocus = detailIdx === i;
          const scale = isFocus ? 1.8 : act ? 1.2 : 0.66;
          const opacity = act ? 1 : anyFilter ? 0.13 : 0.72;
          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              onClick={() => setPinned((pp) => (pp === i ? null : i))}
            >
              {(act || isFocus) && (
                <circle cx={s.x} cy={s.y} r={s.r * scale * 1.9} fill={s.color} opacity={isFocus ? 0.3 : 0.13} />
              )}
              <circle
                cx={s.x}
                cy={s.y}
                r={s.r * scale}
                fill={s.color}
                opacity={opacity}
                stroke={isFocus ? "#fffdf7" : "transparent"}
                strokeWidth={isFocus ? 1.6 : 0}
                style={{ transition: "r 0.25s ease, opacity 0.25s ease" }}
              />
              <circle cx={s.x} cy={s.y} r={Math.max(s.r * scale + 9, 15)} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {detail && (
        <div
          // edge-aware: left-third dots grow right, right-third grow left, middle centred —
          // so the card never runs off a narrow phone screen.
          className="pointer-events-none absolute z-10 w-[180px] sm:w-[210px]"
          style={{
            left: `${(detail.x / VB) * 100}%`,
            top: `${(detail.y / VB) * 100}%`,
            transform: `translate(${detail.x < VB * 0.34 ? "0%" : detail.x > VB * 0.66 ? "-100%" : "-50%"}, ${detail.y > VC ? "calc(-100% - 14px)" : "14px"})`,
          }}
        >
          <div
            className="rounded-lg p-3 text-left"
            style={{
              background: "#fffdf7",
              border: `1px solid ${detail.color}33`,
              borderLeft: `3px solid ${detail.color}`,
              boxShadow: "0 10px 30px rgba(34,28,16,0.18)",
            }}
          >
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em]" style={{ color: detail.color }}>
              {detail.t.year} · {CAT_META[detail.t.cat].label}
            </span>
            <p className="mt-1 font-display text-sm leading-snug" style={{ color: "var(--fg)" }}>
              {detail.t.title}
            </p>
            <p className="mt-1 font-mono text-[0.62rem] leading-relaxed text-[var(--muted)]">
              {detail.t.detail}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */

export function TrophyCase() {
  const [activeFilter, setActiveFilter] = useState<FilterCat>("all");
  const [focusYear, setFocusYear] = useState<string | null>(null);

  // Filtered + sorted trophies — domain pill AND year chip.
  const filtered = useMemo(() => {
    const base = TROPHIES.filter(
      (t) =>
        (activeFilter === "all" || t.cat === activeFilter) &&
        (focusYear === null || t.year === focusYear),
    );
    return sortTrophies(base);
  }, [activeFilter, focusYear]);

  function countFor(cat: FilterCat): number {
    if (cat === "all") return TROPHIES.length;
    return TROPHIES.filter((t) => t.cat === cat).length;
  }

  const activeCatColor =
    activeFilter !== "all" ? CAT_META[activeFilter as TrophyCat].color : null;
  const anyFilter = activeFilter !== "all" || focusYear !== null;

  return (
    <section className="border-b border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-9 md:py-24">

        {/* Section header */}
        <Reveal className="mb-10">
          <div>
            <p className="eyebrow">the archive</p>
            <h2 className="mt-3 font-display text-[2rem] leading-[0.95] tracking-tight md:text-[3.2rem]">
              Every experience and achievement.
            </h2>
            <p className="mt-2 max-w-xl font-mono text-xs leading-relaxed text-[var(--muted)]">
              {TROPHIES.length} entries · 7 domains, as one constellation. Bigger star, bigger accomplishment — hover one to read it, and filter by domain or year to light up its shape.
            </p>
          </div>
        </Reveal>

        {/* Tags on the left · constellation on the right */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">

          {/* LEFT — the tags */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8">
              {/* by domain */}
              <div>
                <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]/70">by domain</p>
                <div className="flex flex-wrap gap-2.5">
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
              </div>

              {/* by year */}
              <div>
                <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]/70">by year</p>
                <div className="flex flex-wrap gap-2.5">
                  {YEARS.map((y) => {
                    const active = focusYear === y;
                    return (
                      <button
                        key={y}
                        onClick={() => setFocusYear((p) => (p === y ? null : y))}
                        data-cursor-hover
                        aria-pressed={active}
                        className={cn(
                          "rounded-full border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-widest transition-all duration-200",
                          active
                            ? "border-transparent text-white"
                            : "border-[var(--line)] bg-[#fffdf7] text-[var(--muted)] hover:text-[var(--fg)]",
                        )}
                        style={active ? { background: "var(--accent)", boxShadow: "0 2px 8px rgba(176,124,30,0.3)" } : undefined}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* active filter + clear */}
              <AnimatePresence>
                {anyFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--line)] pt-5"
                  >
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">Showing</span>
                    {activeFilter !== "all" && activeCatColor && (
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: activeCatColor }}>
                        {CAT_META[activeFilter as TrophyCat].label}
                      </span>
                    )}
                    {focusYear && (
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">{focusYear}</span>
                    )}
                    <span className="font-mono text-[0.6rem] text-[var(--muted)]">
                      · {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
                    </span>
                    <button
                      onClick={() => { setActiveFilter("all"); setFocusYear(null); }}
                      data-cursor-hover
                      className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                    >
                      ✕ Clear
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* RIGHT — the constellation */}
          <Reveal delay={0.15}>
            <div>
              <ConstellationView activeFilter={activeFilter} focusYear={focusYear} />

              {/* Empty state — only reachable when domain ∩ year is empty */}
              <AnimatePresence>
                {anyFilter && filtered.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center font-mono text-sm text-[var(--muted)]"
                  >
                    No entries match that domain in that year.
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Hover-to-read hint */}
              <p className="mt-6 text-center font-mono text-[0.66rem] text-[var(--muted)]">
                Hover a star to read it · the bigger the dot, the bigger the accomplishment
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
