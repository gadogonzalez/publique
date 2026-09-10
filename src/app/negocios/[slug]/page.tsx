import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Instagram, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BusinessThumb } from "@/components/business-thumb";
import { CtaButtons } from "@/components/cta-buttons";
import { StickyContactBar } from "@/components/sticky-contact-bar";
import { getBusinessBySlug } from "@/lib/data/businesses";
import { trackServer } from "@/lib/analytics/server";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return {};

  const title = business.location
    ? `${business.name} en ${business.location.name}`
    : business.name;

  return {
    title,
    description: business.short_description ?? undefined,
    openGraph: {
      title,
      description: business.short_description ?? undefined,
      images: business.cover_image_url ? [business.cover_image_url] : undefined,
    },
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  await trackServer({ type: "business_profile_view", businessId: business.id });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.short_description ?? undefined,
    image: business.cover_image_url ?? business.logo_url ?? undefined,
    telephone: business.phone ?? undefined,
    address: business.address
      ? {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressLocality: business.location?.name,
          addressRegion: "Mendoza",
          addressCountry: "AR",
        }
      : undefined,
    ...(business.latitude && business.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          },
        }
      : {}),
  };

  return (
    <div className="pb-20 sm:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BusinessThumb
        src={business.cover_image_url}
        name={business.name}
        category={business.categories[0]}
        className="h-56 w-full sm:h-96"
        sizes="100vw"
        priority
      />

      <div className="container pt-6">
        {business.categories[0] && (
          <Link
            href={`/buscar?categoria=${business.categories[0].slug}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {business.categories[0].name}
          </Link>
        )}

        <div className="mt-2 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {business.logo_url && (
              <Image
                src={business.logo_url}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
              />
            )}
            <div>
              {business.featured && (
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
                  Destacado
                </p>
              )}
              <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
                {business.name}
              </h1>
              {business.location && (
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {business.location.name}
                </p>
              )}
            </div>
          </div>

          <CtaButtons
            businessId={business.id}
            businessName={business.name}
            whatsapp={business.whatsapp}
            address={business.address}
            latitude={business.latitude}
            longitude={business.longitude}
            website={business.website}
            className="hidden sm:flex"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {business.long_description && (
              <section>
                <h2 className="mb-3 font-serif text-xl font-bold">Sobre nosotros</h2>
                <p className="whitespace-pre-line text-muted-foreground">
                  {business.long_description}
                </p>
              </section>
            )}

            {business.services.length > 0 && (
              <section className="border-t border-border pt-8">
                <h2 className="mb-3 font-serif text-xl font-bold">Servicios</h2>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((s) => (
                    <Badge key={s.id}>{s.name}</Badge>
                  ))}
                </div>
              </section>
            )}

            {business.service_areas.length > 0 && (
              <section className="border-t border-border pt-8">
                <h2 className="mb-3 font-serif text-xl font-bold">Zonas de cobertura</h2>
                <div className="flex flex-wrap gap-2">
                  {business.service_areas.map((a) => (
                    <Badge key={a.id} variant="outline">
                      {a.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {business.images.length > 0 && (
              <section className="border-t border-border pt-8">
                <h2 className="mb-3 font-serif text-xl font-bold">Galería</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {business.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square overflow-hidden rounded-xl"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text ?? business.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8 lg:border-l lg:border-border lg:pl-10">
            {business.address && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4" /> Dirección
                </h2>
                <p className="text-sm text-muted-foreground">{business.address}</p>
              </section>
            )}

            {business.hours.length > 0 && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" /> Horarios
                </h2>
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

            {business.instagram && (
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            )}

            <Link href="/buscar" className="block text-sm text-primary hover:underline">
              ← Ver más negocios
            </Link>
          </aside>
        </div>
      </div>

      <StickyContactBar
        businessId={business.id}
        businessName={business.name}
        whatsapp={business.whatsapp}
        address={business.address}
        latitude={business.latitude}
        longitude={business.longitude}
      />
    </div>
  );
}
