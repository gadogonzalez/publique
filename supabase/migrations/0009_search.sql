-- Search foundation for MVP: PostgreSQL full-text search (Spanish, accent
-- insensitive) + trigram fuzzy matching + the keyword/alias table from
-- 0003_taxonomy.sql. Everything the app needs is exposed through the single
-- `search_businesses` RPC function below -- see src/lib/search and
-- docs/SEARCH.md. Swapping the underlying engine later (e.g. Typesense)
-- means changing that one function/adapter, not the UI.

-- A Spanish text-search config that also folds accents, so "bombas" and a
-- query missing/adding accents still match.
create text search configuration spanish_unaccent (copy = spanish);
alter text search configuration spanish_unaccent
  alter mapping for hword, hword_part, word with unaccent, spanish_stem;

alter table businesses add column search_vector tsvector;

create or replace function businesses_set_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('spanish_unaccent', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('spanish_unaccent', coalesce(new.short_description, '')), 'B') ||
    setweight(to_tsvector('spanish_unaccent', coalesce(new.long_description, '')), 'C');
  return new;
end;
$$;

create trigger businesses_search_vector_trigger
  before insert or update of name, short_description, long_description
  on businesses
  for each row execute function businesses_set_search_vector();

create index businesses_search_vector_idx on businesses using gin (search_vector);
create index businesses_name_trgm_idx on businesses using gin (unaccent_lower(name) gin_trgm_ops);
create index categories_name_trgm_idx on categories using gin (unaccent_lower(name) gin_trgm_ops);
create index services_name_trgm_idx on services using gin (unaccent_lower(name) gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- Location hierarchy helpers (small tree, cheap to walk recursively).
-- ---------------------------------------------------------------------------

create or replace function location_ancestors(p_location_id uuid)
returns table (id uuid)
language sql
stable
as $$
  with recursive chain as (
    select l.id, l.parent_id from locations l where l.id = p_location_id
    union all
    select l.id, l.parent_id from locations l
    join chain c on l.id = c.parent_id
  )
  select chain.id from chain where chain.id <> p_location_id;
$$;

create or replace function location_descendants(p_location_id uuid)
returns table (id uuid)
language sql
stable
as $$
  with recursive tree as (
    select l.id from locations l where l.parent_id = p_location_id
    union all
    select l.id from locations l
    join tree t on l.parent_id = t.id
  )
  select tree.id from tree;
$$;

-- ---------------------------------------------------------------------------
-- search_businesses: the one entry point the app calls.
-- ---------------------------------------------------------------------------

create or replace function search_businesses(
  p_query text default null,
  p_category_slug text default null,
  p_location_id uuid default null,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  id uuid,
  name text,
  slug text,
  short_description text,
  logo_url text,
  cover_image_url text,
  whatsapp text,
  phone text,
  location_id uuid,
  featured boolean,
  relevance real,
  total_count bigint
)
language sql
stable
as $$
  with normalized_query as (
    select nullif(trim(coalesce(p_query, '')), '') as q
  ),
  matched_services as (
    select s.id, s.category_id,
      greatest(
        similarity(unaccent_lower(s.name), unaccent_lower((select q from normalized_query))),
        coalesce((
          select max(similarity(unaccent_lower(k.term), unaccent_lower((select q from normalized_query))))
          from keywords k where k.service_id = s.id
        ), 0)
      ) as score
    from services s
    where (select q from normalized_query) is not null
      and (
        unaccent_lower(s.name) % unaccent_lower((select q from normalized_query))
        or exists (
          select 1 from keywords k
          where k.service_id = s.id
            and unaccent_lower(k.term) % unaccent_lower((select q from normalized_query))
        )
      )
  ),
  matched_categories as (
    select c.id,
      greatest(
        similarity(unaccent_lower(c.name), unaccent_lower((select q from normalized_query))),
        coalesce((
          select max(similarity(unaccent_lower(k.term), unaccent_lower((select q from normalized_query))))
          from keywords k where k.category_id = c.id
        ), 0)
      ) as score
    from categories c
    where (select q from normalized_query) is not null
      and (
        unaccent_lower(c.name) % unaccent_lower((select q from normalized_query))
        or exists (
          select 1 from keywords k
          where k.category_id = c.id
            and unaccent_lower(k.term) % unaccent_lower((select q from normalized_query))
        )
      )
  ),
  candidates as (
    -- Direct text match on the business itself.
    select b.id as business_id,
      ts_rank(b.search_vector, plainto_tsquery('spanish_unaccent', (select q from normalized_query))) as score
    from businesses b
    where (select q from normalized_query) is not null
      and b.search_vector @@ plainto_tsquery('spanish_unaccent', (select q from normalized_query))

    union all

    -- Business offers a service that matched the query or one of its aliases.
    select bs.business_id, ms.score * 0.9
    from business_services bs
    join matched_services ms on ms.id = bs.service_id

    union all

    -- Business is tagged with a category that matched the query or an alias.
    select bc.business_id, mc.score * 0.7
    from business_categories bc
    join matched_categories mc on mc.id = bc.category_id

    union all

    -- Business has its own free-text search tag matching the query
    -- (business_keywords, set from the admin editor).
    select bk.business_id, similarity(unaccent_lower(bk.term), unaccent_lower((select q from normalized_query))) * 0.85
    from business_keywords bk
    where (select q from normalized_query) is not null
      and unaccent_lower(bk.term) % unaccent_lower((select q from normalized_query))

    union all

    -- No query: category/location browsing only, everyone is a candidate.
    select b.id, 0.5
    from businesses b
    where (select q from normalized_query) is null
  ),
  scored as (
    select business_id, max(score) as relevance
    from candidates
    group by business_id
  ),
  filtered as (
    select b.*, s.relevance
    from scored s
    join businesses b on b.id = s.business_id
    where b.status = 'active'
      and (
        p_category_slug is null
        or exists (
          select 1 from business_categories bc
          join categories c on c.id = bc.category_id
          where bc.business_id = b.id and c.slug = p_category_slug
        )
      )
      and (
        p_location_id is null
        or b.location_id = p_location_id
        or b.location_id in (select id from location_descendants(p_location_id))
        or exists (
          select 1 from business_service_areas bsa
          where bsa.business_id = b.id
            and (
              bsa.location_id = p_location_id
              or bsa.location_id in (select id from location_ancestors(p_location_id))
            )
        )
      )
  ),
  ranked as (
    select *,
      relevance
        + (case when featured then 0.25 else 0 end)
        + (case when p_location_id is not null and location_id = p_location_id then 0.15 else 0 end)
        as final_score,
      count(*) over () as total_count
    from filtered
  )
  select
    id, name, slug, short_description, logo_url, cover_image_url,
    whatsapp, phone, location_id, featured, final_score as relevance, total_count
  from ranked
  order by final_score desc, featured desc, name asc
  limit p_limit offset p_offset;
$$;

comment on function search_businesses is
  'Single search entry point used by src/lib/search. Combines full-text search on the business itself with service/category + keyword-alias matching and a location-aware filter, so a natural phrase like "se me rompio la bomba de agua" reaches plumbers/pump repair businesses without hardcoded phrases in application code.';
