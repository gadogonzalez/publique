-- Geographical hierarchy, modeled as a single self-referencing table so new
-- levels (province, department, locality, and anything added later) never
-- require a schema change. `type` says what level a row is; `parent_id`
-- says where it sits. See docs/DATABASE.md for the full rationale.
create table locations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('country', 'province', 'department', 'locality')),
  name text not null,
  slug text not null,
  parent_id uuid references locations(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A country has no parent; every other level must have one.
  constraint locations_parent_required check (
    (type = 'country' and parent_id is null) or
    (type <> 'country' and parent_id is not null)
  )
);

-- Slugs only need to be unique among siblings (e.g. "san-jose" can exist
-- under two different departments). Use a fixed sentinel for the root level.
create unique index locations_parent_slug_idx
  on locations (coalesce(parent_id, '00000000-0000-0000-0000-000000000000'), slug);

create index locations_parent_id_idx on locations (parent_id);
create index locations_type_idx on locations (type);

create trigger locations_set_updated_at
  before update on locations
  for each row execute function set_updated_at();

comment on table locations is
  'Self-referencing geographical hierarchy: country -> province -> department -> locality. Never hardcode Guaymallen or any place name in application code.';
