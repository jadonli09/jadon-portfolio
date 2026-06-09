import { Marquee } from "@/components/primitives/Marquee";

const THEMES = [
  "basketball",
  "cooking",
  "study tips",
  "travel",
  "self-improvement",
  "the grind",
  "vlogs",
  "public work",
];

/** Pink ticker band — content themes marquee */
export function LockedMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--bg-2)] py-4">
      {/* Pink glow edge */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--bg-2), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--bg-2), transparent)" }}
        aria-hidden
      />

      <Marquee
        items={THEMES}
        sep="✦"
        durationSec={22}
        className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-[var(--accent)]"
      />
    </div>
  );
}
