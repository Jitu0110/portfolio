"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useEffect } from "react";
import { formatLapTime } from "@/lib/utils";

// Dynamic import — avoids SSR issues with Three.js
const RacingGame = dynamic(() => import("@/features/game/RacingGame"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050510]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm">Loading game engine...</p>
      </div>
    </div>
  ),
});

export default function GameSection() {
  const { entries, loading, submitting, error, fetchLeaderboard, submitScore } = useLeaderboard();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <section id="game" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-red-400 text-sm font-mono tracking-[0.3em] uppercase mb-3 block">
            Here's a fun weekend project I'm currently working on!
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Can You Beat My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Fastest Lap?
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Complete the circuit, beat the clock, and climb the leaderboard.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-white/10"
            style={{ height: "520px" }}
          >
            <RacingGame submitScore={submitScore} submitting={submitting} error={error} />
          </motion.div>

          {/* Live Leaderboard panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col"
          >
            <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
              <span>🏆</span> Leaderboard
            </h3>
            <p className="text-white/30 text-xs mb-6">Top 10 fastest laps</p>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-6 h-6 border border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-white/20 text-sm text-center">
                  No times yet. <br />Be the first!
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-2 overflow-y-auto">
                {entries.map((entry, i) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-white/[0.03]"
                      }`}
                  >
                    <span
                      className={`text-sm font-bold w-6 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-white/20"
                        }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-white text-sm truncate">{entry.player_name}</span>
                    <span className="text-blue-400 font-mono text-xs font-bold">
                      {formatLapTime(entry.lap_time_ms)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-white/20 text-xs text-center">
                Race to set a time and submit your score
              </p>
            </div>
          </motion.div>
        </div>

        {/* Controls info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mt-6"
        >
          {[
            { key: "W / ↑", action: "Accelerate" },
            { key: "S / ↓", action: "Brake" },
            { key: "A / ←", action: "Turn Left" },
            { key: "D / →", action: "Turn Right" },
          ].map((ctrl) => (
            <div key={ctrl.key} className="flex items-center gap-2 text-sm text-white/40">
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-white/60">
                {ctrl.key}
              </span>
              <span>{ctrl.action}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
