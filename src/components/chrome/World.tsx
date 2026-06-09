import type { WorldId } from "@/lib/data";
import { cn } from "@/lib/cn";

/**
 * Per-page theme wrapper. Sets the colour world via `data-world` so each page
 * paints its own --bg/--fg/--accent. SSR-safe (no flash) because the wrapper
 * itself carries the variables and the background.
 */
export function World({
  id,
  children,
  className,
}: {
  id: WorldId;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      data-world={id}
      className={cn("relative min-h-screen w-full bg-[var(--bg)] text-[var(--fg)]", className)}
    >
      {children}
    </main>
  );
}
