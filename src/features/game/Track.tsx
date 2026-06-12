"use client";

import * as THREE from "three";
import { useMemo } from "react";
import {
  TRACK_POINTS,
  TRACK_NORMALS,
  TRACK_DIRS,
  TRACK_HALF_WIDTH,
  TRACK_LENGTH,
  N,
} from "./trackData";

const WALL_H = 1.6;
const WALL_OFFSET = TRACK_HALF_WIDTH + 0.4;

export default function Track() {
  return (
    <>
      <Ground />
      <RoadSurface />
      <EdgeLines />
      <CornerCurbs />
      <Wall side={1} />
      <Wall side={-1} />
      <StartLine />
      <StartGantry />
      <Grandstands />
      <FloodlightTowers />
      <Forest />
    </>
  );
}

/**
 * Lateral ribbon strip between two offsets from the centerline.
 * `close` joins the last sample back to the first for full-loop strips.
 */
function lateralStrip(
  indices: number[],
  offInner: number,
  offOuter: number,
  yInner: number,
  yOuter: number,
  close: boolean,
  colorFor?: (k: number) => THREE.Color
): THREE.BufferGeometry {
  const seq = close ? [...indices, indices[0]] : indices;
  const pos: number[] = [];
  const col: number[] = [];
  seq.forEach((j, k) => {
    const p = TRACK_POINTS[j];
    const n = TRACK_NORMALS[j];
    pos.push(p.x + n.x * offInner, p.y + yInner, p.z + n.z * offInner);
    pos.push(p.x + n.x * offOuter, p.y + yOuter, p.z + n.z * offOuter);
    if (colorFor) {
      const c = colorFor(k);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
  });
  const idx: number[] = [];
  for (let k = 0; k < seq.length - 1; k++) {
    const a = k * 2, b = a + 1, c = a + 2, d = a + 3;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
  if (colorFor) g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(col), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
      <planeGeometry args={[200, 150]} />
      <meshStandardMaterial color="#0a120c" roughness={1} />
    </mesh>
  );
}

/** Asphalt ribbon following the spline, including elevation. */
function RoadSurface() {
  const geometry = useMemo(() => {
    const pos = new Float32Array((N + 1) * 2 * 3);
    for (let i = 0; i <= N; i++) {
      const j = i % N;
      const p = TRACK_POINTS[j];
      const n = TRACK_NORMALS[j];
      pos.set([p.x + n.x * TRACK_HALF_WIDTH, p.y, p.z + n.z * TRACK_HALF_WIDTH], i * 6);
      pos.set([p.x - n.x * TRACK_HALF_WIDTH, p.y, p.z - n.z * TRACK_HALF_WIDTH], i * 6 + 3);
    }
    const idx: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      idx.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#222230" roughness={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Painted white lines along both track edges — full lap. */
function EdgeLines() {
  const geometries = useMemo(() => {
    const all = Array.from({ length: N }, (_, i) => i);
    return ([1, -1] as const).map((side) =>
      lateralStrip(
        all,
        side * (TRACK_HALF_WIDTH - 0.16),
        side * (TRACK_HALF_WIDTH - 0.02),
        0.018,
        0.018,
        true
      )
    );
  }, []);

  return (
    <>
      {geometries.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial
            color="#e2e8f0"
            emissive="#e2e8f0"
            emissiveIntensity={0.2}
            roughness={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

/**
 * Red/white curbs only where the track actually turns, like a real circuit.
 * Corner zones come from the angle the direction vector sweeps over a fixed
 * arc; zones are dilated so curbs lead into and out of each corner. The outer
 * curb edge is raised slightly for a beveled kerb profile.
 */
function CornerCurbs() {
  const geometries = useMemo(() => {
    const spacing = TRACK_LENGTH / N;
    const span = 16; // samples each way (~4.3 units) for curvature measurement
    const mask: boolean[] = new Array(N).fill(false);
    for (let i = 0; i < N; i++) {
      const a = TRACK_DIRS[(i - span + N) % N];
      const b = TRACK_DIRS[(i + span) % N];
      const dot = THREE.MathUtils.clamp(a.x * b.x + a.z * b.z, -1, 1);
      mask[i] = Math.acos(dot) > 0.28; // radius below ~31 units counts as a corner
    }
    // Extend each zone so the kerb runs into the corner entry and exit
    const dilate = Math.round(9 / spacing);
    const zones = mask.slice();
    for (let i = 0; i < N; i++) {
      if (!mask[i]) continue;
      for (let k = -dilate; k <= dilate; k++) zones[(i + k + N) % N] = true;
    }

    // Collect contiguous runs, starting from a non-corner sample so a zone
    // spanning index 0 isn't split in two
    let scanStart = zones.indexOf(false);
    if (scanStart === -1) scanStart = 0;
    const runs: number[][] = [];
    let current: number[] | null = null;
    for (let k = 0; k < N; k++) {
      const i = (scanStart + k) % N;
      if (zones[i]) {
        (current ??= []).push(i);
      } else if (current) {
        runs.push(current);
        current = null;
      }
    }
    if (current) runs.push(current);

    const red = new THREE.Color("#dc2626");
    const white = new THREE.Color("#e5e7eb");
    const stripeLen = Math.max(2, Math.round(4 / spacing));

    const out: THREE.BufferGeometry[] = [];
    for (const run of runs) {
      if (run.length < stripeLen) continue;
      for (const side of [1, -1] as const) {
        out.push(
          lateralStrip(
            run,
            side * (TRACK_HALF_WIDTH - 0.92),
            side * (TRACK_HALF_WIDTH + 0.02),
            0.02,
            0.07,
            false,
            (k) => (Math.floor(k / stripeLen) % 2 === 0 ? red : white)
          )
        );
      }
    }
    return out;
  }, []);

  return (
    <>
      {geometries.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial vertexColors roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

/** Continuous barrier wall — one ribbon mesh per side. */
function Wall({ side }: { side: 1 | -1 }) {
  const geometry = useMemo(() => {
    const pos = new Float32Array((N + 1) * 2 * 3);
    for (let i = 0; i <= N; i++) {
      const j = i % N;
      const p = TRACK_POINTS[j];
      const n = TRACK_NORMALS[j];
      const x = p.x + n.x * WALL_OFFSET * side;
      const z = p.z + n.z * WALL_OFFSET * side;
      pos.set([x, p.y, z], i * 6);
      pos.set([x, p.y + WALL_H, z], i * 6 + 3);
    }
    const idx: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      idx.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#7f1d1d"
        emissive="#991b1b"
        emissiveIntensity={0.25}
        metalness={0.4}
        roughness={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function StartLine() {
  const p = TRACK_POINTS[0];
  const n = TRACK_NORMALS[0];
  const angle = Math.atan2(n.x, n.z);

  return (
    <group position={[p.x, p.y + 0.03, p.z]} rotation={[0, angle, 0]}>
      {Array.from({ length: 2 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={`${row}-${i}`}
            position={[0, 0, (i - 4.5) * 1.0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.7, 1.0]} />
            <meshStandardMaterial color={(i + row) % 2 === 0 ? "#ffffff" : "#0a0a0a"} />
          </mesh>
        ))
      )}
    </group>
  );
}

function StartGantry() {
  const p = TRACK_POINTS[0];
  const n = TRACK_NORMALS[0];
  const angle = Math.atan2(n.x, n.z);
  const span = TRACK_HALF_WIDTH + 1.6;

  return (
    <group position={[p.x, p.y, p.z]} rotation={[0, angle, 0]}>
      {([-span, span] as number[]).map((z) => (
        <mesh key={z} position={[0, 2.2, z]}>
          <boxGeometry args={[0.3, 4.4, 0.3]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 4.4, 0]}>
        <boxGeometry args={[0.8, 0.7, span * 2]} />
        <meshStandardMaterial color="#111827" emissive="#dc2626" emissiveIntensity={0.4} metalness={0.6} />
      </mesh>
      <pointLight position={[0, 5, 0]} color="#ef4444" intensity={4} distance={20} />
    </group>
  );
}

/**
 * Grandstands around the circuit. Placed by track fraction, offset to the
 * outside (left of travel = outside on this counterclockwise loop), rotated
 * to face the racing line.
 */
const STAND_FRACTIONS = [0.025, 0.115, 0.3, 0.52, 0.74, 0.945];
const ROWS = 5;

function Grandstands() {
  return (
    <>
      {STAND_FRACTIONS.map((f) => (
        <Grandstand key={f} fraction={f} />
      ))}
    </>
  );
}

function Grandstand({ fraction }: { fraction: number }) {
  const placement = useMemo(() => {
    const idx = Math.floor(fraction * N) % N;
    const p = TRACK_POINTS[idx];
    const n = TRACK_NORMALS[idx];
    const d = TRACK_HALF_WIDTH + 8;
    return {
      pos: [p.x + n.x * d, 0, p.z + n.z * d] as [number, number, number],
      rotY: Math.atan2(-n.x, -n.z),
    };
  }, [fraction]);

  return (
    <group position={placement.pos} rotation={[0, placement.rotY, 0]}>
      {/* Tiered steps */}
      {Array.from({ length: ROWS }).map((_, r) => (
        <mesh key={r} position={[0, 0.45 + r * 0.8, -1.4 - r * 1.4]}>
          <boxGeometry args={[19.5, 0.7, 1.4]} />
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </mesh>
      ))}
      {/* Back wall */}
      <mesh position={[0, 2.4, -8.2]}>
        <boxGeometry args={[19.5, 4.8, 0.3]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>
      {/* Roof canopy */}
      <mesh position={[0, 5.4, -4.2]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[20, 0.18, 8.5]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
      </mesh>
      {([-9.2, 9.2] as number[]).map((x) => (
        <mesh key={x} position={[x, 2.7, -0.6]}>
          <cylinderGeometry args={[0.12, 0.12, 5.4, 6]} />
          <meshStandardMaterial color="#374151" metalness={0.7} />
        </mesh>
      ))}
      {/* Red sponsor band on the front edge */}
      <mesh position={[0, 0.95, -0.62]}>
        <boxGeometry args={[19.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#d40000" emissive="#d40000" emissiveIntensity={0.25} />
      </mesh>
      {/* Safety fence in front */}
      <mesh position={[0, 1.0, 1.2]}>
        <boxGeometry args={[19.5, 2.0, 0.05]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}


/** Floodlight towers for the night-race look — emissive heads, no extra lights. */
function FloodlightTowers() {
  const towers = useMemo(() => {
    return [0.07, 0.36, 0.6, 0.86].map((f) => {
      const idx = Math.floor(f * N) % N;
      const p = TRACK_POINTS[idx];
      const n = TRACK_NORMALS[idx];
      const d = TRACK_HALF_WIDTH + 18;
      return {
        pos: [p.x + n.x * d, 0, p.z + n.z * d] as [number, number, number],
        rotY: Math.atan2(-n.x, -n.z),
      };
    });
  }, []);

  return (
    <>
      {towers.map((tw, i) => (
        <group key={i} position={tw.pos} rotation={[0, tw.rotY, 0]}>
          <mesh position={[0, 7, 0]}>
            <cylinderGeometry args={[0.2, 0.35, 14, 6]} />
            <meshStandardMaterial color="#1f2937" metalness={0.6} />
          </mesh>
          <mesh position={[0, 14.2, 0.5]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[3.2, 1.6, 0.3]} />
            <meshStandardMaterial color="#f8fafc" emissive="#e0f2fe" emissiveIntensity={1.6} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Low-poly pine forest around the circuit — Ardennes vibes. Deterministic placement. */
function Forest() {
  const trees = useMemo(() => {
    // mulberry32 — seeded so layout never changes between renders
    let s = 1337;
    const rnd = () => {
      s |= 0; s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const out: { x: number; z: number; h: number }[] = [];
    let attempts = 0;
    while (out.length < 55 && attempts < 600) {
      attempts++;
      const x = (rnd() - 0.5) * 170;
      const z = (rnd() - 0.5) * 125;
      let minD = Infinity;
      for (let i = 0; i < N; i += 12) {
        const p = TRACK_POINTS[i];
        const d = (p.x - x) ** 2 + (p.z - z) ** 2;
        if (d < minD) minD = d;
      }
      // keep clear of the road AND the grandstand/floodlight belt (~20 units out)
      if (minD > 560) out.push({ x, z, h: 3 + rnd() * 3.5 });
    }
    return out;
  }, []);

  return (
    <>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, t.h * 0.25, 0]}>
            <cylinderGeometry args={[0.18, 0.25, t.h * 0.5, 6]} />
            <meshStandardMaterial color="#3f2d1d" />
          </mesh>
          <mesh position={[0, t.h * 0.65, 0]}>
            <coneGeometry args={[t.h * 0.32, t.h * 0.9, 7]} />
            <meshStandardMaterial color="#11331f" />
          </mesh>
        </group>
      ))}
    </>
  );
}
