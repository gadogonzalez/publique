-- Categories, services and keywords: the vocabulary search and business
-- tagging are built on. See docs/SEARCH.md for how these interact.

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on categories
  for each row execute function set_updated_at();

-- A service is a concrete thing a business does ("Bombas de agua",
-- "Electricistas"). It belongs to one category for browsing/filtering, but
-- search matches services (and their keywords) directly, not just categories.
create table services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_category_id_idx on services (category_id);

create trigger services_set_updated_at
  before update on services
  for each row execute function set_updated_at();

-- Keywords are the free-text vocabulary that maps a natural search phrase
-- ("no sale agua", "presurizadora") to a service or category. This is what
-- lets "se me rompio la bomba de agua" resolve to plumbers/pump repair
-- without hardcoding phrases into application code. An AI intent layer can
-- later read/write this same table instead of replacing it.
create table keywords (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  service_id uuid references services(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint keywords_target_required check (
    service_id is not null or category_id is not null
  )
);

create index keywords_service_id_idx on keywords (service_id);
create index keywords_category_id_idx on keywords (category_id);
create index keywords_term_trgm_idx on keywords using gin (unaccent_lower(term) gin_trgm_ops);
