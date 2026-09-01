-- Subscription plans. No billing integration yet (see docs/ARCHITECTURE.md
-- "Payment boundary") -- plan/status are set manually from /admin for MVP.
create table plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_ars numeric(10, 2),
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger plans_set_updated_at
  before update on plans
  for each row execute function set_updated_at();
