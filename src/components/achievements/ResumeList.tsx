import Link from "next/link";
import { CAT_META, TROPHIES, type Trophy, type TrophyCat } from "@/lib/data";
import { TRAIL_PHOTOS } from "./climb/photos";
import { ENTRY_ICONS, FALLBACK_ICON } from "./climb/icons";
import { ENTRY_DATES } from "./climb/dates";

const ORDER: TrophyCat[] = ["leadership", "research", "civic", "built", "academic", "court", "personal"];

const when = (t: Trophy) => ENTRY_DATES[t.title] ?? t.year;
/** Biggest first; ties go to the most recent. */
const rank = (a: Trophy, b: Trophy) => b.w - a.w || when(b).localeCompare(when(a));

function Thumb({ t, color }: { t: Trophy; color: string }) {
  const photo = TRAIL_PHOTOS[t.title];
  if (photo)
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={photo.src}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-16 shrink-0 rounded-xl object-cover md:size-[72px]"
        style={{ objectPosition: photo.pos }}
      />
    );
  const I = ENTRY_ICONS[t.title] ?? FALLBACK_ICON;
  return (
    <span className="flex size-16 shrink-0 items-center justify-center rounded-xl md:size-[72px]" style={{ background: `${color}1a` }} aria-hidden>
      <I className="size-7" strokeWidth={1.6} style={{ color }} />
    </span>
  );
}

/** Every achievement on one page, grouped by domain — the quick read next to the climb. */
export function ResumeList() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-9 md:pt-36">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 className="font-display text-[3rem] leading-[0.95] tracking-[-0.02em] md:text-[4.75rem]">Achievements</h1>
        <Link
          href="/achievements"
          className="inline-flex h-14 w-fit items-center rounded-full border border-[var(--line)] bg-[var(--bg-2)] px-7 text-[17px] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-2)]"
        >
          Climb Mission Peak instead
        </Link>
      </div>

      <div className="mt-14 space-y-16 md:mt-20 md:space-y-20">
        {ORDER.map((cat) => {
          const items = TROPHIES.filter((t) => t.cat === cat).sort(rank);
          const { label, color } = CAT_META[cat];
          return (
            <div key={cat}>
              <h2 className="flex items-center gap-3 border-b border-[var(--line)] pb-4 font-serif text-[2rem] leading-none md:text-[2.4rem]">
                <span className="size-3 rounded-full" style={{ background: color }} aria-hidden />
                {label}
              </h2>
              <ul className="grid gap-x-10 md:grid-cols-2">
                {items.map((t) => (
                  <li key={t.title} className="flex gap-4 border-b border-[var(--line)] py-5">
                    <Thumb t={t} color={color} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-[17px] font-semibold leading-snug md:text-[18px]">{t.title}</h3>
                        <span className="shrink-0 text-[15px] tabular-nums text-[var(--muted)]">{t.year}</span>
                      </div>
                      <p className="mt-1 text-[15px] leading-relaxed text-[var(--muted)] md:text-[16px]">{t.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
