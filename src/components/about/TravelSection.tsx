"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Photo } from "@/components/primitives/Photo";
import { ABOUT, type TravelStop } from "@/lib/data";
import { EASE } from "@/lib/motion";

/**
 * The passport wall — an interactive hand-drawn world map. Continents are
 * authored as rough lon/lat polygons and projected (equirectangular), so the
 * pins always land where the coordinates say. Hover/tap a pin (or a chip)
 * to open that stop's polaroid.
 *
 * Hover photos: drop each place's photo into /public/img and register it
 * here — any stop without an entry shows a dashed "coming soon" print.
 */
const TRAVEL_PHOTOS: Partial<Record<string, { src: string; alt: string }>> = {
  "Amherst, MA": { src: "/img/umass-08.jpg", alt: "The pre-college crew on the big UMass Amherst chair" },
  "Washington, DC": { src: "/img/dc-04.jpg", alt: "Selfie on the National Mall with the Washington Monument and reflecting pool behind" },
  Boston: { src: "/img/boston-04.jpg", alt: "Jadon touching John Harvard's foot in Harvard Yard" },
  "New York": { src: "/img/ny-01.jpg", alt: "Jadon by the Brooklyn Bridge at night" },
};

/* ── projection ───────────────────────────────────────────────── */
const W = 1000;
const H = 500;
const X = (lon: number) => ((lon + 180) / 360) * W;
const Y = (lat: number) => ((90 - lat) / 180) * H;
/* crop the empty poles: lat 84° down to −50° */
const VIEW_Y = Y(84);
const VIEW_H = Y(-50) - VIEW_Y;

/* ── hand-drawn continents (rough lon/lat outlines) ───────────── */
type Outline = [number, number][]; // [lon, lat]

