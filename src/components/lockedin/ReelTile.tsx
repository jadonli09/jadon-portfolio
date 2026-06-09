"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

type ReelTileProps = {
  code: string;
  url: string;
  index: number;
};

export function ReelTile({ code, url, index }: ReelTileProps) {
  return (
    <motion.div
      className="flex flex-col overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Intentional frame top bar */}
      <div className="flex items-center justify-between border-b border-[var(--line)] px-3.5 py-2.5">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[var(--accent)]">
          @li_locked.in
        </span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className="group flex items-center gap-1 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)] transition-colors duration-200 hover:text-[var(--accent-2)]"
          aria-label={`Watch reel on Instagram`}
        >
          Watch on Instagram
          <ArrowUpRight className="size-2.5 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
        </a>
      </div>

      {/* Instagram embed — self-contained, no embed.js needed */}
      <div className="relative w-full overflow-hidden" style={{ height: 640 }}>
        <iframe
          src={`https://www.instagram.com/reel/${code}/embed/`}
          loading="lazy"
          scrolling="no"
          frameBorder={0}
          allowTransparency
          allow="encrypted-media"
          title={`Instagram reel ${code}`}
          className="h-full w-full"
          style={{ border: 0 }}
        />
      </div>
    </motion.div>
  );
}
