"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/cn";

type ReelTileProps = {
  code: string;
  url: string;
  index: number;
};

/** Gradient palette for each tile — alternating pink/cyan pairs */
const GRADIENTS = [
  "linear-gradient(145deg, rgba(255,61,129,0.18) 0%, rgba(61,240,255,0.06) 100%)",
  "linear-gradient(145deg, rgba(61,240,255,0.15) 0%, rgba(255,61,129,0.05) 100%)",
  "linear-gradient(145deg, rgba(255,61,129,0.12) 30%, rgba(61,240,255,0.12) 100%)",
  "linear-gradient(145deg, rgba(61,240,255,0.18) 0%, rgba(255,61,129,0.08) 80%)",
] as const;

export function ReelTile({ code, url, index }: ReelTileProps) {
  const [hovered, setHovered] = useState(false);
  const numStr = String(index + 1).padStart(2, "0");
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group relative aspect-[9/16] w-full overflow-hidden bg-[var(--bg-2)] block"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
      aria-label={`Watch reel ${numStr} on Instagram`}
    >
      {/* Background gradient + grain */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: gradient, opacity: hovered ? 1 : 0.6 }}
        aria-hidden
      />

      {/* Fine scan-line texture — reel-screen vibe */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 3px)",
        }}
        aria-hidden
      />

      {/* Border hover glow */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          boxShadow: hovered
            ? "inset 0 0 0 1.5px var(--accent), inset 0 0 30px rgba(255,61,129,0.08)"
            : "inset 0 0 0 1px rgba(244,241,234,0.08)",
        }}
        transition={{ duration: 0.3 }}
        aria-hidden
      />

      {/* Corner brackets */}
      {[
        "top-2 left-2 border-t border-l",
        "top-2 right-2 border-t border-r",
        "bottom-2 left-2 border-b border-l",
        "bottom-2 right-2 border-b border-r",
      ].map((cls, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "pointer-events-none absolute h-4 w-4 transition-colors duration-300",
            hovered ? "border-[var(--accent)]" : "border-[var(--line)]",
            cls
          )}
        />
      ))}

      {/* Reel index */}
      <div className="absolute left-3 top-3">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[var(--muted)]/70">
          {numStr}
        </span>
      </div>

      {/* Center play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent)] backdrop-blur-sm"
          style={{
            background: hovered ? "rgba(255,61,129,0.2)" : "rgba(255,61,129,0.08)",
          }}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Play
            className="size-6 translate-x-0.5 fill-[var(--accent)] text-[var(--accent)]"
            strokeWidth={0}
          />
        </motion.div>

        <motion.span
          className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-[var(--muted)]"
          animate={{ opacity: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
        >
          Watch on Instagram
        </motion.span>
      </div>

      {/* Bottom info bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-[var(--bg)]/80 px-3 py-2.5 backdrop-blur-sm"
        animate={{ opacity: hovered ? 1 : 0.75 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--fg)]/80">
            @li_locked.in
          </span>
          <ArrowUpRight
            className={cn(
              "size-3.5 transition-all duration-300",
              hovered ? "text-[var(--accent)] translate-x-0.5 -translate-y-0.5" : "text-[var(--muted)]"
            )}
          />
        </div>
        <p className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-widest text-[var(--muted)]/60">
          Watch on Instagram ↗
        </p>
      </motion.div>
    </motion.a>
  );
}
