import Link from "next/link";
import { MapPin } from "lucide-react";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import { CategoryPictogram } from "@/components/category-icon";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Vertical, full-bleed poster card for the homepage destacados carousel --
 * distinct from the square FeaturedBusinessCard used elsewhere (category
 * pages, /buscar), which keeps its image-on-top/text-below layout. No logo
 * here on purpose: logos belong on the business profile, not this card. */
export function FeaturedCarouselCard({ business }: { business: BusinessWithRelations }) {
  const category = business.categories[0];

  return (
    <Link
      href={`/negocios/${business.slug}`}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      <FeaturedBusinessCoverOnly
        business={business}
        className="absolute inset-0 h-full w-full rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/85 via-black/15 to-transparent"
      />

      {category && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-foreground">
          <CategoryPictogram icon={category.icon} className="h-3.5 w-3.5 shrink-0" />
          {category.name}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-serif text-lg font-bold leading-tight text-white">{business.name}</h3>
        {business.location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {business.location.name}
          </p>
        )}
        {business.short_description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/80">{business.short_description}</p>
        )}
      </div>
    </Link>
  );
}
