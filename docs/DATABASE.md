# Database

PostgreSQL (Supabase) is the single source of truth. Every change ships as
a new file in `supabase/migrations/`, applied in filename order — never
edit a migration that has already run against a real environment.

## Entity overview

```
locations (self-referencing: country → province → department → locality)
categories → services → keywords (aliases, service- or category-scoped)
plans
businesses ──┬─ business_categories ─── categories
             ├─ business_services ───── services
             ├─ business_service_areas ─ locations (coverage, separate from home base)
             ├─ business_keywords (free-text tags, business-scoped)
             ├─ business_images (gallery)
             ├─ business_hours (0=Sunday..6=Saturday)
             └─ location_id → locations (physical base)
admin_users (1:1 with auth.users, staff only)
analytics_events (append-only)
```

## Why `locations` is one self-referencing table

Country/Province/Department/Locality is a hierarchy of the same kind of
thing at different levels, and the brief's minimum entity list already
names it "Location" (singular). One table with `type` + `parent_id` means
adding a new level of geography (or expanding to a second province) never
requires a schema change — only new rows. `location_ancestors()` /
`location_descendants()` (in `0009_search.sql`) walk the tree with a small
recursive CTE; the tree is shallow (4 levels) and cheap to walk at MVP
scale.

`businesses.location_id` is the physical base; `business_service_areas` is
where the business is willing to work. A plumber based in Dorrego who
covers all of Guaymallén gets one `business_service_areas` row pointing at
the *department* row, not one row per locality — `search_businesses()`
matches a locality search against a business whose declared service area
is an ancestor of that locality.

## `categories` / `services` / `keywords` vs. `business_keywords`

- `categories` and `services` are the shared taxonomy every business picks
  from (Servicios para el hogar → Electricistas, Bombas de agua, ...).
- `keywords` are global aliases attached to a service or category ("no sale
  agua" → Bombas de agua) — one alias helps every business offering that
  service.
- `business_keywords` are free-text tags an admin attaches to one specific
  business ("urgencias", "abre los domingos") — they only affect that
  listing's own ranking. Added because the brief's admin editor spec lists
  "keywords" as a per-business field distinct from the shared taxonomy.

## `businesses.status`

`draft` (not public) → `active` (public) → `past_due` / `suspended`
(billing or moderation hold, reserved for future subscriptions) →
`archived` (soft-deleted, excluded everywhere). No automated transitions
exist yet — an admin sets status manually from `/admin/negocios`.

## RLS

Every table has RLS enabled (`0010_rls_policies.sql`). Rule of thumb:

- Reference/taxonomy data (`locations`, `categories`, `services`,
  `keywords`, active `plans`) — public read, admin write.
- `businesses` and everything hanging off it — public read **only where
  the business is `active`**, admin (`is_admin()`) full read/write.
- `admin_users` — admins only, both read and write.
- `analytics_events` — anyone can `insert`, only admins can `select`.

`is_admin()` (in `0007_admin_users.sql`) is a `security definer` function
so policies can check admin membership without RLS recursively blocking
the check itself. The running app never uses the service-role key to
bypass RLS — admin server actions authenticate as the signed-in admin, so
these policies are real enforcement (see `docs/ARCHITECTURE.md`).

## Search-related schema

`0009_search.sql` adds a `spanish_unaccent` text search configuration, a
trigger-maintained `businesses.search_vector` (trigger, not a generated
column, because `to_tsvector` with a named config isn't `IMMUTABLE`),
trigram indexes for fuzzy matching, and the `search_businesses()` function
that the app calls via RPC. Details in `docs/SEARCH.md`.

## Storage

Three public-read buckets (`0011_storage.sql`): `business-logos`,
`business-covers`, `business-gallery`. Objects are uploaded client-side
from the admin form directly to Storage (admin's own session; RLS on
`storage.objects` requires `is_admin()`), path-namespaced by business id.

## Applying migrations

Either paste each file into the Supabase SQL editor in order, or:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```
