import * as THREE from "three";

/**
 * Spa-Francorchamps-inspired circuit.
 * Control points trace the iconic layout: La Source hairpin after the line,
 * the Eau Rouge / Raidillon climb, the long Kemmel straight, Les Combes,
 * the sweepers through Pouhon and Stavelot, the fast Blanchimont section
 * and the Bus Stop chicane back onto the start/finish straight.
 * [x, elevation, z]
 */
const CONTROL_POINTS: [number, number, number][] = [
  [-10, 0, 38],   // start/finish line
  [8, 0, 38],
  [18, 0, 36],    // braking for La Source
  [24, 0, 30],    // La Source hairpin
  [20, -0.5, 20], // downhill exit
  [14, -1, 12],   // run to Eau Rouge
  [18, 0, 4],     // Eau Rouge left-right
  [12, 2, -4],    // Raidillon crest
  [20, 3.5, -12], // onto Kemmel straight
  [34, 4, -20],
  [48, 4, -28],   // end of Kemmel
  [58, 4, -32],   // Les Combes entry
  [60, 4, -38],
  [52, 3.5, -42], // Les Combes exit
  [38, 3, -40],
  [26, 2.5, -38], // Rivage
  [14, 2, -44],   // Pouhon double-left
  [0, 1.5, -42],
  [-12, 1, -44],  // Fagnes
  [-24, 1.5, -40],// Stavelot
  [-34, 1, -30],  // Blanchimont approach
  [-42, 0.5, -16],// flat-out left
  [-44, 0, -2],
  [-42, 0, 12],
  [-46, 0, 20],   // Bus Stop chicane
  [-40, 0, 24],
  [-36, 0, 30],   // final corner
  [-26, 0, 36],
  [-18, 0, 38],   // onto the straight
];

export const TRACK_HALF_WIDTH = 5;
export const SECTOR_COUNT = 8;
export const CAR_MAX_SPEED = 28; // units/s — must match the car's handling model

const curve = new THREE.CatmullRomCurve3(
  CONTROL_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  true,
  "centripetal"
);

/**
 * Hand-placed control points give a lumpy curvature profile — corners read as
 * a chain of slightly different arcs. A Laplacian relaxation pass over a coarse
 * sampling irons that out into smooth, constant-radius corner sweeps before
 * the final dense sampling. Elevation is smoothed too, so crests are gentle.
 */
let relaxed = curve.getSpacedPoints(300);
relaxed.pop();
const M = relaxed.length;
for (let iter = 0; iter < 22; iter++) {
  relaxed = relaxed.map((p, i) => {
    const a = relaxed[(i - 1 + M) % M];
    const b = relaxed[(i + 1) % M];
    return new THREE.Vector3(
      p.x * 0.5 + (a.x + b.x) * 0.25,
      p.y * 0.5 + (a.y + b.y) * 0.25,
      p.z * 0.5 + (a.z + b.z) * 0.25
    );
  });
}
const smoothCurve = new THREE.CatmullRomCurve3(relaxed, true, "centripetal");

// High sample density keeps tight corners (La Source, Bus Stop) visually round —
// road, curbs and walls are all built from these samples.
const SAMPLES = 1200;
const spaced = smoothCurve.getSpacedPoints(SAMPLES);
spaced.pop(); // last point duplicates the first on a closed curve

export const TRACK_POINTS: THREE.Vector3[] = spaced;
export const N = TRACK_POINTS.length;
export const TRACK_LENGTH = smoothCurve.getLength();

/**
 * Anti-cheat floor: the fastest physically possible run. Hugging the inside
 * line shortens a closed loop by roughly 2π × (drivable half-width), and the
 * car can never exceed CAR_MAX_SPEED. A small extra margin avoids rejecting
 * legitimate perfect laps.
 */
const INSIDE_LINE_SAVING = 2 * Math.PI * (TRACK_HALF_WIDTH - 1);
export const MIN_POSSIBLE_RACE_MS = Math.floor(
  ((TRACK_LENGTH - INSIDE_LINE_SAVING) / CAR_MAX_SPEED) * 1000 * 0.9
);

/** Unit direction of travel at each sample (xz plane). */
export const TRACK_DIRS: THREE.Vector3[] = TRACK_POINTS.map((_, i) => {
  const prev = TRACK_POINTS[(i - 1 + N) % N];
  const next = TRACK_POINTS[(i + 1) % N];
  return new THREE.Vector3(next.x - prev.x, 0, next.z - prev.z).normalize();
});

/** Unit normal (points to the left of travel) at each sample. */
export const TRACK_NORMALS: THREE.Vector3[] = TRACK_DIRS.map(
  (d) => new THREE.Vector3(-d.z, 0, d.x)
);

/** Spawn: exactly on the start/finish line, facing the direction of travel. */
export const START_POSITION = TRACK_POINTS[0].clone();
export const START_YAW = Math.atan2(-TRACK_DIRS[0].x, -TRACK_DIRS[0].z);

/**
 * Nearest centerline sample to (x, z). Searches a window around `hint`
 * for speed, falling back to a full scan if the car somehow jumped.
 */
export function nearestTrackIndex(x: number, z: number, hint: number): number {
  let best = -1;
  let bestD = Infinity;
  for (let o = -35; o <= 35; o++) {
    const i = (hint + o + N) % N;
    const p = TRACK_POINTS[i];
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < bestD) { bestD = d; best = i; }
  }
  if (bestD > 400) {
    for (let i = 0; i < N; i++) {
      const p = TRACK_POINTS[i];
      const d = (p.x - x) ** 2 + (p.z - z) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    }
  }
  return best;
}

export function sectorOfIndex(i: number): number {
  return Math.min(Math.floor((i / N) * SECTOR_COUNT), SECTOR_COUNT - 1);
}
