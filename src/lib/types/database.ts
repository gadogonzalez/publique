/**
 * Hand-written types mirroring supabase/migrations. For an MVP this is
 * simpler than wiring up `supabase gen types` in CI; once the schema
 * stabilizes, swap this file for generated types without touching call
 * sites (they all import from here).
 */

export type LocationType = "country" | "province" | "department" | "locality";

export type BusinessStatus =
  | "draft"
  | "active"
  | "past_due"
  | "suspended"
  | "archived";

export interface Location {
  id: string;
  type: LocationType;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Keyword {
  id: string;
  term: string;
  service_id: string | null;
  category_id: string | null;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_ars: number | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  location_id: string | null;
  status: BusinessStatus;
  plan_id: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessImage {
  id: string;
  business_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface BusinessHours {
  id: string;
  business_id: string;
  day_of_week: number; // 0 = Sunday
  opens_at: string | null;
  closes_at: string | null;
  closed: boolean;
}

export interface BusinessKeyword {
  id: string;
  business_id: string;
  term: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  full_name: string | null;
  role: "admin" | "superadmin";
  created_at: string;
}

/** Row shape returned by the search_businesses() RPC. */
export interface SearchResultRow {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  location_id: string | null;
  featured: boolean;
  relevance: number;
  total_count: number;
}

/** Business joined with the display data a card/profile page needs. */
export interface BusinessWithRelations extends Business {
  location: Location | null;
  categories: Category[];
  services: Service[];
  service_areas: Location[];
  images: BusinessImage[];
  hours: BusinessHours[];
  keywords: BusinessKeyword[];
  plan: Plan | null;
}
