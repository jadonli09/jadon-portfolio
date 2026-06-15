"use client"; // Required for state and event handlers

import * as React from "react";
import { cn } from "@/lib/cn";

// --- PROPS INTERFACE ---
interface InteractiveProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  description: string;
  /** Optional small pill badge (originally the price). */
  price?: string;
  /** Optional brand/logo image rendered top-right of the glass header. */
  logoUrl?: string;
  /**
   * Optional transparent cut-out of the subject, pixel-aligned with `imageUrl`.
   * When provided it renders ON TOP of the glass header so the subject is in the
   * very front layer (their face is never covered by the header box).
   */
  cutoutUrl?: string;
  /** Decorative pagination dots (off by default — only for real carousels). */
  showDots?: boolean;
}

const REST = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

// --- COMPONENT DEFINITION ---
export function InteractiveProductCard({
  className,
  imageUrl,
  logoUrl,
  cutoutUrl,
  title,
  description,
  price,
  showDots = false,
  ...props
}: InteractiveProductCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const reducedRef = React.useRef(false);

  const [transform, setTransform] = React.useState(REST);
  const [transition, setTransition] = React.useState("transform 0.4s ease-in-out");
  // Cursor-tracking light: position (%) + intensity for the specular glare.
  const [glare, setGlare] = React.useState({ x: 50, y: 28, opacity: 0 });

  React.useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // --- MOUSE MOVE HANDLER (tilt + lighting) ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reducedRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y - height / 2) / (height / 2)) * -8; // Max rotation 8deg
    const rotateY = ((x - width / 2) / (width / 2)) * 8; //   Max rotation 8deg

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
    );
    setTransition("transform 0.1s ease-out");
    setGlare({ x: (x / width) * 100, y: (y / height) * 100, opacity: 1 });
  };

  // --- MOUSE LEAVE HANDLER ---
  const handleMouseLeave = () => {
    setTransform(REST);
    setTransition("transform 0.4s ease-in-out");
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition }}
      className={cn(
        // Flat layers (no preserve-3d) so the cut-out stays pixel-aligned with the
        // background photo while the whole card tilts as one plane. overflow-hidden
        // clips every layer to the rounded card.
        "group relative w-full max-w-[340px] aspect-[9/12] overflow-hidden rounded-3xl shadow-lg",
        className
      )}
      {...props}
    >
      {/* L0 — background photo (the scene, with subject) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* L1 — gradient: darkens the scene so the subject (L3) pops + text is legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/15" />

      {/* L2 — glass header (sits BEHIND the subject) */}
      <div className="absolute inset-x-0 top-0 flex flex-col p-5">
        <div className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-xs text-white/70">{description}</p>
          </div>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-4 w-auto" />
          ) : null}
        </div>
        {price ? (
          <div className="mt-3 self-start">
            <div className="rounded-full bg-black/40 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              {price}
            </div>
          </div>
        ) : null}
      </div>

      {/* L3 — the subject, cut out and pixel-aligned with L0, in the VERY FRONT */}
      {cutoutUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cutoutUrl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center drop-shadow-[0_10px_28px_rgba(0,0,0,0.5)]"
        />
      ) : null}

      {/* L4 — LIGHTING: cursor-tracking light, on top so it falls on the subject too */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-200"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7), rgba(255,255,255,0) 46%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-200"
        style={{
          opacity: glare.opacity * 0.55,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(232,177,90,0.4), transparent 42%)`,
        }}
      />

      {/* Optional decorative pagination dots */}
      {showDots ? (
        <div className="absolute inset-x-0 bottom-0 flex w-full justify-center gap-2 pb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                index === 0 ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
