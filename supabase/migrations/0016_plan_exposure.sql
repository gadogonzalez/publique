-- Plan-driven exposure (Nov 2026):
--  * home_featured: the plan's businesses can appear in the homepage
--    destacados carousel ("Espacios Premium en la página principal").
--  * exposure_priority: higher plans are listed first in category pages
--    (Premium 2 > Destacado 1 > Básico 0).
-- Read by src/lib/plans.ts -- the app never checks plan names/slugs.
-- Also: social links are available on every plan, so they're no longer
-- listed as a Destacado feature.
alter table plans add column home_featured boolean not null default false;
alter table plans add column exposure_priority int not null default 0;

update plans set home_featured = true, exposure_priority = 2 where slug = 'premium';
update plans set exposure_priority = 1 where slug = 'destacado';

update plans
set features = features - 'Enlace a redes sociales.'
where slug = 'destacado';
