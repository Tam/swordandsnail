-- noinspection SqlNoDataSourceInspectionForFile

set client_min_messages to warning;

-- Extensions
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Schemas
-- =============================================================================

create schema if not exists public;
create schema if not exists private;
create schema if not exists util;

-- Helpers
-- =============================================================================

create or replace function type_missing (typename varchar) returns boolean as $$
  select not exists (select true from pg_type where typname = typename)
$$ language sql stable;

create or replace function col_missing (tblname varchar, colname varchar) returns boolean as $$
  select not exists (select true from information_schema.columns where table_name = tblname and column_name = colname)
$$ language sql stable;

-- Utilities
-- =============================================================================

create or replace function util.current_user_id () returns uuid as $$
  select coalesce(nullif(current_setting('session.user_id', true), 'null'), uuid_nil()::text)::uuid
$$ language sql security definer;

create or replace function util.is_admin () returns boolean as $$
  select exists(select from public.account where user_id = util.current_user_id() and role = 'admin')
  or (select case when 'on' then true else false end from current_setting('is_superuser'))
$$ language sql security definer;

-- Types
-- =============================================================================

do $$ begin

  if type_missing('role') then
    create type private.role as enum (
      'player',
      'designer',
      'admin'
    );
  end if;

  if type_missing('theme') then
    create type private.theme as enum (
      'light',
      'dark',
      'system'
    );
  end if;

end $$;

-- RLS
-- =============================================================================

do $$ begin

  -- Reset
  -- ---------------------------------------------------------------------------

  if exists(select from pg_catalog.pg_roles where rolname = 'anonymous') then
    drop owned by anonymous cascade;
    drop owned by player cascade;
    drop owned by designer cascade;
    drop owned by admin cascade;
    drop owned by server cascade;
  end if;

  drop role if exists anonymous;
  drop role if exists player;
  drop role if exists designer;
  drop role if exists admin;
  drop role if exists server;

  revoke all on all functions in schema public from public cascade;
  revoke all on schema public from public cascade;

  revoke all on all functions in schema private from public cascade;
  revoke all on schema private from public cascade;

  -- Create
  -- ---------------------------------------------------------------------------

  create role anonymous;
  create role player;
  create role designer;
  create role admin;
  create role server;

  grant player to designer;
  grant designer to admin;
  grant admin to server;

  -- General Permissions
  -- ---------------------------------------------------------------------------

  grant usage on schema public to anonymous, player;
  grant usage on schema util to anonymous, player;
  grant usage on schema private to admin;

  grant execute on function public.uuid_generate_v1mc() to anonymous, player;
  grant execute on function public.uuid_nil() to anonymous, player;

end $$;

-- Tables
-- =============================================================================

-- Account / Auth
-- -----------------------------------------------------------------------------

-- User

create table if not exists public.user (
  id         uuid primary key default public.uuid_generate_v1mc(),
  name       varchar default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.user is E'@omit create,delete';
comment on column public.user.created_at is E'@omit update';
comment on column public.user.updated_at is E'@omit update';

alter table public.user enable row level security;
grant select,update on table public.user to player;

drop policy if exists user_select on public.user;
create policy user_select on public.user for select using (true);

drop policy if exists user_update on public.user;
create policy user_update on public.user for update using (
  id = util.current_user_id()
  or util.is_admin()
);

-- Account

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

-- Preferences

create table if not exists public.preferences (
  user_id uuid primary key references public.user (id) on delete cascade,
  text_column_width int not null default 80,
  theme private.theme not null default 'system',
  font varchar not null default 'quattro'
);

do $$ begin
  if col_missing ('preferences', 'font') then
    alter table public.preferences add column font varchar not null default 'quattro';
  end if;
end; $$;

comment on table public.preferences is E'@omit all,create,delete';

alter table public.preferences enable row level security;
grant select,update on table public.preferences to player;

drop policy if exists preferences_select on public.preferences;
create policy preferences_select on public.preferences for select using (
  user_id = util.current_user_id()
  or util.is_admin()
);

drop policy if exists preferences_update on public.preferences;
create policy preferences_update on public.preferences for update using (
  user_id = util.current_user_id()
  or util.is_admin()
);

-- Session

create table if not exists private.session (
  sid    varchar not null collate "default",
  sess   json not null,
  expire timestamp(6) not null,
  primary key (sid) not deferrable initially immediate
) with (oids = false);

create index if not exists idx_session_expire on private.session(expire);

-- Functions
-- =============================================================================

-- Account / Auth
-- -----------------------------------------------------------------------------

-- Is Authenticated

create or replace function public.is_authenticated () returns boolean as $$
  select util.current_user_id() != uuid_nil()
$$ language sql stable;

grant execute on function public.is_authenticated () to anonymous, player;

-- Viewer

create or replace function public.viewer () returns public.user as $$
  select * from public.user where id = util.current_user_id()
$$ language sql stable;

grant execute on function public.viewer () to player;

-- Register

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

-- Authenticate

create or replace function private.authenticate (
  email    varchar(256),
  password varchar(72)
) returns uuid as $$
  select user_id from public.account a
  where a.email = $1
    and a.password_hash = crypt($2, a.password_hash)
$$ language sql stable security definer;

grant execute on function private.authenticate(varchar, varchar) to server;

-- Update Password

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

-- Triggers
-- =============================================================================

-- Timestamps
-- -----------------------------------------------------------------------------

create or replace function private.set_timestamps () returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    new.created_at = now();
  end if;

  if (row(new.*) is distinct from row(old.*)) then
    new.updated_at = now();
    return new;
  end if;

  return old;
end;
$$ language plpgsql volatile security definer;

drop trigger if exists set_timestamps on public.user;
create trigger set_timestamps before insert or update on public.user
  for each row execute procedure private.set_timestamps();

-- Account / Auth
-- -----------------------------------------------------------------------------

-- Validate Security Stamp

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

-- Drop Helpers
-- =============================================================================

drop function if exists type_missing(varchar);
