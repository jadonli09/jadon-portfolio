const ITEMS = [
  "Winter Ball",
  "Car Meet",
  "Graduation",
  "Homecoming ×3",
  "Scavenger Hunt",
  "Senior Breakfast",
  "Climbing Wall",
];

/**
 * DisplayMarquee — a poster-scale Anton marquee with alternating
 * outlined / solid-gold words. The loud cousin of the small mono ticker:
 * same kinetic energy, completely different scale and texture.
 * Server component — CSS animation only.
 */
export function DisplayMarquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className="relative my-10 select-none overflow-hidden border-y border-[rgba(212,175,106,0.3)] py-2.5 md:my-14 md:py-3"
      aria-hidden
    >
      <span className="marquee-track" style={{ animationDuration: "46s", animationDirection: "reverse" }}>
        {row.map((item, i) => (
          <span
            key={i}
            className="mx-4 inline-flex items-baseline gap-6 font-anton uppercase leading-none tracking-tight md:mx-6"
            style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)" }}
          >
            <span
              style={
                i % 2 === 0
                  ? { color: "transparent", WebkitTextStroke: "1px rgba(212,175,106,0.75)" }
                  : { color: "var(--accent)" }
              }
            >
              {item}
            </span>
            <span aria-hidden className="text-[0.4em]" style={{ color: "var(--accent-2)" }}>
              ◆
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
