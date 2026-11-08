-- Real commercial plans (Nov 2026): monthly price + 6-month price, and the
-- gallery limit per plan (read by src/lib/plans.ts instead of a hardcoded
-- number). Upsert by slug so this works whether or not seed.ts ran.
alter table plans add column price_6m_ars numeric(10, 2);
alter table plans add column max_gallery_images int not null default 0
  check (max_gallery_images >= 0);

insert into plans (name, slug, description, price_ars, price_6m_ars, max_gallery_images, is_free, sort_order, features)
values
  ('Básico', 'basico', 'Tu negocio forma parte de Publiqué sin pagar.', 0, null, 0, true, 1,
   '["Nombre del comercio o profesional.", "Dirección.", "Horarios de atención.", "Teléfono y WhatsApp."]'::jsonb),
  ('Destacado', 'destacado', 'Más visibilidad para tu negocio.', 14900, 74500, 5, false, 2,
   '["Perfil comercial completo.", "Logo o imagen de perfil.", "Dirección y ubicación en mapa.", "Horarios detallados de atención.", "Enlace directo a WhatsApp.", "Hasta 5 fotografías.", "Enlace a redes sociales."]'::jsonb),
  ('Premium', 'premium', 'La máxima presencia dentro de Publiqué.', 24900, 124500, 10, false, 3,
   '["Todo lo incluido en Destacado.", "Hasta 10 fotografías.", "Prioridad de exposición.", "Espacios Premium en la página principal.", "Mayor exposición en búsquedas relacionadas.", "Estadísticas avanzadas.", "Prioridad en campañas de Publiqué."]'::jsonb)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_ars = excluded.price_ars,
  price_6m_ars = excluded.price_6m_ars,
  max_gallery_images = excluded.max_gallery_images,
  is_free = excluded.is_free,
  sort_order = excluded.sort_order,
  features = excluded.features,
  is_active = true;
