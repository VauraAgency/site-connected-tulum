-- Connected Tulum team log, step 3: agents (affiliates), their own logins, referral tracking and reservation times.
-- Run ONCE in Supabase (SQL Editor > New query > paste > Run), after supabase.sql and supabase-reservations.sql. Safe to run again.
--
-- Who sees what
--   Hector / Benji (emails in public.team_emails): everything, including every agent's clients and commissions.
--   Agents (rows in public.agents, matched by login email): only the clients THEY logged, their own referral
--   link stats, and the payout side of their own sales. They never see Connected's venue commissions, other
--   agents, or Hector's reservations and tasks.

/* ------------------------------------------------------------------- agents */
create table if not exists public.agents (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  name             text not null,
  email            text not null,
  phone            text not null default '',
  code             text not null check (code ~ '^[a-z0-9-]{2,30}$'),
  -- what the agent earns by default (can be overridden per reservation)
  commission_basis text not null default 'percent_commission' check (commission_basis in ('percent_commission','percent_total','flat')),
  commission_rate  numeric(6,2) not null default 0 check (commission_rate between 0 and 100),
  commission_flat  numeric(12,2) not null default 0 check (commission_flat >= 0),
  active           boolean not null default true,
  notes            text not null default ''
);
create unique index if not exists agents_email_uq on public.agents (lower(email));
create unique index if not exists agents_code_uq  on public.agents (code);

drop trigger if exists agents_touch on public.agents;
create trigger agents_touch before update on public.agents
  for each row execute function public.touch_updated_at();

/* ------------------------------------------------------------ who is logged in */
create or replace function public.my_agent_id() returns uuid
  language sql stable security definer set search_path = public as $$
  select id from public.agents
  where active and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  limit 1;
$$;
grant execute on function public.my_agent_id() to authenticated;

-- The portal asks this right after sign-in to decide which screen to show.
create or replace function public.portal_role() returns jsonb
  language sql stable security definer set search_path = public as $$
  select case
    when public.is_team() then jsonb_build_object('role', 'team')
    when public.my_agent_id() is not null then
      (select jsonb_build_object('role', 'agent', 'id', a.id, 'name', a.name, 'code', a.code) from public.agents a where a.id = public.my_agent_id())
    else jsonb_build_object('role', 'none')
  end;
$$;
grant execute on function public.portal_role() to authenticated;

/* ---------------------------------------------- client log: owner + table time */
alter table public.log_entries add column if not exists agent_id  uuid references public.agents(id) on delete set null;
alter table public.log_entries add column if not exists need_date date;   -- the day they need the table / booking
alter table public.log_entries add column if not exists need_time time;   -- and what time
create index if not exists log_entries_agent_idx on public.log_entries (agent_id);

/* -------------------------------------------- reservations: time + agent payout */
alter table public.reservations add column if not exists reservation_time time;
alter table public.reservations add column if not exists agent_id     uuid references public.agents(id) on delete set null;
alter table public.reservations add column if not exists agent_basis  text not null default 'percent_commission' check (agent_basis in ('percent_commission','percent_total','flat'));
alter table public.reservations add column if not exists agent_rate   numeric(6,2) not null default 0 check (agent_rate between 0 and 100);
alter table public.reservations add column if not exists agent_flat   numeric(12,2) not null default 0 check (agent_flat >= 0);
alter table public.reservations add column if not exists agent_amount numeric(12,2) not null default 0 check (agent_amount >= 0);
alter table public.reservations add column if not exists agent_status text not null default 'pending' check (agent_status in ('pending','paid'));
alter table public.reservations add column if not exists agent_paid_on date;
create index if not exists reservations_agent_idx on public.reservations (agent_id);

/* ------------------------------------------------------------ referral tracking */
create table if not exists public.ref_events (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  agent_id   uuid not null references public.agents(id) on delete cascade,
  kind       text not null check (kind in ('visit','whatsapp','ticket')),
  path       text not null default ''
);
create index if not exists ref_events_agent_idx on public.ref_events (agent_id, created_at desc);

