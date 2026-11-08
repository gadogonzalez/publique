import type { Plan } from "@/lib/types/database";

export interface PlanCapabilities {
  canUploadLogo: boolean;
  canUploadGallery: boolean;
  canBeFeatured: boolean;
  /** Eligible for the homepage destacados carousel. */
  canAppearOnHome: boolean;
  /** Higher plans are listed first; 0 for free. */
  exposurePriority: number;
  maxGalleryImages: number;
}

const FREE_CAPABILITIES: PlanCapabilities = {
  canUploadLogo: false,
  canUploadGallery: false,
  canBeFeatured: false,
  canAppearOnHome: false,
  exposurePriority: 0,
  maxGalleryImages: 0,
};


/** Single source of truth for what a plan unlocks -- every component
 * checks a capability here, never a plan name/slug directly, so a future
 * plan (or renaming one) never means hunting down scattered conditions. */
export function getPlanCapabilities(plan: Plan | null | undefined): PlanCapabilities {
  if (!plan || plan.is_free) return FREE_CAPABILITIES;
  // `?? 8`: previous fixed limit, used until migration 0015 adds the column.
  const maxGalleryImages = plan.max_gallery_images ?? 8;
  return {
    canUploadLogo: true,
    canUploadGallery: maxGalleryImages > 0,
    canBeFeatured: true,
    // `?? true` / `?? 1`: behavior before migration 0016 (any paid plan).
    canAppearOnHome: plan.home_featured ?? true,
    exposurePriority: plan.exposure_priority ?? 1,
    maxGalleryImages,
  };
}

/** Sort comparator: higher-exposure plans first. Array.sort is stable, so
 * the incoming (relevance) order is kept within each plan. */
export function byExposure<T extends { plan: Plan | null }>(a: T, b: T): number {
  return getPlanCapabilities(b.plan).exposurePriority - getPlanCapabilities(a.plan).exposurePriority;
}
