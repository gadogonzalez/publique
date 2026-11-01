import { FeaturedBusinessCard } from "@/components/home/featured-business-card";
import { BusinessListRow } from "@/components/home/business-list-row";
import { cn } from "@/lib/utils";
import type { BusinessWithRelations } from "@/lib/types/database";

const FEATURED_COUNT = 3;

/** Shared "3 destacados + list" rendering, used by the homepage, /buscar
 * and category pages: first 3 as photo cards, the rest as a compact,
 * booking-style horizontal list below them. No sort state of its own --
 * callers pass businesses already in the order they want. */
export function BusinessFeaturedAndList({
  businesses,
}: {
  businesses: BusinessWithRelations[];
}) {
  const featured = businesses.slice(0, FEATURED_COUNT);
  const rest = businesses.slice(FEATURED_COUNT);

  return (
    <div>
      {featured.length > 0 && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
          {featured.map((business) => (
            <FeaturedBusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className={cn(featured.length > 0 && "mt-10")}>
          {rest.map((business) => (
            <BusinessListRow key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
