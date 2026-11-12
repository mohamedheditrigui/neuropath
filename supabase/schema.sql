-- NeuroPath database (Supabase / PostgreSQL).
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.

-- One row per player, linked to the Supabase Auth account.
create table if not exists public.players (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  progress    integer not null default 0,   -- number of completed levels
  xp          integer not null default 0,
  week_xp     integer not null default 0,   -- XP earned in the last 7 days (for the leaderboard)
  streak      integer not null default 0,
  last_active date,
  active_days jsonb not null default '[]',  -- ISO dates with activity
  xp_log      jsonb not null default '[]',  -- [{ date, xp }]
  avatar      jsonb not null default '{"color":"#A84F32","acc":"scarf"}',
  quiz_skips  integer not null default 0,
  project     jsonb,                        -- saved choices of the final project
  updated_at  timestamptz not null default now()
);

-- Already created the table before the project column existed? Run this line too:
alter table public.players add column if not exists project jsonb;

-- Messages sent from the contact form on the Help page.
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

alter table public.players  enable row level security;
alter table public.messages enable row level security;

-- Signed-in players can read every player (the leaderboard needs names and XP)...
create policy "players are visible to signed-in users" on public.players
  for select to authenticated using (true);
-- ...but can only create and change their own row.
create policy "players insert own row" on public.players
  for insert to authenticated with check (auth.uid() = id);
create policy "players update own row" on public.players
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Anyone may send a contact message; nobody can read them through the API.
create policy "anyone can send a message" on public.messages
  for insert to anon, authenticated with check (true);

-- Create the player row automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.players (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
