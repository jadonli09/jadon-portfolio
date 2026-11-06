import { TROPHIES, type Trophy } from "@/lib/data";

/** Score entries are shown once, at the summit — so they're pulled out of the waypoints. */
export const SCORE_TITLES = new Set(["SAT 1540", "ACT 35", "11 APs, all 5s"]);
const isClimb = (t: Trophy) => t.title.startsWith("Mission Peak");

/** A range like "2021–23" or "2023–26" belongs to the camp of its end year. */
export function endYear(year: string): number {
  const m = year.match(/(\d{4})(?:\s*[–-]\s*(\d{2,4}))?/);
  if (!m) return 2026;
  if (m[2]) return m[2].length === 2 ? 2000 + Number(m[2]) : Number(m[2]);
  return Number(m[1]);
}

export type Camp = {
  year: number;
  /** That year's Mission Peak entry, if the archive has one — shown as the photo caption. */
  climb: Trophy | null;
  flags: Trophy[];
  waypoints: Trophy[];
};

export const CAMPS: Camp[] = [2021, 2022, 2023, 2024, 2025, 2026].map((year) => {
  const inYear = TROPHIES.filter((t) => endYear(t.year) === year && !SCORE_TITLES.has(t.title));
  const climb = inYear.find(isClimb) ?? null;
  const rest = inYear.filter((t) => !isClimb(t));
  return {
    year,
    climb,
    flags: rest.filter((t) => t.w >= 5),
    // heaviest first, so a skim catches the big ones
    waypoints: rest.filter((t) => t.w < 5).sort((a, b) => b.w - a.w),
  };
});
