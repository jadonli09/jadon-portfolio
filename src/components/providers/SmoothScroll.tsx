"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * On navigation, send Lenis back to the top of the new page — unless the URL has a
 * hash (a "back to the story" return), which the target page scrolls to itself.
 * Without this, Lenis keeps the previous scroll position and you land mid/bottom.
 */
function ScrollReset() {
  const lenis = useLenis();
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);
  return null;
}

/**
 * Lenis inertia scrolling for the whole document. Disabled automatically when
 * the user prefers reduced motion (native scrolling takes over).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
