-- Supabase changed the default for new projects: CREATE TABLE no longer
-- auto-grants anon/authenticated/service_role access to the Data API
-- (PostgREST). RLS policies (0010_rls_policies.sql) are necessary but not
-- sufficient -- without a table-level GRANT, PostgREST can't see the table
-- at all, regardless of what its RLS policies say. This migration adds the
-- missing grants.
--
-- These are ADDITIVE to RLS, not a replacement: RLS still runs on every
-- query for anon/authenticated (it does not apply to service_role, which
-- has BYPASSRLS -- see docs/DATABASE.md "RLS" and ARCHITECTURE.md "Data
-- flow / boundaries"). A grant without a matching RLS policy still returns
-- zero rows / a permission-denied write; these grants only open the door
-- RLS already decided should be open.
--
-- Privileges below are scoped to exactly what the running app and
-- scripts/seed.ts do today (verified against src/ and scripts/seed.ts on
-- 2026-09-01), not to everything each role's RLS policies would allow:
--
--   anon            unauthenticated consumer (src/lib/supabase/client.ts,
--                   server.ts with no session) -- read-only on public data,
--                   insert-only on analytics_events.
--   authenticated   any signed-in Supabase Auth user -- in this app that's
--                   always an admin (no consumer accounts exist), but the
--                   grants here only cover the exact operations the admin
--                   UI performs (src/app/admin/**/actions.ts); is_admin()
--                   in RLS is what actually restricts writes to real
--                   admins, not this grant.
--   service_role    scripts/seed.ts only -- never used by the deployed app
--                   (see src/lib/supabase/admin.ts). Scoped to the exact
--                   tables/verbs the seed script calls.
--
-- No sequence grants are needed: every table uses `uuid default
-- gen_random_uuid()` except analytics_events.id, which is `generated
-- always as identity` -- Postgres checks table-level INSERT for identity
-- columns, not a separate sequence privilege (unlike old-style `serial`).

-- ---- anon: public reference/taxonomy + published business data (read) ----
grant select on
  locations,
  categories,
  services,
  keywords,
  plans,
  businesses,
  business_categories,
  business_services,
  business_service_areas,
  business_images,
  business_hours,
  business_keywords
to anon;

-- ---- anon: analytics beacon (src/app/api/analytics/route.ts, insert-only) -
grant insert on analytics_events to anon;

-- ---- authenticated: same public read surface (admin browsing the ---------
-- ---- consumer site while signed in hits the same RLS-gated reads) --------
grant select on
  locations,
  categories,
  services,
  keywords,
  plans,
  businesses,
  business_categories,
  business_services,
  business_service_areas,
  business_images,
  business_hours,
  business_keywords,
  admin_users
to authenticated;

-- ---- authenticated: taxonomy/location admin (create + delete only -- -----
-- ---- src/app/admin/(dashboard)/categorias/actions.ts and ubicaciones/ ----
-- ---- actions.ts have no update path today) --------------------------------
grant insert, delete on
  locations,
  categories,
  services,
  keywords
to authenticated;

-- ---- authenticated: business editor (saveBusiness upsert + ---------------
-- ---- setBusinessStatus update -- src/app/admin/(dashboard)/negocios/ -----
-- ---- actions.ts; businesses are archived via status, never deleted) ------
grant insert, update on businesses to authenticated;

-- ---- authenticated: business relations (replaceRelation always deletes ---
-- ---- then re-inserts -- same actions.ts, no update path) -----------------
grant insert, delete on
  business_categories,
  business_services,
  business_service_areas,
  business_images,
  business_hours,
  business_keywords
to authenticated;

-- ---- authenticated: analytics beacon can also fire on an admin's own -----
-- ---- session (same client-side code path as anon) ------------------------
grant insert on analytics_events to authenticated;

-- ---- service_role: scripts/seed.ts only, scoped to what it actually calls-
--
-- Note: SELECT is required everywhere seed.ts does an upsert (`ON CONFLICT
-- DO UPDATE` needs to read the conflicting row even with no RETURNING) or a
-- WHERE-filtered DELETE (Postgres needs SELECT on any column the WHERE
-- clause reads) -- verified against a real Postgres 16 instance, not
-- assumed; a plain unconditional INSERT is the only case that doesn't need
-- it (locations, keywords: select-then-insert, no upsert, no delete).
grant select, insert on locations to service_role;
grant select, insert, update on categories to service_role;
grant select, insert, update on services to service_role;
grant select, insert on keywords to service_role;
grant select, insert, update on plans to service_role;
grant select, insert, update on businesses to service_role;
grant select, insert, update on
  business_categories,
  business_services,
  business_service_areas,
  business_keywords,
  business_hours
to service_role;
grant select, insert, delete on business_images to service_role;
grant select, insert, update on admin_users to service_role;
-- analytics_events: seed.ts never touches this table -- no grant.

-- ---- RPC / helper functions --------------------------------------------
-- Postgres grants EXECUTE on new functions to PUBLIC by default, so these
-- already work; made explicit so the Data API's function-call surface is
-- as reviewable as its table surface (see search_businesses in
-- 0009_search.sql, called via .rpc() from src/lib/search/postgres-
-- provider.ts; is_admin() in 0007_admin_users.sql, referenced by every
-- *_admin_* RLS policy and therefore evaluated on ordinary anon/
-- authenticated reads too since permissive policies combine with OR).
grant execute on function search_businesses(text, text, uuid, int, int) to anon, authenticated;
grant execute on function is_admin() to anon, authenticated;
