import { ArrowUpRight } from "lucide-react";
import { Rise, RiseGroup, RiseItem } from "@/components/built/Rise";
import { asset } from "@/lib/base";
import { PROJECTS } from "@/lib/data";

/* ────────────────────────────────────────────────────────────────────
   The index. Every product on the page, with the way in to each.

   This used to be four GitHub repos — a hand-picked subset, in a section
   headed "Build something people use", listing the one thing on the page that
   nobody uses. The page argues that eight products are live; the last thing on
   it should be those eight, addressable, in the order the page introduced them.

   `PROJECTS` order IS display order, and the row's mark is the product's own
   icon, so the list can be read by logo before it is read by name.
   ──────────────────────────────────────────────────────────────────── */

export function Closing({ githubUser }: { githubUser: string }) {
  return (
    <section className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-9 md:py-20">
        <Rise>
          <h2 className="t-title text-balance">Explore the projects</h2>
        </Rise>

        <RiseGroup className="mt-8" delayChildren={0.08}>
          {PROJECTS.map((p) => (
            <RiseItem key={p.slug}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-hover
                className="row flex items-center gap-4 rounded-xl border-b border-[var(--line)] px-3 py-3.5"
              >
                {/*
                  Decorative — the product's name is the very next thing in the
                  row, so an alt text here would say it twice. A product with no
                  mark of its own keeps the slot, so the names stay in a column
                  instead of stepping left and right down the list.
                */}
                <span className="flex size-7 shrink-0 items-center justify-center">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset(p.logo)}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="max-h-full max-w-full rounded-[5px] object-contain"
                    />
                  ) : null}
                </span>

                <span className="t-sub">{p.name}</span>

                <span className="ml-auto flex items-center gap-3">
                  <span className="t-small hidden text-[0.8rem] sm:inline">
                    {p.domain}
                  </span>
                  <ArrowUpRight className="lean size-4 text-[var(--muted)]" />
                </span>
              </a>
            </RiseItem>
          ))}
        </RiseGroup>

        {/* The code is still one click away — it is just no longer the list. */}
        <Rise delay={0.1}>
          <a
            href={`https://github.com/${githubUser}`}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor-hover
            className="mt-10 inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-sm font-medium underline-offset-4 hover:underline"
          >
            The code, on GitHub <ArrowUpRight className="size-4 shrink-0" />
          </a>
        </Rise>
      </div>
    </section>
  );
}
