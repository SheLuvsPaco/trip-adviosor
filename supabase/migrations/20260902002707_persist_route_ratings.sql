-- Shared Detour Atlas rating board.
-- This intentionally matches the current product behavior: anyone with the
-- deployed app can read and edit any of the four travelers' ratings.

create table if not exists public.route_ratings (
  route_id text not null,
  place_id text not null,
  traveler_id text not null,
  score smallint not null,
  updated_at timestamptz not null default now(),

  constraint route_ratings_pkey primary key (route_id, place_id, traveler_id),
  constraint route_ratings_route_id_format check (route_id ~ '^route-[0-9]{2}$'),
  constraint route_ratings_place_id_not_blank check (length(btrim(place_id)) > 0),
  constraint route_ratings_traveler_id_allowed check (
    traveler_id in ('sheluvspaco', 'viki', 'gora', 'stivka')
  ),
  constraint route_ratings_score_range check (score between 1 and 5)
);

alter table public.route_ratings enable row level security;

-- New Supabase projects may not automatically expose SQL-created tables to
-- the Data API, so grant only the operations this client needs explicitly.
revoke all on table public.route_ratings from anon, authenticated;
grant select, insert, update, delete on table public.route_ratings to anon, authenticated;

drop policy if exists "route ratings are readable" on public.route_ratings;
create policy "route ratings are readable"
on public.route_ratings
for select
to anon, authenticated
using (true);

drop policy if exists "route ratings can be added" on public.route_ratings;
create policy "route ratings can be added"
on public.route_ratings
for insert
to anon, authenticated
with check (true);

drop policy if exists "route ratings can be changed" on public.route_ratings;
create policy "route ratings can be changed"
on public.route_ratings
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "route ratings can be cleared" on public.route_ratings;
create policy "route ratings can be cleared"
on public.route_ratings
for delete
to anon, authenticated
using (true);

create index if not exists route_ratings_route_id_idx
on public.route_ratings (route_id);
