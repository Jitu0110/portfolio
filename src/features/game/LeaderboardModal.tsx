"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatLapTime } from "@/lib/utils";
import { isNameAppropriate, NAME_REJECTED_MESSAGE } from "@/lib/moderation";

interface LeaderboardModalProps {
  isOpen: boolean;
  lapTime: number | null;
  submitting: boolean;
  error: string | null;
  onSubmit: (name: string) => Promise<boolean>;
  onClose: () => void;
}

export default function LeaderboardModal({
  isOpen,
  lapTime,
  submitting,
  error,
  onSubmit,
  onClose,
}: LeaderboardModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = playerName.trim();
    if (!name || submitting) return;
    if (!isNameAppropriate(name)) {
      setNameError(NAME_REJECTED_MESSAGE);
      return;
    }
    setNameError(null);
    const ok = await onSubmit(name);
    if (ok) setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setPlayerName("");
    setNameError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-sm z-20 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#0d0d1a] border border-white/10 rounded-2xl w-full max-w-sm p-6"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🏁</div>
              <h3 className="text-2xl font-black text-white">Race Complete!</h3>
              {lapTime && (
                <p className="text-blue-400 font-mono text-xl mt-1 font-bold">
                  {formatLapTime(lapTime)}
                </p>
              )}
            </div>

            {/* Submit form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="mb-4">
                <label className="block text-white/60 text-sm mb-2">
                  Enter your name for the leaderboard
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      if (nameError) setNameError(null);
                    }}
                    placeholder="Your name"
                    maxLength={30}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/60 text-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!playerName.trim() || submitting}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-lg text-sm transition-all"
                  >
                    {submitting ? "..." : "Submit"}
                  </button>
                </div>
                {(nameError || error) && (
                  <p className="text-red-400 text-xs mt-2">{nameError || error}</p>
                )}
              </form>
            ) : (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                <p className="text-green-400 font-semibold">Score submitted! ✓</p>
                <p className="text-white/40 text-xs mt-1">Check the leaderboard below</p>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full py-3 border border-white/10 rounded-xl text-white/50 hover:text-white hover:border-white/30 text-sm font-medium transition-all"
            >
              Race Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
