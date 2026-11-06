"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { CAT_META, type Trophy } from "@/lib/data";
import { CAMPS } from "./data";
import { CAMP_PHOTOS, SUMMIT_PHOTO, TRAIL_PHOTOS, type ClimbPhoto } from "./photos";
import { ENTRY_ICONS, FALLBACK_ICON } from "./icons";
import {
  BLOOM_COLORS,
  FLOWERS,
  LANES,
  MARKERS,
  SKY_ITEMS,
  SKY_P,
  START,
  SUMMIT,
  TERRAIN_PATH,
  THREAD_OF,
  TRAIL_PATH,
  WORLD_H,
  WORLD_W,
  groundY,
  laneY,
  slopeY,
  type Lane,
  type Marker,
  type SkyItem,
} from "./layout";

/* ── tuning ─────────────────────────────────────────────────── */

const WALK = 440; // px/s for a tap or the first moment of a hold
const SPRINT = 1100; // px/s between lanterns once the hold settles in
const PASS = 380; // px/s while a lantern goes by, so its caption gets a beat
const RUN = 2600; // px/s cap when walking somewhere from the rail
const NEAR = 140; // px — the lantern you're next to glows brighter
const HIKER_W = 44;
const HIKER_H = 66;

/* ── palette (night meadow) ─────────────────────────────────── */

const INK = "#f4efe6";
const MUTED = "#8fa6c4";
const GLOW = "#ffc94d";
const SKY_TOP = ["#030c20", "#04102a", "#061636"];
const SKY_LOW = ["#0b2d55", "#0f3966", "#174a7a"];

