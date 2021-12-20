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
