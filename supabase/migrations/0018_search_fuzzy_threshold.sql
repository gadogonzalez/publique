-- Search fix: fuzzy (trigram) matching was too loose. Matches used pg_trgm's
-- `%` operator (similarity >= 0.3), so "carniceria" matched "carpinteria"
-- (0.35) and a carpentry shop came back for a butcher search. Real typos and
-- variants score >= 0.5 (plomero/plomeria 0.55, cerrajero/cerrajeria 0.62,
-- pelukeria/peluqueria 0.50).
--
-- Now a term matches when fuzzy_match_score >= 0.45, where the score is the
-- best of whole-string similarity and word similarity in both directions:
--   * word_similarity(query, term): "bomba" inside "bombas de agua"
--   * strict_word_similarity(term, query): "electricista" inside
--     "necesito un electricista" (whole words, so a short term like
--     "bar" doesn't match "barberia")
-- Everything else in search_businesses is unchanged from 0009.

create or replace function fuzzy_match_score(p_term text, p_query text)
returns real
language sql
immutable
as $$
  select greatest(
    similarity(unaccent_lower(p_term), unaccent_lower(p_query)),
    word_similarity(unaccent_lower(p_query), unaccent_lower(p_term)),
    strict_word_similarity(unaccent_lower(p_term), unaccent_lower(p_query))
  );
$$;

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
        fuzzy_match_score(s.name, (select q from normalized_query)),
        coalesce((
          select max(fuzzy_match_score(k.term, (select q from normalized_query)))
          from keywords k where k.service_id = s.id
        ), 0)
      ) as score
    from services s
    where (select q from normalized_query) is not null
  ),
  matched_services_strong as (
    select * from matched_services where score >= 0.45
  ),
  matched_categories as (
    select c.id,
      greatest(
        fuzzy_match_score(c.name, (select q from normalized_query)),
        coalesce((
          select max(fuzzy_match_score(k.term, (select q from normalized_query)))
          from keywords k where k.category_id = c.id
        ), 0)
      ) as score
    from categories c
    where (select q from normalized_query) is not null
  ),
  matched_categories_strong as (
    select * from matched_categories where score >= 0.45
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
    join matched_services_strong ms on ms.id = bs.service_id

    union all

    -- Business is tagged with a category that matched the query or an alias.
    select bc.business_id, mc.score * 0.7
    from business_categories bc
    join matched_categories_strong mc on mc.id = bc.category_id

    union all

    -- Business has its own free-text search tag matching the query
    -- (business_keywords, set from the admin editor).
    select bk.business_id, fuzzy_match_score(bk.term, (select q from normalized_query)) * 0.85
    from business_keywords bk
    where (select q from normalized_query) is not null
      and fuzzy_match_score(bk.term, (select q from normalized_query)) >= 0.45

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
  'Single search entry point used by src/lib/search. Full-text search on the business itself plus service/category/keyword alias matching (fuzzy_match_score >= 0.45, see 0018) and a location-aware filter.';
