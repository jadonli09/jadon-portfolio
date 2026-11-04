import { TROPHIES, type Trophy } from "@/lib/data";
import { CAMPS, SCORE_TITLES, endYear } from "./data";
import { THREAD_DEFS, type ThreadDef } from "./threads";
import { ENTRY_DATES } from "./dates";

/** When it happened (ISO), for ordering inside a year. */
const when = (t: Trophy) => ENTRY_DATES[t.title] ?? `${endYear(t.year)}-06-30`;
const byDate = (a: Trophy, b: Trophy) => when(a).localeCompare(when(b));

/**
 * World geometry for the playable climb. Everything is in world pixels and is
 * computed once at module load, so the server and the client agree exactly.
 */

export type Marker =
  | { kind: "camp"; id: string; x: number; year: number }
  | { kind: "flag"; id: string; x: number; t: Trophy; big: boolean }
  | { kind: "summit"; id: string; x: number };

const START_X = 140; // where the hiker stands at the trailhead
const FIRST_CAMP = 520;
const AFTER_CAMP = 230; // camp → first lantern
const STEP = 270; // lantern → lantern
const AFTER_YEAR = 70; // last lantern → next camp

const order = new Map(TROPHIES.map((t, i) => [t, i]));

const markers: Marker[] = [];
const flagX = new Map<Trophy, number>();
const campX = new Map<number, number>();
let x = FIRST_CAMP;
for (const camp of CAMPS) {
  markers.push({ kind: "camp", id: `camp-${camp.year}`, x, year: camp.year });
  campX.set(camp.year, x);
  x += AFTER_CAMP;
  // inside a year, lanterns follow the real order things happened
  const flags = [...camp.flags, ...camp.waypoints].filter((t) => t.w >= 4).sort(byDate);
  for (const t of flags) {
    markers.push({ kind: "flag", id: `flag-${order.get(t)}`, x, t, big: t.w >= 5 });
    flagX.set(t, x);
    x += STEP;
  }
  x += AFTER_YEAR;
}
const SUMMIT_X = x + 220;
markers.push({ kind: "summit", id: "summit", x: SUMMIT_X });

export const MARKERS = markers;
export const START = START_X;
export const SUMMIT = SUMMIT_X;
export const WORLD_W = SUMMIT_X + 1000;

/* ── elevation ──────────────────────────────────────────────── */

const TOP = 640; // sky above the summit
const RISE = 1500;
export const WORLD_H = TOP + RISE + 1100;

const r1 = (v: number) => Math.round(v * 10) / 10;

/** Ground height (world y, down is +) of the trail at world x. */
export function groundY(wx: number): number {
  if (wx <= SUMMIT_X) {
    const u = Math.max(0, wx) / SUMMIT_X;
    const base = 0.3 * u + 0.7 * Math.pow(u, 1.4);
    // gentle undulation that fades out on the summit push
    const wobble = 12 * Math.sin(wx / 230) * (1 - u);
    return TOP + RISE * (1 - base) + wobble;
  }
  const d = wx - SUMMIT_X; // the far side drops away
  return TOP + d * 0.5 + (d * d) / 1600;
}

/** The trail's slope without its undulation — what the camera follows, so it glides. */
export function slopeY(wx: number): number {
  const x = Math.min(Math.max(wx, 0), SUMMIT_X);
  const u = x / SUMMIT_X;
  return TOP + RISE * (1 - (0.3 * u + 0.7 * Math.pow(u, 1.4)));
}

function sampled(x0: number, x1: number, dy: number) {
  const pts: string[] = [];
  for (let wx = x0; wx < x1; wx += 30) pts.push(`${r1(wx)},${r1(groundY(wx) + dy)}`);
  pts.push(`${r1(x1)},${r1(groundY(x1) + dy)}`);
  return pts;
}

