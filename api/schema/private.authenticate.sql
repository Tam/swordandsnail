\i public.account.sql

create or replace function private.authenticate (
  email    varchar(256),
  password varchar(72)
) returns uuid as $$
  select user_id from public.account a
  where a.email = $1
    and a.password_hash = crypt($2, a.password_hash)
$$ language sql stable security definer;

grant execute on function private.authenticate(varchar, varchar) to server;
