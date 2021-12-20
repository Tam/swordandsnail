\i public.user.sql
\i private.theme.sql
\i helpers.sql
\i util.sql

create table if not exists public.preferences (
  user_id uuid primary key references public.user (id) on delete cascade,
  text_column_width int not null default 80,
  theme private.theme not null default 'system',
  font varchar not null default 'quattro'
);

do $$ begin
  if col_missing ('preferences', 'font') then
    alter table public.preferences add column font varchar not null default 'quattro';
  end if;
end; $$;

comment on table public.preferences is E'@omit all,create,delete';

alter table public.preferences enable row level security;
grant select,update on table public.preferences to player;

drop policy if exists preferences_select on public.preferences;
create policy preferences_select on public.preferences for select using (
  user_id = util.current_user_id()
  or util.is_admin()
);

drop policy if exists preferences_update on public.preferences;
create policy preferences_update on public.preferences for update using (
  user_id = util.current_user_id()
  or util.is_admin()
);
