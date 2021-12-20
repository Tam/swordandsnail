\i util.sql
\i public.account.sql

create or replace function public.update_password (
  current_password varchar(72),
  new_password varchar(72)
) returns void as $$
begin
  if not exists(select 1 from public.account where user_id = util.current_user_id() and password_hash = crypt($1, password_hash)) then
    raise warning 'invalid_password';
    return;
  end if;

  update public.account
  set password_hash = crypt($2, gen_salt('bf'))
  where user_id = util.current_user_id();
end;
$$ language plpgsql volatile security definer;

grant execute on function public.update_password(varchar, varchar) to player;
