import { BusinessListRow } from "@/components/home/business-list-row";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Shared business listing for /buscar and category pages: stacked rows on
 * mobile, boxed cards (2-3 per row) on larger screens. Callers pass
 * businesses already in the order they want. */
export function BusinessList({
  businesses,
  showCategory = true,
}: {
  businesses: BusinessWithRelations[];
  showCategory?: boolean;
}) {
  return (
    <>
      <div className="sm:hidden">
        {businesses.map((business) => (
          <BusinessListRow key={business.id} business={business} showCategory={showCategory} />
        ))}
      </div>
      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {businesses.map((business) => (
          <BusinessListRow key={business.id} business={business} variant="card" showCategory={showCategory} />
        ))}
      </div>
    </>
  );
}
