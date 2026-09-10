import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BusinessThumb } from "@/components/business-thumb";
import type { BusinessWithRelations } from "@/lib/types/database";

/**
 * Primary business preview for the homepage discovery grid and search
 * results. Discovery only -- no WhatsApp/call/directions here, the whole
 * item just navigates to the profile where those actions live.
 */
export function BusinessCard({ business }: { business: BusinessWithRelations }) {
  const category = business.categories[0];

  return (
    <Link href={`/negocios/${business.slug}`} className="group block">
      <BusinessThumb
        src={business.cover_image_url}
        name={business.name}
        category={category}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="aspect-[4/3] w-full rounded-lg"
      />

      <div className="mt-3">
        {business.featured && (
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            Destacado
          </p>
        )}
        {category && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category.name}
          </p>
        )}
        <h3 className="mt-1 font-serif text-lg font-bold leading-tight tracking-tight">{business.name}</h3>
        {business.location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {business.location.name}
          </p>
        )}
        {business.short_description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {business.short_description}
          </p>
        )}
        <ArrowRight className="mt-2 h-4 w-4 text-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
