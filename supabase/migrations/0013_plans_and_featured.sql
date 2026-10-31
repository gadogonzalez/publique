-- Commercial model evolution: free vs. paid plan capabilities, and a
-- category-scoped "featured placement" system (1 primary banner + up to 4
-- secondary cards per category+market), on top of the existing `plans` and
-- `businesses.featured` columns -- see docs/PRODUCT.md and the product
-- brief this migration implements.
--
-- Plan assignment stays fully manual (admin picks a plan per business, no
-- checkout/self-service) -- this migration only adds the data model, not
-- any billing automation.

-- ---------------------------------------------------------------------
-- 1. Plan capability flag
-- ---------------------------------------------------------------------
-- `plans` keeps its existing rows/names (not renamed, per product
-- decision) -- capabilities are derived from this flag everywhere in the
-- app (see src/lib/plans.ts), never from a plan's name/slug directly.
alter table plans add column is_free boolean not null default false;

update plans set is_free = true where price_ars is null or price_ars = 0;

-- ---------------------------------------------------------------------
-- 2. Category intro copy (section "Introducción" on /categorias/[slug])
-- ---------------------------------------------------------------------
-- Nullable: categories/slugs/names are not being touched (product
-- decision), this only adds optional tagline copy an admin can fill in
-- later. The category page falls back to a generic, non-hardcoded line
-- when this is null (see src/app/categorias/[slug]/page.tsx).
alter table categories add column description text;

-- ---------------------------------------------------------------------
-- 3. Featured placements
-- ---------------------------------------------------------------------
-- One row per occupied slot. `market_id` points at a `locations` row of
-- type 'department' -- today that's only Guaymallen, but this scopes the
-- cupo rules ("1 principal per category") per market for free, so a
-- second department later doesn't need a schema change (see
-- src/lib/data/locations.ts getPrimaryMarket()).
create table featured_placements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  market_id uuid not null references locations(id) on delete restrict,
  type text not null check (type in ('primary', 'secondary')),
  priority int not null default 0,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint featured_placements_dates_check check (ends_at is null or ends_at > starts_at)
);

create index featured_placements_lookup_idx
  on featured_placements (category_id, market_id, type, is_active);
create index featured_placements_business_idx on featured_placements (business_id);

create trigger featured_placements_set_updated_at
  before update on featured_placements
  for each row execute function set_updated_at();

-- Enforces every commercial rule from the brief at the data layer (not
-- just in the admin UI), so a slot conflict is impossible no matter what
-- inserts/updates it: only Basico-plan businesses, no more than 1 active
-- primary / 4 active secondary per category+market, and a business can't
-- hold two slots in the same category at once. Validation is based on
-- date-range overlap against `starts_at`/`ends_at`, not just `is_active`,
-- per the brief ("las validaciones deben considerar los periodos de
-- vigencia"). Rows are never deleted by this -- history stays for future
-- campaign reporting (see section 06 of the brief).
create or replace function featured_placements_validate()
returns trigger
language plpgsql
as $$
declare
  business_plan_is_free boolean;
  conflicting_type text;
  overlapping_count int;
begin
  if not NEW.is_active then
    return NEW;
  end if;

  select p.is_free into business_plan_is_free
  from businesses b
  left join plans p on p.id = b.plan_id
  where b.id = NEW.business_id;

  if coalesce(business_plan_is_free, true) then
    raise exception 'Solo negocios con plan pago (no gratis) pueden ocupar un espacio destacado';
  end if;

  select fp.type into conflicting_type
  from featured_placements fp
  where fp.business_id = NEW.business_id
    and fp.category_id = NEW.category_id
    and fp.market_id = NEW.market_id
    and fp.type <> NEW.type
    and fp.id <> NEW.id
    and fp.is_active
    and fp.starts_at < coalesce(NEW.ends_at, 'infinity'::timestamptz)
    and NEW.starts_at < coalesce(fp.ends_at, 'infinity'::timestamptz)
  limit 1;

  if conflicting_type is not null then
    raise exception 'Este negocio ya tiene un destacado % activo en esta categoria para ese periodo', conflicting_type;
  end if;

  select count(*) into overlapping_count
  from featured_placements fp
  where fp.category_id = NEW.category_id
    and fp.market_id = NEW.market_id
    and fp.type = NEW.type
    and fp.id <> NEW.id
    and fp.business_id <> NEW.business_id
    and fp.is_active
    and fp.starts_at < coalesce(NEW.ends_at, 'infinity'::timestamptz)
    and NEW.starts_at < coalesce(fp.ends_at, 'infinity'::timestamptz);

  if NEW.type = 'primary' and overlapping_count >= 1 then
    raise exception 'Ya hay un destacado principal activo en esta categoria para ese periodo';
  elsif NEW.type = 'secondary' and overlapping_count >= 4 then
    raise exception 'Ya hay 4 destacados secundarios activos en esta categoria para ese periodo';
  end if;

  return NEW;
end;
$$;

create trigger featured_placements_validate_trigger
  before insert or update on featured_placements
  for each row execute function featured_placements_validate();

alter table featured_placements enable row level security;

-- Public consumer read is scoped to "active and currently in window" --
-- the same row outside its date range is invisible to the public site
-- without needing separate application-level filtering everywhere.
create policy featured_placements_public_read on featured_placements
  for select
  using (
    is_active
    and starts_at <= now()
    and (ends_at is null or ends_at > now())
  );

create policy featured_placements_admin_all on featured_placements
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- 4. Data API grants (see 0012_data_api_grants.sql for why these are
--    required in addition to RLS -- PostgREST can't see a table at all
--    without a table-level GRANT, regardless of policy).
-- ---------------------------------------------------------------------
grant select on featured_placements to anon, authenticated;
grant insert, update on featured_placements to authenticated;

-- categories previously only had insert/delete for authenticated (see
-- 0012_data_api_grants.sql) -- updateCategoryDescription() is the first
-- update path, needed for the new optional `description` column above.
grant update on categories to authenticated;
