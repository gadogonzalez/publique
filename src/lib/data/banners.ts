import { createClient } from "@/lib/supabase/server";
import { getPlanCapabilities } from "@/lib/plans";
import type { HomeBanner, Plan } from "@/lib/types/database";

export interface HomeBannerWithBusiness extends HomeBanner {
  business: { id: string; name: string; slug: string; status: string; plan: Plan | null } | null;
}

const SELECT = "*, business:businesses(id, name, slug, status, plan:plans(*))";

/** Active homepage banners whose business is active and still on a plan
 * that includes a banner (Premium). */
export async function getHomeBanners(): Promise<HomeBannerWithBusiness[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_banners")
    .select(SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  // Table missing (migration 0017 not run yet) -> no banners, not a crash.
  if (error) return [];
  return ((data ?? []) as HomeBannerWithBusiness[]).filter(
    (b) => b.business?.status === "active" && getPlanCapabilities(b.business.plan).canHaveHomeBanner
  );
}

/** Admin: every banner, active or not. */
export async function getAllHomeBanners(): Promise<HomeBannerWithBusiness[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_banners")
    .select(SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HomeBannerWithBusiness[];
}

/** Admin: active businesses whose plan includes a homepage banner. */
export async function getBannerEligibleBusinesses(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, plan:plans(*)")
    .eq("status", "active")
    .order("name", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as { id: string; name: string; plan: Plan | null }[])
    .filter((b) => getPlanCapabilities(b.plan).canHaveHomeBanner)
    .map(({ id, name }) => ({ id, name }));
}
