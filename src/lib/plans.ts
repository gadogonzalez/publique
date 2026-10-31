import type { Plan } from "@/lib/types/database";

export interface PlanCapabilities {
  canUploadLogo: boolean;
  canUploadGallery: boolean;
  canBeFeatured: boolean;
  maxGalleryImages: number;
}

const FREE_CAPABILITIES: PlanCapabilities = {
  canUploadLogo: false,
  canUploadGallery: false,
  canBeFeatured: false,
  maxGalleryImages: 0,
};

const PAID_CAPABILITIES: PlanCapabilities = {
  canUploadLogo: true,
  canUploadGallery: true,
  canBeFeatured: true,
  maxGalleryImages: 8,
};

/** Single source of truth for what a plan unlocks -- every component
 * checks a capability here, never a plan name/slug directly, so a future
 * plan (or renaming one) never means hunting down scattered conditions. */
export function getPlanCapabilities(plan: Plan | null | undefined): PlanCapabilities {
  if (!plan || plan.is_free) return FREE_CAPABILITIES;
  return PAID_CAPABILITIES;
}
