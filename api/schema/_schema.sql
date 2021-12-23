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

-- SQL
-- =============================================================================

\echo 'public.user.sql' \i public.user.sql
\echo 'public.account.sql' \i public.account.sql
\echo 'public.preferences.sql' \i public.preferences.sql
\echo 'private.session.sql' \i private.session.sql
\echo 'public.is_authenticated.sql' \i public.is_authenticated.sql
\echo 'public.request_ssrid.sql' \i public.request_ssrid.sql
\echo 'public.verify_ssrid.sql' \i public.verify_ssrid.sql
\echo 'public.viewer.sql' \i public.viewer.sql
\echo 'private.register.sql' \i private.register.sql
\echo 'private.authenticate.sql' \i private.authenticate.sql
\echo 'public.update_password.sql' \i public.update_password.sql
\echo 'private.validate_security_stamp.sql' \i private.validate_security_stamp.sql
\echo 'private.password_reset.sql' \i private.password_reset.sql
\echo 'public.request_password_reset.sql' \i public.request_password_reset.sql
\echo 'public.page.sql' \i public.page.sql

-- Drop Helpers
-- =============================================================================

drop function if exists type_missing(varchar);
drop function if exists type_missing_value(varchar, varchar);
drop function if exists col_missing(varchar, varchar);
