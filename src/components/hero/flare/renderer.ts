/**
 * Adapted from the vgpu `nextjs-flare` example's `renderer.ts`.
 *
 * The WebGPU work is unchanged — same pass order, same abort/generation guards,
 * same `runCleanups` teardown. What changed, and why:
 *
 * 1. The glyph raster comes from the measured DOM headline instead of a fixed
 *    logo SVG, so the flare tracks the responsive `<h1>` at every breakpoint.
 * 2. Pointer listeners bind to a separate `pointerTarget` (the hero section) so
 *    the canvas itself can stay `pointer-events-none` and never eat clicks.
 * 3. `fail` reports through `onError` instead of throwing. Upstream is a
 *    standalone demo where a throw is the right signal; here a GPU hiccup must
 *    degrade to "no flare" rather than throw once per animation frame.
 * 4. `setActive` parks the loop while the hero is off-screen.
 * 5. `setIntensity` fades the flare through the shader uniforms. Fading with
 *    CSS opacity instead would isolate the blend group and paint the opaque
 *    black canvas over the photo rather than screening onto it.
 */

import type { Gpu } from "vgpu";

import {
  measureHeadline,
  rasterizeHeadline,
  type HeadlineRaster,
  type PixelBox,
} from "./text-raster";
import {
  backingDimensions,
  boxPlacement,
  canvasRaster,
  FlarePipeline,
  followLight,
  LOGO_CENTER,
  mapAutonomousLight,
  runCleanups,
  type FlarePlacement,
  type Point,
} from "./pipeline";

type RenderSize = Readonly<{ width: number; height: number; dpr: number }>;

const FRAME_INTERVAL_MS = 33;
const PULSE_HOLD_SECONDS = 0.35;
/** Must match the `pad` that `FlarePipeline.bindLogo` uses for its UV inset. */
const RASTER_PAD = 3;

export interface RendererOptions {
  readonly canvas: HTMLCanvasElement;
  /** Element the canvas exactly covers; headline offsets are measured against it. */
  readonly anchor: HTMLElement;
  /** The element whose text the flare lights up. */
  readonly headline: HTMLElement;
  /** Element that receives pointer tracking, so the canvas can stay inert. */
  readonly pointerTarget: HTMLElement;
  readonly onError?: (error: unknown) => void;
}

