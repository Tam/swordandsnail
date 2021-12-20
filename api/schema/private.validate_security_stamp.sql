\i public.account.sql

create or replace function private.validate_security_stamp () returns trigger as $$
declare
  _stamp varchar(100);
begin
  _stamp := md5(new.email || new.password_hash);

  if old.security_stamp is null or old.security_stamp != _stamp then
    -- TODO: Purge all sessions except the one that triggered this change

    new.security_stamp := _stamp;
  end if;

  return new;
end;
$$ language plpgsql volatile security definer;

drop trigger if exists validate_security_stamp on public.account;
create trigger validate_security_stamp
  before insert or update on public.account
  for each row execute procedure private.validate_security_stamp();
