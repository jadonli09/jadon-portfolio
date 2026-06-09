"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Star, Code2, Users, BookOpen } from "lucide-react";
import { Counter } from "@/components/primitives/Counter";
import { Reveal, RevealGroup } from "@/components/primitives/Reveal";
import { Magnetic } from "@/components/primitives/Magnetic";
import { cn } from "@/lib/cn";

interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  followers: number;
  public_repos: number;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  topics: string[];
}

type FetchState = "idle" | "loading" | "success" | "error";

/** Language color mapping — subset of GitHub's linguist palette */
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Rust: "#dea584",
  Go: "#00ADD8",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  default: "var(--muted)",
};

function langColor(lang: string | null) {
  if (!lang) return LANG_COLORS.default;
  return LANG_COLORS[lang] ?? LANG_COLORS.default;
}

/** Deterministic contribution-grid decoration — 12 × 7 cells from a seed */
function ContribGrid({ seed = 42 }: { seed?: number }) {
  // Deterministic pseudo-random using simple LCG
  function lcg(s: number) {
    let state = s;
    return () => {
      state = (state * 1664525 + 1013904223) & 0xffffffff;
      return (state >>> 0) / 0xffffffff;
    };
  }
  const rand = lcg(seed);
  const cols = 26;
  const rows = 7;

  const levels = Array.from({ length: cols * rows }, () => {
    const v = rand();
    if (v < 0.45) return 0;
    if (v < 0.65) return 1;
    if (v < 0.80) return 2;
    if (v < 0.92) return 3;
    return 4;
  });

  const alphas = [0.05, 0.25, 0.5, 0.75, 1];

  return (
    <div
      className="flex flex-wrap gap-[3px]"
      style={{ width: cols * 13 + (cols - 1) * 3 }}
      aria-label="Decorative contribution pattern"
      role="img"
    >
      {Array.from({ length: cols }, (_, c) =>
        Array.from({ length: rows }, (_, r) => {
          const level = levels[c * rows + r];
          return (
            <div
              key={`${c}-${r}`}
              className="size-3 rounded-sm"
              style={{
                background: `rgba(124,156,255,${alphas[level]})`,
              }}
            />
          );
        }),
      )}
    </div>
  );
}

/** Skeleton placeholder for a single repo card */
function RepoSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-5">
      <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--line)]" />
      <div className="h-3 w-full animate-pulse rounded bg-[var(--line)]" />
      <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--line)]" />
      <div className="mt-auto flex gap-3">
        <div className="h-3 w-12 animate-pulse rounded bg-[var(--line)]" />
        <div className="h-3 w-16 animate-pulse rounded bg-[var(--line)]" />
      </div>
    </div>
  );
}

/** A single repo card */
function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor-hover
      className="group flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-5 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_24px_rgba(124,156,255,0.08)]"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
    >
      {/* Repo name */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="size-3.5 shrink-0 text-[var(--accent)]" />
          <span className="font-mono text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
            {repo.name}
          </span>
        </div>
        <ArrowUpRight className="size-3.5 shrink-0 text-[var(--muted)] opacity-0 transition-all group-hover:opacity-100 group-hover:text-[var(--accent)]" />
      </div>

      {/* Description */}
      {repo.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
          {repo.description}
        </p>
      )}

      {/* Meta row */}
      <div className="mt-auto flex items-center gap-4 font-mono text-[0.65rem]">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ background: langColor(repo.language) }}
            />
            <span className="text-[var(--muted)]">{repo.language}</span>
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1 text-[var(--muted)]">
            <Star className="size-3" />
            {repo.stargazers_count}
          </span>
        )}
      </div>
    </motion.a>
  );
}

/** Graceful fallback when GitHub fetch fails */
function GitHubFallback({ user }: { user: string }) {
  const profileUrl = `https://github.com/${user}`;
  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl border border-[var(--line)] bg-[var(--bg-2)] p-8 md:p-12">
      {/* Decorative grid */}
      <Reveal>
        <div className="overflow-hidden rounded-xl border border-[var(--line)] p-4">
          <ContribGrid seed={user.charCodeAt(0) * 31} />
          <p className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
            Contribution pattern · decorative
          </p>
        </div>
      </Reveal>

      {/* Handle */}
      <Reveal delay={0.1} className="text-center">
        <p className="font-mono text-xl font-semibold text-[var(--fg)]">@{user}</p>
        <p className="mt-1 font-mono text-xs text-[var(--muted)]">github.com/{user}</p>
      </Reveal>

      {/* CTA */}
      <Reveal delay={0.2}>
        <Magnetic strength={0.3}>
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor-hover
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-mono text-xs uppercase tracking-widest text-[var(--bg)] transition-all hover:brightness-110 active:scale-95"
          >
            View profile on GitHub <ArrowUpRight className="size-3.5" />
          </a>
        </Magnetic>
      </Reveal>
    </div>
  );
}

