"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";
import type { LocationType } from "@/lib/types/database";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createLocation(
  type: LocationType,
  name: string,
  parentId: string
): Promise<ActionResult> {
  await requireAdmin();
  if (!name.trim()) return { ok: false, error: "Ingresá un nombre" };
  if (!parentId) return { ok: false, error: "Elegí una ubicación superior" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("locations")
    .insert({ type, name: name.trim(), slug: slugify(name), parent_id: parentId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/ubicaciones");
  return { ok: true };
}

export async function deleteLocation(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) {
    return {
      ok: false,
      error: "No se pudo borrar: hay negocios o sub-ubicaciones que la usan.",
    };
  }
  revalidatePath("/admin/ubicaciones");
  return { ok: true };
}
