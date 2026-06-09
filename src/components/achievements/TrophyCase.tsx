"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TROPHIES, type Trophy } from "@/lib/data";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

/* ── Category config ─────────────────────────────────────── */

/** Only the cats that actually appear in TROPHIES data. */
type TrophyCat = "academic" | "research" | "civic" | "leadership" | "court";
type FilterCat = "all" | TrophyCat;

const CATS: { id: FilterCat; label: string }[] = [
  { id: "all",        label: "All" },
  { id: "academic",   label: "Academic" },
  { id: "research",   label: "Research" },
  { id: "civic",      label: "Civic" },
  { id: "leadership", label: "Leadership" },
  { id: "court",      label: "Court" },
];

const CAT_COLORS: Record<TrophyCat, { bg: string; text: string; dot: string }> = {
  academic:   { bg: "bg-amber-400/10",   text: "text-amber-300",   dot: "#fbbf24" },
  research:   { bg: "bg-teal-400/10",    text: "text-teal-300",    dot: "#2dd4bf" },
  civic:      { bg: "bg-rose-400/10",    text: "text-rose-300",    dot: "#fb7185" },
  leadership: { bg: "bg-purple-400/10",  text: "text-purple-300",  dot: "#c084fc" },
  court:      { bg: "bg-orange-400/10",  text: "text-orange-300",  dot: "#fb923c" },
};

/* ── Trophy SVG glyphs ───────────────────────────────────── */

function TrophyGlyph({ cat, size = 28 }: { cat: TrophyCat; size?: number }) {
  const color = CAT_COLORS[cat].dot;
  if (cat === "court") {
    // Basketball icon
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
        <circle cx="14" cy="14" r="11" stroke={color} strokeWidth="1.5" />
        <path d="M14 3 C14 3 10 9 10 14 C10 19 14 25 14 25" stroke={color} strokeWidth="1.2" />
        <path d="M14 3 C14 3 18 9 18 14 C18 19 14 25 14 25" stroke={color} strokeWidth="1.2" />
        <path d="M3 14 L25 14" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }
  if (cat === "civic") {
    // Film / camera icon
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="3" y="7" width="22" height="14" rx="2" stroke={color} strokeWidth="1.5" />
        <circle cx="14" cy="14" r="4" stroke={color} strokeWidth="1.2" />
        <circle cx="14" cy="14" r="1.5" fill={color} />
        <rect x="7" y="7" width="1.5" height="3" fill={color} rx="0.5" />
        <rect x="12" y="7" width="1.5" height="3" fill={color} rx="0.5" />
        <rect x="17" y="7" width="1.5" height="3" fill={color} rx="0.5" />
        <rect x="7" y="18" width="1.5" height="3" fill={color} rx="0.5" />
        <rect x="12" y="18" width="1.5" height="3" fill={color} rx="0.5" />
        <rect x="17" y="18" width="1.5" height="3" fill={color} rx="0.5" />
      </svg>
    );
  }
  if (cat === "research") {
    // DNA / flask icon
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
        <path d="M10 4 L10 12 L18 20 L18 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 4 L18 12 L10 20 L10 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 9 L20 9" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 19 L20 19" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (cat === "leadership") {
    // Star / crown icon
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
        <path
          d="M14 5 L16.5 11.5 L23.5 11.5 L17.8 15.8 L20 22.5 L14 18.5 L8 22.5 L10.2 15.8 L4.5 11.5 L11.5 11.5 Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // academic — trophy cup
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M9 4 H19 V14 C19 18.4 16.3 20 14 20 C11.7 20 9 18.4 9 14 Z" stroke={color} strokeWidth="1.5" />
      <path d="M19 7 C22 7 24 9 24 11.5 C24 14 22 15.5 19 15" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 7 C6 7 4 9 4 11.5 C4 14 6 15.5 9 15" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11 20 L11 23 L17 23 L17 20" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 23 L20 23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Single trophy vitrine card ──────────────────────────── */

/** All trophy data uses only these cats — safe to cast. */
function asTrophyCat(cat: Trophy["cat"]): TrophyCat {
  return cat as TrophyCat;
}

function TrophyCard({ trophy }: { trophy: Trophy }) {
  const cat = asTrophyCat(trophy.cat);
  const colors = CAT_COLORS[cat];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 12 }}
      transition={{ duration: 0.4, ease: EASE }}
      data-cursor-hover
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--line)]",
        "bg-[var(--bg-2)] p-5 md:p-6",
        "transition-shadow duration-300",
        "hover:shadow-[0_0_32px_-4px_rgba(231,200,115,0.18)]",
      )}
    >
      {/* Shine sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(231,200,115,0.07) 50%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Top row: glyph + year + category tag */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--line)]"
            style={{ background: "rgba(231,200,115,0.06)" }}
          >
            <TrophyGlyph cat={cat} size={22} />
          </div>

          {/* Year pill */}
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            {trophy.year}
          </span>
        </div>

        {/* Category chip */}
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest",
            colors.bg,
            colors.text,
          )}
        >
          {cat}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-4 font-display text-base leading-snug tracking-tight text-[var(--fg)] transition-colors duration-300 md:text-lg">
        {trophy.title}
      </h3>

      {/* Detail */}
      <p className="mt-1.5 font-mono text-xs leading-relaxed text-[var(--muted)]">
        {trophy.detail}
      </p>

      {/* Bottom border shimmer on hover */}
      <div
        className="absolute inset-x-0 bottom-0 h-px translate-y-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
        aria-hidden
      />
    </motion.div>
  );
}

