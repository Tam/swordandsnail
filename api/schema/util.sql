create or replace function util.current_user_id () returns uuid as $$
  select coalesce(nullif(current_setting('session.user_id', true), 'null'), uuid_nil()::text)::uuid
$$ language sql security definer;

create or replace function util.is_admin () returns boolean as $$
  select exists(select from public.account where user_id = util.current_user_id() and role = 'admin')
  or (select case when 'on' then true else false end from current_setting('is_superuser'))
$$ language sql security definer;

create or replace function util.send_email (
  recipient varchar,
  template varchar,
  meta json
) returns void as $$
  select graphile_worker.add_job(
    'email-send-templated',
    json_build_object(
      'to', recipient,
      'template', template,
      'meta', meta
    )
  );
$$ language sql stable;