/**
 * GitHubShowcase — fetches the GitHub user profile + up to 6 repos client-side.
 * Falls back gracefully on any network/rate-limit failure.
 */
export function GitHubShowcase({ user }: { user: string }) {
  const [state, setState] = useState<FetchState>("idle");
  const [ghUser, setGhUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  useEffect(() => {
    setState("loading");

    async function fetchData() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${user}`, { headers: { Accept: "application/vnd.github+json" } }),
          fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=6`, {
            headers: { Accept: "application/vnd.github+json" },
          }),
        ]);

        if (!userRes.ok) throw new Error(`GitHub user fetch failed: ${userRes.status}`);

        const userData: GitHubUser = await userRes.json();
        const reposData: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

        setGhUser(userData);
        setRepos(Array.isArray(reposData) ? reposData.slice(0, 6) : []);
        setState("success");
      } catch {
        setState("error");
      }
    }

    fetchData();
  }, [user]);

  const profileUrl = `https://github.com/${user}`;

  // Error / offline fallback
  if (state === "error") {
    return <GitHubFallback user={user} />;
  }

  // Loading state
  if (state === "loading" || state === "idle") {
    return (
      <div className="space-y-8">
        {/* Profile skeleton */}
        <div className="flex items-start gap-6">
          <div className="size-20 animate-pulse rounded-full bg-[var(--line)]" />
          <div className="flex flex-col gap-3 pt-2">
            <div className="h-5 w-40 animate-pulse rounded bg-[var(--line)]" />
            <div className="h-4 w-64 animate-pulse rounded bg-[var(--line)]" />
            <div className="flex gap-4">
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--line)]" />
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--line)]" />
            </div>
          </div>
        </div>
        {/* Repo skeletons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <RepoSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="space-y-10">
      {/* Profile header */}
      {ghUser && (
        <Reveal>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <a href={profileUrl} target="_blank" rel="noreferrer noopener" data-cursor-hover>
              <img
                src={ghUser.avatar_url}
                alt={`${ghUser.login} GitHub avatar`}
                width={80}
                height={80}
                className="size-20 rounded-full border-2 border-[var(--accent)] transition-shadow hover:shadow-[0_0_24px_rgba(124,156,255,0.3)]"
              />
            </a>

            {/* Info */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display text-2xl font-semibold md:text-3xl">
                  {ghUser.name ?? ghUser.login}
                </p>
                <span className="font-mono text-sm text-[var(--muted)]">@{ghUser.login}</span>
              </div>

              {ghUser.bio && (
                <p className="max-w-md text-sm text-[var(--muted)]">{ghUser.bio}</p>
              )}

              {/* Stats row */}
              <div className="mt-1 flex flex-wrap gap-5">
                <div className="flex items-center gap-2">
                  <Users className="size-3.5 text-[var(--accent)]" />
                  <span className="font-mono text-xs text-[var(--muted)]">
                    <Counter to={ghUser.followers} className="font-semibold text-[var(--fg)]" /> followers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="size-3.5 text-[var(--accent-2)]" />
                  <span className="font-mono text-xs text-[var(--muted)]">
                    <Counter to={ghUser.public_repos} className="font-semibold text-[var(--fg)]" /> public repos
                  </span>
                </div>
              </div>
            </div>

            {/* Profile link */}
            <Magnetic strength={0.25} className="sm:ml-auto">
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-hover
                className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)]"
              >
                View on GitHub <ArrowUpRight className="size-3.5" />
              </a>
            </Magnetic>
          </div>
        </Reveal>
      )}

      {/* Contribution decoration */}
      <Reveal delay={0.1}>
        <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--bg-2)] p-5">
          <ContribGrid seed={user.charCodeAt(0) * 31 + user.charCodeAt(1) * 7} />
          <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">
            Contribution activity · decorative pattern
          </p>
        </div>
      </Reveal>

      {/* Repos */}
      {repos.length > 0 ? (
        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </RevealGroup>
      ) : (
        <Reveal delay={0.2}>
          <p className="font-mono text-sm text-[var(--muted)]">No public repos found yet.</p>
        </Reveal>
      )}
    </div>
  );
}
