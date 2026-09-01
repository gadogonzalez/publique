-- Append-only event log behind the lib/analytics abstraction. `event_type`
-- is intentionally text (not an enum) so new event types can ship without a
-- migration; the app-level union in src/lib/analytics/types.ts is the
-- source of truth for which types the UI actually emits today.
create table analytics_events (
  id bigint generated always as identity primary key,
  event_type text not null,
  business_id uuid references businesses(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  search_query text,
  session_id text,
  referrer text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_business_type_idx on analytics_events (business_id, event_type, created_at);
create index analytics_events_type_created_idx on analytics_events (event_type, created_at);
