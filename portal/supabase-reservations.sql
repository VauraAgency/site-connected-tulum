-- Connected Tulum team log, step 2: reservations, commissions and the action-item register.
-- Run ONCE in Supabase (SQL Editor > New query > paste > Run), after supabase.sql. Safe to run again.
-- Same lock as the log: only the emails in public.team_emails can read or write anything here.

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

/* ------------------------------------------------------------- reservations */
create table if not exists public.reservations (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  entry_id              uuid references public.log_entries(id) on delete set null,

  -- customer
  customer_name         text not null,
  customer_contact      text not null default '',
  guests                integer check (guests is null or guests > 0),

  -- the reservation
  service               text not null default '',
  venue                 text not null default '',
  details               text not null default '',
  reservation_date      date not null,
  res_status            text not null default 'confirmed' check (res_status in ('confirmed','completed','cancelled')),

  -- what the customer pays
  currency              text not null default 'USD' check (currency in ('USD','MXN','EUR')),
  total_amount          numeric(12,2) not null default 0 check (total_amount >= 0),
  amount_paid           numeric(12,2) not null default 0 check (amount_paid >= 0),
  payment_method        text not null default '',
  paid_to               text not null default '' check (paid_to in ('','venue','connected')),
  paid_on               date,

  -- what Connected Tulum earns, and whether it has been collected
  commission_basis      text not null default 'percent' check (commission_basis in ('percent','flat')),
  commission_rate       numeric(6,2) not null default 0 check (commission_rate between 0 and 100),
  commission_amount     numeric(12,2) not null default 0 check (commission_amount >= 0),
  commission_payer      text not null default '',
  commission_status     text not null default 'pending' check (commission_status in ('pending','invoiced','partial','collected','written_off')),
  commission_due        date,
  commission_collected  numeric(12,2) not null default 0 check (commission_collected >= 0),
  commission_collected_on date,
  commission_ref        text not null default '',

  notes                 text not null default ''
);

create index if not exists reservations_date_idx on public.reservations (reservation_date desc);
create index if not exists reservations_comm_idx on public.reservations (res_status, commission_status);

drop trigger if exists reservations_touch on public.reservations;
create trigger reservations_touch before update on public.reservations
  for each row execute function public.touch_updated_at();

/* ------------------------------------------------- follow-up / action register */
create table if not exists public.actions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  title           text not null,
  details         text not null default '',
  type            text not null default 'other' check (type in ('follow_up','commission','payment','booking','other')),
  priority        text not null default 'normal' check (priority in ('low','normal','high')),
  owner           text not null default '',
  due_date        date,
  status          text not null default 'open' check (status in ('open','done')),
  completed_at    timestamptz,
  entry_id        uuid references public.log_entries(id) on delete set null,
  reservation_id  uuid references public.reservations(id) on delete set null
);

create index if not exists actions_open_idx on public.actions (status, due_date);

drop trigger if exists actions_touch on public.actions;
create trigger actions_touch before update on public.actions
  for each row execute function public.touch_updated_at();

/* ------------------------------------------------------------------- access */
alter table public.reservations enable row level security;
alter table public.actions      enable row level security;
revoke all on public.reservations from anon;
revoke all on public.actions      from anon;
grant select, insert, update, delete on public.reservations to authenticated;
grant select, insert, update, delete on public.actions      to authenticated;

drop policy if exists "team only" on public.reservations;
create policy "team only" on public.reservations
  for all to authenticated using (public.is_team()) with check (public.is_team());

drop policy if exists "team only" on public.actions;
create policy "team only" on public.actions
  for all to authenticated using (public.is_team()) with check (public.is_team());
