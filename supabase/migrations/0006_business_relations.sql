-- Join tables and 1-to-many detail tables around a business.

create table business_categories (
  business_id uuid not null references businesses(id) on delete cascade,
  category_id uuid not null references categories(id) on delete restrict,
  is_primary boolean not null default false,
  primary key (business_id, category_id)
);

create index business_categories_category_id_idx on business_categories (category_id);

create table business_services (
  business_id uuid not null references businesses(id) on delete cascade,
  service_id uuid not null references services(id) on delete restrict,
  primary key (business_id, service_id)
);

create index business_services_service_id_idx on business_services (service_id);

-- Where a business is physically based is `businesses.location_id`. Where it
-- is willing to travel/serve is this table -- e.g. a plumber based in
-- Dorrego who covers all of Guaymallen picks the Guaymallen *department*
-- row here, not every individual locality.
create table business_service_areas (
  business_id uuid not null references businesses(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  primary key (business_id, location_id)
);

create index business_service_areas_location_id_idx on business_service_areas (location_id);

create table business_images (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index business_images_business_id_idx on business_images (business_id, sort_order);

create table business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0 = Sunday
  opens_at time,
  closes_at time,
  closed boolean not null default false,
  unique (business_id, day_of_week)
);

create index business_hours_business_id_idx on business_hours (business_id);

-- Free-text search tags entered per business from the admin editor (e.g.
-- "urgencias", "abre fines de semana") -- distinct from the global
-- service/category alias table in 0003_taxonomy.sql, which is shared
-- vocabulary. Both feed search_businesses(); see docs/SEARCH.md.
create table business_keywords (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  term text not null,
  created_at timestamptz not null default now(),
  unique (business_id, term)
);

create index business_keywords_business_id_idx on business_keywords (business_id);
create index business_keywords_term_trgm_idx on business_keywords using gin (unaccent_lower(term) gin_trgm_ops);
