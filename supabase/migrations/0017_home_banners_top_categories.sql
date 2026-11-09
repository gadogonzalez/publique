-- 1. Most-searched categories for the homepage destacados tabs.
-- analytics_events stays admin-read under RLS; this SECURITY DEFINER
-- function only exposes aggregate counts per category, nothing per user.
create or replace function top_searched_categories(p_days int default 90, p_limit int default 6)
returns table (category_id uuid, searches bigint)
language sql
stable
security definer
set search_path = public
as $$
  select e.category_id, count(*) as searches
  from analytics_events e
  where e.event_type = 'search_performed'
    and e.category_id is not null
    and e.created_at > now() - make_interval(days => greatest(p_days, 1))
  group by e.category_id
  order by searches desc
  limit least(greatest(p_limit, 1), 20);
$$;

revoke all on function top_searched_categories(int, int) from public;
grant execute on function top_searched_categories(int, int) to anon, authenticated;

-- 2. Homepage Premium banners (managed from /admin/banners).
create table home_banners (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  desktop_image_url text not null,
  mobile_image_url text not null,
  alt_text text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index home_banners_order_idx on home_banners (sort_order, created_at);

create trigger home_banners_set_updated_at
  before update on home_banners
  for each row execute function set_updated_at();

alter table home_banners enable row level security;

create policy home_banners_public_read on home_banners
  for select using (is_active = true);
create policy home_banners_admin_all on home_banners
  for all using (is_admin()) with check (is_admin());

grant select on home_banners to anon;
grant select, insert, update, delete on home_banners to authenticated;

-- Storage bucket for banner images (public read, admin write).
insert into storage.buckets (id, name, public)
values ('home-banners', 'home-banners', true)
on conflict (id) do nothing;

create policy home_banners_media_public_read on storage.objects
  for select using (bucket_id = 'home-banners');
create policy home_banners_media_admin_insert on storage.objects
  for insert with check (bucket_id = 'home-banners' and is_admin());
create policy home_banners_media_admin_update on storage.objects
  for update using (bucket_id = 'home-banners' and is_admin());
create policy home_banners_media_admin_delete on storage.objects
  for delete using (bucket_id = 'home-banners' and is_admin());

-- Carry over the banner that was hardcoded on the homepage (images live in
-- /public/promo). Only if that business exists and no banner was added yet.
insert into home_banners (business_id, desktop_image_url, mobile_image_url, alt_text, sort_order)
select
  b.id,
  '/promo/patitas-pet-shop-banner.webp',
  '/promo/patitas-pet-shop-banner-mobile.webp',
  'Patitas Pet Shop: todo lo que tu mascota necesita. Alimentos, accesorios, higiene y mucho más.',
  0
from businesses b
where b.slug = 'patitas-pet-shop'
  and not exists (select 1 from home_banners);
