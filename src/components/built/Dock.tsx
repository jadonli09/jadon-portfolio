"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { SPRING_MOVE, SPRING_SHEET, prefersReducedMotion, scrollTargetFor } from "@/lib/fluid";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   Dock — where am I, where can I go, what is there, how do I get out.

   Replaces the old fixed scroll-progress rail, which reported a percentage
   nobody needed and could not be clicked. This one is a control: it says which
   section you are in and it takes you to any other.

   It floats at the bottom rather than pinning to the top because the site's
   global nav already owns the top edge. It is the only genuinely translucent
   surface on the page — everything else sits on white with nothing behind it
   to blur — and content passes under it through a soft edge fade rather than
   a hard 1px rule.
   ──────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: "acornprep", label: "AcornPrep", short: "Acorn" },
  { id: "hermes", label: "Hermes", short: "Hermes" },
  { id: "notebookli", label: "NotebookLI", short: "Notebook" },
  { id: "fleet", label: "More projects", short: "More" },
] as const;

export function Dock() {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();
  const railRef = useRef<HTMLDivElement>(null);

  /**
   * The active section is the one whose top has most recently passed a line a
   * third of the way down the viewport — the same rule a reader uses, and
   * stable in a way "whichever is most visible" is not when one section is
   * three screens tall and the next is one.
   *
   * Measured from scroll rather than from IntersectionObserver thresholds
   * because the sections here differ in height by a factor of four.
   */
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.34;

      // Show the dock once the hero is behind us, hide it over the footer so
      // it never covers the last thing on the page.
      const doc = document.documentElement;
      const nearEnd = window.scrollY + window.innerHeight > doc.scrollHeight - 260;
      setVisible(window.scrollY > window.innerHeight * 0.55 && !nearEnd);

      let current: string | null = null;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      // Lenis owns the scroll while it is mounted; calling scrollIntoView
      // underneath it fights the interpolation and lands short. Lenis is only
      // absent when reduced motion is on — so the fallback jumps rather than
      // animating a whole page of travel.
      if (lenis) lenis.scrollTo(scrollTargetFor(el));
      else
        window.scrollTo({
          top: scrollTargetFor(el),
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
    },
    [lenis],
  );

  /** Roving focus, so arrow keys move the ring as well as the selection. */
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % SECTIONS.length;
    if (e.key === "ArrowLeft") next = (i - 1 + SECTIONS.length) % SECTIONS.length;
    if (next === null) return;
    e.preventDefault();
    const btn = railRef.current?.querySelector<HTMLButtonElement>(
      `[data-dock="${SECTIONS[next].id}"]`,
    );
    btn?.focus();
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="dock"
          // Keep a consistent inset above the device safe area.
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pb-7"
          // Enters and exits along the same path — up from the bottom edge,
          // back down to it. A little bounce, because it is a surface being
          // pushed into place rather than a menu fading in.
          initial={{ opacity: 0, transform: "translateY(120%)" }}
          animate={{ opacity: 1, transform: "translateY(0%)" }}
          exit={{ opacity: 0, transform: "translateY(120%)" }}
          transition={SPRING_SHEET}
        >
          {/* Scroll edge effect — content dissolves into the ground where the
              dock overlaps it, instead of colliding with a border. */}
          <div className="edge-fade pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden />

          <nav
            ref={railRef}
            aria-label="Sections of this page"
            className="surface-chrome pointer-events-auto relative flex items-center gap-0.5 p-1.5"
          >
            {SECTIONS.map((s, i) => {
              const on = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  data-dock={s.id}
                  data-cursor-hover
                  aria-current={on ? "true" : undefined}
                  onClick={() => go(s.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-[-0.005em] transition-[color,scale] duration-150 ease-[var(--ease-out)] active:scale-95 md:px-4 md:text-[0.85rem]",
                    on ? "text-white" : "text-[var(--muted)] hover:text-[var(--fg)]",
                  )}
                >
                  {/* The indicator is one element that MOVES between tabs —
                      four elements cross-fading would read as a blink, not as
                      a thing travelling to where you pointed. */}
                  {on ? (
                    <motion.span
                      layoutId="dock-indicator"
                      className="absolute inset-0 rounded-full bg-[var(--fg)]"
                      transition={SPRING_MOVE}
                    />
                  ) : null}
                  <span className="relative z-10">
                    <span className="sm:hidden">{s.short}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
