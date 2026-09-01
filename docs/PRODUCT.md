# Product

## What Publique is

Publique helps small local businesses and service providers in Guaymallén,
Mendoza — who today rely on printed neighborhood magazines, word of mouth,
or WhatsApp/Facebook groups — become discoverable online. It is not a
Yellow Pages clone: the primary experience is "tell us what you need and
we help you find someone nearby who can solve it" (e.g. *"se me rompió la
bomba de agua"*, *"necesito un electricista"*, *"viandas cerca de Villa
Nueva"*).

Long-term vision (not built yet, but the architecture is prepared for it):
more areas, departments and provinces; thousands of businesses; paid plans;
featured placements; reviews; analytics reports for business owners;
business self-service; recurring Mercado Pago subscriptions; AI-assisted
natural language search; SEO landing pages; websites/marketing services.

## MVP scope

**Consumer** — homepage with search-first UX, category/locality browsing,
search results (PLP-style), template-driven business profile pages,
WhatsApp/phone/directions CTAs.

**Admin** (`/admin`, authenticated) — dashboard metrics, business list with
search/filters, business create/edit (sectioned form), activate/suspend/
archive, category+service management, location management.

**Platform** — Supabase Postgres as source of truth, SQL migrations, seed
data, Supabase Storage for images, Postgres-based search behind an
abstraction, analytics event hooks, SEO foundation (metadata, OpenGraph,
JSON-LD, clean URLs), deployable to Vercel on free tiers.

## Explicitly NOT built in this MVP

AI search, consumer accounts, reviews, marketplace transactions, quotes,
booking, chat, Mercado Pago payments, recurring subscriptions, an advanced
analytics dashboard, automated monthly reports, business self-registration,
social media management, a website builder, an ad campaign manager,
multi-tenant white-labeling.

Each of these has a specific hook already in the data model or code so it
can be added later without a rewrite — see the "Prepared for later" table
below and `docs/ARCHITECTURE.md`.

## Prepared for later (schema/architecture exists, feature doesn't)

| Future feature | What's already there |
|---|---|
| More departments/provinces | `locations` is a generic self-referencing tree, not hardcoded to Guaymallén |
| Paid/featured plans | `plans` table + `businesses.plan_id`, manually set from admin today |
| Mercado Pago subscriptions | `businesses.status` includes `past_due`; no provider code is called anywhere — see "Payment boundary" in ARCHITECTURE.md |
| Reviews/ratings | `RatingStars` component wired into card + profile, renders nothing without data; no reviews table yet |
| Business self-service accounts | `admin_users` is staff-only by design, kept separate so a future `business_users` table doesn't overload it |
| AI natural-language search | `src/lib/search` is a provider interface; an AI intent layer can call the same `search_businesses` RPC or add a new provider without touching the UI |
| SEO landing pages (`/mendoza/guaymallen/electricistas`) | Categories/locations already have slugs; only new route files are needed, no schema change |
| Monthly business reports ("appeared 820 times...") | `analytics_events` already logs impressions/clicks per business |
| Typesense or another search engine | Swap point is `src/lib/search/index.ts` |

## Deviations from the original brief (documented per the brief's own instruction)

- **Next.js major version**: the brief didn't pin a version; a disclosed
  Next.js security advisory (unauthenticated disclosure of internal Server
  Function/Server Action endpoints) affects the entire 14.x line at the
  time of writing, so the project ships on the first patched stable line
  (Next 16) instead of 14. React stayed on 18 (Next 16 supports both).
- **`business_keywords` table**: the brief's minimum entity list has a
  single global `Keyword` (alias) entity tied to categories/services, but
  the admin editor spec also lists "keywords" as a per-business field.
  Added a small `business_keywords` table (free-text tags an admin attaches
  to one business, e.g. "urgencias") so both are real: global aliases feed
  category/service search, business keywords feed that one listing's
  ranking. See `docs/DATABASE.md`.
- **Categories & services share one admin page** (`/admin/categorias`)
  instead of two nav items, since services are always edited in the
  context of a category. Locations get their own page as specified.