-- The public site calls this (anonymous visitors can't touch the table itself).
create or replace function public.track_ref(p_code text, p_kind text, p_path text default '') returns void
  language plpgsql security definer set search_path = public as $$
declare a uuid;
begin
  if p_kind not in ('visit','whatsapp','ticket') then return; end if;
  select id into a from public.agents where active and code = lower(coalesce(p_code, ''));
  if a is null then return; end if;
  insert into public.ref_events (agent_id, kind, path) values (a, p_kind, left(coalesce(p_path, ''), 200));
end $$;
grant execute on function public.track_ref(text, text, text) to anon, authenticated;

/* -------------------------------------------------- an agent's own sales (payout side only) */
create or replace function public.agent_sales() returns table (
  id uuid, reservation_date date, reservation_time time, customer_name text, guests integer,
  venue text, service text, res_status text, currency text, total_amount numeric,
  agent_amount numeric, agent_status text, agent_paid_on date
) language sql stable security definer set search_path = public as $$
  select r.id, r.reservation_date, r.reservation_time, r.customer_name, r.guests,
         r.venue, r.service, r.res_status, r.currency, r.total_amount,
         r.agent_amount, r.agent_status, r.agent_paid_on
  from public.reservations r
  where r.agent_id is not null and r.agent_id = public.my_agent_id()
  order by r.reservation_date desc, r.reservation_time desc nulls last;
$$;
grant execute on function public.agent_sales() to authenticated;

/* ------------------------------------------------------------------- access */
alter table public.agents     enable row level security;
alter table public.ref_events enable row level security;
revoke all on public.agents     from anon;
revoke all on public.ref_events from anon;
grant select, insert, update, delete on public.agents     to authenticated;
grant select                         on public.ref_events to authenticated;

drop policy if exists "team only" on public.agents;
create policy "team only" on public.agents
  for all to authenticated using (public.is_team()) with check (public.is_team());
drop policy if exists "agent reads self" on public.agents;
create policy "agent reads self" on public.agents
  for select to authenticated using (id = public.my_agent_id());

drop policy if exists "team only" on public.ref_events;
create policy "team only" on public.ref_events
  for select to authenticated using (public.is_team());
drop policy if exists "agent reads own" on public.ref_events;
create policy "agent reads own" on public.ref_events
  for select to authenticated using (agent_id = public.my_agent_id());

-- Agents work on their own rows of the client log, nothing else. (The "team only" policy from supabase.sql stays.)
drop policy if exists "agent own clients" on public.log_entries;
create policy "agent own clients" on public.log_entries
  for all to authenticated
  using (agent_id is not null and agent_id = public.my_agent_id())
  with check (agent_id is not null and agent_id = public.my_agent_id());

/* ------------------------------------------------------------- the affiliates */
-- Codes become the referral links: connectedtulum.com/ref/<code>. Commission is set in the portal (Agents tab).
insert into public.agents (name, email, phone, code) values
  ('Arantxa Pineda',   'arantxapineda@gmail.com',   '+52 222 532 7116', 'arantxa'),
  ('Fernanda Quintos', 'fernandaquintos8@gmail.com','+52 55 6675 6817', 'fernanda'),
  ('Eduardo Vales',    'eduvgmusic@gmail.com',      '+52 4444570004',   'eduardo'),
  ('Nicole Solórzano', 'nicoleslzngrc@outlook.com', '+52 999 700 3321', 'nicole'),
  ('Valentino Faccio', 'valenfacciovera@gmail.com', '+52 56 5922 1924', 'valentino'),
  ('Rebeca Rangel',    'rangelrebeca015@gmail.com', '+52 222 481 3703', 'rebeca'),
  ('Alan Boneta',      'alanboneta@gmail.com',      '+52 81 1421 0669', 'alan')
on conflict do nothing;