const CONTINENTS: Outline[] = [
  // North America
  [[-166, 66], [-158, 71], [-140, 70], [-125, 72], [-110, 73], [-95, 72], [-85, 70], [-75, 68], [-68, 60], [-58, 54], [-53, 48], [-60, 45], [-66, 44], [-70, 41], [-74, 38], [-76, 34], [-80, 31], [-80, 26], [-82, 30], [-86, 30], [-90, 29], [-94, 29], [-97, 26], [-97, 21], [-94, 18], [-88, 21], [-86, 16], [-83, 10], [-78, 8], [-83, 8], [-92, 15], [-97, 16], [-105, 20], [-110, 23], [-112, 26], [-114, 29], [-117, 33], [-120, 34], [-122, 37], [-124, 40], [-124, 44], [-124, 48], [-128, 51], [-132, 55], [-137, 58], [-145, 60], [-151, 59], [-158, 56], [-164, 55], [-168, 60]],
  // Greenland
  [[-45, 60], [-53, 66], [-58, 72], [-55, 76], [-45, 80], [-32, 82], [-22, 79], [-20, 73], [-25, 69], [-33, 66], [-40, 62]],
  // South America
  [[-78, 7], [-72, 11], [-64, 10], [-60, 8], [-52, 4], [-44, -2], [-35, -7], [-37, -12], [-40, -20], [-47, -25], [-53, -31], [-57, -36], [-62, -40], [-65, -45], [-66, -50], [-68, -54], [-72, -52], [-72, -46], [-71, -40], [-71, -33], [-70, -25], [-70, -18], [-75, -14], [-79, -7], [-81, -3], [-80, 1]],
  // Africa
  [[-10, 32], [-6, 35], [3, 37], [10, 37], [15, 33], [20, 32], [25, 32], [31, 31], [34, 27], [37, 21], [40, 15], [43, 11], [48, 11], [51, 12], [46, 5], [41, -1], [39, -7], [37, -13], [35, -20], [33, -26], [28, -33], [22, -34], [18, -33], [15, -27], [12, -19], [11, -10], [9, -2], [9, 4], [5, 5], [-2, 5], [-8, 4], [-13, 9], [-17, 14], [-17, 20], [-13, 26]],
  // Madagascar
  [[44, -12], [50, -15], [48, -22], [45, -25], [43, -20]],
  // Eurasia
  [[-9, 36], [-9, 40], [-8, 43], [-2, 46], [-2, 49], [3, 51], [8, 54], [8, 57], [10, 57], [6, 58], [5, 61], [10, 64], [14, 68], [20, 70], [26, 71], [31, 70], [40, 68], [50, 69], [60, 70], [70, 73], [80, 73], [90, 76], [100, 77], [110, 74], [120, 73], [130, 72], [140, 72], [150, 70], [160, 69], [170, 67], [179, 66], [178, 62], [170, 60], [162, 58], [160, 53], [156, 51], [157, 57], [153, 59], [147, 55], [142, 54], [140, 49], [136, 45], [131, 43], [127, 40], [126, 35], [122, 37], [120, 32], [117, 24], [114, 22], [109, 19], [106, 11], [103, 2], [100, 6], [98, 12], [94, 17], [89, 22], [85, 20], [80, 16], [77, 8], [73, 16], [70, 21], [66, 25], [61, 25], [57, 26], [55, 23], [58, 21], [55, 17], [50, 13], [44, 12], [42, 16], [39, 21], [35, 29], [33, 31], [35, 36], [30, 36], [27, 37], [26, 40], [23, 38], [22, 37], [19, 40], [19, 42], [15, 38], [15, 41], [12, 44], [8, 44], [5, 43], [3, 42], [0, 40], [-2, 37], [-6, 36]],
  // Britain & Ireland (one rough blob, London on the SE corner)
  [[-5, 50], [-4, 53], [-6, 56], [-4, 58], [-2, 57], [-1, 54], [1, 52], [-2, 50]],
  // Iceland
  [[-22, 64], [-18, 66], [-14, 65], [-16, 63], [-21, 63]],
  // Japan
  [[130, 32], [133, 34], [136, 34.5], [139, 34.5], [141, 36], [141, 40], [143, 42], [145, 44], [141, 45], [139, 40], [138, 36], [135, 35.5], [132, 35], [129, 33]],
  // Taiwan
  [[120.2, 25.2], [121.9, 25.2], [121.2, 22.3], [120, 22.6]],
  // Philippines
  [[120, 18], [122, 16], [124, 12], [125, 8], [122, 8], [121, 13], [119, 16]],
  // Sumatra + Java
  [[95, 5], [99, 3], [104, -3], [110, -7], [114, -8], [112, -9], [105, -7], [98, 0], [95, 3]],
  // Borneo
  [[109, 1], [114, 4], [119, 1], [117, -3], [113, -4], [110, -1]],
  // New Guinea
  [[131, -1], [137, -2], [141, -3], [146, -6], [150, -9], [147, -10], [141, -8], [135, -4], [131, -2]],
  // Australia
  [[113, -22], [114, -26], [115, -33], [118, -35], [124, -33], [129, -32], [133, -32], [136, -35], [139, -36], [144, -38], [147, -39], [150, -37], [153, -31], [153, -26], [150, -22], [146, -19], [143, -14], [142, -11], [137, -12], [135, -12], [132, -11], [129, -14], [124, -16], [119, -18]],
  // New Zealand
  [[167, -46], [170, -44], [173, -41], [172, -40], [175, -38], [178, -37], [176, -39], [174, -40], [171, -44]],
];

const outlinePath = (o: Outline) =>
  o.map(([lon, lat], i) => `${i === 0 ? "M" : "L"} ${X(lon).toFixed(1)} ${Y(lat).toFixed(1)}`).join(" ") + " Z";

const CONTINENT_PATHS = CONTINENTS.map(outlinePath);

/* graticule lines every 30°, for the chart-paper feel */
const GRID_LONS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];
const GRID_LATS = [60, 30, 0, -30];

/* pin position as percentages of the cropped viewBox */
const pinLeft = (s: TravelStop) => (X(s.lon) / W) * 100;
const pinTop = (s: TravelStop) => ((Y(s.lat) - VIEW_Y) / VIEW_H) * 100;

