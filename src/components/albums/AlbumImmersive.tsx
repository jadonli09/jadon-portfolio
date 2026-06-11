"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useProgress } from "@react-three/drei";
import { MousePointer2, Orbit } from "lucide-react";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import { ALBUMS } from "@/lib/data";
import { asset } from "@/lib/base";

/** Texture-load readout — useProgress reads three's default loading manager. */
function DarkroomProgress() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <p className="animate-pulse font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--muted)]">
      Developing the roll — {Math.round(progress)}%
    </p>
  );
}

/**
 * The mode switch — a dark/light-style segmented toggle between the two ways
 * through the archive: CURSOR (image-trail hero) and FLOAT (3D flythrough).
 * A spring-loaded thumb slides under the active side.
 */
function ModeToggle({
  float,
  onChange,
}: {
  float: boolean;
  onChange: (float: boolean) => void;
}) {
  const segment =
    "relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.22em] transition-colors duration-300 md:px-5";

  return (
    <div className="rounded-full border border-[var(--line)] bg-[var(--bg-2)]/85 p-1 shadow-2xl backdrop-blur-md">
      <div className="relative grid grid-cols-2">
        <motion.span
          aria-hidden
          className="absolute bottom-0 left-0 top-0 w-1/2 rounded-full bg-[var(--fg)]"
          initial={false}
          animate={{ x: float ? "100%" : "0%" }}
          transition={{ type: "spring", duration: 0.55, bounce: 0.25 }}
        />
        <button
          type="button"
          onClick={() => onChange(false)}
          aria-pressed={!float}
          className={`${segment} ${
            float
              ? "text-[var(--muted)] hover:text-[var(--fg)]"
              : "text-[var(--bg)]"
          }`}
        >
          <MousePointer2 className="h-3.5 w-3.5" aria-hidden />
          Cursor
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          aria-pressed={float}
          className={`${segment} ${
            float
              ? "text-[var(--bg)]"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          <Orbit className="h-3.5 w-3.5" aria-hidden />
          Float
        </button>
      </div>
    </div>
  );
}

/**
 * Top-of-page view switch for the archive. CURSOR leaves the page as-is;
 * FLOAT opens a fullscreen 3D flythrough where every frame drifts past the
 * camera (wheel / arrows / auto-play). The same toggle re-renders inside the
 * overlay at the same spot, so flipping back feels like one control.
 * Lenis is paused while open so the gallery owns the wheel.
 */
export function AlbumImmersive({ className = "" }: { className?: string }) {
  const [float, setFloat] = useState(false);
  const lenis = useLenis();

  const images = useMemo(
    () =>
      ALBUMS.flatMap((album) => album.photos).map((photo) => ({
        src: asset(photo.src),
        alt: photo.caption,
      })),
    []
  );

  useEffect(() => {
    if (!float) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFloat(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [float, lenis]);

  return (
    <>
      <div className={className}>
        <ModeToggle float={float} onChange={setFloat} />
      </div>

      {/* Portal to <body> — ancestors carry motion transforms, which would
          otherwise become the containing block and trap this fixed overlay. */}
      {float &&
        createPortal(
          <div
            // z-[60]: above the nav (z-50) but below the custom cursor
            // (z-[70]) — the native cursor is hidden site-wide, so the
            // overlay must not cover the Cursor layer.
            className="fixed inset-0 z-[60] bg-[var(--bg)]"
            role="dialog"
            aria-modal="true"
            aria-label="3D photo flythrough"
            data-lenis-prevent
          >
            <InfiniteGallery
              images={images}
              speed={1.2}
              visibleCount={12}
              className="h-full w-full"
            />

            {/* Center wordmark, demo-style — exclusion blend so frames pass through it */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-center mix-blend-exclusion text-white">
              <h3 className="font-anton text-5xl uppercase leading-none tracking-tight md:text-8xl">
                Every Frame
              </h3>
            </div>

            {/* The same toggle, same spot — flip back to CURSOR to land where you left */}
            <div className="absolute left-1/2 top-16 z-10 -translate-x-1/2 md:top-20">
              <ModeToggle float={float} onChange={setFloat} />
            </div>

            {/* Navigation hint + load progress */}
            <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.25em]">
              <DarkroomProgress />
              <p className="text-[var(--muted)]">
                Scroll or use arrow keys · auto-play resumes after 3s · Esc to
                exit
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
