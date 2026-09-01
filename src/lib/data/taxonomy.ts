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
