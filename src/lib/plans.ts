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
    maxGalleryImages,
  };
}
