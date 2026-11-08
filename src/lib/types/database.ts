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
  description: string | null;
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
  /** Monthly price. */
  price_ars: number | null;
  /** Price when paying 6 months up front. */
  price_6m_ars: number | null;
  max_gallery_images: number;
  /** Plan's businesses can appear in the homepage destacados carousel. */
  home_featured: boolean;
  /** Listing order across plans: higher first. */
  exposure_priority: number;
  features: string[];
  is_active: boolean;
  is_free: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type FeaturedPlacementType = "primary" | "secondary";

export interface FeaturedPlacement {
  id: string;
  business_id: string;
  category_id: string;
  market_id: string;
  type: FeaturedPlacementType;
  priority: number;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
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
export type ContactReason = "consulta" | "negocio" | "error";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  reason: ContactReason;
  message: string;
  status: "new" | "read";
  created_at: string;
}

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
