\i public.user.sql

create table if not exists private.password_reset (
  id      uuid primary key default public.uuid_generate_v1mc(),
  user_id uuid references public.user(id) on delete cascade,
  exp     timestamptz default (now() + interval '1 day')
);

create or replace function private.on_before_insert_password_reset () returns trigger as $$
begin
  delete from private.password_reset
  where user_id = new.user_id;

  return new;
end;
$$ language plpgsql volatile security definer;

drop trigger if exists before_insert_password_reset on private.password_reset;
create trigger before_insert_password_reset
  before insert on private.password_reset
  for each row execute procedure private.on_before_insert_password_reset();
