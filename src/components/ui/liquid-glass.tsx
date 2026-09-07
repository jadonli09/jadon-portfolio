"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────────────────────────
   Liquid glass — a pane that refracts whatever is moving behind it.

   Two layers doing two different jobs:

     · The BACKDROP is displaced by an SVG turbulence filter, so what shows
       through is bent rather than merely blurred. That is what separates
       this from a frosted panel: the distortion moves when the content
       behind it moves.
     · The SHELL is a stack of inset shadows that fake the thick, rounded
       edge of a real lens — bright where light would catch the bevel, dark
       where the glass turns away.

   It only earns its keep over live content. On flat ground there is nothing
   to refract and it degrades to an expensive rectangle, so this is used in
   exactly one place: over the hero's moving corridor of screenshots.
   ──────────────────────────────────────────────────────────────────── */

/** One filter for the whole page, mounted once by whoever renders the glass. */
export const GLASS_FILTER_ID = "liquid-glass-displace";

/**
 * The displacement map. Rendered once per page — the `<div>`s below all point
 * their `backdrop-filter` at this one `id`.
 */
export function LiquidGlassFilter() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0">
      <defs>
        <filter
          id={GLASS_FILTER_ID}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Low-frequency noise: big, slow undulations, not sandpaper. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="2"
            seed="4"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softNoise" />
          {/*
            Scale is the whole character of the material. The reference used 70,
            which smears a screenshot into abstraction; at 14 the picture behind
            stays a picture and merely bends, which is what glass does.
          */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.4" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * A pane of the material. Children sit above the glass; the refraction happens
 * behind them.
 */
export function LiquidGlass({
  className,
  contentClassName,
  children,
  onPointerMove,
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * Layout for the content layer. It has to go here rather than on the pane:
   * the pane's own children are the backdrop, the bevel and this one wrapper,
   * so a `grid` on the pane would lay out those three and stack the real
   * content inside a single cell.
   */
  contentClassName?: string;
}) {
  const paneRef = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);

  React.useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  /*
    Where the light is. The pointer's position is written to the pane as two
    custom properties and CSS does the rest — see `.liquid-glass-glow`.

    Read inside a rAF because the handler is the one place here that touches
    layout (`getBoundingClientRect`), and a pointer can fire faster than the
    screen refreshes. Coordinates are pulled off the event BEFORE the frame is
    queued: by the time it runs the event is stale.
  */
  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const { clientX, clientY } = e;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = paneRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      el.style.setProperty("--lg-x", `${((clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--lg-y", `${((clientY - r.top) / r.height) * 100}%`);
    });
  };

  return (
    /*
      Deliberately just `relative`. `isolation: isolate`, an `opacity` below 1,
      a `filter` or a `mask` on THIS element would each make it a backdrop root
      — and a backdrop-filtered child of a backdrop root samples only its
      parent's own content, which here is nothing. The pane would go clear and
      the effect would silently vanish. The same applies to anything that wraps
      it: never fade a `<LiquidGlass>` in by animating an ancestor's opacity.

      Layer order is document order, so no z-index is needed and none is used —
      a negative z-index here would punch the backdrop through the hero's own
      stacking context.
    */
    <div
      ref={paneRef}
      className={cn("liquid-glass relative", className)}
      onPointerMove={track}
      {...props}
    >
      {/*
        The refracting backdrop. The blur/saturate pair is the FALLBACK and is
        declared unconditionally in CSS: Safari has shipped `backdrop-filter`
        for years but not `url()` filters inside it, so a lone url() there
        yields plain, undistorted content showing through. `@supports` upgrades
        it only where the filter is real.
      */}
      <div aria-hidden className="liquid-glass-backdrop absolute inset-0" />
      {/*
        The moving highlight. Its own element rather than another background on
        the sheen, so the fade in and out is a plain `opacity` transition — a
        custom property inside a gradient does not interpolate without being
        registered with `@property`, and would snap on and off.

        Under the sheen on purpose: the fixed specular is the edge of the glass
        and stays on top of whatever is travelling through it.
      */}
      <div aria-hidden className="liquid-glass-glow pointer-events-none absolute inset-0" />
      {/*
        The sheen. A pane of white over a white page is invisible — the only
        parts of real glass you can see against paper are the light it catches
        and the shadow it drops. So the material is faintly COOLER than the
        ground, with a specular run across its upper edge; that tint is what
        makes it a thing sitting on the page rather than a hole in it.
      */}
      <div aria-hidden className="liquid-glass-sheen pointer-events-none absolute inset-0" />
      {/* The bevel. A shadow stack only — it paints nothing of its own. */}
      <div aria-hidden className="liquid-glass-shell pointer-events-none absolute inset-0" />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}
