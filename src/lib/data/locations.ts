import { createClient } from "@/lib/supabase/server";
import type { Location } from "@/lib/types/database";

/** Localities (the level consumers pick from on the homepage). MVP has one
 * department (Guaymallén) so this is effectively "all localities" -- once
 * more departments exist, filter by parent_id here without touching call
 * sites. */
export async function getLocalities(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("type", "locality")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** All departments (currently just Guaymallén) -- offered as service-area
 * options alongside individual localities in the admin editor. */
export async function getDepartments(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("type", "department")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

/** The one market this MVP serves, used to scope featured-placement cupos
 * (see docs/PRODUCT.md "More departments/provinces"). Phase 2 swaps this
 * for a real per-request market lookup without touching call sites. */
export async function getPrimaryMarket(): Promise<Location | null> {
  const departments = await getDepartments();
  return departments[0] ?? null;
}

export async function getAllLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("locations").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getLocationById(id: string): Promise<Location | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
