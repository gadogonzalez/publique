import { createClient } from "@/lib/supabase/server";
import { getBusinessesByIds } from "@/lib/data/businesses";
import type { BusinessWithRelations, FeaturedPlacement } from "@/lib/types/database";

export interface CategoryFeatured {
  primary: BusinessWithRelations | null;
  secondary: BusinessWithRelations[];
}

/** Active, currently-in-window placements for one category+market,
 * resolved to full business records. Scoped by date range here, not just
 * is_active -- a placement with a future/past window never shows up even
 * if it's still flagged active (see 0013_plans_and_featured.sql). */
export async function getFeaturedForCategory(
  categoryId: string,
  marketId: string
): Promise<CategoryFeatured> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("featured_placements")
    .select("business_id, type")
    .eq("category_id", categoryId)
    .eq("market_id", marketId)
    .eq("is_active", true)
    .lte("starts_at", now)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .order("priority", { ascending: true });
  if (error) throw error;

  const rows = data ?? [];
  const primaryId = rows.find((p) => p.type === "primary")?.business_id;
  const secondaryIds = rows.filter((p) => p.type === "secondary").map((p) => p.business_id);

  const businesses = await getBusinessesByIds(
    primaryId ? [primaryId, ...secondaryIds] : secondaryIds
  );
  const byId = new Map(businesses.map((b) => [b.id, b]));

  return {
    primary: primaryId ? byId.get(primaryId) ?? null : null,
    secondary: secondaryIds
      .map((id) => byId.get(id))
      .filter((b): b is BusinessWithRelations => !!b),
  };
}

/** Admin-only: every placement row for one category+market (any date or
 * active state) with the business name, for the slot-management screen. */
export async function getFeaturedSlotsForCategory(
  categoryId: string,
  marketId: string
): Promise<(FeaturedPlacement & { business_name: string })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("featured_placements")
    .select("*, business:businesses(name)")
    .eq("category_id", categoryId)
    .eq("market_id", marketId)
    .order("type", { ascending: true })
    .order("priority", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const { business, ...placement } = row as FeaturedPlacement & {
      business: { name: string } | null;
    };
    return { ...placement, business_name: business?.name ?? "—" };
  });
}

/** Businesses that could be assigned a featured slot in this category:
 * active status + a plan that allows it (see src/lib/plans.ts). */
export async function getFeaturedEligibleBusinesses(
  categoryId: string
): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_categories")
    .select("business:businesses(id, name, status, plan:plans(is_free))")
    .eq("category_id", categoryId);
  if (error) throw error;

  type Row = {
    business: { id: string; name: string; status: string; plan: { is_free: boolean } | null } | null;
  };

  return ((data as unknown as Row[] | null) ?? [])
    .map((row) => row.business)
    .filter(
      (b): b is { id: string; name: string; status: string; plan: { is_free: boolean } } =>
        !!b && b.status === "active" && !!b.plan && !b.plan.is_free
    )
    .map((b) => ({ id: b.id, name: b.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
