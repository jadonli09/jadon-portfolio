"use client";

import { useEffect, useState } from "react";

/**
 * True while the reader is scrolling down past the first screen-top, so
 * floating chrome can step out of the way of the text; false again the moment
 * they scroll up or return near the top.
 */
export function useHideOnScroll(threshold = 80) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        if (y < threshold) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [threshold]);
  return hidden;
}
