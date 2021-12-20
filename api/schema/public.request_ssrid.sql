\i util.sql
\i private.session.sql

create or replace function public.request_ssrid () returns varchar as $$
declare
  _id uuid = util.current_user_id();
  _sid varchar;
  _ssrid varchar;
begin
  if _id is null or _id = uuid_nil() then
    return null;
  end if;

  _sid := current_setting('session.id', true)::varchar;

  if _sid is null then
    return null;
  end if;

  select ssrid
  into _ssrid
  from private.session
  where sid = _sid;

  if _ssrid is null then
    _ssrid := encode(gen_random_bytes(10), 'base64');
    update private.session
    set ssrid = _ssrid
    where sid = _sid;
  end if;

  return _ssrid;
end;
$$ language plpgsql volatile security definer;

grant execute on function public.request_ssrid () to player;
