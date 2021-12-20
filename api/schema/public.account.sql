\i util.sql
\i public.user.sql
\i private.role.sql

create table if not exists public.account (
  user_id        uuid primary key references public.user (id) on delete cascade,
  role           private.role not null default 'player',
  email          varchar(256) unique check (email ~* '^.+@.+\..+$'),
  password_hash  varchar(100) default null,
  security_stamp varchar(100)
);

comment on table public.account is E'@omit all,create,delete';
comment on column public.account.password_hash is E'@omit';
comment on column public.account.security_stamp is E'@omit';

alter table public.account enable row level security;
grant select,update on table public.account to player;

drop policy if exists account_select on public.account;
create policy account_select on public.account for select using (
  user_id = util.current_user_id()
  or util.is_admin()
);

drop policy if exists account_update on public.account;
create policy account_update on public.account for update using (
  user_id = util.current_user_id()
  or util.is_admin()
);

-- Before Account Create

create or replace function private.before_account_create () returns trigger as $$
begin
  -- Force email to lower-case
  new.email = lower(new.email);

  return new;
end;
$$ language plpgsql volatile security definer;

drop trigger if exists before_account_create on public.account;
create trigger before_account_create
  before insert on public.account
  for each row execute procedure private.before_account_create();

-- Before Account Update

create or replace function private.before_account_update () returns trigger as $$
begin
  -- Prevent non-admins from changing user roles
  if not util.is_admin() then
    new.role = old.role;
  end if;

  -- Force email to lower-case
  new.email = lower(new.email);

  return new;
end;
$$ language plpgsql volatile security definer;

drop trigger if exists before_account_update on public.account;
create trigger before_account_update
  before update on public.account
  for each row execute procedure private.before_account_update();
