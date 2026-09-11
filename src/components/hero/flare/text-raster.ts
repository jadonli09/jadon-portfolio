/**
 * Replaces the example's `logo-raster.ts`.
 *
 * Upstream rasterized a fixed Next.js logo SVG whose paths are *stroked*, not
 * filled — that outline is what the rim pass dilates and the composite pass
 * ray-marches into streaks. To keep the same behaviour the headline is drawn
 * with `strokeText`, so the flare catches the contours of the letterforms
 * rather than flooding a solid block of ink.
 */

export interface PixelBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface HeadlineStyle {
  readonly text: string;
  readonly fontFamily: string;
  readonly fontWeight: string;
  readonly fontStyle: string;
  /** CSS pixels. */
  readonly fontSize: number;
  /** CSS pixels — the line box height, which is also the measured box height. */
  readonly lineHeight: number;
  /** CSS pixels. */
  readonly letterSpacing: number;
}

export interface HeadlineMeasurement {
  readonly box: PixelBox;
  readonly style: HeadlineStyle;
}

export interface HeadlineRaster {
  readonly canvas: HTMLCanvasElement;
  /**
   * The box the raster actually covers, in CSS pixels and in the same space as
   * the measured box. Wider and taller than the measured box whenever the
   * glyphs overflow their line box, which they do at tight leading.
   */
  readonly box: PixelBox;
}

/** Ink colour of the raster. Matches the stop colour of the upstream logo gradients. */
const STROKE_COLOR = "#EDEDED";
/** Stroke weight as a fraction of font size — tuned to read like the logo's hairlines. */
const STROKE_RATIO = 0.02;

/**
 * Position of `element` inside `ancestor` using layout offsets rather than
 * `getBoundingClientRect`.
 *
 * This is deliberate: the headline is wrapped in transforms (an entrance slide
 * and a scroll parallax), and `offsetLeft`/`offsetTop` ignore transforms. That
 * keeps the measurement stable no matter when it runs, so a resize that lands
 * mid-animation still places the flare correctly.
 */
function offsetWithin(
  element: HTMLElement,
  ancestor: HTMLElement
): PixelBox | undefined {
  const box = { width: element.offsetWidth, height: element.offsetHeight };
  if (element === ancestor) return { x: 0, y: 0, ...box };
  let node: HTMLElement = element;
  let x = 0;
  let y = 0;
  for (;;) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const parent = node.offsetParent;
    if (!(parent instanceof HTMLElement)) return undefined;
    if (parent === ancestor) return { x, y, ...box };
    node = parent;
  }
}

