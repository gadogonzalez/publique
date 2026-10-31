"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Globe, Instagram, MapPin, MessageCircle } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import { BusinessMapEmbed } from "@/components/business-map-embed";
import { Button } from "@/components/ui/button";
import { getPlanCapabilities } from "@/lib/plans";
import { formatWhatsAppLink } from "@/lib/utils";
import { trackClient } from "@/lib/analytics/client";
import type { BusinessWithRelations } from "@/lib/types/database";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/** Category page hero: a condensed profile for the one business that paid
 * to be the destacado principal of this category -- cover, logo, a map
 * (no "Cómo llegar" link needed when the pin is right there), contact
 * links, hours and gallery. Not the full PDP (no services/coverage areas),
 * just enough to convert without leaving the category page. */
export function CategoryHeroSpotlight({
  business,
  categoryName,
}: {
  business: BusinessWithRelations;
  categoryName: string;
}) {
  const capabilities = getPlanCapabilities(business.plan);
  const showLogo = capabilities.canUploadLogo && !!business.logo_url;
  const showGallery = capabilities.canUploadGallery && business.images.length > 0;
  const category = business.categories[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <FeaturedBusinessCoverOnly business={business} className="aspect-[21/9] w-full rounded-none" />

      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          {showLogo ? (
            <Image
              src={business.logo_url!}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
            />
          ) : (
            <CategoryIcon icon={category?.icon} className="h-14 w-14 shrink-0 rounded-full" iconClassName="h-6 w-6" />
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-primary">
              Lo más destacado en {categoryName}
            </p>
            <Link href={`/negocios/${business.slug}`} className="hover:underline">
              <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                {business.name}
              </h2>
            </Link>
            {business.location && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {business.location.name}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {(business.long_description || business.short_description) && (
              <section>
                <h3 className="mb-2 font-serif text-lg font-bold tracking-tight">Sobre nosotros</h3>
                <p className="whitespace-pre-line text-muted-foreground">
                  {business.long_description ?? business.short_description}
                </p>
              </section>
            )}

            {showGallery && (
              <section className="border-t border-border pt-6">
                <h3 className="mb-3 font-serif text-lg font-bold tracking-tight">Galería</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {business.images.map((img) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl">
                      <Image src={img.url} alt={img.alt_text ?? business.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <BusinessMapEmbed
              name={business.name}
              address={business.address}
              latitude={business.latitude}
              longitude={business.longitude}
              className="aspect-square w-full"
            />

            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium hover:text-brand-primary"
              >
                <Globe className="h-4 w-4" /> Sitio web
              </a>
            )}
            {business.instagram && (
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium hover:text-brand-primary"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            )}

            {business.whatsapp && (
              <Button
                asChild
                variant="whatsapp"
                className="w-full"
                onClick={() => trackClient({ type: "whatsapp_click", businessId: business.id })}
              >
                <a
                  href={formatWhatsAppLink(
                    business.whatsapp,
                    `Hola ${business.name}, te encontré en Publiqué.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contáctanos
                </a>
              </Button>
            )}

            {business.hours.length > 0 && (
              <section>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" /> Horarios
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {business.hours.map((h) => (
                    <li key={h.id} className="flex justify-between gap-4">
                      <span>{DAY_NAMES[h.day_of_week]}</span>
                      <span>
                        {h.closed || !h.opens_at
                          ? "Cerrado"
                          : `${h.opens_at.slice(0, 5)} – ${h.closes_at?.slice(0, 5)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
