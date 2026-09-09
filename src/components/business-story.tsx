import Link from "next/link";
import { MapPin } from "lucide-react";
import { BusinessThumb } from "@/components/business-thumb";
import { CtaButtons } from "@/components/cta-buttons";
import type { BusinessWithRelations } from "@/lib/types/database";

/**
 * Large lead feature for a single curated business -- image and text as an
 * editorial spread, not a bordered card. Used for the one "recommended"
 * pick on the homepage.
 */
export function BusinessStory({ business }: { business: BusinessWithRelations }) {
  const category = business.categories[0];

  return (
    <article className="grid gap-6 sm:grid-cols-2 sm:gap-10">
      <Link href={`/negocios/${business.slug}`} className="block">
        <BusinessThumb
          src={business.cover_image_url}
          name={business.name}
          category={category}
          sizes="(max-width: 640px) 100vw, 50vw"
          className="aspect-[4/3] w-full rounded-2xl"
        />
      </Link>

      <div className="flex flex-col justify-center gap-3">
        {business.featured && (
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            Destacado
          </span>
        )}
        <Link href={`/negocios/${business.slug}`}>
          <h3 className="font-serif text-2xl leading-tight sm:text-3xl">
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
          <p className="text-muted-foreground">{business.short_description}</p>
        )}
        <CtaButtons
          businessId={business.id}
          businessName={business.name}
          whatsapp={business.whatsapp}
          phone={business.phone}
          variant="compact"
          className="mt-1"
        />
      </div>
    </article>
  );
}
