"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatLapTime } from "@/lib/utils";
import { GameState } from "@/types";
import { TRACK_POINTS } from "./trackData";
import { keys } from "./controls";

interface GameUIProps {
  gameState: GameState;
  onStart: () => void;
  onRestart: () => void;
  onQuit: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

// Minimap projection — computed once at module load
const MAP_W = 116;
const MAP_H = 88;
const xs = TRACK_POINTS.map((p) => p.x);
const zs = TRACK_POINTS.map((p) => p.z);
const minX = Math.min(...xs) - 4;
const maxX = Math.max(...xs) + 4;
const minZ = Math.min(...zs) - 4;
const maxZ = Math.max(...zs) + 4;
const mapX = (x: number) => ((x - minX) / (maxX - minX)) * MAP_W;
const mapZ = (z: number) => ((z - minZ) / (maxZ - minZ)) * MAP_H;
const MAP_PATH = TRACK_POINTS.filter((_, i) => i % 10 === 0)
  .map((p) => `${mapX(p.x).toFixed(1)},${mapZ(p.z).toFixed(1)}`)
  .join(" ");
const START_DOT = { x: mapX(TRACK_POINTS[0].x), z: mapZ(TRACK_POINTS[0].z) };

const press = (key: string) => (e: React.PointerEvent) => {
  e.preventDefault();
  keys[key] = true;
};
const release = (key: string) => () => { keys[key] = false; };

const STEER_BTNS = [
  { key: "ArrowLeft", label: "◀" },
  { key: "ArrowRight", label: "▶" },
];
const ACCEL_BTNS = [
  { key: "ArrowUp", label: "▲" },
  { key: "ArrowDown", label: "▼" },
];

export default function GameUI({ gameState, onStart, onRestart, onQuit, muted, onToggleMute }: GameUIProps) {
  const { phase, countdown, raceTime, speed, carX, carZ } = gameState;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Mute toggle — always available once a race has begun */}
      {phase !== "idle" && (
        <button
          onClick={onToggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute top-4 left-4 z-20 pointer-events-auto w-10 h-10 flex items-center justify-center bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl text-base hover:border-white/30 transition-colors"
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}

      {/* Menu button — available during countdown and racing */}
      {(phase === "countdown" || phase === "racing") && (
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menu"
          className="absolute top-4 left-16 z-20 pointer-events-auto w-10 h-10 flex items-center justify-center bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl text-base hover:border-white/30 transition-colors"
        >
          ✕
        </button>
      )}

      {/* Pause menu popup */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-30 pointer-events-auto"
            onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 w-full max-w-xs text-center"
            >
              <h3 className="text-white font-black text-xl mb-1">Menu</h3>
              <p className="text-white/40 text-sm mb-6">What would you like to do?</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setMenuOpen(false); onRestart(); }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all"
                >
                  Restart Race
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onQuit(); }}
                  className="w-full py-3 border border-white/10 hover:border-white/30 text-white/60 hover:text-white font-semibold rounded-xl text-sm transition-all"
                >
                  Quit Game
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Idle — pre-race overlay */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto z-10"
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center px-6"
            >
              <div className="text-5xl mb-3">🏁</div>
              <h3 className="text-3xl font-black text-white mb-1">Circuit de Portfolio</h3>
              <p className="text-red-400 text-xs font-mono tracking-[0.25em] uppercase mb-5">
                One timed lap
              </p>
              <p className="hidden xl:block text-white/50 text-sm mb-1">
                <span className="font-mono text-white/70">W / ↑</span> throttle ·{" "}
                <span className="font-mono text-white/70">S / ↓</span> brake ·{" "}
                <span className="font-mono text-white/70">A D / ← →</span> steer
              </p>
              <p className="xl:hidden text-white/50 text-sm mb-1">
                Use the on-screen buttons to steer, throttle &amp; brake
              </p>
              <p className="text-white/30 text-xs mb-8">
                The clock starts at lights out. Finish where you started.
              </p>
              <button
                onClick={onStart}
                className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5"
              >
                Start Race
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 1.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <span className="text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">
              {countdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GO! flash */}
      <AnimatePresence>
        {phase === "racing" && raceTime < 900 && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <span className="text-9xl font-black text-green-400 drop-shadow-[0_0_40px_rgba(74,222,128,0.9)]">
              GO
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD while racing / finished */}
      {(phase === "racing" || phase === "finished") && (
        <>
          {/* Race timer */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3 text-center">
              <div className="text-white/40 text-[10px] font-mono mb-1 tracking-[0.25em] uppercase">
                Race Time
              </div>
              <div className="text-white font-mono text-3xl font-bold tracking-wider tabular-nums">
                {formatLapTime(raceTime)}
              </div>
            </div>
          </div>

          {/* Minimap — desktop only */}
          <div className="hidden xl:block absolute top-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl p-3">
              <svg width={MAP_W} height={MAP_H} className="block">
                <polygon
                  points={MAP_PATH}
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <circle cx={START_DOT.x} cy={START_DOT.z} r="3" fill="#ef4444" />
                {phase === "racing" && (
                  <circle cx={mapX(carX)} cy={mapZ(carZ)} r="3.5" fill="#3b82f6">
                    <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>
            </div>
          </div>

          {/* Speedometer */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 min-w-[120px]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-white font-black text-3xl font-mono tabular-nums">{speed}</span>
                <span className="text-white/30 text-xs font-mono">km/h</span>
              </div>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-red-500 transition-all duration-100"
                  style={{ width: `${Math.min((speed / 250) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Controls hint — desktop only */}
          <div className="hidden xl:block absolute bottom-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm border border-white/5 rounded-xl px-3 py-2">
              <div className="text-white/30 text-[10px] font-mono space-y-0.5">
                <div>W / ↑ &nbsp;throttle</div>
                <div>S / ↓ &nbsp;brake</div>
                <div>A D &nbsp;&nbsp;&nbsp;steer</div>
              </div>
            </div>
          </div>

        </>
      )}

      {/* Touch controls — mobile/tablet only, visible from countdown onwards so fingers are ready */}
      {(phase === "countdown" || phase === "racing" || phase === "finished") && (
        <>
          <div className="xl:hidden absolute bottom-28 left-4 flex gap-3 pointer-events-auto select-none">
            {STEER_BTNS.map(({ key: k, label }) => (
              <button
                key={k}
                onPointerDown={press(k)}
                onPointerUp={release(k)}
                onPointerLeave={release(k)}
                onPointerCancel={release(k)}
                className="w-16 h-16 bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl text-white text-2xl flex items-center justify-center active:bg-white/20 touch-none"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="xl:hidden absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto select-none">
            {ACCEL_BTNS.map(({ key: k, label }) => (
              <button
                key={k}
                onPointerDown={press(k)}
                onPointerUp={release(k)}
                onPointerLeave={release(k)}
                onPointerCancel={release(k)}
                className="w-16 h-16 bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl text-white text-2xl flex items-center justify-center active:bg-white/20 touch-none"
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
