create table if not exists private.session (
  sid    varchar not null collate "default",
  sess   json not null,
  expire timestamp(6) not null,
  ssrid  varchar default null,
  primary key (sid) not deferrable initially immediate
) with (oids = false);

create index if not exists idx_session_expire on private.session(expire);

alter table private.session add column if not exists ssrid varchar default null;
