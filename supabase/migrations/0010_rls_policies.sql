-- Row Level Security. Consumers are always anonymous (anon role) and only
-- ever read published data or write analytics events. All writes to
-- business/taxonomy data require an authenticated admin (see is_admin() in
-- 0007_admin_users.sql). Admin server actions run with the user's own
-- session (not the service-role key), so these policies are the real
-- enforcement, not just a formality.

alter table locations enable row level security;
alter table categories enable row level security;
alter table services enable row level security;
alter table keywords enable row level security;
alter table plans enable row level security;
alter table businesses enable row level security;
alter table business_categories enable row level security;
alter table business_services enable row level security;
alter table business_service_areas enable row level security;
alter table business_images enable row level security;
alter table business_hours enable row level security;
alter table business_keywords enable row level security;
alter table admin_users enable row level security;
alter table analytics_events enable row level security;

-- ---- Public read access (reference/taxonomy data: always readable) -------
create policy locations_public_read on locations for select using (true);
create policy categories_public_read on categories for select using (true);
create policy services_public_read on services for select using (true);
create policy keywords_public_read on keywords for select using (true);
create policy plans_public_read on plans for select using (is_active = true);

-- ---- Businesses: public sees only active listings -------------------------
create policy businesses_public_read on businesses
  for select using (status = 'active');

create policy business_categories_public_read on business_categories
  for select using (
    exists (select 1 from businesses b where b.id = business_id and b.status = 'active')
  );

create policy business_services_public_read on business_services
  for select using (
    exists (select 1 from businesses b where b.id = business_id and b.status = 'active')
  );

create policy business_service_areas_public_read on business_service_areas
  for select using (
    exists (select 1 from businesses b where b.id = business_id and b.status = 'active')
  );

create policy business_images_public_read on business_images
  for select using (
    exists (select 1 from businesses b where b.id = business_id and b.status = 'active')
  );

create policy business_hours_public_read on business_hours
  for select using (
    exists (select 1 from businesses b where b.id = business_id and b.status = 'active')
  );

create policy business_keywords_public_read on business_keywords
  for select using (
    exists (select 1 from businesses b where b.id = business_id and b.status = 'active')
  );

-- ---- Admin: full read/write on everything above --------------------------
create policy locations_admin_write on locations for all using (is_admin()) with check (is_admin());
create policy categories_admin_write on categories for all using (is_admin()) with check (is_admin());
create policy services_admin_write on services for all using (is_admin()) with check (is_admin());
create policy keywords_admin_write on keywords for all using (is_admin()) with check (is_admin());
create policy plans_admin_write on plans for all using (is_admin()) with check (is_admin());

create policy businesses_admin_all on businesses for all using (is_admin()) with check (is_admin());
create policy business_categories_admin_all on business_categories for all using (is_admin()) with check (is_admin());
create policy business_services_admin_all on business_services for all using (is_admin()) with check (is_admin());
create policy business_service_areas_admin_all on business_service_areas for all using (is_admin()) with check (is_admin());
create policy business_images_admin_all on business_images for all using (is_admin()) with check (is_admin());
create policy business_hours_admin_all on business_hours for all using (is_admin()) with check (is_admin());
create policy business_keywords_admin_all on business_keywords for all using (is_admin()) with check (is_admin());

-- ---- admin_users: admins can see the staff list; nobody else can ----------
create policy admin_users_admin_read on admin_users for select using (is_admin());
create policy admin_users_admin_write on admin_users for all using (is_admin()) with check (is_admin());

-- ---- analytics_events: anyone can log an event, only admins can read -----
create policy analytics_events_insert on analytics_events for insert with check (true);
create policy analytics_events_admin_read on analytics_events for select using (is_admin());
