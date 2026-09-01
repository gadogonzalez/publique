-- The core listing entity.
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  long_description text,
  logo_url text,
  cover_image_url text,

  whatsapp text,
  phone text,
  email text,
  website text,
  instagram text,

  address text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  location_id uuid references locations(id) on delete restrict,

  status text not null default 'draft'
    check (status in ('draft', 'active', 'past_due', 'suspended', 'archived')),
  plan_id uuid references plans(id) on delete set null,
  featured boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index businesses_location_id_idx on businesses (location_id);
create index businesses_status_idx on businesses (status);
create index businesses_plan_id_idx on businesses (plan_id);
create index businesses_featured_idx on businesses (featured) where featured = true;

create trigger businesses_set_updated_at
  before update on businesses
  for each row execute function set_updated_at();

comment on column businesses.status is
  'draft: not yet published. active: publicly visible. past_due/suspended: billing or moderation hold (reserved for future subscriptions). archived: soft-deleted.';
