import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/lib/data";
import { Magnetic } from "@/components/primitives/Magnetic";
import { FooterNav } from "@/components/chrome/FooterNav";

/** Designed page close: a "where to next" chapter picker + contact links — never a blank white footer. */
/** `seamless`: no band or rule, and no utility links — for the landing, whose closing covers already carry them. */
export function Footer({ seamless = false }: { seamless?: boolean }) {
  return (
    <footer className={`relative px-5 md:px-9 ${seamless ? "pb-16 pt-4 md:pb-24" : "border-t border-[var(--line)] bg-[var(--bg-2)] py-16 md:py-24"}`}>
      <div className={`mx-auto ${seamless ? "max-w-[1360px]" : "max-w-6xl"}`}>
        <FooterNav extras={!seamless} />
        <div className="flex flex-col justify-between gap-8 border-t border-[var(--line)] pt-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-2xl">{PROFILE.name}</p>
            <p className="mt-1.5 text-base text-[var(--muted)]">
              {PROFILE.school}, {PROFILE.city}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-base">
            {[
              { label: "Instagram", href: PROFILE.links.instagram },
              { label: "LinkedIn", href: PROFILE.links.linkedin },
              { label: "GitHub", href: PROFILE.links.github },
              { label: "Email", href: `mailto:${PROFILE.email}` },
            ].map((l) => (
              <Magnetic key={l.label} strength={0.3}>
                <a href={l.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 py-2 text-[var(--muted)] transition-colors hover:text-[var(--fg)]">
                  {l.label}
                  <ArrowUpRight className="size-4 transition-[translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
