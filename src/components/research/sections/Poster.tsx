import { asset } from "@/lib/base";
import { FUS, FUS_IMAGES } from "../lab/content";
import { Photo } from "@/components/primitives/Photo";
import { Section, aspectFrom } from "./Section";

const SHOTS = ["bench", "session", "photo"] as const;

export function Poster() {
  return (
    <Section id="poster" kicker="Poster session · August 2026" heading={FUS.title}>
      <p className="mb-2 max-w-[70ch] text-[0.95rem] leading-[1.6] text-[var(--muted)]">
        {FUS.authors}
      </p>
      <p className="mb-8 max-w-[70ch] text-[0.9rem] leading-[1.6] text-[var(--muted)]">
        {FUS.affiliations} · mentored by {FUS.mentor}
      </p>

      <a
        href={asset(FUS_IMAGES.poster.src)}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-[var(--line)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <div className="relative w-full bg-black" style={aspectFrom(FUS_IMAGES.poster.dims)}>
          <Photo src={FUS_IMAGES.poster.src} alt={FUS_IMAGES.poster.alt} />
        </div>
      </a>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SHOTS.map((k) => {
          const f = FUS_IMAGES[k];
          return (
            <figure key={k} className="m-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--line)]">
                <Photo src={f.src} alt={f.alt} />
              </div>
              <figcaption className="mt-2 font-mono text-[0.64rem] leading-[1.5] text-[var(--muted)]">
                {f.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
