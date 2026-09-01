-- Storage buckets for business media. Public-read (listings are public
-- pages), write restricted to admins. Paths are namespaced by business id,
-- e.g. business-logos/{business_id}/logo.jpg -- see docs/ADMIN.md.
insert into storage.buckets (id, name, public)
values
  ('business-logos', 'business-logos', true),
  ('business-covers', 'business-covers', true),
  ('business-gallery', 'business-gallery', true)
on conflict (id) do nothing;

create policy business_media_public_read on storage.objects
  for select using (bucket_id in ('business-logos', 'business-covers', 'business-gallery'));

create policy business_media_admin_write on storage.objects
  for insert with check (
    bucket_id in ('business-logos', 'business-covers', 'business-gallery') and is_admin()
  );

create policy business_media_admin_update on storage.objects
  for update using (
    bucket_id in ('business-logos', 'business-covers', 'business-gallery') and is_admin()
  );

create policy business_media_admin_delete on storage.objects
  for delete using (
    bucket_id in ('business-logos', 'business-covers', 'business-gallery') and is_admin()
  );