export function createRenderer({
  canvas,
  anchor,
  headline,
  pointerTarget,
  onError,
}: RendererOptions) {
  let disposed = false;
  let failed = false;
  let gpu: Gpu | undefined;
  let pipeline: FlarePipeline | undefined;
  let placement: FlarePlacement | undefined;
  let light: Point = LOGO_CENTER;
  let pointer: Point | undefined;
  let pulseHold = 0;
  let frameIndex = 0;
  let staticDirty = true;
  let lastTime = 0;
  let lastRender = -Infinity;
  let animationFrame = 0;
  let observer: ResizeObserver | undefined;
  let pendingSize: RenderSize | undefined;
  let resizeTask: Promise<void> | undefined;
  let resizeGeneration = 0;
  let rasterAbort: AbortController | undefined;
  let appliedBacking: Point = [0, 0];
  let appliedSupersample = 0;
  let appliedMeasuredBox: PixelBox | undefined;
  let active = true;
  let intensity = 1;
  let cssHeight = 0;
  let offsetUv = 0;
  let appliedOffsetUv = 0;

  const sameBox = (a: PixelBox | undefined, b: PixelBox) =>
    !!a &&
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height;

  const applySize = async (size: RenderSize, generation: number) => {
    if (!pipeline) return;
    const backing = backingDimensions(size.width, size.height, size.dpr);
    const supersample = size.dpr < 1.5 ? 2 : 1;

    // Backing pixels per CSS pixel, after the example's DPR clamp.
    const scale = backing[0] / Math.max(size.width, 1);
    const measured = measureHeadline(headline, anchor);
    // Nothing to light yet (fonts still loading, or the hero is display:none).
    // Leave the applied state untouched so the next measure retries.
    if (!measured) return;
    const measuredBox: PixelBox = {
      x: measured.box.x * scale,
      y: measured.box.y * scale,
      width: measured.box.width * scale,
      height: measured.box.height * scale,
    };

    if (
      backing[0] === appliedBacking[0] &&
      backing[1] === appliedBacking[1] &&
      supersample === appliedSupersample &&
      sameBox(appliedMeasuredBox, measuredBox)
    ) {
      return;
    }

    const controller = new AbortController();
    rasterAbort = controller;
    let raster: HeadlineRaster;
    try {
      raster = await rasterizeHeadline(
        measured.style,
        measured.box,
        scale * supersample,
        RASTER_PAD,
        controller.signal
      );
    } catch (error) {
      if (controller.signal.aborted) return;
      throw error;
    } finally {
      if (rasterAbort === controller) rasterAbort = undefined;
    }
    if (disposed || generation !== resizeGeneration) return;

    // The raster bleeds past the line box to hold the whole glyph, so the
    // placement follows the raster's box, not the element's.
    const box: PixelBox = {
      x: raster.box.x * scale,
      y: raster.box.y * scale,
      width: raster.box.width * scale,
      height: raster.box.height * scale,
    };

    const nextPlacement = await pipeline.replace(
      backing,
      supersample,
      canvasRaster(raster.canvas),
      boxPlacement(backing[0], backing[1], box),
      () => disposed || generation !== resizeGeneration
    );
    if (!nextPlacement) return;
    placement = nextPlacement;
    appliedBacking = backing;
    appliedSupersample = supersample;
    appliedMeasuredBox = measuredBox;
    staticDirty = true;
  };

  const drainResizes = async () => {
    while (pendingSize && !disposed) {
      const size = pendingSize;
      pendingSize = undefined;
      await applySize(size, resizeGeneration);
    }
  };

  const resize = (size: RenderSize): Promise<void> => {
    if (disposed || size.width <= 0 || size.height <= 0)
      return Promise.resolve();
    cssHeight = size.height;
    pendingSize = size;
    resizeGeneration += 1;
    rasterAbort?.abort();
    resizeTask ??= drainResizes()
      .catch((error: unknown) => {
        if (disposed && !failed) return;
        fail(error);
      })
      .finally(() => {
        resizeTask = undefined;
      });
    return resizeTask;
  };

  const measure = () =>
    guard(() => {
      const rect = canvas.getBoundingClientRect();
      void resize({
        width: rect.width,
        height: rect.height,
        dpr: window.devicePixelRatio || 1,
      });
    });

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    guard(() => {
      const rect = canvas.getBoundingClientRect();
      pointer = [
        Math.min(
          1,
          Math.max(0, (event.clientX - rect.left) / Math.max(1, rect.width))
        ),
        Math.min(
          1,
          Math.max(0, (event.clientY - rect.top) / Math.max(1, rect.height))
        ),
      ];
    });
  };

  const handlePointerLeave = () => {
    pointer = undefined;
  };

  const frameLoop = (now: number) => {
    if (disposed) return;
    guard(() => {
      animationFrame = requestAnimationFrame(frameLoop);
      const activePipeline = pipeline;
      if (now - lastRender < FRAME_INTERVAL_MS || !placement || !activePipeline)
        return;
      lastRender = now;
      const time = now / 1000;
      const dt = Math.min(Math.max(time - lastTime, 0), 0.05);
      lastTime = time;
      // Scrolled past its own fade — keep the clock warm, skip the GPU work.
      if (intensity <= 0.002) return;
      // Scroll parallax rides the uniforms, not a CSS transform: a transformed
      // wrapper would isolate the blend group and drop the opaque canvas on top
      // of the photo instead of screening the light onto it.
      const framePlacement: FlarePlacement =
        offsetUv === 0
          ? placement
          : {
              ...placement,
              logoCenter: [
                placement.logoCenter[0],
                placement.logoCenter[1] + offsetUv,
              ],
            };
      if (offsetUv !== appliedOffsetUv) {
        appliedOffsetUv = offsetUv;
        staticDirty = true;
      }
      const target = pointer ?? mapAutonomousLight(time, framePlacement);
      light = followLight(light, target, dt);
      pulseHold +=
        ((pointer ? 1 : 0) - pulseHold) *
        (1 - Math.exp(-dt / PULSE_HOLD_SECONDS));
      activePipeline.setFrameUniforms(
        framePlacement,
        light,
        frameIndex,
        time,
        pulseHold,
        intensity
      );
      activePipeline.draw(staticDirty);
      staticDirty = false;
      frameIndex += 1;
    });
  };

  const start = () => {
    if (disposed || animationFrame) return;
    lastTime = performance.now() / 1000;
    animationFrame = requestAnimationFrame(frameLoop);
  };

  const stop = () => {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    resizeGeneration += 1;
    runCleanups([
      () => rasterAbort?.abort(),
      () => stop(),
      () => observer?.disconnect(),
      () => pointerTarget.removeEventListener("pointermove", handlePointerMove),
      () =>
        pointerTarget.removeEventListener("pointerleave", handlePointerLeave),
      () =>
        pointerTarget.removeEventListener("pointercancel", handlePointerLeave),
      () => pipeline?.dispose(),
      () => gpu?.dispose(),
    ]);
  };

  function fail(error: unknown): void {
    if (failed) return;
    failed = true;
    try {
      dispose();
    } catch {
      // Teardown must not replace the live or initialization failure.
    }
    onError?.(error);
  }

  function guard<T>(work: () => T): T | undefined {
    try {
      return work();
    } catch (error) {
      fail(error);
      return undefined;
    }
  }

  const initialize = async () => {
    if (!("gpu" in navigator) || !navigator.gpu) {
      failed = true;
      return false;
    }
    const { init, surface } = await import("vgpu");
    if (disposed) return false;
    const nextGpu = await init({ label: "hero-name-flare" });
    if (disposed) {
      try {
        nextGpu.dispose();
      } catch {
        // Intentional stale initialization is quiet.
      }
      return false;
    }
    gpu = nextGpu;
    const output = surface(gpu, canvas, {
      autoResize: false,
      alphaMode: "opaque",
      format: "bgra8unorm",
    });
    pipeline = new FlarePipeline(gpu, output);
    const rect = canvas.getBoundingClientRect();
    await resize({
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height),
      dpr: window.devicePixelRatio || 1,
    });
    if (disposed || failed) return false;
    light = placement?.logoCenter ?? LOGO_CENTER;
    pointerTarget.addEventListener("pointermove", handlePointerMove);
    pointerTarget.addEventListener("pointerleave", handlePointerLeave);
    pointerTarget.addEventListener("pointercancel", handlePointerLeave);
    observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(canvas);
    if (active) start();
    return true;
  };

  const ready = initialize().catch((error: unknown) => {
    if (disposed && !failed) return false;
    fail(error);
    return false;
  });

  return {
    /** Resolves true once the flare is actually rendering. */
    ready,
    resize,
    dispose,
    /** Re-measures the headline; call after web fonts settle. */
    refresh: () => measure(),
    setActive(next: boolean) {
      if (disposed || active === next) return;
      active = next;
      if (next) start();
      else stop();
    },
    setIntensity(next: number) {
      intensity = Math.min(1, Math.max(0, next));
    },
    /** Vertical parallax in CSS pixels, matched to the headline's own offset. */
    setOffset(px: number) {
      offsetUv = cssHeight > 0 ? px / cssHeight : 0;
    },
  };
}
