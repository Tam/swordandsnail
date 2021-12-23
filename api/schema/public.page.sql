\i util.sql
\i private.set_timestamps.sql

create table if not exists public.page (
  id         uuid primary key default public.uuid_generate_v1mc(),
  title      varchar not null,
  slug       varchar unique not null,
  text       varchar default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.page enable row level security;
grant select on table public.page to anonymous, player;
grant all on table public.page to admin;

drop policy if exists page_select on public.page;
create policy page_select on public.page for select using (true);

drop policy if exists page_all on public.page;
create policy page_all on public.page for all using (
  util.is_admin()
);

drop trigger if exists set_timestamps on public.page;
create trigger set_timestamps before insert or update on public.page
  for each row execute procedure private.set_timestamps();

create or replace function public.page_from_slug (slug varchar) returns public.page as $$
  select p.* from public.page p where p.slug = $1
$$ language sql stable;

grant execute on function public.page_from_slug(varchar) to anonymous, player;
