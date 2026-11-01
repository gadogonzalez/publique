import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Instagram, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BusinessThumb } from "@/components/business-thumb";
import { CategoryIcon } from "@/components/category-icon";
import { CtaButtons, ShareButton, TrackedLink } from "@/components/cta-buttons";
import { StickyContactBar } from "@/components/sticky-contact-bar";
import { HERO_GRID } from "@/components/home/width";
import { getBusinessBySlug } from "@/lib/data/businesses";
import { getPlanCapabilities } from "@/lib/plans";
import { trackServer } from "@/lib/analytics/server";
import { cn, getMapsUrl } from "@/lib/utils";
import type { BusinessHours } from "@/lib/types/database";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const TIME_ZONE = "America/Argentina/Mendoza";

/** Current weekday (0 = Sunday, matching day_of_week) and HH:MM in Mendoza. */
function nowInMendoza() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, time: `${get("hour")}:${get("minute")}` };
}

/** Open right now? Handles shifts that close after midnight (closes <= opens). */
function isOpenNow(hours: BusinessHours[], day: number, time: string) {
  const yesterday = (day + 6) % 7;
  return hours.some((h) => {
    if (h.closed || !h.opens_at || !h.closes_at) return false;
    const opens = h.opens_at.slice(0, 5);
    const closes = h.closes_at.slice(0, 5);
    const overnight = closes <= opens;
    if (h.day_of_week === day) return overnight ? time >= opens : time >= opens && time < closes;
    if (h.day_of_week === yesterday && overnight) return time < closes;
    return false;
  });
}

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

  const capabilities = getPlanCapabilities(business.plan);
  const showLogo = capabilities.canUploadLogo && !!business.logo_url;
  const showGallery = capabilities.canUploadGallery && business.images.length > 0;
  const mapsUrl = getMapsUrl(business.address, business.latitude, business.longitude);
  const now = nowInMendoza();
  const openNow = isOpenNow(business.hours, now.day, now.time);
  // Monday-first, as people in Argentina read a week.
  const sortedHours = [...business.hours].sort(
    (a, b) => (a.day_of_week + 6) % 7 - (b.day_of_week + 6) % 7
  );

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

      <div className={`${HERO_GRID} pt-6`}>
        {business.categories[0] && (
          <Link
            href={`/categorias/${business.categories[0].slug}`}
            className="text-sm text-muted-foreground hover:text-brand-primary"
          >
            {business.categories[0].name}
          </Link>
        )}

        <div className="mt-2 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
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
              <CategoryIcon
                icon={business.categories[0]?.icon}
                className="h-14 w-14 shrink-0 rounded-full"
                iconClassName="h-6 w-6"
              />
            )}
            <div>
              {business.featured && (
                <p className="mb-1 text-sm font-semibold text-brand-primary">
                  Destacado
                </p>
              )}
              <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
            <ShareButton businessId={business.id} businessName={business.name} />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {business.long_description && (
              <section>
                <h2 className="mb-3 font-serif text-xl font-bold tracking-tight">Sobre nosotros</h2>
                <p className="whitespace-pre-line text-muted-foreground">
                  {business.long_description}
                </p>
              </section>
            )}

            {business.services.length > 0 && (
              <section className="border-t border-border pt-8">
                <h2 className="mb-3 font-serif text-xl font-bold tracking-tight">Servicios</h2>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((s) => (
                    <Badge key={s.id}>{s.name}</Badge>
                  ))}
                </div>
              </section>
            )}

            {business.service_areas.length > 0 && (
              <section className="border-t border-border pt-8">
                <h2 className="mb-3 font-serif text-xl font-bold tracking-tight">Zonas de cobertura</h2>
                <div className="flex flex-wrap gap-2">
                  {business.service_areas.map((a) => (
                    <Badge key={a.id} variant="outline">
                      {a.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {showGallery && (
              <section className="border-t border-border pt-8">
                <h2 className="mb-3 font-serif text-xl font-bold tracking-tight">Galería</h2>
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
                {mapsUrl ? (
                  <TrackedLink
                    businessId={business.id}
                    event="directions_click"
                    href={mapsUrl}
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    {business.address}
                  </TrackedLink>
                ) : (
                  <p className="text-sm text-muted-foreground">{business.address}</p>
                )}
              </section>
            )}

            {business.hours.length > 0 && (
              <section>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" /> Horarios
                </h2>
                <p
                  className={cn(
                    "mb-3 text-sm font-semibold",
                    openNow ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {openNow ? "Abierto ahora" : "Cerrado ahora"}
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {sortedHours.map((h) => (
                    <li
                      key={h.id}
                      className={cn(
                        "flex justify-between gap-4",
                        h.day_of_week === now.day && "font-semibold text-foreground"
                      )}
                    >
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

            {business.website && (
              <TrackedLink
                businessId={business.id}
                event="website_click"
                href={business.website}
                className="flex items-center gap-2 text-sm font-medium hover:text-brand-primary"
              >
                <Globe className="h-4 w-4" /> Sitio web
              </TrackedLink>
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

            <Link href="/buscar" className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Ver más negocios
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
