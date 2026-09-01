# Admin panel

`/admin`, gated by `src/middleware.ts`'s successor `src/proxy.ts` (requires
a signed-in Supabase Auth user) and again by `requireAdmin()` in
`src/app/admin/(dashboard)/layout.tsx` (requires an `admin_users` row —
see `docs/DATABASE.md`). `/admin/login` sits outside the `(dashboard)`
route group so it isn't itself gated.

## Creating an admin

No self-service signup. Either:

- Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env.local` and run
  `npm run seed` (creates the Supabase Auth user + `admin_users` row), or
- Create a user in Supabase Auth (dashboard or `auth.admin.createUser`)
  and insert a matching row into `admin_users` manually.

## Dashboard (`/admin`)

Six counts (total, active, draft, suspended, archived, featured) via
`count: "exact", head: true` queries, plus the 5 most recently created
businesses. Intentionally no charts/BI — the brief asked for basic metrics
only.

## Business list (`/admin/negocios`)

Search by name, filter by status/category/locality, all via URL search
params (shareable/bookmarkable). Status changes (`StatusActions`) call the
`setBusinessStatus` server action and only offer the transitions that make
sense from the current status (draft→active, active→suspended, etc.) —
see `NEXT_ACTIONS` in `src/components/admin/status-actions.tsx`.

## Business editor (`/admin/negocios/nuevo`, `/admin/negocios/[id]/editar`)

One form (`src/components/admin/business-form.tsx`), sectioned to match
the brief: Basic information, Contact, Location, Business information
(categories/services/keywords), Media, Hours, Commercial. A few UX notes:

- **Slug auto-fills from the name** until the admin edits it directly.
- **Categories/services are toggle chips**, not a `<select multiple>` —
  faster for a small taxonomy, and services are filtered to the currently
  selected categories.
- **Images upload directly to Supabase Storage** from the browser
  (`ImageUpload` / `GalleryUpload` components) using the admin's own
  session — nothing routes through a Next.js API route or the service-role
  key. A `crypto.randomUUID()` is generated client-side as the business id
  the moment the "create" form mounts, so image paths exist before the
  business row is ever saved.
- **Keywords are free-text chips** added one at a time (Enter or the
  "Agregar" button), stored per-business (`business_keywords`) — see
  `docs/SEARCH.md` for how they affect ranking.
- **Saving** calls the `saveBusiness` server action, which upserts the
  business row then replaces every related table. See "Known tradeoffs"
  in `docs/ARCHITECTURE.md` for why this isn't a single DB transaction.

Getting a business onto Publique should stay close to "add a contact to
your phone" — name, WhatsApp/phone, one category, one locality, and status
`active` is enough to publish; everything else can be filled in later by
editing the same form.

## Categories & services (`/admin/categorias`)

One page, grouped by category: create a category, create/delete services
under it, delete a category (blocked by the DB if anything still
references it — see "Known tradeoffs" in `docs/ARCHITECTURE.md`).

## Locations (`/admin/ubicaciones`)

A generic form (type + parent + name) plus a read-only indented tree.
Supports adding a new province, department, or locality — this is the
lever for expanding Publique beyond Guaymallén without touching code.
