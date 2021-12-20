\i util.sql
\i public.user.sql

create or replace function public.viewer () returns public.user as $$
  select * from public.user where id = util.current_user_id()
$$ language sql stable;

grant execute on function public.viewer () to player;
