import Link from "next/link";
import { MapPin } from "lucide-react";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Compact horizontal listing row (photo left, details right) for every
 * business after the first 3 "destacados" cards -- denser, scannable,
 * closer to a classic booking-style results list than another photo
 * card. Same single interaction as the cards: open the profile. */
export function BusinessListRow({ business }: { business: BusinessWithRelations }) {
  const category = business.categories[0];
  return (
    <Link
      href={`/negocios/${business.slug}`}
      className="group flex items-center gap-4 border-b border-border py-4 first:pt-0 last:border-b-0 hover:bg-muted/40 sm:gap-5"
    >
      <FeaturedBusinessCoverOnly
        business={business}
        className="aspect-square w-20 shrink-0 sm:w-28"
      />
      <div className="min-w-0 flex-1">
        {category && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category.name}
          </p>
        )}
        <h3 className="mt-0.5 truncate font-serif text-base font-bold leading-tight tracking-tight sm:text-lg">
          {business.name}
        </h3>
        {business.location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {business.location.name}
          </p>
        )}
        {business.short_description && (
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{business.short_description}</p>
        )}
      </div>
    </Link>
  );
}
