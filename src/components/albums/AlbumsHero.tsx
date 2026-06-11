"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ImageTrail } from "@/components/ui/image-trail";
import { AlbumImmersive } from "@/components/albums/AlbumImmersive";
import { ALBUM_TRAIL } from "@/lib/data";
import { asset } from "@/lib/base";
import { EASE } from "@/lib/motion";

/**
 * Albums hero — move the mouse (or drag a finger) and frames from every
 * world spill out behind the headline like prints tossed on a light table.
 */
export function AlbumsHero() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="relative flex h-svh w-full items-center justify-center overflow-hidden">
      {/* Trail canvas — covers the hero so item coordinates match the mouse. */}
      <div className="absolute inset-0 z-0" ref={ref}>
        <ImageTrail containerRef={ref} rotationRange={12} interval={120}>
          {ALBUM_TRAIL.map((src, index) => (
            <div
              key={src}
              className="relative flex h-32 w-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-[var(--line)] bg-[var(--bg-2)] shadow-2xl md:h-44 md:w-36"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(src)}
                alt={`Trail frame ${index + 1}`}
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </ImageTrail>
      </div>

      <div className="pointer-events-none relative z-10 flex flex-col items-center px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-[var(--accent)]"
        >
          The contact sheet · every world, one roll
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="font-anton select-none bg-gradient-to-b from-[var(--fg)] to-[var(--muted)] bg-clip-text text-[clamp(4.5rem,18vw,15rem)] leading-none text-transparent"
        >
          ALBUMS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 max-w-md font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
        >
          Move the cursor — the originals follow
        </motion.p>
      </div>

      {/* View-mode switch — CURSOR (trail) vs FLOAT (3D flythrough), pinned
          below the nav. The 3D overlay itself portals to <body>. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
        className="absolute left-1/2 top-16 z-20 -translate-x-1/2 md:top-20"
      >
        <AlbumImmersive />
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="pointer-events-none absolute bottom-24 left-1/2 z-10 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)] md:bottom-8"
      >
        Scroll for the albums ↓
      </motion.span>
    </section>
  );
}
