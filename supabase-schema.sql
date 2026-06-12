-- Run this in your Supabase SQL editor

create table if not exists leaderboard (
  id uuid default gen_random_uuid() primary key,
  player_name varchar(30) not null,
  lap_time_ms integer not null check (lap_time_ms > 0),
  created_at timestamptz default now() not null
);

-- Index for fast sorted leaderboard queries
create index if not exists idx_leaderboard_lap_time on leaderboard (lap_time_ms asc);

-- Enable Row Level Security
alter table leaderboard enable row level security;

-- Allow anyone to read the leaderboard
create policy "Public read"
  on leaderboard for select
  to anon
  using (true);

-- Allow anyone to insert (anti-cheat is enforced in the API)
create policy "Public insert"
  on leaderboard for insert
  to anon
  with check (true);
