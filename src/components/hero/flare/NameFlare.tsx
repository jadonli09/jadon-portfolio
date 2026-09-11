"use client";

/**
 * Replaces the vgpu example's `index.tsx`.
 *
 * The example owned a whole black viewport. Here the flare is one layer of the
 * existing hero, so the canvas is additive only: it renders the same opaque
 * black frame, and `mix-blend-screen` turns black into a no-op and the light
 * into light over the photograph.
 *
 * The `<h1>` keeps drawing the solid, selectable name — this only adds the
 * light that rakes across it. (`logoOpacity` is pinned to 0 in `pipeline.ts`
 * for exactly that reason; raise it there to let the canvas draw the glyph too.)
 */

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

import { createRenderer } from "./renderer";

type Renderer = ReturnType<typeof createRenderer>;

interface NameFlareProps {
  /** Element the canvas exactly covers; the headline is measured against it. */
  readonly anchorRef: RefObject<HTMLElement | null>;
  /** The headline the flare lights up. */
  readonly headlineRef: RefObject<HTMLElement | null>;
  /** Vertical parallax in CSS pixels — pass the headline's own motion value. */
  readonly offset: MotionValue<number>;
  /** Fades the light out as the hero scrolls away. */
  readonly intensity: MotionValue<number>;
  /** Lets the headline's entrance land before the light arrives. */
  readonly revealDelayMs?: number;
}

export function NameFlare({
  anchorRef,
  headlineRef,
  offset,
  intensity,
  revealDelayMs = 1500,
}: NameFlareProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const [lit, setLit] = useState(false);
  const reduced = useReducedMotion();

  useMotionValueEvent(offset, "change", (value) =>
    rendererRef.current?.setOffset(value)
  );
  useMotionValueEvent(intensity, "change", (value) =>
    rendererRef.current?.setIntensity(value)
  );

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    const headline = headlineRef.current;
    if (!canvas || !anchor || !headline) return;

    let revealTimer = 0;
    let onScreen = true;
    let pageVisible = !document.hidden;

    const renderer = createRenderer({
      canvas,
      anchor,
      headline,
      // The hero section tracks the cursor so the canvas can stay inert.
      pointerTarget: anchor,
      onError: (error) => {
        setLit(false);
        if (process.env.NODE_ENV !== "production")
          console.warn("[NameFlare] falling back to the plain headline:", error);
      },
    });
    rendererRef.current = renderer;
    renderer.setOffset(offset.get());
    renderer.setIntensity(intensity.get());

    const sync = () => renderer.setActive(onScreen && pageVisible);
    const handleVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // A 48-tap ray march has no business running while the hero is off-screen.
    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "10% 0px" }
    );
    observer.observe(canvas);

    void renderer.ready.then((running) => {
      if (!running) return;
      // Re-measure once the web font swaps in, so the raster is never
      // laid out to the fallback face's metrics.
      void document.fonts?.ready.then(() => renderer.refresh()).catch(() => {});
      revealTimer = window.setTimeout(() => setLit(true), revealDelayMs);
    });

    return () => {
      window.clearTimeout(revealTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [anchorRef, headlineRef, offset, intensity, reduced, revealDelayMs]);

  // No WebGPU, or the reader asked for stillness: the hero keeps its plain headline.
  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] block h-full w-full mix-blend-screen"
      style={{
        opacity: lit ? 1 : 0,
        transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}

export default NameFlare;