/** Mountain silhouette (trail = its top edge) as one SVG path. */
export const TERRAIN_PATH = `M0,${WORLD_H} L${sampled(0, WORLD_W, 0).join(" L")} L${WORLD_W},${WORLD_H} Z`;
/** The walked line itself. */
export const TRAIL_PATH = `M${sampled(0, SUMMIT_X, -2).join(" L")}`;

/* ── threads: achievements that grew over years ─────────────── */

/** Where each thread entry sits along x. Lantern entries keep their lantern's x;
 *  the rest are spread, in data order, between the lanterns of their year. */
const entryX = new Map<Trophy, number>();
const threadTitles = new Set(THREAD_DEFS.flatMap((d) => d.stages.map((s) => s.title)));
const years = CAMPS.map((c) => c.year);
years.forEach((year, yi) => {
  const segEnd = yi + 1 < years.length ? campX.get(years[yi + 1])! - 90 : SUMMIT_X - 120;
  let prev = campX.get(year)! + 170;
  let pending: Trophy[] = [];
  const place = (to: number) => {
    pending.forEach((t, k) => entryX.set(t, prev + ((to - prev) * (k + 1)) / (pending.length + 1)));
    pending = [];
  };
  for (const t of TROPHIES.filter((t) => endYear(t.year) === year && !SCORE_TITLES.has(t.title)).sort(byDate)) {
    const fx = flagX.get(t);
    if (fx !== undefined) {
      place(fx);
      entryX.set(t, fx);
      prev = fx;
    } else if (threadTitles.has(t.title)) {
      pending.push(t);
    }
  }
  place(segEnd);
});

export type LaneNode = { t: Trophy; x: number; label: string; onTrail: boolean; below: boolean; w: number };

/** Rough rendered width of a stage label pill (15px text + year + dot). */
const labelW = (label: string, year: string) => Math.round((label.length + year.length) * 7.8 + 56);
export type Lane = { def: ThreadDef; track: number; x0: number; x1: number; nodes: LaneNode[]; path: string };

export const LANE_TOP = 92; // first lane, below the flower band
export const LANE_GAP = 36;
export const laneY = (track: number, wx: number) => groundY(wx) + LANE_TOP + track * LANE_GAP;

const MIN_NODE_GAP = 230;
const byTitle = new Map(TROPHIES.map((t) => [t.title, t]));

const lanesUnpacked = THREAD_DEFS.map((def) => {
  const nodes: LaneNode[] = def.stages
    .map((s) => {
      const t = byTitle.get(s.title);
      if (!t) throw new Error(`Thread "${def.id}" names a missing entry: ${s.title}`);
      return { t, x: Math.round(entryX.get(t)!), label: s.label, onTrail: flagX.has(t), below: false, w: labelW(s.label, t.year) };
    })
    .sort((a, b) => a.x - b.x);
  // keep stage labels from colliding: lantern stages are pinned to their lantern,
  // the rest slide left (then right) to keep MIN_NODE_GAP between neighbours
  for (let i = nodes.length - 2; i >= 0; i--)
    if (!nodes[i].onTrail && nodes[i].x > nodes[i + 1].x - MIN_NODE_GAP) nodes[i].x = nodes[i + 1].x - MIN_NODE_GAP;
  for (let i = 1; i < nodes.length; i++)
    if (!nodes[i].onTrail && nodes[i].x < nodes[i - 1].x + MIN_NODE_GAP) nodes[i].x = nodes[i - 1].x + MIN_NODE_GAP;
  // where neighbours are still too close (two lanterns a step apart), drop the label under the line
  for (let i = 0; i < nodes.length - 1; i++) if (nodes[i + 1].x - nodes[i].x < nodes[i].w + 16) nodes[i].below = true;
  nodes.forEach((n) => entryX.set(n.t, n.x));
  const x0 = def.spanFrom ? campX.get(def.spanFrom)! + 60 : nodes[0].x - 140;
  const x1 = nodes[nodes.length - 1].x + 60;
  return { def, nodes, x0, x1 };
}).sort((a, b) => a.x0 - b.x0);

