import { createClient } from "@/lib/supabase/server";
import type {
  Business,
  BusinessHours,
  BusinessImage,
  BusinessKeyword,
  BusinessWithRelations,
  Category,
  Location,
  Plan,
  Service,
} from "@/lib/types/database";

const BUSINESS_SELECT =
  "*, location:locations(*), categories:business_categories(category:categories(*)), services:business_services(service:services(*)), service_areas:business_service_areas(location:locations(*)), images:business_images(*), hours:business_hours(*), keywords:business_keywords(*), plan:plans(*)";

/** Shape returned by BUSINESS_SELECT before join tables are flattened. */
interface RawBusinessRow extends Business {
  location: Location | null;
  categories: { category: Category | null }[] | null;
  services: { service: Service | null }[] | null;
  service_areas: { location: Location | null }[] | null;
  images: BusinessImage[] | null;
  hours: BusinessHours[] | null;
  keywords: BusinessKeyword[] | null;
  plan: Plan | null;
}

export async function getFeaturedBusinesses(
  limit = 6
): Promise<BusinessWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(BUSINESS_SELECT)
    .eq("status", "active")
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapBusinessRow);
}

/** Fetches full display data for a set of business ids (e.g. a page of
 * search results) and returns them in the same order as `ids`. */
export async function getBusinessesByIds(
  ids: string[]
): Promise<BusinessWithRelations[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(BUSINESS_SELECT)
    .in("id", ids);
  if (error) throw error;
  const mapped = (data ?? []).map(mapBusinessRow);
  const byId = new Map(mapped.map((b) => [b.id, b]));
  return ids.map((id) => byId.get(id)).filter((b): b is BusinessWithRelations => !!b);
}

/** Admin-only: fetches a business by id regardless of status (draft,
 * suspended, etc. included) for the edit form. */
export async function getBusinessById(id: string): Promise<BusinessWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(BUSINESS_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapBusinessRow(data) : null;
}

export async function getBusinessBySlug(
  slug: string
): Promise<BusinessWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(BUSINESS_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  return data ? mapBusinessRow(data) : null;
}

// The Supabase JS client returns nested join rows shaped like
// { category: {...} }[] for join tables -- flatten them into plain arrays
// so components don't need to know about the join table structure.
function mapBusinessRow(row: RawBusinessRow): BusinessWithRelations {
  return {
    ...row,
    categories: (row.categories ?? []).map((c) => c.category).filter((c): c is Category => !!c),
    services: (row.services ?? []).map((s) => s.service).filter((s): s is Service => !!s),
    service_areas: (row.service_areas ?? [])
      .map((a) => a.location)
      .filter((l): l is Location => !!l),
    images: [...(row.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    hours: [...(row.hours ?? [])].sort((a, b) => a.day_of_week - b.day_of_week),
    keywords: row.keywords ?? [],
  };
}