function hex(c: string) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(stops: string[], p: number) {
  const s = Math.min(Math.max(p, 0), 1) * (stops.length - 1);
  const i = Math.min(Math.floor(s), stops.length - 2);
  const f = s - i;
  const a = hex(stops[i]);
  const b = hex(stops[i + 1]);
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(",")})`;
}
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/* ── what a hover card can show ─────────────────────────────── */

type Showable = Marker | { kind: "entry"; id: string; t: Trophy };
type HoverApi = { show: (o: Showable) => void; hide: () => void };

const CAMP_BY_YEAR = new Map(CAMPS.map((c) => [c.year, c]));
const entry = (t: Trophy): Showable => ({ kind: "entry", id: `entry-${t.title}`, t });

/** Pointer + keyboard wiring shared by everything that brings out a card. */
function hoverHandlers(o: Showable, api: HoverApi) {
  return {
    "data-hover-anchor": "",
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => e.pointerType === "mouse" && api.show(o),
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => e.pointerType === "mouse" && api.hide(),
    onFocus: () => api.show(o),
    onBlur: () => api.hide(),
    onClick: () => api.show(o), // taps on touch screens
  };
}

const glass = "border border-white/[0.14] bg-[rgba(8,22,44,0.82)]"; // no backdrop blur: dozens of these move every frame

/* ── pieces of the world ────────────────────────────────────── */

function Hiker({ lamp }: { lamp: boolean }) {
  return (
    <svg width={HIKER_W} height={HIKER_H} viewBox="0 0 44 66" aria-hidden className="overflow-visible">
      <polygon points="30,13 118,-6 118,40" fill="#ffe7a8" opacity={lamp ? 0.16 : 0} style={{ transition: "opacity 1s" }} />
      <rect x="6" y="20" width="12" height="18" rx="3" fill="#ff9a3c" />
      <rect x="14" y="18" width="14" height="22" rx="5" fill="#e8eef7" />
      <g className="climb-leg climb-leg-a" style={{ transformOrigin: "21px 40px" }}>
        <rect x="16" y="38" width="6" height="22" rx="3" fill="#22314f" />
        <rect x="15" y="57" width="10" height="5" rx="2" fill="#111a2c" />
      </g>
      <g className="climb-leg climb-leg-b" style={{ transformOrigin: "21px 40px" }}>
        <rect x="20" y="38" width="6" height="22" rx="3" fill="#2d3f63" />
        <rect x="19" y="57" width="10" height="5" rx="2" fill="#111a2c" />
      </g>
      <rect x="22" y="22" width="5" height="16" rx="2.5" fill="#d6e0ee" className="climb-arm" style={{ transformOrigin: "24px 23px" }} />
      <circle cx="22" cy="11" r="8" fill="#f1c9a5" />
      <path d="M13.5 10 a8.5 8.5 0 0 1 17 0 z" fill={GLOW} />
      <circle cx="30" cy="11" r="2.2" fill="#fff2c4" />
    </svg>
  );
}

const ORB = "radial-gradient(circle at 45% 40%, #fff6d6 0%, #ffd45e 45%, #ff9a3c 100%)";

/** A lantern on a post. Once passed, its light has risen into the sky and it goes dark. */
function Lantern({ big, lit, spent }: { big: boolean; lit: boolean; spent: boolean }) {
  const h = big ? 96 : 72;
  const r = big ? 11 : 8;
  return (
    <span className="relative block" style={{ width: 2, height: h }} aria-hidden>
      <span className="absolute inset-0 rounded-full bg-[#c9d6e8]/60" />
      <span
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[scale,opacity,box-shadow] duration-500"
        style={{
          width: r * 2,
          height: r * 2,
          scale: lit && !spent ? "1.25" : "1",
          opacity: spent ? 0.28 : 1,
          background: spent ? "#2a3b57" : ORB,
          boxShadow: spent ? "none" : `0 0 ${lit ? 46 : 26}px ${lit ? 14 : 8}px rgba(255,190,80,${lit ? 0.55 : 0.35})`,
        }}
      />
    </span>
  );
}

function Tent() {
  return (
    <svg width="78" height="48" viewBox="0 0 78 48" aria-hidden className="overflow-visible">
      <defs>
        <radialGradient id="tent-glow" cx="50%" cy="80%" r="60%">
          <stop offset="0" stopColor="#ffe6a0" />
          <stop offset="1" stopColor="#ff9a3c" />
        </radialGradient>
      </defs>
      <ellipse cx="39" cy="44" rx="56" ry="14" fill="rgba(255,180,70,0.18)" />
      <path d="M2 48 L39 4 L76 48 Z" fill="#163456" />
      <path d="M39 6 L54 48 L24 48 Z" fill="url(#tent-glow)" />
      <path d="M39 4 L39 0" stroke="#c9d6e8" strokeWidth="2" />
    </svg>
  );
}

/** Something on the trail, foot on the ground. */
function TrailMarker({ m, near, spent, api }: { m: Marker; near: boolean; spent: boolean; api: HoverApi }) {
  const y = Math.round(groundY(m.x));
  const label = m.kind === "camp" ? `Camp ${m.year}` : m.kind === "summit" ? "The summit" : m.t.title;

  return (
    <button
      type="button"
      aria-label={label}
      {...hoverHandlers(m, api)}
      className="group absolute outline-none"
      style={{ left: m.x, top: y, zIndex: near ? 6 : 3 }}
    >
      {m.kind === "flag" && (
        <span className="absolute bottom-0 left-0 flex w-11 -translate-x-1/2 justify-center pt-4">
          <Lantern big={m.big} lit={near} spent={spent} />
        </span>
      )}

      {m.kind === "camp" && (
        <span className="absolute bottom-0 left-0 flex -translate-x-1/2 items-end gap-3">
          <span className="flex flex-col items-center">
            <span className={`rounded-full px-5 py-1 transition-[border-color] group-hover:border-[rgba(255,201,77,0.8)] ${glass}`}>
              <span className="font-serif text-[2.4rem] leading-none" style={{ color: INK }}>
                {m.year}
              </span>
            </span>
            <span className="h-14 w-[2px] bg-[#c9d6e8]/60" />
          </span>
          <Tent />
        </span>
      )}

      {m.kind === "summit" && (
        <span className="absolute bottom-0 left-0 flex flex-col items-start">
          <span className={`mb-4 -ml-4 whitespace-nowrap rounded-full px-5 py-2 font-serif text-[1.6rem] leading-none ${glass}`} style={{ color: INK }}>
            Summit <span style={{ color: MUTED }}>· 2,517 ft</span>
          </span>
          <Lantern big lit={near} spent={false} />
        </span>
      )}
    </button>
  );
}

/** A thread: a glowing line through the mountain with a node per stage. */
function LaneNodes({ lane, api }: { lane: Lane; api: HoverApi }) {
  const c = lane.def.color;
  return (
    <>
      {lane.nodes.map((n) => (
        <button
          key={n.t.title}
          type="button"
          aria-label={`${lane.def.name}: ${n.label}, ${n.t.year}`}
          {...hoverHandlers(entry(n.t), api)}
          className={`group absolute flex outline-none ${n.below || n.onTrail ? "flex-col items-start gap-1.5 p-1" : "items-center gap-2.5 rounded-full bg-[#06142b] py-1.5 pl-1 pr-3 ring-1 ring-white/[0.06] hover:bg-[#0c2140] focus-visible:bg-[#0c2140]"}`}
          style={{ left: n.x - (n.below || n.onTrail ? 11 : 11), top: Math.round(laneY(lane.track, n.x)), translate: n.below || n.onTrail ? "0 -11px" : "0 -50%", zIndex: 4 }}
        >
          <span
            className="block size-3.5 shrink-0 rounded-full transition-[scale] duration-200 group-hover:scale-125"
            style={{ background: c, boxShadow: `0 0 14px 3px ${c}88` }}
          />
          {!n.onTrail && (
          <span
            className={`whitespace-nowrap text-[15px] leading-none ${n.below ? "-ml-2 rounded-full bg-[#06142b] px-3 py-1.5 ring-1 ring-white/[0.06] group-hover:bg-[#0c2140]" : ""}`}
            style={{ color: INK }}
          >
            {n.label}
            <span className="ml-2" style={{ color: MUTED }}>
              {n.t.year}
            </span>
          </span>
          )}
        </button>
      ))}
    </>
  );
}

/** One light in the sky. Hidden below the horizon until its moment on the trail is passed. */
function SkyLight({ it, risen, reduced, api }: { it: SkyItem; risen: boolean; reduced: boolean; api: HoverApi }) {
  const photo = TRAIL_PHOTOS[it.t.title];
  const lantern = it.kind === "lantern";
  return (
    <button
      type="button"
      tabIndex={risen ? 0 : -1}
      aria-hidden={!risen}
      aria-label={it.t.title}
      {...hoverHandlers(entry(it.t), api)}
      className="group absolute flex items-center gap-2.5 outline-none"
      style={{
        left: it.sx,
        top: `${it.band * 100}%`,
        translate: risen || reduced ? "-50% -50%" : "-50% 160px",
        scale: risen ? "1" : "0.4",
        opacity: risen ? 1 : 0,
        pointerEvents: risen ? "auto" : "none",
        transition: reduced ? "opacity 0.4s" : "translate 1.6s cubic-bezier(0.2,0.75,0.2,1), scale 1.6s cubic-bezier(0.2,0.75,0.2,1), opacity 0.9s ease",
      }}
    >
      {photo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo.src}
          alt=""
          className={`shrink-0 rounded-full object-cover transition-[scale] duration-200 group-hover:scale-110 ${lantern ? (it.big ? "size-14" : "size-11") : "size-7 opacity-90"}`}
          style={{
            objectPosition: photo.pos,
            boxShadow: lantern
              ? "0 0 0 2px #ffc94d, 0 0 26px 6px rgba(255,190,80,0.45)"
              : "0 0 0 1.5px rgba(255,236,190,0.75), 0 0 14px 3px rgba(255,220,150,0.35)",
          }}
        />
      ) : lantern ? (
        <span
          className="block size-4 shrink-0 rounded-full transition-[scale] duration-200 group-hover:scale-125"
          style={{ background: ORB, boxShadow: "0 0 26px 8px rgba(255,190,80,0.45)" }}
        />
      ) : (
        <span className="flex size-7 items-center justify-center">
          <span
            className="block rounded-full bg-[#fff3cf] transition-[scale] duration-200 group-hover:scale-[2]"
            style={{ width: 3 + it.t.w, height: 3 + it.t.w, boxShadow: "0 0 10px 3px rgba(255,220,150,0.55)" }}
          />
        </span>
      )}
    </button>
  );
}

/* ── the caption: what you're walking past, in the bottom third ── */

/** Big, in its own aspect ratio, edges dissolving into the night, with a soft glow of
 *  itself behind it so the picture tints the scene rather than sitting on top of it. */
// a feathered rectangle: two soft linear ramps, intersected
const FADE_EDGES =
  "linear-gradient(to right, transparent 0%, #000 20%, #000 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)";
const FRAME = "h-[26svh] max-w-full md:h-[min(46svh,440px)] md:max-w-[54vw]";

function CaptionVisual({ photo, color, icon: Icon }: { photo?: ClimbPhoto; color: string; icon?: typeof FALLBACK_ICON }) {
  if (photo)
    return (
      <span className="relative mx-auto block shrink-0 md:mx-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt="" aria-hidden className={`${FRAME} absolute inset-0 m-auto w-auto scale-110 object-contain opacity-45 blur-3xl`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.alt}
          className={`${FRAME} relative block w-auto object-contain`}
          style={{ maskImage: FADE_EDGES, WebkitMaskImage: FADE_EDGES, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
        />
      </span>
    );
  const I = Icon ?? FALLBACK_ICON;
  return (
    <span
      className={`${FRAME} relative mx-auto block aspect-[4/3] shrink-0 md:mx-0`}
      style={{ background: `radial-gradient(circle at 50% 50%, ${color}40 0%, ${color}12 36%, transparent 68%)` }}
      aria-hidden
    >
      {TILE_STARS.map((st, i) => (
        <span key={i} className="absolute rounded-full bg-white" style={{ left: `${st.l}%`, top: `${st.t}%`, width: st.s, height: st.s, opacity: st.o }} />
      ))}
      <span className="absolute left-1/2 top-1/2 size-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ borderColor: `${color}26` }} />
      <span className="absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ borderColor: `${color}14` }} />
      <I
        className="absolute left-1/2 top-1/2 size-[22%] -translate-x-1/2 -translate-y-1/2"
        strokeWidth={1.3}
        style={{ color: "#fff6e0", filter: `drop-shadow(0 0 16px ${color}) drop-shadow(0 0 4px ${color})` }}
      />
    </span>
  );
}

/** A storyline as pictures: each stage a round photo on the storyline's line; you are here = big + ringed. */
function StoryStrip({ lane, current }: { lane: Lane; current: Trophy }) {
  const c = lane.def.color;
  const stages = lane.def.stages;
  const here = stages.find((st) => st.title === current.title);
  return (
    <div className="mt-4">
      <div className="relative inline-flex items-center gap-3 md:gap-4">
        <span className="absolute inset-x-3 top-1/2 h-[2px] -translate-y-1/2 rounded-full" style={{ background: `${c}66` }} aria-hidden />
        {stages.map((st) => {
          const isHere = st.title === current.title;
          const ph = TRAIL_PHOTOS[st.title];
          const I = ENTRY_ICONS[st.title] ?? FALLBACK_ICON;
          return (
            <span
              key={st.title}
              title={st.label}
              className={`relative z-10 flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#071530] ${isHere ? "size-12 md:size-14" : "size-8 opacity-70 md:size-10"}`}
              style={{ boxShadow: isHere ? `0 0 0 2px ${c}, 0 0 22px 4px ${c}66` : `0 0 0 1.5px ${c}88` }}
            >
              {ph ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={ph.src} alt="" className="size-full object-cover" style={{ objectPosition: ph.pos }} />
              ) : (
                <I className="size-1/2" strokeWidth={1.6} style={{ color: c }} />
              )}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-[17px]" style={{ color: MUTED }}>
        <span className="font-serif text-[1.2rem] italic" style={{ color: c }}>
          {lane.def.name}
        </span>
        {here && (
          <>
            {" "}· <span style={{ color: INK }}>{here.label}</span>
          </>
        )}
      </p>
    </div>
  );
}

