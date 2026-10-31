import { createClient } from "@/lib/supabase/server";
import type { Category, Keyword, Service } from "@/lib/types/database";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Count of active businesses per category, for the category grid tiles
 * (home + /categorias). One query, counted client-side -- small dataset,
 * no need for a dedicated RPC. */
export async function getCategoryBusinessCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_categories")
    .select("category_id, businesses!inner(status)")
    .eq("businesses.status", "active");
  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of (data as unknown as { category_id: string }[] | null) ?? []) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

/** Global keyword/alias table (see docs/SEARCH.md) -- feeds
 * service/category matching in search_businesses(), edited from
 * /admin/categorias. */
export async function getKeywords(): Promise<Keyword[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("keywords").select("*").order("term");
  if (error) throw error;
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}
