"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Pause, Volume2 } from "lucide-react";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

type NativeVideoTileProps = {
  src: string;
  poster: string;
  label: string;
  index: number;
};

export function NativeVideoTile({ src, poster, label, index }: NativeVideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  // Detect pointer-fine (real mouse) on mount — gate hover-autoplay behind this
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  // Reduced-motion check
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    playing ? pause() : play();
  }, [playing, play, pause]);

  // Hover-autoplay: only on pointer-fine devices and no reduced-motion
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (canHover && !reducedMotion && !playing) {
      play();
    }
  }, [canHover, reducedMotion, playing, play]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (canHover && !reducedMotion && playing) {
      pause();
    }
  }, [canHover, reducedMotion, playing, pause]);

  const numStr = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden bg-[var(--bg-2)]"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toggle}
      data-cursor-hover
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={asset(src)}
        poster={asset(poster)}
        muted
        playsInline
        loop
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient overlay — always present, dims on play */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          playing ? "opacity-20" : "opacity-70"
        )}
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.7) 0%, transparent 30%, transparent 60%, rgba(10,10,12,0.9) 100%)",
        }}
        aria-hidden
      />

      {/* Pink/cyan edge glow on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-none transition-opacity duration-500",
          hovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          boxShadow: "inset 0 0 0 1.5px var(--accent), inset 0 0 40px rgba(255,61,129,0.08)",
        }}
        aria-hidden
      />

      {/* Top label bar */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-3 py-2.5">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[var(--accent)]">
          ▶ plays here
        </span>
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[var(--muted)]/70">
          {numStr}
        </span>
      </div>

      {/* Center play/pause overlay — shown when not hovering-autoplaying */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: playing && hovered ? 0 : playing ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)]/15 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {playing ? (
            <Pause className="size-5 fill-[var(--accent)] text-[var(--accent)]" strokeWidth={0} />
          ) : (
            <Play className="size-5 translate-x-0.5 fill-[var(--accent)] text-[var(--accent)]" strokeWidth={0} />
          )}
        </motion.div>
      </motion.div>

      {/* Playing indicator: pause icon fades in on hover while playing */}
      {playing && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg)]/50 backdrop-blur-sm">
            <Pause className="size-4 fill-[var(--fg)] text-[var(--fg)]" strokeWidth={0} />
          </div>
        </motion.div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-end justify-between">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--fg)]/90 leading-tight">
            {label}
          </p>
          <Volume2 className="size-3 text-[var(--muted)]/60" aria-hidden />
        </div>
      </div>
    </motion.div>
  );
}