function Caption({ o }: { o: Showable }) {
  let photo: ClimbPhoto | undefined;
  let icon: typeof FALLBACK_ICON | undefined;
  let accent = GLOW;
  let meta: React.ReactNode;
  let title: React.ReactNode;
  let body: React.ReactNode = null;
  let extra: React.ReactNode = null;

  if (o.kind === "flag" || o.kind === "entry") {
    const t = o.t;
    const lane = THREAD_OF.get(t);
    photo = TRAIL_PHOTOS[t.title];
    icon = ENTRY_ICONS[t.title];
    accent = lane?.def.color ?? CAT_META[t.cat].color;
    meta = `${CAT_META[t.cat].label}, ${t.year}`;
    title = t.title;
    body = t.detail;
    if (lane && lane.def.stages.length > 1) extra = <StoryStrip lane={lane} current={t} />;
  } else if (o.kind === "summit") {
    photo = SUMMIT_PHOTO;
    meta = "Mission Peak summit, 2,517 feet";
    title = "Locked In.";
  } else {
    const camp = CAMP_BY_YEAR.get(o.year)!;
    photo = CAMP_PHOTOS[o.year];
    meta = "Mission Peak";
    title = `${o.year}`;
    body = camp.climb?.detail ?? null;
  }

  return (
    <div className="mx-auto flex w-fit max-w-full flex-col md:flex-row md:items-center">
      <CaptionVisual photo={photo} color={accent} icon={icon} />
      <div
        className="relative z-10 mx-1 -mt-10 min-w-0 rounded-[28px] border border-white/[0.16] bg-[rgba(14,30,58,0.38)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl backdrop-saturate-150 md:-ml-14 md:mt-0 md:min-w-[420px] md:max-w-[640px] md:p-8"
      >
        <p className="text-[16px] md:text-[17px]" style={{ color: MUTED }}>
          {meta}
        </p>
        <h2 className="mt-1 font-serif text-[2.1rem] leading-[1.0] md:text-[3.6rem]" style={{ color: INK }}>
          {title}
        </h2>
        {body && <p className="mt-3 line-clamp-3 text-[17px] leading-relaxed text-[#d5deea] md:text-[19px]">{body}</p>}
        {extra}
      </div>
    </div>
  );
}

