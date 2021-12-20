\i util.sql
\i private.set_timestamps.sql

create table if not exists public.user (
  id         uuid primary key default public.uuid_generate_v1mc(),
  name       varchar default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.user is E'@omit create,delete';
comment on column public.user.created_at is E'@omit update';
comment on column public.user.updated_at is E'@omit update';

alter table public.user enable row level security;
grant select,update on table public.user to player;

drop policy if exists user_select on public.user;
create policy user_select on public.user for select using (true);

drop policy if exists user_update on public.user;
create policy user_update on public.user for update using (
  id = util.current_user_id()
  or util.is_admin()
);

drop trigger if exists set_timestamps on public.user;
create trigger set_timestamps before insert or update on public.user
  for each row execute procedure private.set_timestamps();
