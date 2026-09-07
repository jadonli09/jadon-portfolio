import { ArrowUpRight } from "lucide-react";
import { Rise, RiseGroup, RiseItem } from "@/components/built/Rise";

/** The code, in public. One row per repo — no ornament. */
const REPOS = [
  { name: "jadon-portfolio", lang: "TypeScript" },
  { name: "hermes", lang: "JavaScript" },
  { name: "LockedIn", lang: "Swift" },
  { name: "cuesheet", lang: "TypeScript" },
];

export function Closing({ githubUser }: { githubUser: string }) {
  return (
    <section className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-3xl px-5 py-24 md:px-9 md:py-32">
        <Rise>
          <h2 className="t-title text-balance">
            Build something people use.
          </h2>
        </Rise>

        <Rise delay={0.06}>
          <p className="t-body mt-6">
            Every product on this page started as the same question — what if there
            were a better way to do this? The answer never changes. Build it, put it
            in front of someone, and find out whether you were right.
          </p>
        </Rise>

        <RiseGroup className="mt-14" delayChildren={0.08}>
          {REPOS.map((r) => (
            <RiseItem key={r.name}>
              <a
                href={`https://github.com/${githubUser}/${r.name}`}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-hover
                className="row flex items-center justify-between gap-4 rounded-xl border-b border-[var(--line)] px-3 py-3.5"
              >
                <span className="t-sub font-mono text-[0.95rem]">{r.name}</span>
                <span className="flex items-center gap-3">
                  <span className="t-small text-[0.8rem]">{r.lang}</span>
                  <ArrowUpRight className="lean size-4 text-[var(--muted)]" />
                </span>
              </a>
            </RiseItem>
          ))}
        </RiseGroup>
      </div>
    </section>
  );
}
