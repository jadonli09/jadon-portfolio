"use client";

import { usePathname } from "next/navigation";
import { GATES, gateFor } from "@/lib/gate";
import { Gate } from "@/components/chrome/Gate";
import { KeypadGate } from "@/components/chrome/KeypadGate";

/**
 * Picks the lock for the current page (lib/gate.ts → gateFor) and renders it.
 * Keyed by lock id, so walking from a page on one lock to a page on another
 * swaps the screen instead of carrying the first one's state over.
 */
export function Gates() {
  const id = gateFor(usePathname() ?? "/");
  if (!id) return null;
  return GATES[id].kind === "stickers" ? <Gate key={id} /> : <KeypadGate key={id} id={id} />;
}
