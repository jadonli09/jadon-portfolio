"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/primitives/Magnetic";
import { EASE } from "@/lib/motion";

const DOORS = [
  { href: "/achievements", label: "Experiences & Achievements", note: "The full archive — every award, role, and project by year", accent: "#b07c1e" },
  { href: "/albums", label: "Albums", note: "The photo archive — every frame of the whole story", accent: "#c9a227" },
  { href: "/contact", label: "Say Hello", note: "Email · Instagram · LinkedIn · GitHub", accent: "#b04a32" },
];

/** The synthesis + the final doorways, on the dark landing. */
export function LandingClose() {
  return (
    <section id="close" className="relative scroll-mt-24 border-t border-white/10 px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-display max-w-3xl text-[2.2rem] leading-[1.05] tracking-tight text-[#f4f1ea] md:text-[4rem]"
        >
          Seven doors, one direction:{" "}
          <span className="italic text-[#e8b15a]">the pursuit of happiness.</span>
        </motion.p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-3">
          {DOORS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              data-cursor-hover
              className="group relative flex flex-col justify-between gap-10 bg-[#07070a] p-8 transition-colors hover:bg-[#101016] md:p-12"
            >
              <span className="flex items-start justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#8a8a99]">Explore</span>
                <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" style={{ color: d.accent }} />
              </span>
              <span>
                <span className="block font-display text-3xl leading-none text-[#f4f1ea] transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                  {d.label}
                </span>
                <span className="mt-3 block font-mono text-[0.68rem] uppercase tracking-widest text-[#8a8a99]">
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
              className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#8a8a99] transition-colors hover:text-[#f4f1ea]"
            >
              Back to the top
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