export function TravelSection() {
  const stops = ABOUT.travel;
  const [active, setActive] = useState(0);
  const current = stops[active];
  const photo = TRAVEL_PHOTOS[current.place];

  return (
    <section className="border-y border-[var(--line)] bg-[var(--bg-2)]">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-9 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="inline-block bg-[var(--fg)] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--bg)]">
              Passport
            </p>
            <h2 className="mt-5 font-anton text-4xl uppercase leading-[0.95] tracking-tight md:text-6xl">
              Stamps so far<span className="text-[var(--accent)]">.</span>
            </h2>
          </div>
          <p className="font-hand max-w-[16rem] rotate-[-1.5deg] text-2xl leading-tight text-[var(--muted)]">
            {stops.length - 1} stops and counting — hover a pin
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_300px]">
          {/* ── the map ── */}
          <div className="relative">
            <svg
              viewBox={`0 ${VIEW_Y.toFixed(0)} ${W} ${VIEW_H.toFixed(0)}`}
              className="w-full"
              role="img"
              aria-label="Hand-drawn world map of places Jadon has traveled"
            >
              {/* graticule */}
              {GRID_LONS.map((lon) => (
                <line key={`lon${lon}`} x1={X(lon)} y1={VIEW_Y} x2={X(lon)} y2={VIEW_Y + VIEW_H} stroke="var(--line)" strokeWidth={0.6} strokeDasharray="2 6" />
              ))}
              {GRID_LATS.map((lat) => (
                <line key={`lat${lat}`} x1={0} y1={Y(lat)} x2={W} y2={Y(lat)} stroke="var(--line)" strokeWidth={0.6} strokeDasharray="2 6" />
              ))}

              {/* continents — drawn-on-scroll ink outlines */}
              {CONTINENT_PATHS.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke="var(--fg)"
                  strokeWidth={1.7}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="color-mix(in srgb, var(--fg) 7%, transparent)"
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  whileInView={{ pathLength: 1, fillOpacity: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: i * 0.06 }}
                />
              ))}

              {/* dashed flight line: home → active stop */}
              {!current.home && (
                <motion.path
                  key={current.place}
                  d={`M ${X(stops[0].lon)} ${Y(stops[0].lat)} Q ${(X(stops[0].lon) + X(current.lon)) / 2} ${Math.min(Y(stops[0].lat), Y(current.lat)) - 55} ${X(current.lon)} ${Y(current.lat)}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.8}
                  strokeDasharray="5 7"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
            </svg>

            {/* pins — HTML buttons positioned over the svg */}
            {stops.map((s, i) => {
              const isActive = active === i;
              return (
                <button
                  key={s.place}
                  data-cursor-hover
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={`${s.place} — ${s.region}`}
                  aria-pressed={isActive}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
                  style={{ left: `${pinLeft(s)}%`, top: `${pinTop(s)}%` }}
                >
                  {s.home ? (
                    <span
                      className="block h-3 w-3 rotate-45 bg-[var(--fg)] transition-transform duration-300"
                      style={{ transform: `rotate(45deg) scale(${isActive ? 1.5 : 1})` }}
                    />
                  ) : (
                    <span className="relative block h-3 w-3">
                      {isActive && (
                        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-60" />
                      )}
                      <span
                        className="absolute inset-0 rounded-full border-2 border-[var(--bg)] bg-[var(--accent)] shadow-[1px_2px_0_rgba(23,21,17,0.3)] transition-transform duration-300"
                        style={{ transform: `scale(${isActive ? 1.6 : 1})` }}
                      />
                    </span>
                  )}
                  {/* name tag on the active pin */}
                  {isActive && (
                    <span className="font-hand pointer-events-none absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-lg leading-none text-[var(--fg)]">
                      {s.place}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── the stop's polaroid ── */}
          <div className="mx-auto w-full max-w-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.place}
                initial={{ opacity: 0, y: 14, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: 1.6 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="polaroid relative p-3 pb-12"
              >
                <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" />
                <div className="overflow-hidden bg-[var(--bg-2)]" style={{ aspectRatio: "4 / 3" }}>
                  {photo ? (
                    <Photo src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
                  ) : (
                    /* placeholder print — waiting on this stop's photo */
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-[var(--muted)] p-3">
                      <svg viewBox="0 0 48 24" aria-hidden className="w-12" fill="none" stroke="var(--muted)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 20l40-15-9 17-8-6-7 7-2-9z" />
                      </svg>
                      <p className="font-hand text-center text-lg leading-tight text-[var(--muted)]">
                        photo coming soon
                      </p>
                    </div>
                  )}
                </div>
                <p className="font-hand absolute bottom-2.5 left-4 text-xl leading-none text-[var(--fg)]">
                  {current.place}
                </p>
                <p className="absolute bottom-4 right-4 font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)]">
                  {current.region}
                </p>
              </motion.div>
            </AnimatePresence>

            {current.note && (
              <motion.p
                key={`${current.place}-note`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-6 border-l-2 border-[var(--accent)] pl-4 text-sm leading-relaxed text-[var(--muted)]"
              >
                {current.note}
              </motion.p>
            )}
          </div>
        </div>

        {/* chip index — quick nav, keyboard/touch friendly */}
        <div className="mt-10 flex flex-wrap gap-2">
          {stops.map((s, i) => (
            <button
              key={s.place}
              data-cursor-hover
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={[
                "border px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-200",
                active === i
                  ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                  : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]",
              ].join(" ")}
            >
              {s.home ? "⌂ " : ""}
              {s.place}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
