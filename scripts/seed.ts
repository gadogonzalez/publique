/**
 * Seed script for local/dev Supabase projects.
 * Requires SUPABASE_SERVICE_ROLE_KEY (bypasses RLS on purpose -- this is
 * the only place in the codebase that should use it outside admin auth).
 *
 * Usage: npm run seed   (reads .env.local)
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { slugify } from "../src/lib/utils";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type LocationType = "country" | "province" | "department" | "locality";

async function getOrCreateLocation(
  type: LocationType,
  name: string,
  parentId: string | null
) {
  const slug = slugify(name);
  const query = supabase
    .from("locations")
    .select("id")
    .eq("type", type)
    .eq("slug", slug);
  const { data: existing } = parentId
    ? await query.eq("parent_id", parentId).maybeSingle()
    : await query.is("parent_id", null).maybeSingle();

  if (existing) return existing.id as string;

  const { data, error } = await supabase
    .from("locations")
    .insert({ type, name, slug, parent_id: parentId })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

async function upsertBySlug(
  table: string,
  rows: Record<string, unknown>[]
) {
  const { data, error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");
  if (error) throw error;
  return new Map(
    (data ?? []).map((r) => [r.slug as string, r.id as string])
  );
}

async function getOrCreateKeyword(
  term: string,
  target: { service_id?: string; category_id?: string }
) {
  let query = supabase.from("keywords").select("id").eq("term", term);
  query = target.service_id
    ? query.eq("service_id", target.service_id)
    : query.eq("category_id", target.category_id!);
  const { data: existing } = await query.maybeSingle();
  if (existing) return;
  const { error } = await supabase.from("keywords").insert({ term, ...target });
  if (error) throw error;
}

async function main() {
  console.log("Seeding locations...");
  const argentina = await getOrCreateLocation("country", "Argentina", null);
  const mendoza = await getOrCreateLocation("province", "Mendoza", argentina);
  const guaymallen = await getOrCreateLocation("department", "Guaymallén", mendoza);

  const localityNames = [
    "Dorrego",
    "San José",
    "Villa Nueva",
    "Bermejo",
    "El Sauce",
    "Las Cañas",
    "Buena Nueva",
    "Nueva Ciudad",
  ];
  const localities = new Map<string, string>();
  for (const name of localityNames) {
    localities.set(name, await getOrCreateLocation("locality", name, guaymallen));
  }

  console.log("Seeding categories...");
  const categoryRows = [
    { name: "Servicios para el hogar", icon: "home", sort_order: 1 },
    { name: "Construcción", icon: "hammer", sort_order: 2 },
    { name: "Gastronomía", icon: "utensils", sort_order: 3 },
    { name: "Automotor", icon: "car", sort_order: 4 },
    { name: "Salud", icon: "heart-pulse", sort_order: 5 },
    { name: "Belleza", icon: "sparkles", sort_order: 6 },
    { name: "Profesionales", icon: "briefcase", sort_order: 7 },
    { name: "Mascotas", icon: "paw-print", sort_order: 8 },
  ].map((c) => ({ ...c, slug: slugify(c.name) }));
  const categories = await upsertBySlug("categories", categoryRows);
  const catId = (name: string) => categories.get(slugify(name))!;

  console.log("Seeding services...");
  const serviceRows = [
    { name: "Electricistas", category: "Servicios para el hogar" },
    { name: "Plomeros", category: "Servicios para el hogar" },
    { name: "Bombas de agua", category: "Servicios para el hogar" },
    { name: "Reparación de electrodomésticos", category: "Servicios para el hogar" },
    { name: "Cerrajeros", category: "Servicios para el hogar" },
    { name: "Jardineros", category: "Servicios para el hogar" },
    { name: "Climatización", category: "Servicios para el hogar" },
    { name: "Reparación de celulares y PC", category: "Servicios para el hogar" },
    { name: "Pintores", category: "Construcción" },
    { name: "Albañiles", category: "Construcción" },
    { name: "Carpintería", category: "Construcción" },
    { name: "Viandas", category: "Gastronomía" },
    { name: "Mecánica general", category: "Automotor" },
    { name: "Gomería", category: "Automotor" },
    { name: "Kinesiología", category: "Salud" },
    { name: "Peluquería y estética", category: "Belleza" },
    { name: "Gestoría y trámites", category: "Profesionales" },
    { name: "Veterinaria", category: "Mascotas" },
  ].map((s) => ({
    name: s.name,
    slug: slugify(s.name),
    category_id: catId(s.category),
  }));
  const services = await upsertBySlug("services", serviceRows);
  const svcId = (name: string) => services.get(slugify(name))!;

  console.log("Seeding keywords/aliases...");
  const keywordSeeds: Array<[string, string]> = [
    ["bomba", "Bombas de agua"],
    ["presurizadora", "Bombas de agua"],
    ["reparación bomba", "Bombas de agua"],
    ["no sale agua", "Bombas de agua"],
    ["se rompió la bomba de agua", "Bombas de agua"],
    ["destapaciones", "Plomeros"],
    ["pérdida de agua", "Plomeros"],
    ["caño roto", "Plomeros"],
    ["instalación eléctrica", "Electricistas"],
    ["cortocircuito", "Electricistas"],
    ["se cortó la luz", "Electricistas"],
    ["arreglo de heladera", "Reparación de electrodomésticos"],
    ["arreglo de lavarropas", "Reparación de electrodomésticos"],
    ["lavarropas no anda", "Reparación de electrodomésticos"],
    ["cerrajero urgente", "Cerrajeros"],
    ["me quedé afuera", "Cerrajeros"],
    ["copias de llaves", "Cerrajeros"],
    ["poda de árboles", "Jardineros"],
    ["corte de pasto", "Jardineros"],
    ["mantenimiento de jardín", "Jardineros"],
    ["pintura de casas", "Pintores"],
    ["viandas caseras", "Viandas"],
    ["comida para llevar", "Viandas"],
    ["arreglo de auto", "Mecánica general"],
    ["service del auto", "Mecánica general"],
    ["gomería 24 horas", "Gomería"],
    ["gomería cerca", "Gomería"],
    ["pinchazo", "Gomería"],
    ["necesito electricista", "Electricistas"],
    ["necesito plomero", "Plomeros"],
    ["no enfría el aire", "Climatización"],
    ["instalación de aire acondicionado", "Climatización"],
    ["service de aire acondicionado", "Climatización"],
    ["arreglar celular", "Reparación de celulares y PC"],
    ["dónde arreglan celulares", "Reparación de celulares y PC"],
    ["pantalla rota", "Reparación de celulares y PC"],
    ["arreglo de pc", "Reparación de celulares y PC"],
    ["muebles a medida", "Carpintería"],
    ["carpintero", "Carpintería"],
    ["comida casera", "Viandas"],
    ["veterinaria", "Veterinaria"],
    ["mi perro está enfermo", "Veterinaria"],
    ["vacunas para mascotas", "Veterinaria"],
    ["peluquería", "Peluquería y estética"],
    ["corte de pelo", "Peluquería y estética"],
    ["manicura", "Peluquería y estética"],
    ["kinesiólogo", "Kinesiología"],
    ["dolor de espalda", "Kinesiología"],
    ["rehabilitación", "Kinesiología"],
    ["gestoría", "Gestoría y trámites"],
    ["trámites del auto", "Gestoría y trámites"],
    ["contador", "Gestoría y trámites"],
  ];
  for (const [term, serviceName] of keywordSeeds) {
    await getOrCreateKeyword(term, { service_id: svcId(serviceName) });
  }

  console.log("Seeding plans...");
  const planRows = [
    { name: "Básico", description: "Perfil publicado con datos de contacto y ubicación.", price_ars: 0, sort_order: 1 },
    { name: "Destacado", description: "Prioridad en resultados de búsqueda + insignia de destacado.", price_ars: 9999, sort_order: 2 },
    { name: "Premium", description: "Destacado + galería ampliada y estadísticas (próximamente).", price_ars: 17999, sort_order: 3 },
  ].map((p) => ({ ...p, slug: slugify(p.name) }));
  const plans = await upsertBySlug("plans", planRows);
  const planId = (name: string) => plans.get(slugify(name))!;

  console.log("Seeding businesses...");
  type BusinessSeed = {
    name: string;
    short_description: string;
    long_description: string;
    whatsapp: string;
    phone: string;
    address: string;
    location: string;
    serviceAreas: string[];
    categories: string[];
    services: string[];
    status: "active" | "draft";
    featured: boolean;
    plan: string;
    hours?: { day: number; opens: string; closes: string }[];
    extraKeywords?: string[];
  };

  const businessSeeds: BusinessSeed[] = [
    {
      name: "Bombas Cuyo",
      short_description: "Reparación e instalación de bombas de agua y presurizadoras.",
      long_description:
        "Más de 15 años reparando e instalando bombas de agua, presurizadoras y sistemas de bombeo en Guaymallén. Atendemos urgencias el mismo día.",
      whatsapp: "5492615551001",
      phone: "2615551001",
      address: "Calle San Martín 1450, Dorrego",
      location: "Dorrego",
      serviceAreas: ["Guaymallén"],
      categories: ["Servicios para el hogar"],
      services: ["Bombas de agua", "Plomeros"],
      status: "active",
      featured: true,
      plan: "Destacado",
      hours: [
        { day: 1, opens: "08:00", closes: "18:00" },
        { day: 2, opens: "08:00", closes: "18:00" },
        { day: 3, opens: "08:00", closes: "18:00" },
        { day: 4, opens: "08:00", closes: "18:00" },
        { day: 5, opens: "08:00", closes: "13:00" },
      ],
      extraKeywords: ["urgencias", "atención los 7 días"],
    },
    {
      name: "Electricidad Pérez",
      short_description: "Electricista matriculado para hogares y comercios.",
      long_description:
        "Instalaciones eléctricas, tableros, cortocircuitos y emergencias las 24hs. Trabajo prolijo y con presupuesto previo.",
      whatsapp: "5492615551002",
      phone: "2615551002",
      address: "Av. Boulogne Sur Mer 320, San José",
      location: "San José",
      serviceAreas: ["San José", "Villa Nueva"],
      categories: ["Servicios para el hogar"],
      services: ["Electricistas"],
      status: "active",
      featured: false,
      plan: "Básico",
      hours: [
        { day: 1, opens: "09:00", closes: "19:00" },
        { day: 2, opens: "09:00", closes: "19:00" },
        { day: 3, opens: "09:00", closes: "19:00" },
        { day: 4, opens: "09:00", closes: "19:00" },
        { day: 5, opens: "09:00", closes: "19:00" },
        { day: 6, opens: "09:00", closes: "13:00" },
      ],
    },
    {
      name: "Viandas Doña Rosa",
      short_description: "Viandas caseras diarias, entrega a domicilio.",
      long_description:
        "Comida casera de lunes a viernes con menú semanal. Opciones sin sal y vegetarianas. Pedidos por WhatsApp con 1 día de anticipación.",
      whatsapp: "5492615551003",
      phone: "2615551003",
      address: "Calle Argentina 875, Villa Nueva",
      location: "Villa Nueva",
      serviceAreas: ["Villa Nueva", "Bermejo"],
      categories: ["Gastronomía"],
      services: ["Viandas"],
      status: "active",
      featured: true,
      plan: "Destacado",
      hours: [
        { day: 1, opens: "09:00", closes: "14:00" },
        { day: 2, opens: "09:00", closes: "14:00" },
        { day: 3, opens: "09:00", closes: "14:00" },
        { day: 4, opens: "09:00", closes: "14:00" },
        { day: 5, opens: "09:00", closes: "14:00" },
      ],
    },
    {
      name: "Gomería y Mecánica El Sauce",
      short_description: "Gomería, mecánica general y auxilio.",
      long_description:
        "Reparación de pinchaduras, alineación, balanceo y mecánica general para autos y camionetas. Auxilio en zona El Sauce.",
      whatsapp: "5492615551004",
      phone: "2615551004",
      address: "Ruta Provincial 50 Km 8, El Sauce",
      location: "El Sauce",
      serviceAreas: ["El Sauce"],
      categories: ["Automotor"],
      services: ["Gomería", "Mecánica general"],
      status: "active",
      featured: false,
      plan: "Básico",
      hours: [
        { day: 1, opens: "08:00", closes: "18:00" },
        { day: 2, opens: "08:00", closes: "18:00" },
        { day: 3, opens: "08:00", closes: "18:00" },
        { day: 4, opens: "08:00", closes: "18:00" },
        { day: 5, opens: "08:00", closes: "18:00" },
        { day: 6, opens: "08:00", closes: "13:00" },
      ],
    },
    {
      name: "Jardinería Los Álamos",
      short_description: "Poda, corte de pasto y mantenimiento de jardines.",
      long_description:
        "Servicio de jardinería integral: poda de árboles, corte de pasto, diseño y mantenimiento de espacios verdes en Guaymallén.",
      whatsapp: "5492615551005",
      phone: "2615551005",
      address: "Calle Las Cañas 210, Las Cañas",
      location: "Las Cañas",
      serviceAreas: ["Las Cañas", "Dorrego"],
      categories: ["Servicios para el hogar"],
      services: ["Jardineros"],
      status: "draft",
      featured: false,
      plan: "Básico",
    },
    {
      name: "Plomería San José",
      short_description: "Destapaciones, pérdidas de agua e instalaciones sanitarias.",
      long_description:
        "Plomero matriculado con más de 10 años de experiencia. Destapaciones, reparación de pérdidas, instalación de sanitarios y termotanques. Presupuesto sin cargo.",
      whatsapp: "5492615551006",
      phone: "2615551006",
      address: "Calle Rivadavia 640, San José",
      location: "San José",
      serviceAreas: ["San José", "Bermejo"],
      categories: ["Servicios para el hogar"],
      services: ["Plomeros"],
      status: "active",
      featured: false,
      plan: "Básico",
      hours: [
        { day: 1, opens: "08:00", closes: "17:00" },
        { day: 2, opens: "08:00", closes: "17:00" },
        { day: 3, opens: "08:00", closes: "17:00" },
        { day: 4, opens: "08:00", closes: "17:00" },
        { day: 5, opens: "08:00", closes: "17:00" },
      ],
      extraKeywords: ["pérdida de agua urgente"],
    },
    {
      name: "Cerrajería Dorrego",
      short_description: "Cerrajero urgente las 24 horas, copias de llaves.",
      long_description:
        "Aperturas de puertas, cambio de cerraduras, copias de llaves y cerrajería para autos. Atención urgente los 365 días del año en Guaymallén.",
      whatsapp: "5492615551007",
      phone: "2615551007",
      address: "Calle San Martín 980, Dorrego",
      location: "Dorrego",
      serviceAreas: ["Dorrego", "Villa Nueva", "San José"],
      categories: ["Servicios para el hogar"],
      services: ["Cerrajeros"],
      status: "active",
      featured: false,
      plan: "Básico",
      extraKeywords: ["cerrajero 24 horas"],
    },
    {
      name: "Climatización Andina",
      short_description: "Instalación y service de aires acondicionados.",
      long_description:
        "Instalación, mantenimiento y reparación de equipos de aire acondicionado frío/calor para hogares y comercios. Marcas líderes con garantía escrita.",
      whatsapp: "5492615551008",
      phone: "2615551008",
      address: "Av. Champagnat 1120, Nueva Ciudad",
      location: "Nueva Ciudad",
      serviceAreas: ["Nueva Ciudad", "Buena Nueva", "Villa Nueva"],
      categories: ["Servicios para el hogar"],
      services: ["Climatización"],
      status: "active",
      featured: true,
      plan: "Destacado",
      hours: [
        { day: 1, opens: "09:00", closes: "18:00" },
        { day: 2, opens: "09:00", closes: "18:00" },
        { day: 3, opens: "09:00", closes: "18:00" },
        { day: 4, opens: "09:00", closes: "18:00" },
        { day: 5, opens: "09:00", closes: "18:00" },
      ],
    },
    {
      name: "Servicio Técnico Mendoza",
      short_description: "Reparación de celulares, PC y notebooks.",
      long_description:
        "Cambio de pantallas, baterías y reparación de placas para celulares, PC y notebooks de todas las marcas. Diagnóstico sin cargo y entrega en 24-48hs.",
      whatsapp: "5492615551009",
      phone: "2615551009",
      address: "Calle Costa Rica 455, Buena Nueva",
      location: "Buena Nueva",
      serviceAreas: ["Guaymallén"],
      categories: ["Servicios para el hogar"],
      services: ["Reparación de celulares y PC"],
      status: "active",
      featured: true,
      plan: "Destacado",
      hours: [
        { day: 1, opens: "09:30", closes: "19:00" },
        { day: 2, opens: "09:30", closes: "19:00" },
        { day: 3, opens: "09:30", closes: "19:00" },
        { day: 4, opens: "09:30", closes: "19:00" },
        { day: 5, opens: "09:30", closes: "19:00" },
        { day: 6, opens: "09:30", closes: "13:30" },
      ],
    },
    {
      name: "Carpintería Nueva Ciudad",
      short_description: "Muebles a medida y restauración en madera maciza.",
      long_description:
        "Fabricación de muebles a medida, placares, cocinas y restauración de piezas en madera maciza. Visitamos tu casa para tomar medidas sin cargo.",
      whatsapp: "5492615551010",
      phone: "2615551010",
      address: "Calle Beltrán 210, Nueva Ciudad",
      location: "Nueva Ciudad",
      serviceAreas: ["Nueva Ciudad", "Dorrego"],
      categories: ["Construcción"],
      services: ["Carpintería"],
      status: "active",
      featured: false,
      plan: "Básico",
    },
    {
      name: "Construcciones y Pintura Guaymallén",
      short_description: "Albañilería, refacciones y pintura de interiores y exteriores.",
      long_description:
        "Ampliaciones, refacciones, revoques y pintura de interiores y exteriores. Trabajamos con presupuesto detallado y plazos de obra cumplidos.",
      whatsapp: "5492615551011",
      phone: "2615551011",
      address: "Calle Perú 330, Villa Nueva",
      location: "Villa Nueva",
      serviceAreas: ["Villa Nueva", "Bermejo", "San José"],
      categories: ["Construcción"],
      services: ["Albañiles", "Pintores"],
      status: "active",
      featured: false,
      plan: "Básico",
    },
    {
      name: "Gomería y Mecánica El Sauce",
      short_description: "Gomería, mecánica general y auxilio.",
      long_description:
        "Reparación de pinchaduras, alineación, balanceo y mecánica general para autos y camionetas. Auxilio en zona El Sauce.",
      whatsapp: "5492615551004",
      phone: "2615551004",
      address: "Ruta Provincial 50 Km 8, El Sauce",
      location: "El Sauce",
      serviceAreas: ["El Sauce"],
      categories: ["Automotor"],
      services: ["Gomería", "Mecánica general"],
      status: "active",
      featured: false,
      plan: "Básico",
      hours: [
        { day: 1, opens: "08:00", closes: "18:00" },
        { day: 2, opens: "08:00", closes: "18:00" },
        { day: 3, opens: "08:00", closes: "18:00" },
        { day: 4, opens: "08:00", closes: "18:00" },
        { day: 5, opens: "08:00", closes: "18:00" },
        { day: 6, opens: "08:00", closes: "13:00" },
      ],
    },
    {
      name: "Veterinaria Huellas",
      short_description: "Consultas, vacunación y peluquería canina y felina.",
      long_description:
        "Atención veterinaria integral: consultas clínicas, vacunación, desparasitación, cirugías de rutina y peluquería para perros y gatos.",
      whatsapp: "5492615551012",
      phone: "2615551012",
      address: "Calle Bandera de los Andes 560, Bermejo",
      location: "Bermejo",
      serviceAreas: ["Bermejo", "El Sauce", "Las Cañas"],
      categories: ["Mascotas"],
      services: ["Veterinaria"],
      status: "active",
      featured: true,
      plan: "Destacado",
      hours: [
        { day: 1, opens: "09:00", closes: "20:00" },
        { day: 2, opens: "09:00", closes: "20:00" },
        { day: 3, opens: "09:00", closes: "20:00" },
        { day: 4, opens: "09:00", closes: "20:00" },
        { day: 5, opens: "09:00", closes: "20:00" },
        { day: 6, opens: "09:00", closes: "13:00" },
      ],
    },
    {
      name: "Estética Magnolia",
      short_description: "Peluquería, manicura y tratamientos de belleza.",
      long_description:
        "Salón de belleza integral: corte y color, manicura, pedicura y tratamientos faciales. Turnos por WhatsApp de martes a sábado.",
      whatsapp: "5492615551013",
      phone: "2615551013",
      address: "Calle Chile 145, San José",
      location: "San José",
      serviceAreas: ["San José", "Villa Nueva"],
      categories: ["Belleza"],
      services: ["Peluquería y estética"],
      status: "active",
      featured: false,
      plan: "Básico",
      hours: [
        { day: 2, opens: "10:00", closes: "19:00" },
        { day: 3, opens: "10:00", closes: "19:00" },
        { day: 4, opens: "10:00", closes: "19:00" },
        { day: 5, opens: "10:00", closes: "19:00" },
        { day: 6, opens: "09:00", closes: "17:00" },
      ],
    },
    {
      name: "Kinesiología Bermejo",
      short_description: "Rehabilitación, kinesiología deportiva y a domicilio.",
      long_description:
        "Tratamiento de lesiones, rehabilitación post-quirúrgica y kinesiología deportiva. Atención en consultorio y a domicilio en Guaymallén.",
      whatsapp: "5492615551014",
      phone: "2615551014",
      address: "Calle Emilio Civit 90, Bermejo",
      location: "Bermejo",
      serviceAreas: ["Bermejo", "Buena Nueva"],
      categories: ["Salud"],
      services: ["Kinesiología"],
      status: "active",
      featured: false,
      plan: "Básico",
    },
    {
      name: "Gestoría Cuyo",
      short_description: "Trámites de autos, ANSES y habilitaciones comerciales.",
      long_description:
        "Gestoría integral: transferencias de autos, trámites previsionales, habilitaciones comerciales y liquidación de impuestos. Retiramos la documentación en tu domicilio.",
      whatsapp: "5492615551015",
      phone: "2615551015",
      address: "Calle Ozamis 210, Buena Nueva",
      location: "Buena Nueva",
      serviceAreas: ["Guaymallén"],
      categories: ["Profesionales"],
      services: ["Gestoría y trámites"],
      status: "active",
      featured: false,
      plan: "Básico",
    },
  ];

  for (const b of businessSeeds) {
    const slug = slugify(b.name);
    const { data: business, error } = await supabase
      .from("businesses")
      .upsert(
        {
          name: b.name,
          slug,
          short_description: b.short_description,
          long_description: b.long_description,
          whatsapp: b.whatsapp,
          phone: b.phone,
          address: b.address,
          location_id: localities.get(b.location),
          status: b.status,
          featured: b.featured,
          plan_id: planId(b.plan),
          // No logo/cover: the UI falls back to a category-colored icon
          // tile (src/components/business-thumb.tsx) rather than a
          // hotlinked placeholder image. Add real photos via /admin.
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();
    if (error) throw error;
    const businessId = business.id as string;

    await supabase
      .from("business_categories")
      .upsert(
        b.categories.map((c, i) => ({
          business_id: businessId,
          category_id: catId(c),
          is_primary: i === 0,
        })),
        { onConflict: "business_id,category_id" }
      );

    await supabase
      .from("business_services")
      .upsert(
        b.services.map((s) => ({ business_id: businessId, service_id: svcId(s) })),
        { onConflict: "business_id,service_id" }
      );

    const areaLocationIds = b.serviceAreas.map((areaName) =>
      areaName === "Guaymallén" ? guaymallen : localities.get(areaName)!
    );
    await supabase
      .from("business_service_areas")
      .upsert(
        areaLocationIds.map((locationId) => ({
          business_id: businessId,
          location_id: locationId,
        })),
        { onConflict: "business_id,location_id" }
      );

    if (b.extraKeywords?.length) {
      await supabase
        .from("business_keywords")
        .upsert(
          b.extraKeywords.map((term) => ({ business_id: businessId, term })),
          { onConflict: "business_id,term" }
        );
    }

    if (b.hours) {
      await supabase.from("business_hours").upsert(
        b.hours.map((h) => ({
          business_id: businessId,
          day_of_week: h.day,
          opens_at: h.opens,
          closes_at: h.closes,
          closed: false,
        })),
        { onConflict: "business_id,day_of_week" }
      );
    }

    console.log(`  - ${b.name} (${b.status})`);
  }

  const seedAdminEmail = process.env.SEED_ADMIN_EMAIL;
  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (seedAdminEmail && seedAdminPassword) {
    console.log(`Seeding admin user ${seedAdminEmail}...`);
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: seedAdminEmail,
      password: seedAdminPassword,
      email_confirm: true,
    });
    let adminId = created?.user?.id;
    if (createErr) {
      const { data: list } = await supabase.auth.admin.listUsers();
      adminId = list?.users.find((u) => u.email === seedAdminEmail)?.id;
    }
    if (adminId) {
      await supabase
        .from("admin_users")
        .upsert({ id: adminId, full_name: "Admin Publique", role: "superadmin" });
    }
  } else {
    console.log(
      "Skipping admin user seed (set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env.local to create one)."
    );
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
