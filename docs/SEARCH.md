# Search

## The problem

Consumers type what's wrong, not a category name: *"se me rompió la bomba
de agua"* should surface plumbers and pump-repair businesses even though
none of them have "bomba de agua" literally in their name. Search has to
match on business text, on the service/category taxonomy, and on aliases —
without hardcoding phrases into application code.

## How it works today (PostgreSQL, MVP)

Everything is behind one entry point: `search()` in `src/lib/search/index.ts`,
which calls the `SearchProvider` interface (`src/lib/search/types.ts`).
The only implementation today is `PostgresSearchProvider`
(`src/lib/search/postgres-provider.ts`), a thin wrapper around the
`search_businesses()` Postgres function (`supabase/migrations/0009_search.sql`).

`search_businesses(query, category_slug, location_id, limit, offset)`
combines four candidate sources and takes the max score per business:

1. **Direct full-text match** on the business's own `search_vector`
   (name/short/long description, Spanish-stemmed, accent-insensitive).
2. **Service match** — the query (or one of that service's aliases in
   `keywords`) matches a service's name via trigram similarity; every
   business offering that service is a candidate.
3. **Category match** — same idea, one level up.
4. **Business keyword match** — the query matches a free-text tag an admin
   attached to that specific business (`business_keywords`).

Results are filtered to `status = 'active'`, optionally to a category slug
and/or a location (matching the business's own base locality, any
locality "under" a searched department, or a service area that covers the
searched location — see `docs/DATABASE.md`). Final ranking is relevance +
a featured boost + a same-location boost.

This is why "se me rompió la bomba de agua" reaches Bombas Cuyo in the seed
data even though that phrase never appears verbatim anywhere: "bomba de
agua" / "se me rompió la bomba de agua" are seeded as aliases of the
*Bombas de agua* service, which Bombas Cuyo offers.

## Growing the vocabulary

Add more phrases people actually search for as rows in `keywords` — global
aliases scoped to a service or category, edited from `/admin/categorias`
(each service/category card has an alias editor) — or as `business_keywords`
for one specific listing (via the business editor, "Palabras clave
adicionales"). No code change needed either way.

## Swapping the engine later

Everything outside `src/lib/search/` only ever imports `search()` from
`src/lib/search/index.ts` — no page or component talks to Supabase or a
search engine directly. To move to Typesense (or add an AI intent layer):

1. Implement `SearchProvider` (e.g. `TypesenseSearchProvider`).
2. Swap the instantiation in `src/lib/search/index.ts`.
3. Keep Postgres as the source of truth; index into the new engine from
   there (e.g. a sync job or DB trigger → webhook).

An AI intent layer (turning "se me rompió la bomba de agua" into a
structured `{service: "bombas-de-agua"}` query with an LLM) can sit in
front of this same function — it would resolve the natural-language input
to `category_slug`/`query` parameters and still call `search_businesses()`,
so it's an additive layer, not a replacement.
