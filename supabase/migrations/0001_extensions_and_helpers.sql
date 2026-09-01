-- Extensions needed across the schema.
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists pg_trgm;    -- fuzzy / trigram search
create extension if not exists unaccent;   -- accent-insensitive search

-- Generic "touch updated_at" trigger, reused by every table that has one.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Unaccented-lowercase helper used by search + slugs. Marked IMMUTABLE so it
-- can back functional indexes.
create or replace function unaccent_lower(text)
returns text
language sql
immutable
parallel safe
as $$
  select lower(unaccent($1));
$$;
