import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import { getPlanCapabilities } from "@/lib/plans";
import { cn } from "@/lib/utils";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Compact horizontal listing row (photo left, details right) for every
 * business after the first 3 "destacados" cards -- denser, scannable,
 * closer to a classic booking-style results list than another photo
 * card. Same single interaction as the cards: open the profile.
 *
 * `variant="card"` is the same row content boxed as a standalone card
 * instead of a border-bottom list item, for layouts that put several per
 * row in a grid (e.g. category pages on desktop) rather than stacking
 * full-width. */
export function BusinessListRow({
  business,
  variant = "list",
}: {
  business: BusinessWithRelations;
  variant?: "list" | "card";
}) {
  const category = business.categories[0];
  const { canUploadLogo } = getPlanCapabilities(business.plan);
  const showLogo = canUploadLogo && !!business.logo_url;
  return (
    <Link
      href={`/negocios/${business.slug}`}
      className={cn(
        "group flex items-center gap-4 sm:gap-5",
        variant === "list" && "border-b border-border py-4 first:pt-0 last:border-b-0",
        variant === "card" && "rounded-2xl border border-border bg-card p-3 transition-colors hover:border-brand-primary"
      )}
    >
      <div className="relative shrink-0">
        <FeaturedBusinessCoverOnly business={business} className="aspect-square w-20 rounded-xl sm:w-28" />
        {showLogo && (
          <Image
            src={business.logo_url!}
            alt=""
            width={28}
            height={28}
            className="absolute bottom-1 right-1 h-7 w-7 rounded-full border-2 border-background object-cover shadow"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {category && (
          <p className="text-xs font-medium text-muted-foreground">
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
