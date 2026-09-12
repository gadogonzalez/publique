"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/category-icon";
import { getPexelsPlaceholder } from "@/lib/pexels-placeholders";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Homepage-only cover image: real photo -> Pexels category placeholder ->
 * monochrome category icon tile. Never a broken image. Kept separate from
 * the shared BusinessThumb (used by /buscar and the profile page) so this
 * fallback chain never affects those routes. Shared by the discovery grid
 * card and the editorial spotlight module. */
export function FeaturedBusinessCoverOnly({
  business,
  className,
}: {
  business: BusinessWithRelations;
  className?: string;
}) {
  const category = business.categories[0];
  const candidates = [business.cover_image_url, getPexelsPlaceholder(category?.slug)].filter(
    (src): src is string => !!src
  );
  const [index, setIndex] = useState(0);
  const src = candidates[index];

  if (!src) {
    return (
      <CategoryIcon
        icon={category?.icon}
        className={cn("rounded-lg", className)}
        iconClassName="h-1/4 w-1/4 min-h-6 min-w-6"
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-secondary", className)}>
      <Image
        src={src}
        alt={business.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        onError={() => setIndex((i) => i + 1)}
      />
    </div>
  );
}

/** Editorial, photo-first business card for the homepage discovery grid.
 * Single interaction: open the business profile. No WhatsApp/call/quote
 * actions -- those belong on the profile page, not on discovery. */
export function FeaturedBusinessCard({ business }: { business: BusinessWithRelations }) {
  const category = business.categories[0];
  return (
    <Link href={`/negocios/${business.slug}`} className="group block overflow-hidden rounded-lg">
      <FeaturedBusinessCoverOnly business={business} className="aspect-[4/3] w-full" />
      <div className="mt-3">
        {category && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category.name}
          </p>
        )}
        <h3 className="mt-1 font-serif text-lg font-bold leading-tight tracking-tight">
          {business.name}
        </h3>
        {business.location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {business.location.name}
          </p>
        )}
        {business.short_description && (
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {business.short_description}
          </p>
        )}
      </div>
    </Link>
  );
}
