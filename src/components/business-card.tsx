import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CtaButtons } from "@/components/cta-buttons";
import { RatingStars } from "@/components/rating-stars";
import type { BusinessWithRelations } from "@/lib/types/database";

export function BusinessCard({ business }: { business: BusinessWithRelations }) {
  const primaryCategory = business.categories[0];

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={`/negocios/${business.slug}`} className="block">
        <div className="relative h-36 w-full bg-secondary">
          {business.cover_image_url ? (
            <Image
              src={business.cover_image_url}
              alt={business.name}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover"
            />
          ) : null}
          {business.featured && (
            <Badge variant="accent" className="absolute left-3 top-3">
              Destacado
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/negocios/${business.slug}`}>
            <h3 className="font-semibold leading-tight hover:underline">
              {business.name}
            </h3>
          </Link>
          {business.logo_url && (
            <Image
              src={business.logo_url}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {primaryCategory && <span>{primaryCategory.name}</span>}
          {business.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location.name}
            </span>
          )}
        </div>

        <RatingStars rating={null} />

        {business.short_description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {business.short_description}
          </p>
        )}

        <div className="mt-auto pt-2">
          <CtaButtons
            businessId={business.id}
            businessName={business.name}
            whatsapp={business.whatsapp}
            phone={business.phone}
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
}
