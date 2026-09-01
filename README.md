# Publique Online

Local business & services discovery platform for Guaymallén, Mendoza — MVP.
"Tell us what you need" search over a normalized directory of businesses,
categories, services and locations. See `docs/PRODUCT.md` for the product
brief and `docs/ARCHITECTURE.md` for how the system is built.

## Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS · Supabase
(Postgres, Auth, Storage) · deployed on Vercel.

## Project docs

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product brief, MVP scope, what's
  deliberately deferred.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design, folder
  structure, routing, known tradeoffs, risks.
- [`docs/DATABASE.md`](docs/DATABASE.md) — schema, RLS, migrations.
- [`docs/SEARCH.md`](docs/SEARCH.md) — how search works today and how to
  swap the engine later.
- [`docs/ADMIN.md`](docs/ADMIN.md) — admin panel walkthrough.
- [`AGENTS.md`](AGENTS.md) — rules for AI coding agents working on this repo.

## Local setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is enough for MVP).
2. **Copy env vars**: `cp .env.example .env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY` — same page. **Never** exposed to the client; used only by `scripts/seed.ts`.
   - `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally.
3. **Run migrations**: open the Supabase SQL editor and run every file in
   `supabase/migrations/` in order (`0001_...` through `0011_...`), or use
   the Supabase CLI:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
4. **Install deps and seed data**:
   ```bash
   npm install
   # optional: also create an admin login while seeding
   echo "SEED_ADMIN_EMAIL=admin@publique.online" >> .env.local
   echo "SEED_ADMIN_PASSWORD=changeme123" >> .env.local
   npm run seed
   ```
5. **Run the app**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the consumer site and
   `http://localhost:3000/admin` for the admin panel (log in with the
   `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` above, or create a user in
   Supabase Auth and add a matching row to `admin_users`).

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in the Vercel
   project settings (Production + Preview). `SUPABASE_SERVICE_ROLE_KEY` is
   only needed if you run the seed script from CI/locally against
   production — the deployed app itself never uses it.
4. Deploy. Framework preset "Next.js" is auto-detected; no custom build
   config is required.
5. Run the migrations (step 3 above) against the same Supabase project
   before or after the first deploy.

## Scripts

- `npm run dev` — local dev server.
- `npm run build` / `npm run start` — production build/serve.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run lint` — Next.js ESLint.
- `npm run seed` — populate reference + example data (see `scripts/seed.ts`).
