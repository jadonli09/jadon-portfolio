/* ────────────────────────────────────────────────────────────────────
   Locks. Static export, so these are doorbells, not vaults: an unlock is
   remembered in localStorage, and `?lock` on any URL clears every lock.

   HOW TO CHANGE WHICH PAGE USES WHICH LOCK
   - Everything uses DEFAULT_GATE unless the page is listed in ROUTE_GATES.
   - Give a page its own lock:      "/research": "lab"   (add "lab" to GATES)
   - Put a page back on the site lock: delete its line in ROUTE_GATES.
   - Leave a page open:             "/contact": null
   - Turn every lock off:           GATE_ENABLED = false
   ──────────────────────────────────────────────────────────────────── */

type StickerGate = {
  /** The sticker puzzle (src/components/chrome/Gate.tsx). */
  kind: "stickers";
  /** localStorage flag set once solved. */
  key: string;
};

type KeypadGate = {
  /** A tile keypad (src/components/chrome/KeypadGate.tsx). */
  kind: "keypad";
  key: string;
  /** The letters to tap, in order. */
  code: string;
  /** Every tile on the pad, in order — must include each letter of `code`. */
  tiles: string;
  /** Headline over the pad. */
  prompt: string;
  /** Ids of other locks whose unlock also opens this one (so the owner isn't asked twice). */
  openedBy?: readonly string[];
};

export type Gate = StickerGate | KeypadGate;

export const GATES = {
  site: { kind: "stickers", key: "jl_unlocked" },
  tks: {
    kind: "keypad",
    key: "jl_unlocked_tks",
    code: "TKS",
    tiles: "MAKJTOWLSNPR",
    prompt: "Enter the code to watch.",
    openedBy: ["site"],
  },
} as const satisfies Record<string, Gate>;

export type GateId = keyof typeof GATES;

/** Master switch for every lock on the site. */
export const GATE_ENABLED = true;

/** The lock every page uses unless it's listed in ROUTE_GATES. */
export const DEFAULT_GATE: GateId | null = "site";

/** Per-page overrides — a different lock, or null for no lock at all. */
export const ROUTE_GATES: Record<string, GateId | null> = {
  // The video portfolio opens with TKS on its own. To put it back behind the
  // site's sticker lock, delete this line.
  "/locked-in": "tks",
};

/** Kept for the sticker gate and the intro, which only care about the site lock. */
export const GATE_KEY = GATES.site.key;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Which lock guards a path (with or without the base path / trailing slash). */
export function gateFor(pathname: string): GateId | null {
  if (!GATE_ENABLED) return null;
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  p = p.replace(/\/+$/, "") || "/";
  return p in ROUTE_GATES ? ROUTE_GATES[p] : DEFAULT_GATE;
}

/** True when this visitor has already opened the lock (or one that opens it). Client only. */
export function isOpen(id: GateId): boolean {
  try {
    const g: Gate = GATES[id];
    const ids = [id, ...(g.kind === "keypad" ? (g.openedBy ?? []) : [])];
    return ids.some((k) => k in GATES && !!localStorage.getItem(GATES[k as GateId].key));
  } catch {
    return false;
  }
}

/** CSS that hides a gate's server-rendered markup once it's open (see GATE_SCRIPT). */
export const GATE_CSS = (Object.keys(GATES) as GateId[])
  .map((id) => `html[data-open~="${id}"] [data-gate="${id}"]{display:none}`)
  .join("");

/**
 * Runs before first paint (see layout) so a returning visitor never sees a gate
 * flash. Marks every open lock on <html data-open="…">. `?lock` clears them all.
 */
export const GATE_SCRIPT = `try{var G=${JSON.stringify(GATES)},L=localStorage;if(/[?&]lock\\b/.test(location.search)){for(var k in G)L.removeItem(G[k].key);sessionStorage.removeItem("jl_intro")}var o=[];for(var id in G){var ids=[id].concat(G[id].openedBy||[]);for(var i=0;i<ids.length;i++)if(L.getItem(G[ids[i]].key)){o.push(id);break}}document.documentElement.dataset.open=o.join(" ")}catch(e){}`;
