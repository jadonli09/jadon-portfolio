"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PROFILE, SENTENCE_DOORS } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

type Door = (typeof SENTENCE_DOORS)[keyof typeof SENTENCE_DOORS];

/** Insertion order is num order: 01 leads … 07 person. */
const FRAMES: Door[] = Object.values(SENTENCE_DOORS);

const UTILITY = [
  { label: "Home", href: "/" },
  { label: "Trophy Case", href: "/achievements" },
  { label: "Albums", href: "/albums" },
  { label: "Contact", href: "/contact" },
] as const;

/** Photographer's red grease-pencil circle marking the frame you're on. */
function GreasePencil() {
  return (
    <svg viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute -inset-3 z-10">
      <path
        d="M50 6 C 82 4 96 38 94 80 C 92 124 78 154 48 155 C 20 156 5 122 6 78 C 7 36 22 8 50 6 Z"
        fill="none"
        stroke="#c43e2c"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.9"
        style={{ transform: "rotate(-2.5deg)", transformOrigin: "50% 50%" }}
      />
    </svg>
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
  return (
    <Link
      href={door.href}
      data-cursor-hover
      onClick={(e) => onNavigate(e, door)}
      aria-current={isCurrent ? "page" : undefined}
      className="group relative shrink-0 snap-center outline-none"
    >
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 + index * 0.06, duration: 0.7, ease: EASE }}
        whileHover={{ scale: 1.06, y: -10 }}
        className="relative h-[46vh] w-[62vw] overflow-hidden rounded-[4px] bg-[#14141b] shadow-[0_18px_50px_rgba(0,0,0,0.6)] md:h-[52vh] md:w-[clamp(150px,12vw,220px)]"
      >
        {/* sprocket holes */}
        <div className="absolute inset-y-0 left-1 w-2 [background:repeating-linear-gradient(#070709_0_8px,transparent_8px_18px)]" />
        <div className="absolute inset-y-0 right-1 w-2 [background:repeating-linear-gradient(#070709_0_8px,transparent_8px_18px)]" />
        <span className="absolute left-4 top-2 font-mono text-[0.55rem] tracking-[0.2em] text-[#8a8a99]">FR {door.num}</span>
        {/* negative — accent-tinted underlay doubles as the image-error fallback */}
        <div
          className="absolute inset-x-4 bottom-12 top-7 overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${door.accent}33, #1a1a22)` }}
        >
          <img
            src={asset(door.photo)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover contrast-[1.05] saturate-[0.92] transition-[filter] duration-300 group-hover:saturate-100"
          />
        </div>
        {/* label */}
        <div className="absolute inset-x-4 bottom-2.5">
          <p className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-[#8a8a99]">{door.kicker}</p>
          <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#f4f1ea]" style={{ textDecorationColor: door.accent }}>
            {door.word}
          </p>
        </div>
        {/* accent edge glow on hover / keyboard focus */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[4px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1.5px ${door.accent}, 0 0 28px -6px ${door.accent}` }}
        />
        {isCurrent && <GreasePencil />}
      </motion.div>
      {/* peek stat under the loupe */}
      <span className="pointer-events-none absolute -bottom-6 left-1/2 w-max max-w-[110%] -translate-x-1/2 truncate font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#8a8a99] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {door.peek}
      </span>
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

  /** Hand off to the Develop overlay, then navigate once the cover has settled. */
  const onNavigate = (e: React.MouseEvent, door: Door) => {
    e.preventDefault();
    if (current === door.href) return onClose();
    if (navigating.current) return;
    navigating.current = true;
    try {
      sessionStorage.setItem("develop", JSON.stringify({ photo: door.photo, accent: door.accent, t: Date.now() }));
    } catch {
      /* private mode etc. — transition degrades to plain navigation */
    }
    window.dispatchEvent(new CustomEvent("develop:start", { detail: { photo: door.photo, accent: door.accent } }));
    window.setTimeout(() => router.push(door.href), 480);
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
      aria-label="Site navigation — contact sheet"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-40 flex flex-col bg-[#070709] text-[#f4f1ea]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="grain" />
      {/* safelight glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,62,44,0.3),transparent_70%)]" />

      <p className="pt-24 text-center font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#8a8a99]">
        One year · seven rolls — pick a frame
      </p>

      {/* the roll — native horizontal scroller; Lenis must ignore it */}
      <div
        ref={stripRef}
        data-lenis-prevent
        onWheel={(e) => {
          if (stripRef.current) stripRef.current.scrollLeft += e.deltaY;
        }}
        className="flex flex-1 snap-x snap-mandatory items-center overflow-x-auto overflow-y-hidden"
      >
        <div className="mx-auto flex w-max items-center gap-5 px-6 pb-7 md:gap-6">
          {FRAMES.map((door, i) => (
            <FilmFrame key={door.id} door={door} index={i} isCurrent={current === door.href} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* utility strip — cut single negatives */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex flex-wrap items-center justify-center gap-2.5 px-5 pb-8"
      >
        {UTILITY.map((u) => {
          const here = current === u.href;
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
