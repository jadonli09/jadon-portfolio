"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PROFILE, SENTENCE_DOORS } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

type Door = (typeof SENTENCE_DOORS)[keyof typeof SENTENCE_DOORS];

/** Insertion order is num order: 01 leads … 07 person. */
const FRAMES: Door[] = Object.values(SENTENCE_DOORS);

/**
 * Native aspect ratio of each door photo, as a static Tailwind class setting `--ar`
 * (it must be a class, not an inline style, so `group-hover:[--ar:1.6]` can override it).
 */
const ASPECT_CLASS: Record<string, string> = {
  leadership: "[--ar:1.5]",
  civic: "[--ar:1.333]",
  research: "[--ar:1.5]",
  built: "[--ar:1.333]",
  court: "[--ar:1.778]",
  lockedin: "[--ar:1.5]",
  about: "[--ar:1.333]",
};

/** Page-preview screenshot shown on hover (frames morph to its 16:10 aspect via `group-hover:[--ar:1.6]`). */
const previewOf = (id: string) => `/img/previews/${id}.jpg`;

const UTILITY = [
  { label: "Home", href: "/" },
  { label: "Trophy Case", href: "/achievements" },
  { label: "Albums", href: "/albums" },
  { label: "Contact", href: "/contact" },
] as const;

/** A row of sprocket holes punched through the film base. */
function PerfRow() {
  return (
    <div
      aria-hidden
      className="h-[18px] w-full border-y border-black/40 [background-image:radial-gradient(circle,#040407_0_3.5px,transparent_4.2px)] [background-position:11px_center] [background-repeat:repeat-x] [background-size:19px_18px]"
    />
  );
}

function FilmFrame({
  door,
  index,
  isCurrent,
  onNavigate,
}: {
  door: Door;
  index: number;
  isCurrent: boolean;
  onNavigate: (e: React.MouseEvent, door: Door) => void;
}) {
  const aspectClass = ASPECT_CLASS[door.id] ?? "[--ar:1.5]";
  return (
    <Link
      href={door.href}
      data-cursor-hover
      onClick={(e) => onNavigate(e, door)}
      aria-current={isCurrent ? "page" : undefined}
      className="group relative flex shrink-0 snap-center flex-col outline-none"
    >
      <motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12 + index * 0.05, duration: 0.6, ease: EASE }}
        className="flex flex-col"
      >
        <div
          className={`relative overflow-hidden rounded-[2px] bg-[#0b0b0f] transition-[width] duration-300 ease-out ${aspectClass} group-hover:[--ar:1.6] group-focus-visible:[--ar:1.6]`}
          style={{ height: "var(--fh)", width: "calc(var(--fh) * var(--ar))" }}
        >
          {/* the still — full image, frame matches its native aspect */}
          <img
            src={asset(door.photo)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
          />
          {/* the page preview — frame widens to its 16:10 aspect on hover, then zooms into the page on click */}
          <img
            src={asset(previewOf(door.id))}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          {/* accent edge glow on hover / keyboard focus */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
            style={{ boxShadow: `inset 0 0 0 1.5px ${door.accent}, 0 0 26px -8px ${door.accent}` }}
          />
        </div>
        {/* rebate — film edge markings under the frame */}
        <div className="relative h-5 font-mono text-[0.52rem] uppercase tracking-[0.18em]">
          <span className="absolute inset-x-0.5 inset-y-0 flex items-center gap-1.5 overflow-hidden text-[#d9a83f] transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
            <span className="truncate">FR {door.num} · {door.word}</span>
            {isCurrent && <span className="shrink-0 text-[#c43e2c]">● here</span>}
          </span>
          <span className="pointer-events-none absolute inset-x-0.5 inset-y-0 flex items-center gap-2 truncate opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="shrink-0 text-[#d9a83f]">↗ enter</span>
            <span className="truncate text-[#6f6f7d]">{door.peek}</span>
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export function ContactSheet({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  /** trailingSlash builds report "/court/" while door hrefs are "/court"; the length guard keeps root "/" intact. */
  const current = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const router = useRouter();
  const stripRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  /** A click already queued navigation — ignore further frame clicks. */
  const navigating = useRef(false);

  // On small screens the roll scrolls — bring the current page's frame into view.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    strip.querySelector('a[aria-current="page"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  /** Kick off the destination world's transition, then navigate once the screen is covered. */
  const onNavigate = (e: React.MouseEvent, door: Door) => {
    e.preventDefault();
    if (current === door.href) return onClose();
    if (navigating.current) return;
    navigating.current = true;
    window.dispatchEvent(new CustomEvent("develop:start", { detail: { world: door.id } }));
    window.setTimeout(() => router.push(door.href), 520);
  };

  /** Esc closes; Tab is trapped inside the dialog; ←/→ move focus along the roll. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Tab") {
      const all = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])') ?? [],
      );
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
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const links = Array.from(stripRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    if (!links.length) return;
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = links[(i + (e.key === "ArrowRight" ? 1 : -1) + links.length) % links.length];
    next.focus();
    next.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation — film roll"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[45] flex flex-col bg-[#070709] text-[#f4f1ea]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="grain" />
      {/* safelight glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,62,44,0.3),transparent_70%)]" />

      <p className="pt-24 text-center font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#8a8a99]">
        One year · one roll — hover a frame to preview the page
      </p>

      {/* the roll — a full-bleed strip of film laid across the screen */}
      <div className="flex flex-1 items-center">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="w-full bg-[#141419] shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
        >
          <PerfRow />
          {/* frame sizing: desktop fits all 7 at once (incl. one hover-widened frame); small screens swipe */}
          <div
            ref={stripRef}
            data-lenis-prevent
            onWheel={(e) => {
              const el = stripRef.current;
              if (el && el.scrollWidth > el.clientWidth) el.scrollLeft += e.deltaY;
            }}
            className="flex snap-x items-end gap-2 overflow-x-auto px-4 pb-0.5 pt-1.5 [--fh:30vh] md:justify-center md:overflow-visible md:[--fh:min(calc((100vw-180px)/10.6),24vh)]"
          >
            {FRAMES.map((door, i) => (
              <FilmFrame key={door.id} door={door} index={i} isCurrent={current === door.href} onNavigate={onNavigate} />
            ))}
          </div>
          <PerfRow />
        </motion.div>
      </div>

      {/* utility strip — cut single negatives */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex flex-wrap items-center justify-center gap-2.5 px-5 pb-8"
      >
        {UTILITY.map((u) => {
          const here = pathname === u.href || current === u.href;
          return (
            <Link
              key={u.href}
              href={u.href}
              data-cursor-hover
              onClick={here ? (e) => { e.preventDefault(); onClose(); } : undefined}
              aria-current={here ? "page" : undefined}
              className={`border px-3.5 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] transition-colors [background:linear-gradient(#14141b,#14141b)_padding-box,repeating-linear-gradient(90deg,#070709_0_6px,#2a2a33_6px_8px)_border-box] ${
                here ? "border-[#c43e2c] text-[#f4f1ea]" : "border-transparent text-[#8a8a99] hover:text-[#f4f1ea]"
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
          className="px-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#8a8a99] transition-colors hover:text-[#f4f1ea]"
        >
          {PROFILE.links.instagramHandle}
        </a>
      </motion.div>
    </motion.div>
  );
}
