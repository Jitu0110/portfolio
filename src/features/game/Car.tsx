"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PerspectiveCamera } from "three";
import {
  TRACK_POINTS,
  TRACK_NORMALS,
  TRACK_HALF_WIDTH,
  START_POSITION,
  START_YAW,
  nearestTrackIndex,
  sectorOfIndex,
  SECTOR_COUNT,
  CAR_MAX_SPEED,
  N,
} from "./trackData";
import { RacePhase } from "@/types";
import { keys } from "./controls";

interface CarProps {
  phase: RacePhase;
  onTelemetry: (speedKmh: number, progress: number, x: number, z: number) => void;
  onFinish: () => void;
}

// Handling model — tuned for a fast but controllable arcade-sim feel
const ENGINE_ACCEL = 26;     // peak acceleration, falls off toward top speed
const MAX_SPEED = CAR_MAX_SPEED; // single source of truth in trackData — the API derives its anti-cheat floor from it
const BRAKE_DECEL = 38;
const REVERSE_MAX = 7;
const COAST_DRAG = 0.5;      // exponential decay when off throttle
const LATERAL_GRIP = 5.5;    // how fast sideways slip is absorbed (lower = more drift)
const STEER_RATE = 2.6;

const CAR_CLEARANCE = 0.32;
const EDGE_MARGIN = 1.0;     // car half-width buffer against the walls