/** Walking order of everything that captions itself as you pass. */
const TILE_STARS = Array.from({ length: 14 }, (_, i) => ({
  l: Math.round(h01(i + 40) * 920) / 10 + 3,
  t: Math.round(h01(i + 80) * 920) / 10 + 3,
  s: h01(i + 120) > 0.8 ? 2 : 1,
  o: Math.round((0.3 + h01(i + 160) * 0.6) * 100) / 100,
}));
const CAPTION_STOPS = MARKERS.map((m) => ({ x: m.x, o: m as Showable }));
const CAPTION_REACH = 230; // px either side of a stop
const CAPTION_KEEP = 520; // a caption stays up until the next stop takes over (no blank gaps)
const CAPTION_SWITCH = 36; // px — the next stop must be clearly closer before it takes the slot
const CAPTION_DWELL = 420; // ms — minimum time a caption stays before the next can replace it

/** Warm the browser cache for the next few photos up the trail, so a caption never pops in. */
const warmed = new Set<string>();
function warm(src?: string) {
  if (!src || warmed.has(src) || typeof window === "undefined") return;
  warmed.add(src);
  const im = new Image();
  im.decoding = "async";
  im.src = src;
}
function photoOf(o: Showable): string | undefined {
  if (o.kind === "flag" || o.kind === "entry") return TRAIL_PHOTOS[o.t.title]?.src;
  if (o.kind === "summit") return SUMMIT_PHOTO.src;
  return CAMP_PHOTOS[o.year]?.src;
}

/* ── the game ───────────────────────────────────────────────── */

const RAIL: { label: string; x: number }[] = [
  ...MARKERS.filter((m): m is Extract<Marker, { kind: "camp" }> => m.kind === "camp").map((m) => ({ label: `${m.year}`, x: m.x })),
  { label: "Summit", x: SUMMIT },
];
const FIRST_CAMP_X = RAIL[0].x;
const LANE_NAME_W = LANES.map((l) => Math.round(l.def.name.length * 8.6 + 34));
const SKY_W = Math.round(WORLD_W * SKY_P) + 400;

function h01(n: number) {
  const v = Math.sin(n * 91.7 + 13.3) * 43758.5453;
  return v - Math.floor(v);
}
const STARS = Array.from({ length: 240 }, (_, i) => ({
  left: Math.round(h01(i) * 1000) / 10,
  top: Math.round(h01(i + 300) * 780) / 10,
  s: Math.round((0.8 + Math.pow(h01(i + 600), 3) * 2.2) * 10) / 10,
  o: Math.round((0.35 + h01(i + 900) * 0.65) * 100) / 100,
  tw: i % 9 === 0,
}));

