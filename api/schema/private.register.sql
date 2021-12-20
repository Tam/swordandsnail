\i public.account.sql
\i public.user.sql
\i public.preferences.sql

create or replace function private.register (
  email varchar(256),
  password varchar(72),
  name varchar
) returns uuid as $$
declare
  _id uuid;
begin
  -- Force email lowercase
  email := lower(email);

  -- Check if email already exists
  if (select true from public.account a where a.email = lower($1)) then
    raise warning 'email_taken';
    return null;
  end if;

  -- Create user
  insert into public.user (name)
  values ($3)
  returning id into _id;

  -- Create account
  insert into public.account (user_id, email, password_hash)
  values (_id, $1, crypt(password, gen_salt('bf')));

  -- Create preferences
  insert into public.preferences (user_id) values (_id);

  return _id;
end;
$$ language plpgsql volatile security definer;

grant execute on function private.register (varchar, varchar, varchar) to server;