/* ── Filter button ───────────────────────────────────────── */

function FilterPill({
  cat,
  active,
  count,
  onClick,
}: {
  cat: FilterCat;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      data-cursor-hover
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest transition-colors duration-200",
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[#0a0907]"
          : "border-[var(--line)] bg-[var(--bg-2)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--fg)]",
      )}
    >
      {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
      <span
        className={cn(
          "inline-flex size-4 items-center justify-center rounded-full text-[0.55rem] font-bold",
          active ? "bg-[rgba(0,0,0,0.18)] text-[#0a0907]" : "bg-[var(--line)] text-[var(--muted)]",
        )}
      >
        {count}
      </span>
    </motion.button>
  );
}

/* ── Main export ─────────────────────────────────────────── */

export function TrophyCase() {
  const [active, setActive] = useState<FilterCat>("all");

  const sorted = [...TROPHIES].sort((a, b) => Number(a.year) - Number(b.year));

  const filtered =
    active === "all" ? sorted : sorted.filter((t) => t.cat === active);

  function countFor(cat: FilterCat) {
    if (cat === "all") return TROPHIES.length;
    return TROPHIES.filter((t) => t.cat === cat).length;
  }

  return (
    <section className="border-b border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-9 md:py-32">
        {/* Section header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Trophy Case</p>
            <h2 className="mt-3 font-display text-[2rem] leading-[0.95] tracking-tight md:text-[3.2rem]">
              The receipts.
            </h2>
          </div>

          {/* Count badge */}
          <p className="font-mono text-xs text-[var(--muted)]">
            <span style={{ color: "var(--accent)" }}>{filtered.length}</span>
            {" "}/{" "}
            {TROPHIES.length} awards
          </p>
        </div>

        {/* Filter pills */}
        <div className="mb-10 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <FilterPill
              key={c.id}
              cat={c.id}
              active={active === c.id}
              count={countFor(c.id)}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>

        {/* Trophy grid */}
        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((trophy) => (
              <TrophyCard key={`${trophy.year}-${trophy.title}`} trophy={trophy} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state (shouldn't happen with current data) */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center font-mono text-sm text-[var(--muted)]"
            >
              No trophies in this category yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
