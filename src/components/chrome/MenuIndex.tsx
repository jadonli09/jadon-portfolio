"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PROFILE, SENTENCE_DOORS } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";
import { startWorldTransition, WORLD_NAV_DELAY_MS } from "@/lib/transition";

type Door = (typeof SENTENCE_DOORS)[keyof typeof SENTENCE_DOORS];

const FRAMES: Door[] = Object.values(SENTENCE_DOORS);
/** Display order: the person opens the issue, then the chapters in num order. */
const ORDERED: Door[] = [
  ...FRAMES.filter((d) => d.id === "about"),
  ...FRAMES.filter((d) => d.id !== "about"),
];

/** Page-preview screenshot (1280×800) for each chapter. */
const previewOf = (id: string) => `/img/previews/${id}.jpg`;
const nameOf = (d: Door) => d.word[0].toUpperCase() + d.word.slice(1);

const UTILITY = [
  { label: "Home", href: "/" },
  { label: "Milestones", href: "/milestones" },
  { label: "Albums", href: "/albums" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * The menu as a magazine contents page: a numbered index of the seven chapters
 * on the left, one large spread on the right. Hovering or focusing a row swaps
 * the spread to that chapter's photo, with a screenshot of the page pinned over
 * its corner. On small screens the spread drops away and each row carries a
 * thumbnail instead.
 */
export function MenuIndex({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  /** trailingSlash builds report "/court/" while door hrefs are "/court"; the length guard keeps root "/" intact. */
  const current =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  const router = useRouter();
  const listRef = useRef<HTMLOListElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  /** A click already queued navigation — ignore further clicks. */
  const navigating = useRef(false);

  const [activeId, setActiveId] = useState<string>(
    () => ORDERED.find((d) => d.href === current)?.id ?? ORDERED[0].id,
  );
  const active = ORDERED.find((d) => d.id === activeId) ?? ORDERED[0];

  /** Kick off the destination world's transition, then navigate once the screen is covered. */
  const onNavigate = (e: React.MouseEvent, door: Door) => {
    e.preventDefault();
    if (current === door.href) return onClose();
    if (navigating.current) return;
    navigating.current = true;
    startWorldTransition(door.id);
    window.setTimeout(() => router.push(door.href), WORLD_NAV_DELAY_MS);
  };

  /** Esc closes; Tab is trapped inside the dialog; ↑/↓ move through the index. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Tab") {
      const all = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);
      if (!all.length) return;
      const first = all[0];
      const last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(
      listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
    );
    if (!links.length) return;
    e.preventDefault();
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      links[
        (i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length
      ];
    next.focus();
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      onKeyDown={onKeyDown}
      data-lenis-prevent
      className="fixed inset-0 z-[45] overflow-y-auto bg-[#120e0c] text-[#f4efe6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {/* the active chapter's colour, as a soft wash behind the spread */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 transition-[background] duration-700"
        style={{
          background: `radial-gradient(60% 70% at 78% 50%, ${active.accent}2e, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto flex min-h-full max-w-[1500px] flex-col px-5 pb-8 pt-20 md:px-9 lg:flex-row lg:items-center lg:gap-[5vw] lg:pb-10 lg:pt-24">
        {/* ── the index ── */}
        <nav
          aria-label="Chapters"
          className="flex flex-col lg:w-[44%] lg:shrink-0"
        >
          <ol ref={listRef} className="flex flex-col">
            {ORDERED.map((door, i) => {
              const isCurrent = current === door.href;
              const isActive = door.id === active.id;
              return (
                <motion.li
                  key={door.id}
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.08 + i * 0.045,
                    duration: 0.6,
                    ease: EASE,
                  }}
                  className="border-b border-white/10 first:border-t"
                >
                  <Link
                    href={door.href}
                    data-cursor-hover
                    onClick={(e) => onNavigate(e, door)}
                    onMouseEnter={() => setActiveId(door.id)}
                    onFocus={() => setActiveId(door.id)}
                    aria-current={isCurrent ? "page" : undefined}
                    className="group flex min-h-16 items-center gap-4 py-2 outline-none lg:min-h-0 lg:gap-5 lg:py-[0.9svh]"
                  >
                    {/* thumbnail stands in for the spread on small screens */}
                    <img
                      src={asset(door.photo)}
                      alt=""
                      className="size-14 shrink-0 rounded-[3px] object-cover lg:hidden"
                    />
                    <span
                      className="hidden w-8 shrink-0 font-grotesk text-[15px] font-semibold tabular-nums transition-colors duration-300 lg:block"
                      style={{
                        color: isActive ? door.color : "rgba(244,239,230,0.4)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-anton text-[2rem] uppercase leading-none tracking-[0.005em] transition-[color,translate] duration-300 lg:text-[min(4.3vw,6.4svh)] ${
                        isActive
                          ? "text-[#f4efe6] lg:translate-x-2"
                          : "text-[#f4efe6] lg:text-[#f4efe6]/45 lg:group-focus-visible:text-[#f4efe6]"
                      }`}
                    >
                      {nameOf(door)}
                    </span>
                    {isCurrent && (
                      <span className="ml-auto shrink-0 rounded-full border border-white/20 px-3 py-1 text-sm text-[#f4efe6]/75">
                        You&rsquo;re here
                      </span>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ol>

          {/* utility pages — same type, one row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="-ml-4 mt-6 flex flex-wrap items-center gap-x-1 gap-y-1 lg:mt-[3svh]"
          >
            {UTILITY.map((u) => {
              const here = current === u.href;
              return (
                <Link
                  key={u.href}
                  href={u.href}
                  data-cursor-hover
                  onClick={
                    here
                      ? (e) => {
                          e.preventDefault();
                          onClose();
                        }
                      : undefined
                  }
                  aria-current={here ? "page" : undefined}
                  className={`flex h-14 items-center rounded-full px-4 text-[17px] font-medium transition-colors hover:bg-white/[0.07] hover:text-[#f4efe6] ${
                    here
                      ? "text-[#f4efe6] underline decoration-[#c43e2c] decoration-2 underline-offset-[6px]"
                      : "text-[#f4efe6]/70"
                  }`}
                >
                  {u.label}
                </Link>
              );
            })}
            <a
              href={PROFILE.links.instagram}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="flex h-14 items-center rounded-full px-4 text-[17px] font-medium text-[#f4efe6]/70 transition-colors hover:bg-white/[0.07] hover:text-[#f4efe6]"
            >
              {PROFILE.links.instagramHandle}
            </a>
          </motion.div>
        </nav>

        {/* ── the spread (large screens) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
          className="relative hidden flex-1 lg:block"
        >
          <div className="mx-auto w-full max-w-[calc(62svh*4/3)]">
            <Link
              href={active.href}
              data-cursor-hover
              onClick={(e) => onNavigate(e, active)}
              tabIndex={-1}
              aria-hidden
              className="relative block aspect-[4/3] w-full"
            >
              {/* chapter photos, stacked and crossfaded (CSS, so fast hovering never piles up exits) */}
              <div className="absolute inset-0 overflow-hidden rounded-[4px] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                {ORDERED.map((door) => (
                  <img
                    key={door.id}
                    src={asset(door.photo)}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-500 ease-out ${
                      door.id === active.id
                        ? "scale-100 opacity-100"
                        : "scale-[1.04] opacity-0"
                    }`}
                  />
                ))}
              </div>

              {/* the page itself, pinned over the lower-left corner */}
              <div className="absolute -bottom-[7%] -left-[6%] aspect-[16/10] w-[50%] overflow-hidden rounded-[4px] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/15">
                {ORDERED.map((door) => (
                  <img
                    key={door.id}
                    src={asset(previewOf(door.id))}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,translate] duration-500 ease-out ${
                      door.id === active.id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    }`}
                  />
                ))}
              </div>
            </Link>

            {/* one shared caption that swaps with the spread */}
            <p
              key={active.id}
              className="ml-[48%] mt-4 max-w-[34ch] animate-[menu-cap_0.45s_ease-out] text-[17px] leading-snug text-[#f4efe6]/80"
            >
              {active.peek}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
