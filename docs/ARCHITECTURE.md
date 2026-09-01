# Architecture

Modular monolith. One Next.js app, one Postgres database (Supabase), no
microservices, no separate backend. Server Components and Server Actions
talk to Postgres through well-defined boundaries (`src/lib/*`) instead of
scattering Supabase calls through the UI.

## Folder structure

```
src/
  app/
    page.tsx                     Home
    buscar/page.tsx              Search results (PLP)
    negocios/[slug]/page.tsx     Business profile
    api/analytics/route.ts       Client-side event ingestion
    admin/
      login/page.tsx             Not behind auth
      (dashboard)/               Route group: everything below requires requireAdmin()
        layout.tsx
        page.tsx                 Dashboard
        negocios/                List, create, edit, actions.ts (server actions)
        categorias/               Category/service management
        ubicaciones/              Location tree management
    layout.tsx, globals.css
    middleware.ts renamed to proxy.ts (Next 16 convention): session refresh,
      admin route gate, anonymous analytics session cookie
  components/
    ui/                          Small local shadcn-style primitives (button, input, ...)
    admin/                       Admin-only components (forms, uploaders, tables)
    business-card.tsx, cta-buttons.tsx, search-bar.tsx, ...  Consumer components
  lib/
    supabase/                    client.ts (browser), server.ts (RSC/actions, user session),
                                  admin.ts (service-role, server-only, seed script only)
    search/                      Search abstraction (see docs/SEARCH.md)
    analytics/                   Event tracking abstraction (see below)
    data/                        Read-only data-access functions used by pages
    validations/                 Zod schemas
    types/database.ts            Hand-written DB types (source of truth for shapes)
    admin-auth.ts, session.ts, utils.ts
supabase/migrations/             Numbered, sequential SQL migrations
scripts/seed.ts                  Reference + example data
docs/                            This documentation set
```

## Routing

Current (MVP):

- `/` — home
- `/buscar?q=&categoria=&zona=&page=` — search results
- `/negocios/[slug]` — business profile
- `/admin`, `/admin/negocios`, `/admin/negocios/nuevo`,
  `/admin/negocios/[id]/editar`, `/admin/categorias`, `/admin/ubicaciones`,
  `/admin/login`

Designed for, not built yet: SEO landing pages of the shape
`/mendoza/guaymallen/electricistas` and `/mendoza/guaymallen/dorrego/plomeros`.
Because categories and locations already carry slugs and a real hierarchy,
these are new route files that call the same `search()`/data-access
functions with different fixed filters — not a schema or data-layer change.
Intentionally not built now per the brief ("don't create thousands of SEO
pages yet").

## Data flow / boundaries

- **Consumer pages** are Server Components. They call `src/lib/data/*`
  (plain reads) or `src/lib/search` (the search RPC), both using the
  **user's own session** via `src/lib/supabase/server.ts` — for anonymous
  consumers that's the anon role, gated by the public-read RLS policies in
  `0010_rls_policies.sql`.
- **Admin writes** go through Server Actions (`actions.ts` next to each
  admin route) that call `requireAdmin()` first, then write with the
  signed-in admin's own session — RLS's `is_admin()` check is real
  enforcement, not just a UI gate. The service-role key
  (`src/lib/supabase/admin.ts`) is intentionally unused by the running app;
  it exists only for `scripts/seed.ts`.
- **Analytics** (`src/lib/analytics/{server,client}.ts`) is a thin
  abstraction over one `analytics_events` table. Server-side page renders
  log `search_performed` / `business_impression` / `business_profile_view`;
  client components fire `whatsapp_click` / `phone_click` /
  `directions_click` / `website_click` via `navigator.sendBeacon` to
  `/api/analytics`. Swapping in PostHog later means changing these two
  files, not every call site.
- **Search** (`src/lib/search`) is a `SearchProvider` interface with one
  implementation today (`PostgresSearchProvider`, calling the
  `search_businesses()` SQL function). See `docs/SEARCH.md`.

## Payment boundary

No Mercado Pago code exists anywhere in the app. The only preparation is
data-model: `plans`, `businesses.plan_id`, and `businesses.status` values
(`past_due`, `suspended`) that a future billing integration would set.
When billing is added, it should be a new module (e.g.
`src/lib/billing/`) that calls into the same `businesses` update path
already used by admin — not a rewrite of the business model.

## Known tradeoffs (deliberate, for MVP)

- **Business writes are not transactional.** `saveBusiness()` in
  `src/app/admin/(dashboard)/negocios/actions.ts` writes the business row
  then replaces each related table (categories, services, service areas,
  keywords, images, hours) sequentially, not inside a single DB
  transaction. Acceptable for an admin-only, low-concurrency MVP. If this
  becomes a problem (e.g. multiple admins editing concurrently), the fix is
  a single Postgres RPC function (same pattern as `search_businesses()`)
  that does everything atomically, called once from the action.
- **No automated tests.** Given MVP scope and timeline, no unit/e2e suite
  was added. Before onboarding more contributors or real customer data,
  add at minimum: RLS policy tests (can an anon user write to `businesses`?
  no) and a smoke test for the search RPC.
- **No CI pipeline.** Vercel's build-on-push is the only current gate.
  `npm run typecheck` and `npm run build` are cheap enough to add as a
  GitHub Actions step later.
- **Category/location deletes use FK `RESTRICT`,** so deleting a category
  or location still in use fails with a raw error surfaced to the admin
  instead of a friendly "used by N businesses" message. Fine for the small
  admin team expected at MVP stage.

## Risks / things to watch

- **Search relevance weights** in `search_businesses()` (0.9 for service
  match, 0.7 for category match, 0.85 for business keyword, +0.25 featured
  boost, +0.15 same-location boost) are a reasonable first pass, not tuned
  on real query data. Expect to revisit once there's real search traffic.
- **Image uploads have no size/type limit enforced server-side** beyond the
  browser file picker's `accept="image/*"`. Add a Supabase Storage bucket
  size limit and/or an edge check before opening this to non-staff users.
- **`/api/analytics` has no rate limiting**, so it can be spammed with fake
  events. Low risk while only Publique staff know the endpoint exists;
  revisit if traffic or abuse shows up.
- **No password reset / email flows wired for admin accounts.** Supabase
  Auth supports both; only sign-in is built. Fine for a handful of internal
  admins created via the seed script or Supabase dashboard; build this out
  before the admin team grows past "ask an engineer."
- **Single department (Guaymallén) today.** The location-aware part of
  search (`location_ancestors`/`location_descendants` in
  `0009_search.sql`) is written generically and was only exercised against
  a 4-level, single-branch tree — validate again once a second department
  or province is added.

## Missing from the original brief (worth deciding on before/soon after launch)

- **Duplicate-business detection.** Nothing stops the same business being
  entered twice by different admins.
- **Content moderation.** No profanity/spam filter on free-text fields
  (descriptions, keywords) — reasonable to skip while only Publique staff
  can create listings, necessary once business self-service ships.
- **Analytics data retention/cleanup.** `analytics_events` grows unbounded;
  fine at MVP scale, plan a retention policy before it's large.
- **Backups.** Supabase free tier has limited point-in-time recovery;
  decide on a backup plan before real business data accumulates.
