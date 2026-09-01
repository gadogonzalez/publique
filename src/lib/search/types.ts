import type { SearchResultRow } from "@/lib/types/database";

export interface SearchParams {
  /** Free-text query, e.g. "se me rompió la bomba de agua". Optional -- a
   * bare category/location browse is also a valid "search". */
  query?: string;
  categorySlug?: string;
  locationId?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  whatsapp: string | null;
  phone: string | null;
  locationId: string | null;
  featured: boolean;
  relevance: number;
}

export interface SearchResponse {
  items: SearchResultItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * The search abstraction the rest of the app codes against. For MVP the
 * only implementation is PostgresSearchProvider (search_businesses() RPC).
 * A future engine (Typesense, an AI intent layer, etc.) implements the same
 * interface and gets swapped in at src/lib/search/index.ts -- UI code and
 * route handlers never call Supabase or a search engine directly.
 */
export interface SearchProvider {
  search(params: SearchParams): Promise<SearchResponse>;
}

export function mapSearchRow(row: SearchResultRow): SearchResultItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    logoUrl: row.logo_url,
    coverImageUrl: row.cover_image_url,
    whatsapp: row.whatsapp,
    phone: row.phone,
    locationId: row.location_id,
    featured: row.featured,
    relevance: row.relevance,
  };
}
