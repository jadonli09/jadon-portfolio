"use client";

import dynamic from "next/dynamic";

/** Client wrapper that code-splits the WebGL canvas so it never blocks first paint. */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export function HeroStage() {
  return (
    <div className="absolute inset-0 -z-0" aria-hidden>
      {/* CSS fallback gradient sits beneath the canvas; if WebGL fails the page still has atmosphere. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(217,96,63,0.22), transparent 55%), radial-gradient(90% 60% at 50% 120%, rgba(232,177,90,0.18), transparent 60%)",
        }}
      />
      <HeroCanvas />
      {/* vignette to sink the particles into the void */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(110% 110% at 50% 35%, transparent 40%, #07070a 100%)" }}
      />
    </div>
  );
}