export function ClimbGame() {
  const reduced = !!useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const skyLayerRef = useRef<HTMLDivElement>(null);
  const hikerRef = useRef<HTMLDivElement>(null);
  const hikerFlipRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const ridgeRef = useRef<SVGSVGElement>(null);
  const ridge2Ref = useRef<SVGSVGElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const laneNameRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const sim = useRef({ held: 0, x: START, v: 0, auto: null as number | null, camX: 0, camY: 0, ready: false, maxX: START });
  const keys = useRef({ fwd: false, back: false });
  const hold = useRef<0 | 1 | -1>(0);
  const active = useRef(true);

  const [near, setNear] = useState<Marker | null>(null);
  const [risen, setRisen] = useState(0); // how many sky items have risen (SKY_ITEMS is sorted by x)
  const [yearIdx, setYearIdx] = useState(0);
  const [lamp, setLamp] = useState(true);
  const [walkItem, setWalkItem] = useState<Showable | null>(null);
  const [hoverItem, setHoverItem] = useState<Showable | null>(null);

  const hideTimer = useRef<number | undefined>(undefined);
  const railActive = useRef<HTMLButtonElement>(null);

  /* hovering (or tapping) a light borrows the caption slot; walking gives it back */
  const [api] = useState<HoverApi>(() => ({
    show: (o) => {
      // the world slides under a still cursor while walking — those aren't real hovers
      if (Math.abs(sim.current.v) > 25 || sim.current.auto !== null) return;
      window.clearTimeout(hideTimer.current);
      setHoverItem((cur) => (cur?.id === o.id ? cur : o));
    },
    hide: () => {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setHoverItem(null), 160);
    },
  }));

  useEffect(() => {
    // scroll only the rail — scrollIntoView would also scroll the clipped stage sideways
    const btn = railActive.current;
    const rail = btn?.parentElement;
    if (btn && rail) rail.scrollTo({ left: btn.offsetLeft - rail.clientWidth / 2 + btn.clientWidth / 2, behavior: "smooth" });
  }, [yearIdx]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (active.current = e.intersectionRatio > 0.5), { threshold: [0, 0.5, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // keyboard: arrows walk, Esc puts the card away
  useEffect(() => {
    const FWD = new Set(["ArrowRight", "ArrowUp", "d", "D", "w", "W"]);
    const BACK = new Set(["ArrowLeft", "ArrowDown", "a", "A", "s", "S"]);
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") {
        setHoverItem(null);
        return;
      }
      if (!active.current) return;
      const isFwd = FWD.has(e.key);
      const isBack = BACK.has(e.key);
      if (isFwd || isBack) {
        e.preventDefault();
        keys.current[isFwd ? "fwd" : "back"] = true;
        sim.current.auto = null;
        if (!e.repeat) setHoverItem(null);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (FWD.has(e.key)) keys.current.fwd = false;
      if (BACK.has(e.key)) keys.current.back = false;
    };
    const blur = () => {
      keys.current.fwd = keys.current.back = false;
      hold.current = 0;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // the loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastNear: Marker | null = null;
    let lastYear = -1;
    let lastLamp = true;
    let lastMoving = false;
    let lastFacing = 1;
    let lastRisen = 0;
    let lastCap: Showable | null = null;
    let lastCapAt = 0;
    let warmedUpTo = -1;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = sim.current;
      const stage = stageRef.current;
      if (!stage) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;

      const input = (keys.current.fwd || hold.current === 1 ? 1 : 0) - (keys.current.back || hold.current === -1 ? 1 : 0);
      // paced walking: a held key speeds up through the gaps and eases off past each stop
      s.held = input !== 0 ? s.held + dt : 0;
      let dStop = Infinity;
      for (const m of MARKERS) dStop = Math.min(dStop, Math.abs(m.x - s.x));
      const ramp = clamp((s.held - 0.35) / 0.6, 0, 1);
      const u = clamp(dStop / 120, 0, 1);
      const cruise = PASS + (SPRINT - PASS) * u * u * (3 - 2 * u);
      let targetV = input * (WALK + (cruise - WALK) * ramp);
      if (input !== 0) s.auto = null;
      if (s.auto !== null) {
        const d = s.auto - s.x;
        if (reduced || Math.abs(d) < 2) {
          s.x = s.auto;
          s.auto = null;
          s.v = targetV = 0;
        } else {
          targetV = Math.sign(d) * Math.min(RUN, Math.abs(d) * 3.2 + 120);
        }
      }
      s.v += (targetV - s.v) * Math.min(1, dt * (s.auto !== null ? 6 : 9));
      if (Math.abs(s.v) < 1 && targetV === 0) s.v = 0;
      s.x = clamp(s.x + s.v * dt, START, SUMMIT);
      if ((s.x <= START && s.v < 0) || (s.x >= SUMMIT && s.v > 0)) s.v = 0;
      s.maxX = Math.max(s.maxX, s.x);

      const hy = groundY(s.x);

      // camera — open on a big sky like a title card, then frame the middle of the screen
      const intro = clamp((s.x - START) / 480, 0, 1);
      const frameY = 0.74 - (0.74 - (vw < 640 ? 0.36 : 0.31)) * intro;
      const lead = vw < 640 ? 0.3 : 0.36;
      const tx = clamp(s.x - vw * lead, 0, WORLD_W - vw);
      const midY = slopeY(tx + vw / 2); // the smooth slope, never the far side of the peak
      const ty = clamp(midY - vh * frameY, 0, WORLD_H - vh);
      if (!s.ready || reduced) {
        s.camX = tx;
        s.camY = ty;
        s.ready = true;
      } else {
        // horizontal keeps up with the hiker; vertical eases more slowly so the climb glides
        s.camX += (tx - s.camX) * (1 - Math.exp(-dt * 7));
        s.camY += (ty - s.camY) * (1 - Math.exp(-dt * 2.6));
        // …but never so slowly that the hiker leaves the frame
        const hs = hy - s.camY;
        if (hs < vh * 0.16) s.camY = hy - vh * 0.16;
        else if (hs > vh * 0.62) s.camY = hy - vh * 0.62;
      }

      worldRef.current!.style.transform = `translate3d(${-s.camX}px, ${-s.camY}px, 0)`;
      hikerRef.current!.style.transform = `translate3d(${s.x - HIKER_W / 2}px, ${hy - HIKER_H + 2}px, 0)`;
      // the sky drifts slower than the ground; a light rises right above the hiker
      skyLayerRef.current!.style.transform = `translate3d(${vw * lead * (1 - SKY_P) - s.camX * SKY_P}px, 0, 0)`;

      LANES.forEach((lane, i) => {
        const el = laneNameRefs.current[i];
        if (!el) return;
        let lx = clamp(s.camX + (vw < 640 ? 16 : 32), lane.x0, Math.max(lane.x0, lane.x1 - 200));
        const nameW = LANE_NAME_W[i];
        for (const n of lane.nodes) if (!n.below && n.x - 24 < lx + nameW && n.x + n.w > lx) lx = n.x + n.w + 12;
        el.style.opacity = lx > lane.x1 - nameW * 0.5 ? "0" : "1";
        el.style.transform = `translate3d(${lx}px, ${laneY(lane.track, lx)}px, 0) translateY(-50%)`;
      });

      const moving = Math.abs(s.v) > 25;
      if (moving !== lastMoving) {
        hikerRef.current!.classList.toggle("is-walking", moving && !reduced);
        lastMoving = moving;
      }
      const facing = s.v < -25 ? -1 : s.v > 25 ? 1 : lastFacing;
      if (facing !== lastFacing) {
        hikerFlipRef.current!.style.transform = `scaleX(${facing})`;
        lastFacing = facing;
      }

      const p = (s.x - START) / (SUMMIT - START);
      skyRef.current!.style.background = `linear-gradient(to bottom, ${mix(SKY_TOP, p)} 0%, ${mix(SKY_LOW, p)} 100%)`;
      dawnRef.current!.style.opacity = `${clamp((p - 0.7) / 0.3, 0, 1)}`;
      ridgeRef.current!.style.transform = `translate3d(${-s.camX * 0.12}px, ${-s.camY * 0.08}px, 0)`;
      ridge2Ref.current!.style.transform = `translate3d(${-s.camX * 0.25}px, ${-s.camY * 0.16}px, 0)`;
      if (introRef.current) {
        const op = clamp(1 - (s.x - START) / 300, 0, 1);
        introRef.current.style.opacity = `${op}`;
        introRef.current.style.visibility = op < 0.02 ? "hidden" : "visible";
      }
      const isLamp = p < 0.75;
      if (isLamp !== lastLamp) {
        lastLamp = isLamp;
        setLamp(isLamp);
      }

      // lights rise once the hiker is past them
      let n = lastRisen;
      while (n < SKY_ITEMS.length && SKY_ITEMS[n].x <= s.maxX + 8) n++;
      if (n !== lastRisen) {
        lastRisen = n;
        setRisen(n);
      }

      // caption: the nearest stop within reach — sticky, so it hands over instead of blinking
      let cap: Showable | null = null;
      let capD = CAPTION_REACH;
      let capI = -1;
      for (let i = 0; i < CAPTION_STOPS.length; i++) {
        const d = Math.abs(CAPTION_STOPS[i].x - s.x);
        if (d < capD) {
          capD = d;
          cap = CAPTION_STOPS[i].o;
          capI = i;
        }
      }
      if (lastCap) {
        const curD = Math.abs(CAPTION_STOPS.find((c) => c.o === lastCap)!.x - s.x);
        if (!cap) cap = curD < CAPTION_KEEP ? lastCap : null;
        else if (cap !== lastCap && capD > curD - CAPTION_SWITCH) cap = lastCap;
      }
      if (cap !== lastCap && (now - lastCapAt > CAPTION_DWELL || !lastCap || !cap)) {
        lastCap = cap;
        lastCapAt = now;
        setWalkItem(cap);
      }
      if (capI > warmedUpTo) {
        warmedUpTo = capI;
        for (let k = capI; k < Math.min(capI + 4, CAPTION_STOPS.length); k++) warm(photoOf(CAPTION_STOPS[k].o));
      }

      let best: Marker | null = null;
      let bestD = NEAR;
      for (const m of MARKERS) {
        const d = Math.abs(m.x - s.x);
        if (d < bestD) {
          bestD = d;
          best = m;
        }
      }
      if (best !== lastNear) {
        lastNear = best;
        setNear(best);
      }

      let yi = 0;
      for (let i = 0; i < RAIL.length; i++) if (s.x >= RAIL[i].x - NEAR) yi = i;
      if (yi !== lastYear) {
        lastYear = yi;
        setYearIdx(yi);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const walkTo = (x: number) => {
    sim.current.auto = x;
  };
  const startHold = (dir: 1 | -1, e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    hold.current = dir;
    sim.current.auto = null;
    setHoverItem(null);
  };
  const endHold = () => {
    hold.current = 0;
  };
  /** A tap on empty sky or ground puts the card away (touch has no hover-out). */
  const onStagePointerDown = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    if (!t.closest("[data-hover-anchor]")) setHoverItem(null);
  };

  const risenUpTo = risen > 0 ? SKY_ITEMS[risen - 1].x : -1;
  const shown = hoverItem ?? walkItem;
  // two layers only — the caption on screen and the one fading out under it
  const [cap, setCap] = useState<{ cur: Showable | null; prev: Showable | null }>({ cur: null, prev: null });
  if (shown !== cap.cur) setCap({ cur: shown, prev: cap.cur });
  const capLayers = [cap.prev, cap.cur].filter((o, i, a): o is Showable => !!o && (i === 1 || o.id !== a[1]?.id));
  const pill = "border border-white/25 bg-white/[0.04] backdrop-blur-md text-[#f4efe6] hover:bg-white/[0.1]";

  return (
    <section
      ref={stageRef}
      onPointerDown={onStagePointerDown}
      className="climb-stage relative isolate z-0 h-[100svh] min-h-[560px] w-full select-none overflow-clip"
      aria-label="The Climb — walk up Mission Peak through every year"
    >
      <style>{`
        .climb-stage .is-walking .climb-leg-a { animation: climb-step 0.42s ease-in-out infinite; }
        .climb-stage .is-walking .climb-leg-b { animation: climb-step 0.42s ease-in-out infinite reverse; }
        .climb-stage .is-walking .climb-arm { animation: climb-step 0.42s ease-in-out infinite reverse; }
        .climb-stage .is-walking .climb-bob { animation: climb-bob 0.21s ease-in-out infinite alternate; }
        @keyframes climb-step { 0% { transform: rotate(-22deg); } 50% { transform: rotate(22deg); } 100% { transform: rotate(-22deg); } }
        @keyframes climb-bob { from { transform: translateY(0); } to { transform: translateY(-2px); } }
        .climb-twinkle { animation: climb-twinkle 3.2s ease-in-out infinite alternate; }
        @keyframes climb-twinkle { from { opacity: 0.25; } to { opacity: 1; } }
        .climb-cap { transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1), translate 0.5s cubic-bezier(0.22,1,0.36,1), visibility 0s; }
        .climb-cap[data-on="1"] { opacity: 1; translate: 0 0; visibility: visible; }
        @starting-style { .climb-cap[data-on="1"] { opacity: 0; translate: 0 10px; } }
        .climb-cap[data-on="0"] { opacity: 0; translate: 0 -6px; visibility: hidden; transition-duration: 0.45s, 0.45s, 0s; transition-delay: 0s, 0s, 0.45s; }
        @media (prefers-reduced-motion: reduce) { .climb-twinkle { animation: none; } .climb-cap { translate: none !important; } }
      `}</style>

      {/* sky */}
      <div ref={skyRef} className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${SKY_TOP[0]} 0%, ${SKY_LOW[0]} 100%)` }} aria-hidden />
      <div
        className="absolute -left-[20%] top-[8%] h-[38%] w-[140%] -rotate-[14deg] opacity-60"
        style={{ background: "radial-gradient(ellipse at center, rgba(150,190,255,0.16) 0%, rgba(120,160,230,0.06) 40%, transparent 70%)", filter: "blur(18px)" }}
        aria-hidden
      />
      <div className="absolute inset-0" aria-hidden>
        {STARS.map((st, i) => (
          <span
            key={i}
            className={`absolute rounded-full bg-white ${st.tw ? "climb-twinkle" : ""}`}
            style={{ left: `${st.left}%`, top: `${st.top}%`, width: st.s, height: st.s, opacity: st.o, animationDelay: `${(i % 7) * 0.45}s` }}
          />
        ))}
      </div>
      <div
        ref={dawnRef}
        className="absolute inset-x-0 bottom-0 h-[70%] opacity-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 70% 100%, rgba(255,170,80,0.45) 0%, rgba(255,140,90,0.18) 40%, transparent 75%)" }}
        aria-hidden
      />

      {/* everything already passed, risen into the sky */}
      <div className="absolute inset-x-0 top-[11%] h-[15%] md:top-[10%] md:h-[16%]">
        <div ref={skyLayerRef} className="absolute inset-y-0 left-0 will-change-transform" style={{ width: SKY_W }}>
          {SKY_ITEMS.map((it, i) => (
            <SkyLight key={it.t.title} it={it} risen={i < risen} reduced={reduced} api={api} />
          ))}
        </div>
      </div>

      {/* far ridges (parallax) */}
      <svg ref={ridgeRef} className="pointer-events-none absolute left-0 top-[34%] h-[80%] w-[400%]" viewBox="0 0 4000 600" preserveAspectRatio="none" aria-hidden>
        <path d="M0 330 L260 220 L520 290 L800 170 L1100 270 L1400 140 L1700 250 L2000 180 L2300 290 L2600 160 L2900 240 L3200 130 L3500 260 L3800 190 L4000 230 L4000 600 L0 600 Z" fill="#0b2a4f" opacity="0.55" />
      </svg>
      <svg ref={ridge2Ref} className="pointer-events-none absolute left-0 top-[48%] h-[70%] w-[400%]" viewBox="0 0 4000 600" preserveAspectRatio="none" aria-hidden>
        <path d="M0 260 L340 180 L640 250 L980 150 L1300 240 L1650 170 L1950 260 L2300 190 L2650 270 L3000 170 L3350 250 L3700 200 L4000 240 L4000 600 L0 600 Z" fill="#082140" opacity="0.75" />
      </svg>

      {/* the world */}
      <div ref={worldRef} className="pointer-events-none absolute left-0 top-0 will-change-transform" style={{ width: WORLD_W, height: WORLD_H }}>
        <svg className="absolute inset-0" width={WORLD_W} height={WORLD_H} aria-hidden>
          <defs>
            <linearGradient id="climb-rock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0c2442" />
              <stop offset="0.35" stopColor="#081a33" />
              <stop offset="1" stopColor="#040e1e" />
            </linearGradient>
            {BLOOM_COLORS.map((c, i) => (
              <radialGradient key={c} id={`bloom-${i}`}>
                <stop offset="0" stopColor={c} stopOpacity="0.9" />
                <stop offset="1" stopColor={c} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          <path d={TERRAIN_PATH} fill="url(#climb-rock)" />

          {LANES.map((lane) => (
            <g key={lane.def.id}>
              {lane.nodes
                .filter((n) => n.onTrail)
                .map((n) => (
                  <line
                    key={n.t.title}
                    x1={n.x}
                    y1={Math.round(groundY(n.x) + 6)}
                    x2={n.x}
                    y2={Math.round(laneY(lane.track, n.x) - 10)}
                    stroke={lane.def.color}
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                    strokeDasharray="2 6"
                    strokeLinecap="round"
                  />
                ))}
              <path d={lane.path} fill="none" stroke={lane.def.color} strokeOpacity="0.14" strokeWidth="9" strokeLinecap="round" />
              <path d={lane.path} fill="none" stroke={lane.def.color} strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}

          {FLOWERS.map((f, i) =>
            f.r > 2.6 ? <circle key={`h${i}`} cx={f.x} cy={f.y} r={Math.round(f.r * 32) / 10} fill={`url(#bloom-${f.c})`} opacity={0.55} /> : null,
          )}
          {FLOWERS.map((f, i) => (
            <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={BLOOM_COLORS[f.c]} opacity={f.o} />
          ))}

          <path d={TRAIL_PATH} fill="none" stroke="#f3e3b5" strokeOpacity="0.5" strokeWidth="2.5" strokeDasharray="9 9" strokeLinecap="round" />
        </svg>

        {LANES.map((lane, i) => (
          <span
            key={lane.def.id}
            ref={(el) => {
              laneNameRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 z-[3] whitespace-nowrap rounded-full border px-3 py-1 font-serif text-[1.1rem] italic leading-none transition-opacity duration-200"
            style={{
              color: lane.def.color,
              borderColor: `${lane.def.color}55`,
              background: "#06142b",
              transform: `translate3d(${lane.x0}px, ${Math.round(laneY(lane.track, lane.x0))}px, 0) translateY(-50%)`,
            }}
            aria-hidden
          >
            {lane.def.name}
          </span>
        ))}
        <div className="pointer-events-auto">
          {LANES.map((lane) => (
            <LaneNodes key={lane.def.id} lane={lane} api={api} />
          ))}
          {MARKERS.map((m) => (
            <TrailMarker key={m.id} m={m} near={near?.id === m.id} spent={m.kind === "flag" && m.x <= risenUpTo} api={api} />
          ))}
        </div>

        <div
          ref={hikerRef}
          className="absolute left-0 top-0 z-10"
          style={{ transform: `translate3d(${START - HIKER_W / 2}px, ${Math.round(groundY(START)) - HIKER_H + 2}px, 0)` }}
        >
          <div ref={hikerFlipRef}>
            <div className="climb-bob">
              <Hiker lamp={lamp} />
            </div>
          </div>
        </div>
      </div>

      {/* opening title card */}
      <div ref={introRef} className="pointer-events-none absolute inset-x-0 top-[12%] z-20 flex flex-col items-center px-5 text-center">
        <h1 className="max-w-[18ch] font-serif text-[3.1rem] leading-[0.98] tracking-[-0.01em] md:max-w-none md:text-[5.6rem]" style={{ color: INK }}>
          Achievements <span style={{ color: MUTED }}>along the climb.</span>
        </h1>
        <p className="mt-6 text-[20px] leading-snug text-[#d5deea] md:text-[24px]">Hold → to climb Mission Peak with me.</p>
        <button type="button" onClick={() => walkTo(FIRST_CAMP_X)} className={`pointer-events-auto mt-7 h-14 rounded-full px-8 text-[17px] ${pill}`}>
          Begin the climb
        </button>
      </div>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-3 px-4 pb-5 md:px-8 md:pb-7">
        <nav
          aria-label="Walk to a year"
          data-lenis-prevent
          className="pointer-events-auto relative flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/20 bg-[rgba(8,22,44,0.5)] p-1 backdrop-blur-md [scrollbar-width:none] md:absolute md:bottom-7 md:left-1/2 md:-translate-x-1/2"
        >
          {RAIL.map((r, i) => (
            <button
              key={r.label}
              ref={i === yearIdx ? railActive : undefined}
              type="button"
              onClick={(e) => {
                walkTo(r.x);
                e.currentTarget.blur();
              }}
              aria-current={i === yearIdx ? "step" : undefined}
              className={`h-11 shrink-0 rounded-full px-3.5 text-base tabular-nums transition-colors md:px-4 ${
                i === yearIdx ? "bg-[#f4efe6] text-[#0a1a30]" : "text-[#dbe4f0] hover:bg-white/10"
              }`}
            >
              {r.label}
            </button>
          ))}
          <Link
            href="/achievements/resume"
            className="ml-1 flex h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-[#ffc94d] px-4 text-base font-medium text-[#0a1a30] transition-colors hover:bg-[#ffd877]"
          >
            Resume Achievements
          </Link>
        </nav>

        <div className="pointer-events-auto flex shrink-0 gap-2 self-end">
          <button
            type="button"
            aria-label="Walk back down"
            onPointerDown={(e) => startHold(-1, e)}
            onPointerUp={endHold}
            onPointerCancel={endHold}
            onLostPointerCapture={endHold}
            onContextMenu={(e) => e.preventDefault()}
            className={`flex size-14 touch-none items-center justify-center rounded-full text-2xl ${pill}`}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Climb"
            onPointerDown={(e) => startHold(1, e)}
            onPointerUp={endHold}
            onPointerCancel={endHold}
            onLostPointerCapture={endHold}
            onContextMenu={(e) => e.preventDefault()}
            className="flex size-14 touch-none items-center justify-center rounded-full bg-[#f4efe6] text-2xl text-[#0a1a30] hover:bg-white"
          >
            →
          </button>
        </div>
      </div>

      {/* the caption — bottom third, crossfading as you walk */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[52%] bg-gradient-to-t from-[rgba(3,10,26,0.97)] via-[rgba(3,10,26,0.82)] to-transparent md:h-[54%] md:from-[rgba(3,10,26,0.96)] md:via-[rgba(3,10,26,0.74)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-[146px] z-20 px-4 md:bottom-[96px] md:px-12" aria-live="polite">
        {capLayers.map((o) => (
          <div key={o.id} data-on={o === cap.cur ? "1" : "0"} aria-hidden={o !== cap.cur} className="climb-cap absolute inset-x-4 bottom-0 md:inset-x-12">
            <Caption o={o} />
          </div>
        ))}
      </div>
    </section>
  );
}
