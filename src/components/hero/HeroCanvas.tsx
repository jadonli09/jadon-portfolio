"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { ParticleField } from "./ParticleField";

/** The WebGL hero stage. Lazy-loaded (ssr:false) from the landing page. */
export default function HeroCanvas() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.8]}
      camera={{ position: [0, 2.4, 9], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ParticleField reduced={reduced} />
    </Canvas>
  );
}
