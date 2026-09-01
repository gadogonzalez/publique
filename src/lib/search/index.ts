import { createClient } from "@/lib/supabase/server";
import { PostgresSearchProvider } from "./postgres-provider";
import type { SearchParams, SearchResponse } from "./types";

export type { SearchParams, SearchResponse, SearchResultItem } from "./types";

/**
 * Single entry point for search, used by Server Components / route
 * handlers. Swap the provider here (e.g. to a Typesense-backed one) when
 * the platform outgrows Postgres FTS -- nothing outside this file needs to
 * change.
 */
export async function search(params: SearchParams): Promise<SearchResponse> {
  const supabase = await createClient();
  const provider = new PostgresSearchProvider(supabase);
  return provider.search(params);
}
