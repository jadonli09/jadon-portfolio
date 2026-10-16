import type { WorldId } from "@/lib/data";
import { cn } from "@/lib/cn";
import { DeepDiveBar } from "@/components/chrome/DeepDiveBar";

/**
 * Per-page theme wrapper for a deep-dive world. Sets the colour world via
 * `data-world` and renders the always-available "back to the story" affordance.
 * SSR-safe (no flash) because the wrapper carries the variables and background.
 */
export function World({
  id,
  children,
  className,
  homeBar = true,
}: {
  id: WorldId;
  children: React.ReactNode;
  className?: string;
  /** Hide the floating Home button (a full-screen page that needs its corners). */
  homeBar?: boolean;
}) {
  return (
    <main
      data-world={id}
      className={cn("relative min-h-screen w-full bg-[var(--bg)] text-[var(--fg)]", className)}
    >
      {children}
      {id !== "built" && homeBar && <DeepDiveBar id={id} />}
    </main>
  );
}
