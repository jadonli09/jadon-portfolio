/** Shared contract between navigation surfaces and the Develop transition overlay. */

/** How long a world's enter animation gets to cover the screen before navigation fires. */
export const WORLD_NAV_DELAY_MS = 650;

/** Kick off the destination world's transition overlay (listened for in chrome/Develop.tsx). */
export function startWorldTransition(world: string) {
  window.dispatchEvent(new CustomEvent("develop:start", { detail: { world } }));
}