function parsePx(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function measureHeadline(
  element: HTMLElement,
  ancestor: HTMLElement
): HeadlineMeasurement | undefined {
  const box = offsetWithin(element, ancestor);
  if (!box || box.width <= 0 || box.height <= 0) return undefined;
  const text = (element.textContent ?? "").trim();
  if (!text) return undefined;
  const computed = window.getComputedStyle(element);
  const fontSize = parsePx(computed.fontSize);
  if (fontSize <= 0) return undefined;
  return {
    box,
    style: {
      text,
      fontFamily: computed.fontFamily,
      fontWeight: computed.fontWeight || "400",
      fontStyle: computed.fontStyle || "normal",
      fontSize,
      // The element's own height is the line box, so no line-height parsing.
      lineHeight: box.height,
      letterSpacing: parsePx(computed.letterSpacing),
    },
  };
}

function fontShorthand(style: HeadlineStyle, scale: number): string {
  return `${style.fontStyle} ${style.fontWeight} ${style.fontSize * scale}px ${
    style.fontFamily
  }`;
}

/** Web fonts load late; rasterizing early bakes the fallback face into the texture. */
export async function waitForFont(
  style: HeadlineStyle,
  signal?: AbortSignal
): Promise<void> {
  const fonts = document.fonts;
  if (!fonts) return;
  try {
    await fonts.load(fontShorthand(style, 1), style.text);
    await fonts.ready;
  } catch {
    // A font that refuses to load still rasterizes in the fallback face.
  }
  if (signal?.aborted)
    throw new DOMException("Headline rasterization aborted.", "AbortError");
}

/** Applies the shared text state, so measuring and drawing can never disagree. */
function applyTextStyle(
  context: CanvasRenderingContext2D,
  style: HeadlineStyle,
  scale: number
): void {
  context.font = fontShorthand(style, scale);
  // Chrome-only, and WebGPU is Chrome-only today, but the flare still reads
  // correctly without it — the glyphs just sit a hair wider than the DOM text.
  if ("letterSpacing" in context)
    context.letterSpacing = `${style.letterSpacing * scale}px`;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
}

export async function rasterizeHeadline(
  style: HeadlineStyle,
  box: PixelBox,
  scale: number,
  pad: number,
  signal?: AbortSignal
): Promise<HeadlineRaster> {
  if (signal?.aborted)
    throw new DOMException("Headline rasterization aborted.", "AbortError");
  await waitForFont(style, signal);

  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) throw new Error("Could not measure the headline.");
  applyTextStyle(probe, style, scale);
  const metrics = probe.measureText(style.text);

  const lineBox = Math.max(1, Math.round(box.height * scale));
  const advance = Math.max(1, Math.round(box.width * scale));
  const fontAscent =
    metrics.fontBoundingBoxAscent || style.fontSize * scale * 0.8;
  const fontDescent =
    metrics.fontBoundingBoxDescent || style.fontSize * scale * 0.2;
  // CSS half-leading: where the baseline sits inside the element's line box.
  const baselineInBox = (lineBox - (fontAscent + fontDescent)) / 2 + fontAscent;

  const strokeWidth = Math.max(1, style.fontSize * scale * STROKE_RATIO);
  // Half the stroke straddles the outline, plus a texel for antialiasing.
  const slack = strokeWidth / 2 + 1;

  /*
   * The element's line box is NOT the glyph's ink box — at `leading-[0.85]`
   * the letterforms are taller than the line they sit on. Sizing the canvas to
   * the line box therefore sliced the caps off top and bottom, and the flare
   * lit those straight cut edges as a hard rectangle around the name. Bleed the
   * canvas out to the real ink instead, and report the enlarged box back so the
   * placement still maps the texture 1:1 onto the DOM text.
   */
  const inkAscent = metrics.actualBoundingBoxAscent || fontAscent;
  const inkDescent = metrics.actualBoundingBoxDescent || fontDescent;
  const inkLeft = metrics.actualBoundingBoxLeft || 0;
  const inkRight = metrics.actualBoundingBoxRight || metrics.width;

  const cap = style.fontSize * scale * 2;
  const clampBleed = (value: number) =>
    Math.ceil(Math.min(Math.max(value, 0), cap));
  const bleedTop = clampBleed(inkAscent + slack - baselineInBox);
  const bleedBottom = clampBleed(
    baselineInBox + inkDescent + slack - lineBox
  );
  const bleedLeft = clampBleed(inkLeft + slack);
  const bleedRight = clampBleed(inkRight + slack - advance);

  const width = advance + bleedLeft + bleedRight;
  const height = lineBox + bleedTop + bleedBottom;
  const canvas = document.createElement("canvas");
  canvas.width = width + pad * 2;
  canvas.height = height + pad * 2;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the headline raster canvas.");

  applyTextStyle(context, style, scale);
  context.strokeStyle = STROKE_COLOR;
  context.lineWidth = strokeWidth;
  context.lineJoin = "round";
  context.miterLimit = 2;
  context.strokeText(
    style.text,
    pad + bleedLeft,
    pad + bleedTop + baselineInBox
  );

  if (signal?.aborted)
    throw new DOMException("Headline rasterization aborted.", "AbortError");
  return {
    canvas,
    box: {
      x: box.x - bleedLeft / scale,
      y: box.y - bleedTop / scale,
      width: box.width + (bleedLeft + bleedRight) / scale,
      height: box.height + (bleedTop + bleedBottom) / scale,
    },
  };
}
