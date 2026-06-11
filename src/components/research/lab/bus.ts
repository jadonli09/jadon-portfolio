/**
 * Tiny window-event bus so the command palette, terminal dock, and easter eggs
 * can talk to the toast UI and the project disclosure without prop-drilling.
 * All functions are SSR-guarded.
 */
export type ToastTone = "lime" | "cyan" | "hot";

type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void;
};

// The page uses Lenis smooth-scroll, which ignores native scrollIntoView — so
// navigation must go through the live Lenis instance. A mounted component
// registers it here.
let lenis: LenisLike | null = null;
export function registerLenis(instance: LenisLike | null | undefined) {
  lenis = instance ?? null;
}

export function fireToast(text: string, tone: ToastTone = "lime") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lab:toast", { detail: { text, tone } }));
}

export function toggleMutate(): boolean {
  if (typeof document === "undefined") return false;
  const on = document.documentElement.classList.toggle("mutate");
  fireToast(on ? "🧬 mutation mode engaged" : "genome restored", on ? "hot" : "cyan");
  return on;
}

/** Scroll to a section by id — via Lenis when present, native otherwise. */
export function jumpTo(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function openMethodology() {
  jumpTo("mod-project");
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("lab:open-methodology"));
  fireToast("opening methodology", "cyan");
}
