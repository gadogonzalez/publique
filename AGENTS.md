# Agent rules for this repository

This project is worked on by both humans and AI coding agents (Claude,
Codex). These rules keep the codebase coherent across sessions and tools.
Read `docs/ARCHITECTURE.md` and `docs/DATABASE.md` before making
structural changes.

## Non-negotiables

1. **PostgreSQL is the source of truth.** Every important read/write goes
   through Supabase Postgres. Don't introduce another datastore, cache
   layer, or "temporary" JSON file for real data.
2. **Every schema change is a new migration file** in
   `supabase/migrations/`, numbered after the last one. Never edit a
   migration that may already have run against a real environment (local
   dev counts once seeded data depends on it). Update
   `src/lib/types/database.ts` in the same change.
3. **Do not hardcode categories, services, or locations** anywhere in the
   frontend. They come from the database (`categories`, `services`,
   `keywords`, `locations`) via `src/lib/data/*`. If a page needs "the list
   of Guaymallén localities," query for `type = 'locality'` — don't write
   out the names.
4. **Business profile pages stay template-driven.** One route
   (`src/app/negocios/[slug]/page.tsx`) renders every business from data.
   Do not create one-off page code per business. Custom/premium landing
   pages are an explicitly future, separate feature if they ever happen.
5. **Search stays behind the abstraction.** UI and route code call
   `search()` from `src/lib/search`, never Supabase or a search engine
   directly. See `docs/SEARCH.md` before changing ranking or adding an
   engine.
6. **Keep this a modular monolith.** One Next.js app, one database. No
   microservices, no splitting into separate deployable services, even for
   "just this one feature."
7. **Don't introduce a dependency without a reason.** Check whether an
   existing library or a native browser/Node API already covers it first.
   If you add one, it should be small, actively maintained, and worth the
   bundle/complexity cost — say why in the commit/PR.
8. **Preserve TypeScript strict mode.** `tsconfig.json` has `strict: true`
   and `noUncheckedIndexedAccess: true`. Don't loosen these to make a
   change compile; fix the types instead.
9. **Reuse existing UI components before creating new ones.** Check
   `src/components/ui/` and `src/components/` first. Small, composable
   components over large one-off ones.
10. **Every analytics-worthy interaction gets an event.** New CTAs or
    meaningful consumer actions should call `trackServer`/`trackClient`
    (`src/lib/analytics`) with a real event type, not silently skip
    tracking. Adding a new event type is just adding it to the union in
    `src/lib/analytics/types.ts` (and the zod enum in
    `src/app/api/analytics/route.ts`) — no migration needed, the column is
    plain text.
11. **Mobile UX is first-class, not an afterthought.** A large share of
    consumers arrive on a phone. WhatsApp/call/directions CTAs must stay
    obvious and tappable at mobile width; test at ~375px before calling a
    UI change done.
12. **RLS is real enforcement, not a formality.** Admin server actions
    authenticate as the signed-in admin (`src/lib/supabase/server.ts`), not
    the service-role key. If a write needs the service-role key
    (`src/lib/supabase/admin.ts`), that's a signal to stop and reconsider —
    it should stay limited to `scripts/seed.ts` and genuinely trusted
    backend jobs.
13. **Don't build the "not yet" list.** `docs/PRODUCT.md` names what's
    explicitly out of MVP scope (AI search, reviews, payments, consumer
    accounts, etc.). If a task seems to require one of those, stop and
    confirm scope with the user rather than building it silently.

## Before opening a PR / finishing a task

- `npm run typecheck` and `npm run build` both pass.
- New tables/columns have RLS policies (public read where applicable,
  `is_admin()` for writes) — don't leave a table with RLS enabled and zero
  policies (that just makes it unreadable) or RLS disabled.
- If you touched `scripts/seed.ts`, re-run it against a local/dev project
  to confirm it's still idempotent.
