"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/base";
import { cn } from "@/lib/cn";

const ZOOM = 2.75;
const LENS = 224;

/**
 * A research poster, read the way you read one at a session: you lean in.
 *
 * On a fine pointer, a lens follows the cursor and magnifies the board under
 * it. On touch and for keyboard users there is no lens — the frame is a link,
 * and it opens the poster at full size. It is the one circular element on a
 * page of hard rectangles, so it reads as an instrument rather than a card.
 */
export function PosterLoupe({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const frameRef = useRef<HTMLAnchorElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [box, setBox] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const track = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setBox({ w: r.width, h: r.height });
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const url = asset(src);
  const on = canHover && lens !== null;

  return (
    <a
      ref={frameRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={track}
      onPointerLeave={() => setLens(null)}
      aria-label={`${alt} — opens the full-size poster`}
      className={cn(
        "group relative block overflow-hidden border border-[var(--line)] bg-black",
        "transition-colors duration-300 hover:border-[var(--accent)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        canHover && "cursor-zoom-in",
        className,
      )}
      style={{ aspectRatio: "4 / 3" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={cn(
          "h-full w-full object-cover transition-[filter] duration-300",
          on && "brightness-[0.55] saturate-[0.85]",
        )}
      />

      {on && lens ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border border-[var(--accent)]"
          style={{
            width: LENS,
            height: LENS,
            left: lens.x - LENS / 2,
            top: lens.y - LENS / 2,
            backgroundImage: `url("${url}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${box.w * ZOOM}px ${box.h * ZOOM}px`,
            backgroundPosition: `${-(lens.x * ZOOM - LENS / 2)}px ${-(lens.y * ZOOM - LENS / 2)}px`,
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.9), 0 0 44px -6px var(--accent), inset 0 0 24px -12px rgba(0,0,0,0.8)",
          }}
        />
      ) : null}
    </a>
  );
}
