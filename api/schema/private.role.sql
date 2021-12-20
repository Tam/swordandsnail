\i helpers.sql

do $$ begin

  if type_missing('role') then
    create type private.role as enum (
      'player',
      'designer',
      'admin'
    );
  end if;

end $$;
