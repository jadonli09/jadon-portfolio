import { ALBUMS } from "@/lib/data";
import { asset } from "@/lib/base";
import { Reveal } from "@/components/primitives/Reveal";

/**
 * The albums themselves — six titled rolls, masonry-flowed at natural aspect
 * so group shots and drone panoramas are never cropped.
 */
export function AlbumGallery() {
  return (
    <section className="relative border-t border-[var(--line)] px-5 pb-28 md:px-9">
      {ALBUMS.map((album) => (
        <div key={album.id} id={album.id} className="mx-auto max-w-6xl scroll-mt-24 pt-20 md:pt-28">
          <Reveal>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-mono text-xs text-[var(--accent)]">{album.index}</span>
              <h2 className="font-anton text-4xl uppercase leading-none tracking-tight md:text-6xl">
                {album.title}
              </h2>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--muted)]">
                {album.kicker} · {album.photos.length} frames
              </span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">{album.blurb}</p>
          </Reveal>

          <div className="mt-8 columns-2 gap-4 md:columns-3 md:gap-5">
            {album.photos.map((photo) => (
              <Reveal key={photo.src} className="mb-4 break-inside-avoid md:mb-5">
                <figure className="group">
                  <div className="overflow-hidden rounded-md border border-[var(--line)] bg-[var(--bg-2)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(photo.src)}
                      alt={photo.caption}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]">
                    {photo.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
