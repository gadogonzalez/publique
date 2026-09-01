import type { SupabaseClient } from "@supabase/supabase-js";
import type { SearchResultRow } from "@/lib/types/database";
import {
  mapSearchRow,
  type SearchParams,
  type SearchProvider,
  type SearchResponse,
} from "./types";

const DEFAULT_PAGE_SIZE = 20;

export class PostgresSearchProvider implements SearchProvider {
  constructor(private readonly supabase: SupabaseClient) {}

  async search(params: SearchParams): Promise<SearchResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

    const { data, error } = await this.supabase.rpc("search_businesses", {
      p_query: params.query ?? null,
      p_category_slug: params.categorySlug ?? null,
      p_location_id: params.locationId ?? null,
      p_limit: pageSize,
      p_offset: (page - 1) * pageSize,
    });

    if (error) throw error;

    const rows = (data ?? []) as SearchResultRow[];
    return {
      items: rows.map(mapSearchRow),
      totalCount: rows[0]?.total_count ?? 0,
      page,
      pageSize,
    };
  }
}
