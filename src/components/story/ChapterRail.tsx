"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { useLenis } from "lenis/react";
import { CHAPTERS } from "@/lib/data";

/**
 * The connective thread + navigator. A fixed left rail (desktop) that shows every
 * chapter as a node on one continuous line, highlights the active one via
 * scroll-spy, and jumps you there on click. A slim progress bar stands in on mobile.
 * This is what makes the story explorable section-by-section instead of a long scroll.
 */
export function ChapterRail() {
  const [active, setActive] = useState<string>(CHAPTERS[0].id);
  const [shown, setShown] = useState(false);
  const lenis = useLenis();
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Keep the rail out of the hero — it only appears once you've started the story,
  // so it never blocks the JADON LI title up top.
  useMotionValueEvent(scrollY, "change", (v) => {
    const past = v > (typeof window !== "undefined" ? window.innerHeight * 0.62 : 600);
    setShown((s) => (s !== past ? past : s));
  });

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // The section whose middle is closest to the viewport middle wins.
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const mid = window.innerHeight / 2;
        let best = visible[0];
        let bestDist = Infinity;
        for (const e of visible) {
          const r = e.boundingClientRect;
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = e;
          }
        }
        const id = (best.target as HTMLElement).id;
        if (id) setActive(id);
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.1 });
    else el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* slim top progress (all viewports) */}
      <motion.div
        className="fixed left-0 top-0 z-[45] h-[2px] w-full origin-left bg-[var(--accent,#e8b15a)]"
        style={{ scaleX: progress }}
        aria-hidden
      />

      {/* desktop thread rail — fades in once you leave the hero */}
      <motion.nav
        aria-label="Story chapters"
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
        initial={false}
        animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -12 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: shown ? "auto" : "none" }}
      >
        <div className="relative flex flex-col gap-5">
          {/* the continuous thread */}
          <span className="absolute left-[5px] top-1 bottom-1 w-px bg-white/12" aria-hidden />
          {CHAPTERS.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => jump(c.id)}
                data-cursor-hover
                className="group relative flex items-center gap-3"
                aria-current={isActive ? "true" : undefined}
                aria-label={`${c.num} — ${c.kicker}`}
              >
                <span className="relative z-10 flex size-[11px] items-center justify-center">
                  <motion.span
                    className="block rounded-full"
                    animate={{
                      width: isActive ? 11 : 6,
                      height: isActive ? 11 : 6,
                      backgroundColor: isActive ? c.accent : "rgba(244,241,234,0.35)",
                    }}
                    transition={{ duration: 0.35 }}
                  />
                </span>
                <motion.span
                  className="whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.25em]"
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : -6,
                    color: isActive ? c.accent : "#8a8a99",
                  }}
                  transition={{ duration: 0.35 }}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                >
                  {c.kicker}
                </motion.span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
