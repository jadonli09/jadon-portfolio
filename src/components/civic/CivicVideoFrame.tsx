"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Designed placeholder frame for video content.
 * Sits in the lead story to imply the video-forward nature of the work.
 */
export function CivicVideoFrame({
  caption,
  label,
  className,
}: {
  caption: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative aspect-video w-full overflow-hidden border border-[var(--line)] bg-[var(--bg-2)]",
        className,
      )}
      data-cursor-hover
    >
      {/* Background mesh */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(192,57,43,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 20% 80%, rgba(20,17,13,0.18) 0%, transparent 60%)",
        }}
      />

      {/* Grid lines — editorial feel */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Corner marks */}
      {[
        "top-2 left-2 border-t border-l",
        "top-2 right-2 border-t border-r",
        "bottom-2 left-2 border-b border-l",
        "bottom-2 right-2 border-b border-r",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute h-5 w-5 border-[var(--accent)] ${pos}`}
        />
      ))}

      {/* Play glyph */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-14 w-14 items-center justify-center border border-[var(--accent)] bg-[var(--accent)] md:h-16 md:w-16"
        >
          <Play
            className="h-5 w-5 translate-x-0.5 fill-white text-white md:h-6 md:w-6"
            strokeWidth={0}
          />
        </motion.div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          {label}
        </span>
      </div>

      {/* Caption bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--line)] bg-[var(--bg)] px-4 py-2.5">
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
          {caption}
        </p>
      </div>
    </div>
  );
}
