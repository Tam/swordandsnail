\i helpers.sql

do $$ begin

  if type_missing('theme') then
    create type private.theme as enum (
      'light',
      'dark',
      'system'
    );
  end if;

  if type_missing_value('theme', 'gameboy') then
    alter type private.theme add value 'gameboy';
  end if;

end $$;
