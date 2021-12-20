create or replace function type_missing (typename varchar) returns boolean as $$
select not exists (select true from pg_type where typname = typename)
$$ language sql stable;

create or replace function type_missing_value (typename varchar, val varchar) returns boolean as $$
select not exists(select 1 from pg_enum e inner join pg_type t on t.typname = typename and t.typcategory = 'E' where e.enumlabel = val and e.enumtypid = t.oid);
$$ language sql stable;

create or replace function col_missing (tblname varchar, colname varchar) returns boolean as $$
select not exists (select true from information_schema.columns where table_name = tblname and column_name = colname)
$$ language sql stable;