// greedy interval packing — lanes that don't overlap share a track
const trackEnds: number[] = [];
export const LANES: Lane[] = lanesUnpacked.map((l) => {
  let track = trackEnds.findIndex((end) => end + 320 < l.x0);
  if (track === -1) track = trackEnds.length;
  trackEnds[track] = l.x1;
  return { ...l, track, path: `M${sampled(l.x0, l.x1, LANE_TOP + track * LANE_GAP).join(" L")}` };
});

/** Which thread an entry belongs to, if any. */
export const THREAD_OF = new Map<Trophy, Lane>(LANES.flatMap((l) => l.nodes.map((n) => [n.t, l] as const)));
/** Where every thread entry sits (for walking to it). */
export const ENTRY_X = entryX;

/* ── meadow: warm wildflowers along the trail ───────────────── */

function hash01(n: number) {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

export const BLOOM_COLORS = ["#ffd45e", "#ffb347", "#ff8f3d", "#ffe08a", "#ff7a4d"];

export const FLOWERS = Array.from({ length: Math.floor(WORLD_W / 11) }, (_, i) => {
  const fx = i * 11 + (hash01(i) - 0.5) * 10;
  const depth = Math.pow(hash01(i + 7), 1.9) * 104 - 6;
  return {
    x: r1(fx),
    y: r1(groundY(fx) + depth),
    r: r1(1.4 + hash01(i + 19) * 3.2 * (1 - depth / 160)),
    c: Math.floor(hash01(i + 31) * BLOOM_COLORS.length),
    o: r1(0.55 + hash01(i + 43) * 0.45),
  };
}).filter((f) => f.x > 0 && f.x < WORLD_W);

/* ── the sky: everything you've walked past ─────────────────── */

/** Sky parallax: the sky layer moves at this fraction of the ground's speed. */
export const SKY_P = 0.6;

export type SkyItem = {
  t: Trophy;
  /** world x of the moment it's passed (it rises then) */
  x: number;
  /** x inside the sky layer */
  sx: number;
  /** vertical slot, 0–1 down the sky band */
  band: number;
  kind: "lantern" | "star";
  big: boolean;
};

const isClimbEntry = (t: Trophy) => t.title.startsWith("Mission Peak");
const skyItems: SkyItem[] = [];
years.forEach((year, yi) => {
  const segStart = campX.get(year)! + 120;
  const segEnd = yi + 1 < years.length ? campX.get(years[yi + 1])! - 60 : SUMMIT_X - 80;
  const inYear = TROPHIES.filter((t) => endYear(t.year) === year && !SCORE_TITLES.has(t.title) && !isClimbEntry(t)).sort(byDate);
  // smaller entries slot in by date between the placed entries around them
  let prev = segStart;
  let run: Trophy[] = [];
  const flush = (to: number) => {
    run.forEach((t, k) => entryX.set(t, prev + ((to - prev) * (k + 1)) / (run.length + 1)));
    run = [];
  };
  for (const t of inYear) {
    const placed = flagX.get(t) ?? entryX.get(t);
    if (placed === undefined) run.push(t);
    else {
      flush(placed);
      prev = placed;
    }
  }
  flush(segEnd);
  for (const t of inYear) {
    const x = flagX.get(t) ?? entryX.get(t)!;
    const lantern = flagX.has(t);
    skyItems.push({ t, x: Math.round(x), sx: 0, band: 0, kind: lantern ? "lantern" : "star", big: t.w >= 5 });
  }
});
skyItems.sort((a, b) => a.x - b.x);
let lanternK = 0;
skyItems.forEach((it, i) => {
  it.sx = Math.round(it.x * SKY_P);
  // lanterns cycle through three rows so neighbouring titles never collide;
  // stars scatter between them
  it.band = it.kind === "lantern" ? [0.12, 0.5, 0.88][lanternK++ % 3] : Math.round(hash01(i + 500) * 100) / 100;
});
export const SKY_ITEMS = skyItems;
