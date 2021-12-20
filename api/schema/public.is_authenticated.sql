\i util.sql

create or replace function public.is_authenticated () returns boolean as $$
  select util.current_user_id() != uuid_nil()
$$ language sql stable;

grant execute on function public.is_authenticated () to anonymous, player;
