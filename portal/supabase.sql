-- Connected Tulum team log: run this ONCE in Supabase (SQL Editor > New query > paste > Run).

create table if not exists public.log_entries (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  name           text not null,
  contact        text not null default '',
  source         text not null default '',
  events         text[] not null default '{}',
  other_interest text not null default '',
  guests         integer,
  trip_dates     text not null default '',
  services       text[] not null default '{}',
  notes          text not null default '',
  actions_taken  text not null default '',
  status         text not null default 'new' check (status in ('new','in_progress','booked','done','lost')),
  follow_up      boolean not null default false,
  follow_up_date date,
  follow_up_note text not null default ''
);

create index if not exists log_entries_follow_idx on public.log_entries (follow_up, follow_up_date);

create or replace function public.log_entries_touch() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists log_entries_touch on public.log_entries;
create trigger log_entries_touch before update on public.log_entries
  for each row execute function public.log_entries_touch();

-- Only signed-in team members can read or write. Anonymous visitors get nothing.
alter table public.log_entries enable row level security;
revoke all on public.log_entries from anon;
grant select, insert, update, delete on public.log_entries to authenticated;

drop policy if exists "team only" on public.log_entries;
create policy "team only" on public.log_entries
  for all to authenticated using (true) with check (true);
