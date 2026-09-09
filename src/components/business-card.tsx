import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BusinessThumb } from "@/components/business-thumb";
import { CtaButtons } from "@/components/cta-buttons";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Primary business preview used in the homepage discovery grid and search
 * results. Image-led, scannable, with at most a couple of service tags --
 * not everything wrapped in a pill. */
export function BusinessCard({ business }: { business: BusinessWithRelations }) {
  const category = business.categories[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Link href={`/negocios/${business.slug}`} className="relative block">
        <BusinessThumb
          src={business.cover_image_url}
          name={business.name}
          category={category}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-[4/3] w-full"
        />
        {business.featured && (
          <Badge variant="accent" className="absolute left-3 top-3">
            Destacado
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {category && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category.name}
          </p>
        )}
        <Link href={`/negocios/${business.slug}`}>
          <h3 className="font-serif text-lg leading-tight">{business.name}</h3>
        </Link>
        {business.location && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {business.location.name}
          </p>
        )}
        {business.short_description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {business.short_description}
          </p>
        )}

        {business.services.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {business.services.slice(0, 2).map((s) => (
              <Badge key={s.id}>{s.name}</Badge>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3">
          <CtaButtons
            businessId={business.id}
            businessName={business.name}
            whatsapp={business.whatsapp}
            phone={business.phone}
            variant="compact"
            size="sm"
          />
        </div>
      </div>
    </article>
  );
}
