import Link from "next/link";
import { MapPin } from "lucide-react";
import { BusinessThumb } from "@/components/business-thumb";
import { CtaButtons } from "@/components/cta-buttons";
import type { BusinessWithRelations } from "@/lib/types/database";

/**
 * Compact editorial listing row -- used for search results and secondary
 * featured businesses. A hairline divider (border-t on the wrapping list)
 * separates rows instead of individual card borders.
 */
export function BusinessListing({ business }: { business: BusinessWithRelations }) {
  const category = business.categories[0];

  return (
    <article className="flex gap-4 py-6 sm:gap-6">
      <Link href={`/negocios/${business.slug}`} className="shrink-0">
        <BusinessThumb
          src={business.cover_image_url ?? business.logo_url}
          name={business.name}
          sizes="96px"
          className="h-20 w-20 sm:h-24 sm:w-24"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {business.featured && (
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            Destacado
          </span>
        )}
        <Link href={`/negocios/${business.slug}`}>
          <h3 className="font-serif text-lg leading-tight sm:text-xl">
            {business.name}
          </h3>
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {category && <span>{category.name}</span>}
          {business.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location.name}
            </span>
          )}
        </div>
        {business.short_description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {business.short_description}
          </p>
        )}
        <CtaButtons
          businessId={business.id}
          businessName={business.name}
          whatsapp={business.whatsapp}
          phone={business.phone}
          variant="compact"
          size="sm"
          className="mt-1"
        />
      </div>
    </article>
  );
}
