\i private.session.sql
\i public.account.sql

drop function if exists public.verify_ssrid (ssrid varchar);
create or replace function public.verify_ssrid (ssrid varchar) returns varchar as $$
declare
  _id uuid;
  _role varchar;
begin
  select (s.sess->>'user_id')::uuid, s.sid
  into _id
  from private.session s
  where s.ssrid = $1;

  select role
  into _role
  from public.account
  where user_id = _id;

  return _role;
end;
$$ language plpgsql stable security definer;

grant execute on function public.verify_ssrid (varchar) to anonymous;
