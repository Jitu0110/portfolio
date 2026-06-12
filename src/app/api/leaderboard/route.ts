import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { MIN_POSSIBLE_RACE_MS } from "@/features/game/trackData";
import { isNameAppropriate, NAME_REJECTED_MESSAGE } from "@/lib/moderation";

// Derived from track length / car top speed — stays correct if the circuit changes
const MIN_LAP_TIME_MS = MIN_POSSIBLE_RACE_MS;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leaderboard")
      .select("id, player_name, lap_time_ms, created_at")
      .order("lap_time_ms", { ascending: true })
      .limit(10);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { player_name, lap_time_ms, checkpoints_passed, total_checkpoints } = body;

    if (!player_name || typeof player_name !== "string" || player_name.trim().length === 0) {
      return NextResponse.json({ error: "Invalid player name" }, { status: 400 });
    }

    if (!isNameAppropriate(player_name)) {
      return NextResponse.json({ error: NAME_REJECTED_MESSAGE }, { status: 400 });
    }

    if (typeof lap_time_ms !== "number" || lap_time_ms < MIN_LAP_TIME_MS) {
      return NextResponse.json({ error: "Invalid lap time" }, { status: 400 });
    }

    if (
      typeof checkpoints_passed !== "number" ||
      typeof total_checkpoints !== "number" ||
      checkpoints_passed < total_checkpoints
    ) {
      return NextResponse.json(
        { error: "Incomplete lap — not all checkpoints crossed" },
        { status: 400 }
      );
    }

    const sanitizedName = player_name.trim().slice(0, 30);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leaderboard")
      .insert([{ player_name: sanitizedName, lap_time_ms }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
