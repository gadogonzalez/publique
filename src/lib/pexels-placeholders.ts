/**
 * Category-slug -> Pexels photo URL, used as a homepage-only fallback when
 * a business has no cover photo. Unverified from this sandbox (outbound
 * requests to image CDNs are blocked here) -- each URL is a real Pexels
 * photo page asset, but must be spot-checked in a normal browser/deploy
 * before shipping. Callers must still fall back to the branded category
 * icon tile on load error (see FeaturedBusinessCard).
 */
export const PEXELS_CATEGORY_PLACEHOLDERS: Record<string, string> = {
  gastronomia: "https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800",
  automotor: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800",
  salud: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800",
  belleza: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800",
  mascotas: "https://images.pexels.com/photos/6234609/pexels-photo-6234609.jpeg?auto=compress&cs=tinysrgb&w=800",
  hogar: "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800",
  construccion: "https://images.pexels.com/photos/8961057/pexels-photo-8961057.jpeg?auto=compress&cs=tinysrgb&w=800",
  profesionales: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800",
};

export function getPexelsPlaceholder(categorySlug?: string | null): string | undefined {
  if (!categorySlug) return undefined;
  return PEXELS_CATEGORY_PLACEHOLDERS[categorySlug];
}
