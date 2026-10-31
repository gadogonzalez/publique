"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { FeaturedPlacementType } from "@/lib/types/database";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/** Postgres raises a plain-text exception for every commercial rule
 * (cupo, plan elegibility, overlapping slot) -- see
 * 0013_plans_and_featured.sql featured_placements_validate(). Those
 * messages are already Spanish and user-facing, so they're surfaced as-is
 * instead of a generic "no se pudo guardar". */
export async function createFeaturedPlacement(input: {
  business_id: string;
  category_id: string;
  market_id: string;
  type: FeaturedPlacementType;
  starts_at: string;
  ends_at: string | null;
}): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("featured_placements").insert({
    business_id: input.business_id,
    category_id: input.category_id,
    market_id: input.market_id,
    type: input.type,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/destacados");
  return { ok: true };
}

export async function updateFeaturedPlacement(
  id: string,
  patch: { is_active?: boolean; starts_at?: string; ends_at?: string | null }
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("featured_placements").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/destacados");
  return { ok: true };
}