export default function Car({ phase, onTelemetry, onFinish }: CarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const sim = useRef({
    pos: new THREE.Vector3(START_POSITION.x, START_POSITION.y + CAR_CLEARANCE, START_POSITION.z),
    vel: new THREE.Vector2(0, 0), // world xz velocity
    yaw: START_YAW,
    trackIdx: 0,
    sectors: new Set<number>(),
    finished: false,
    telemetryClock: 0,
    pitch: 0,
    roll: 0,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { keys[e.key] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      // Clear any held inputs so they don't carry over to the next race
      Object.keys(keys).forEach(k => { keys[k] = false; });
    };
  }, []);

  useFrame((_, rawDt) => {
    const g = groupRef.current;
    if (!g) return;
    const dt = Math.min(rawDt, 1 / 30); // clamp so tab-switch doesn't teleport the car
    const s = sim.current;

    if (phase === "racing" && !s.finished) {
      const throttle = keys["w"] || keys["W"] || keys["ArrowUp"];
      const brake = keys["s"] || keys["S"] || keys["ArrowDown"];
      const steer = (keys["a"] || keys["A"] || keys["ArrowLeft"] ? 1 : 0) - (keys["d"] || keys["D"] || keys["ArrowRight"] ? 1 : 0);

      // Decompose velocity into the car's frame
      const fwd = new THREE.Vector2(-Math.sin(s.yaw), -Math.cos(s.yaw));
      const right = new THREE.Vector2(-fwd.y, fwd.x);
      let vF = s.vel.dot(fwd);   // forward speed
      let vL = s.vel.dot(right); // lateral slip

      // Steering: builds up from standstill, tightens less at very high speed
      const steerAuthority = Math.min(Math.abs(vF) / 6, 1) / (1 + Math.abs(vF) * 0.022);
      s.yaw += STEER_RATE * steer * steerAuthority * Math.sign(vF || 1) * dt;

      // Longitudinal forces
      if (throttle) {
        vF += ENGINE_ACCEL * Math.max(1 - Math.max(vF, 0) / MAX_SPEED, 0.12) * dt;
      } else if (brake) {
        if (vF > 0.5) vF -= BRAKE_DECEL * dt;
        else vF = Math.max(vF - ENGINE_ACCEL * 0.45 * dt, -REVERSE_MAX);
      } else {
        vF *= Math.exp(-COAST_DRAG * dt);
      }

      // Tyre grip soaks up lateral slip — this is what makes corners feel planted
      vL *= Math.exp(-LATERAL_GRIP * dt);

      // Recompose in the (possibly rotated) car frame — slip emerges naturally
      const newFwd = new THREE.Vector2(-Math.sin(s.yaw), -Math.cos(s.yaw));
      const newRight = new THREE.Vector2(-newFwd.y, newFwd.x);
      s.vel.set(
        newFwd.x * vF + newRight.x * vL,
        newFwd.y * vF + newRight.y * vL
      );

      // Integrate
      let nx = s.pos.x + s.vel.x * dt;
      let nz = s.pos.z + s.vel.y * dt;

      // Track-edge collision: lateral offset from the centerline
      const idx = nearestTrackIndex(nx, nz, s.trackIdx);
      const center = TRACK_POINTS[idx];
      const normal = TRACK_NORMALS[idx];
      const off = (nx - center.x) * normal.x + (nz - center.z) * normal.z;
      const limit = TRACK_HALF_WIDTH - EDGE_MARGIN;
      if (Math.abs(off) > limit) {
        const clamped = Math.sign(off) * limit;
        nx = center.x + normal.x * clamped;
        nz = center.z + normal.z * clamped;
        // kill outward velocity, scrub some speed — wall grinds, no bounce-back
        const vN = s.vel.x * normal.x + s.vel.y * normal.y;
        if (Math.sign(vN) === Math.sign(off)) {
          s.vel.x -= normal.x * vN;
          s.vel.y -= normal.z * vN;
        }
        s.vel.multiplyScalar(0.92);
      }

      // Follow track elevation
      const targetY = center.y + CAR_CLEARANCE;
      s.pos.set(nx, THREE.MathUtils.lerp(s.pos.y, targetY, 12 * dt), nz);

      // Lap progress + sector coverage (invisible anti-cheat checkpoints)
      const prevIdx = s.trackIdx;
      s.trackIdx = idx;
      s.sectors.add(sectorOfIndex(idx));

      // Finish: wrapped past the start line with every sector covered
      if (prevIdx > N - 25 && idx < 25 && s.sectors.size === SECTOR_COUNT) {
        s.finished = true;
        onFinish();
      }

      // Body attitude: pitch follows track grade, roll leans into corners
      const ahead = TRACK_POINTS[(idx + 12) % N];
      const behind = TRACK_POINTS[(idx - 12 + N) % N];
      const run = Math.hypot(ahead.x - behind.x, ahead.z - behind.z);
      const targetPitch = Math.atan2(ahead.y - behind.y, run) * (vF >= 0 ? 1 : -1);
      const targetRoll = -steer * Math.min(Math.abs(vF) / MAX_SPEED, 1) * 0.07;
      s.pitch = THREE.MathUtils.lerp(s.pitch, targetPitch, 6 * dt);
      s.roll = THREE.MathUtils.lerp(s.roll, targetRoll, 6 * dt);

      // Throttled telemetry to the HUD (~12 Hz keeps React cheap)
      s.telemetryClock += dt;
      if (s.telemetryClock > 0.08) {
        s.telemetryClock = 0;
        onTelemetry(Math.round(Math.abs(vF) * 9), Math.round((idx / N) * 100), nx, nz);
      }
    }

    // Apply transform
    g.position.copy(s.pos);
    g.rotation.order = "YXZ";
    g.rotation.set(s.pitch, s.yaw, s.roll);

    // Chase camera — sits behind and above, looks through the car
    const speed = s.vel.length();
    const dist = 10 + speed * 0.12;
    const camX = s.pos.x + Math.sin(s.yaw) * dist;
    const camZ = s.pos.z + Math.cos(s.yaw) * dist;
    const camY = s.pos.y + 4.5 + speed * 0.04;
    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), Math.min(6 * dt, 1));
    const lookAhead = new THREE.Vector3(
      s.pos.x - Math.sin(s.yaw) * 4,
      s.pos.y + 0.6,
      s.pos.z - Math.cos(s.yaw) * 4
    );
    camera.lookAt(lookAhead);

    // Speed widens the FOV for a sense of pace
    const cam = camera as PerspectiveCamera;
    const targetFov = 55 + Math.min(speed / MAX_SPEED, 1) * 12;
    if (Math.abs(cam.fov - targetFov) > 0.1) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 4 * dt);
      cam.updateProjectionMatrix();
    }
  });

  return (
    <group ref={groupRef} position={[START_POSITION.x, START_POSITION.y + CAR_CLEARANCE, START_POSITION.z]}>
      {/* Physics forward is local -Z; the body is modeled nose-at-+Z, so flip it here */}
      <group rotation={[0, Math.PI, 0]}>
        {/* Chassis — Rosso Corsa */}
        <mesh castShadow position={[0, 0.12, 0]}>
          <boxGeometry args={[1.5, 0.4, 3.4]} />
          <meshStandardMaterial color="#d40000" metalness={0.6} roughness={0.25} />
        </mesh>
        {/* Sidepods */}
        {([-0.78, 0.78] as number[]).map((x) => (
          <mesh key={x} castShadow position={[x, 0.18, -0.3]}>
            <boxGeometry args={[0.32, 0.32, 1.6]} />
            <meshStandardMaterial color="#a00000" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
        {/* Nose */}
        <mesh castShadow position={[0, 0.06, 1.9]}>
          <boxGeometry args={[0.55, 0.25, 0.7]} />
          <meshStandardMaterial color="#d40000" metalness={0.6} roughness={0.25} />
        </mesh>
        {/* Cockpit + halo */}
        <mesh castShadow position={[0, 0.45, -0.2]}>
          <boxGeometry args={[0.85, 0.3, 1.4]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0, 0.68, -0.1]}>
          <torusGeometry args={[0.42, 0.04, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
        {/* Front wing — carbon black with red endplates */}
        <mesh castShadow position={[0, -0.04, 2.05]}>
          <boxGeometry args={[2.1, 0.07, 0.45]} />
          <meshStandardMaterial color="#16161a" metalness={0.7} roughness={0.3} />
        </mesh>
        {([-1.02, 1.02] as number[]).map((x) => (
          <mesh key={x} position={[x, 0.06, 2.05]}>
            <boxGeometry args={[0.06, 0.22, 0.45]} />
            <meshStandardMaterial color="#d40000" metalness={0.6} />
          </mesh>
        ))}
        {/* Rear wing — carbon with scuderia-yellow supports */}
        <mesh castShadow position={[0, 0.62, -1.65]}>
          <boxGeometry args={[2.0, 0.09, 0.32]} />
          <meshStandardMaterial color="#16161a" metalness={0.7} roughness={0.3} />
        </mesh>
        {([-0.65, 0.65] as number[]).map((x) => (
          <mesh key={x} position={[x, 0.38, -1.65]}>
            <boxGeometry args={[0.07, 0.5, 0.07]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.5} />
          </mesh>
        ))}
        {/* Wheels */}
        {([
          [0.92, 0, 1.25], [-0.92, 0, 1.25],
          [0.92, 0, -1.2], [-0.92, 0, -1.2],
        ] as [number, number, number][]).map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.32, 14]} />
            <meshStandardMaterial color="#0b0f19" roughness={0.95} />
          </mesh>
        ))}
        {/* Headlight glow */}
        <pointLight position={[0, 0.2, 2.2]} color="#fde68a" intensity={5} distance={14} />
        {/* Rain light */}
        <mesh position={[0, 0.3, -1.78]}>
          <boxGeometry args={[0.12, 0.12, 0.05]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}
