\i public.account.sql
\i public.user.sql
\i private.password_reset.sql
\i util.sql

create or replace function public.request_password_reset (
  email varchar(256),
  operating_system varchar(256),
  browser_name varchar(256)
) returns void as $$
declare
  _id uuid;
  _user public.user;
  _account public.account;
begin
  -- Get the account
  select a.*
  into _account
  from public.account a
  join public.user u on u.id = a.user_id
  where a.email = lower($1);

  -- If the email is invalid, just return
  if _account is null then
    return;
  end if;

  -- Get the user
  select u.*
  into _user
  from public.user u
  where u.id = _account.user_id;

  -- Delete any existing requests
  delete from private.password_reset
  where user_id = _account.user_id;

  -- Create a new request
  insert into private.password_reset (user_id)
  values (_account.user_id)
  returning private.password_reset.id into _id;

  -- Send the email
  perform util.send_email(
    _account.email,
    'password-reset',
    json_build_object(
      'name', _user.name,
      'action_url', '$APP_URL/reset?code=' || encode(_id::varchar::bytea, 'base64'),
      'operating_system', operating_system,
      'browser_name', browser_name
    )
  );
end;
$$ language plpgsql volatile security definer;

grant execute on function public.request_password_reset(varchar, varchar, varchar) to anonymous;
