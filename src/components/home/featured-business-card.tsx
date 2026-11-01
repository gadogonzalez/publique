"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/category-icon";
import { getPexelsPlaceholder } from "@/lib/pexels-placeholders";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Listing cover image: real photo -> Pexels category placeholder ->
 * monochrome category icon tile. Never a broken image. Used by the
 * destacados cards, the category hero and the business list rows. */
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
        className={cn("rounded-xl", className)}
        iconClassName="h-1/4 w-1/4 min-h-6 min-w-6"
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-secondary", className)}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        onError={() => setIndex((i) => i + 1)}
      />
    </div>
  );
}
