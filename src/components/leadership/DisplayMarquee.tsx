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
      className="relative my-20 select-none overflow-hidden border-y-2 border-[rgba(212,175,106,0.3)] py-4 md:my-28 md:py-6"
      aria-hidden
    >
      <span className="marquee-track" style={{ animationDuration: "46s", animationDirection: "reverse" }}>
        {row.map((item, i) => (
          <span
            key={i}
            className="mx-5 inline-flex items-baseline gap-10 font-anton uppercase leading-none tracking-tight md:mx-8"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}
          >
            <span
              style={
                i % 2 === 0
                  ? { color: "transparent", WebkitTextStroke: "1.5px rgba(212,175,106,0.75)" }
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
