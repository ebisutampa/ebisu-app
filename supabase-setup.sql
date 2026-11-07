-- Ebisu 店务助手 — Supabase setup. Paste all of this into Supabase → SQL Editor → Run (once).

-- Products synced from Pospal (no cost/purchase price is stored here)
create table if not exists products (
  b text primary key,
  cn text, n text, cat text,
  st numeric default 0,
  p numeric default 0,
  s7 numeric default 0,
  s30 numeric default 0,
  synced_at bigint
);

-- Count sessions
create table if not exists rounds (
  id text primary key,
  name text not null,
  started_at bigint not null,
  active boolean default true
);

-- Scan counts per session / zone (f = sales floor, b = backroom)
create table if not exists scans (
  round_id text not null references rounds(id) on delete cascade,
  zone text not null check (zone in ('f','b')),
  b text not null,
  n integer not null default 0,
  updated_at timestamptz default now(),
  primary key (round_id, zone, b)
);

-- New items found on the EBISU wholesale site
create table if not exists new_items (
  b text primary key,
  name text, price numeric, msrp numeric,
  section text, kind text,
  first_seen bigint, is_new boolean default true
);

-- Small key/value table (sync status, monitor status)
create table if not exists meta (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

-- Atomic +1 / -1 so two phones scanning at once never lose a count
create or replace function inc_scan(p_round text, p_zone text, p_b text, p_delta integer)
returns integer language sql security invoker as $$
  insert into scans (round_id, zone, b, n, updated_at)
  values (p_round, p_zone, p_b, greatest(p_delta, 0), now())
  on conflict (round_id, zone, b)
  do update set n = greatest(scans.n + p_delta, 0), updated_at = now()
  returning n;
$$;

-- Only signed-in store accounts can read or write anything
alter table products  enable row level security;
alter table rounds    enable row level security;
alter table scans     enable row level security;
alter table new_items enable row level security;
alter table meta      enable row level security;

do $$ declare t text; begin
  foreach t in array array['products','rounds','scans','new_items','meta'] loop
    execute format('drop policy if exists "store_all" on %I', t);
    execute format('create policy "store_all" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

grant execute on function inc_scan(text, text, text, integer) to authenticated;

-- Live updates between phones
alter publication supabase_realtime add table scans;
alter publication supabase_realtime add table rounds;
