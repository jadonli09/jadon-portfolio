"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { WORLDS } from "@/lib/data";
import { EASE } from "@/lib/motion";

/** Interactive index of the six worlds — hover lights the row and reveals its art note. */
export function WorldIndex() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 md:px-9 md:py-36">
      <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-5">
        <h2 className="font-display text-2xl md:text-4xl">The Worlds</h2>
        <span className="font-mono text-xs uppercase tracking-widest text-[#8a8a99]">Choose a way in</span>
      </div>

      <ul onMouseLeave={() => setActive(null)}>
        {WORLDS.map((w, i) => (
          <li key={w.id}>
            <Link
              href={w.href}
              data-cursor-hover
              onMouseEnter={() => setActive(i)}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/10 py-5 md:gap-8 md:py-7"
            >
              <span className="font-mono text-xs text-[#e8b15a] md:text-sm">{w.index}</span>

              <span className="overflow-hidden">
                <motion.span
                  className="block font-display text-[1.9rem] leading-none md:text-[3.6rem]"
                  animate={{
                    x: active === i ? 16 : 0,
                    color: active === i ? "#e8b15a" : "#f4f1ea",
                    opacity: active === null || active === i ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {w.title}
                </motion.span>
                <motion.span
                  initial={false}
                  animate={{ height: active === i ? "auto" : 0, opacity: active === i ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="block overflow-hidden font-mono text-[0.7rem] uppercase tracking-widest text-[#8a8a99]"
                >
                  <span className="block pt-2">{w.blurb}</span>
                </motion.span>
              </span>

              <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[#8a8a99] md:inline">
                {w.art}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
