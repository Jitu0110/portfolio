"use client";

import { useState, useCallback } from "react";
import { LeaderboardEntry } from "@/types";

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to load leaderboard");
      const data = await res.json();
      setEntries(data);
    } catch {
      setError("Could not load leaderboard");
    } finally {
      setLoading(false);
    }
  }, []);

  const submitScore = useCallback(
    async (playerName: string, lapTimeMs: number, checkpointsPassed: number, totalCheckpoints: number) => {
      setSubmitting(true);
      setError(null);
      try {
        const res = await fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ player_name: playerName, lap_time_ms: lapTimeMs, checkpoints_passed: checkpointsPassed, total_checkpoints: totalCheckpoints }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Submission failed");
        }
        await fetchLeaderboard();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Submission failed");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchLeaderboard]
  );

  return { entries, loading, submitting, error, fetchLeaderboard, submitScore };
}
