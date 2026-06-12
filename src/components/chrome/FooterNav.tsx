"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SENTENCE_DOORS } from "@/lib/data";
import { asset } from "@/lib/base";
import { startWorldTransition, WORLD_NAV_DELAY_MS } from "@/lib/transition";

type Door = (typeof SENTENCE_DOORS)[keyof typeof SENTENCE_DOORS];

const DOORS: Door[] = Object.values(SENTENCE_DOORS);

const EXTRAS = [
  { label: "Trophy Case", href: "/achievements" },
  { label: "Albums", href: "/albums" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * End-of-page navigator: every other chapter as a mini film frame (clicks ride
 * the same per-world transitions as the menu), plus the utility pages. Lives
 * inside Footer, so every page that closes with a Footer gets it for free.
 */
export function FooterNav() {
  const pathname = usePathname();
  const current = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const router = useRouter();
  const navigating = useRef(false);

  const doors = DOORS.filter((d) => d.href !== current);
  const extras = EXTRAS.filter((e) => e.href !== current);

  const go = (e: React.MouseEvent, door: Door) => {
    e.preventDefault();
    if (navigating.current) return;
    navigating.current = true;
    startWorldTransition(door.id);
    window.setTimeout(() => router.push(door.href), WORLD_NAV_DELAY_MS);
  };

  return (
    <nav aria-label="Continue to another chapter" className="mb-14">
      <p className="eyebrow">Where to next</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {doors.map((door) => (
          <Link
            key={door.id}
            href={door.href}
            data-cursor-hover
            onClick={(e) => go(e, door)}
            className="group block outline-none"
          >
            <span className="relative block aspect-[16/10] overflow-hidden rounded-[3px] border border-[var(--line)]">
              <img
                src={asset(door.photo)}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover saturate-[0.35] transition-[filter,transform] duration-500 group-hover:scale-[1.04] group-hover:saturate-100 group-focus-visible:saturate-100"
              />
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{ boxShadow: `inset 0 0 0 1.5px ${door.accent}` }}
              />
              <span className="absolute left-2 top-1.5 font-mono text-[0.55rem] tracking-[0.2em] text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                {door.num}
              </span>
            </span>
            <span className="mt-2 flex items-baseline justify-between gap-2">
              <span className="truncate font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--fg)]">{door.word}</span>
              <span className="shrink-0 font-mono text-[0.58rem] text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {extras.map((x) => (
          <Link
            key={x.href}
            href={x.href}
            data-cursor-hover
            className="border border-[var(--line)] bg-[var(--bg)]/40 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {x.label} →
          </Link>
        ))}
      </div>
    </nav>
  );
}
