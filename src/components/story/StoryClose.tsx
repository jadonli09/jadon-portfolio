"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/primitives/Magnetic";
import { EASE } from "@/lib/motion";

const DOORS = [
  { href: "/achievements", label: "Experiences & Achievements", note: "The full archive — every award, role, and project by year", accent: "#b07c1e" },
  { href: "/albums", label: "Albums", note: "The photo archive — every frame from all five worlds", accent: "#c9a227" },
  { href: "/contact", label: "Say Hello", note: "Email · Instagram · LinkedIn · GitHub", accent: "#b04a32" },
];

/** The synthesis + the final two doorways. Closes the story without a blank footer. */
export function StoryClose() {
  return (
    <section id="close" data-world="story" className="relative scroll-mt-24 border-t border-[var(--line)] bg-[var(--bg-2)] px-5 py-20 text-[var(--fg)] md:px-9 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-3xl font-display text-[2.2rem] leading-[1.05] tracking-tight md:text-[4rem]"
        >
          Five pursuits, one person — all pointing the same direction:{" "}
          <span className="italic text-[var(--accent)]">the pursuit of happiness.</span>
        </motion.p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {DOORS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              data-cursor-hover
              className="group relative flex flex-col justify-between gap-10 bg-[var(--bg)] p-8 transition-colors hover:bg-[var(--bg-2)] md:p-12"
            >
              <span className="flex items-start justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">Explore</span>
                <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" style={{ color: d.accent }} />
              </span>
              <span>
                <span className="block font-display text-3xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-5xl" style={{ color: "var(--fg)" }}>
                  {d.label}
                </span>
                <span className="mt-3 block font-mono text-[0.68rem] uppercase tracking-widest text-[var(--muted)]">
                  {d.note}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Magnetic strength={0.3}>
            <button
              onClick={() => (typeof window !== "undefined" ? window.scrollTo({ top: 0, behavior: "smooth" }) : null)}
              data-cursor-hover
              className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              ↑ Back to the top
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
