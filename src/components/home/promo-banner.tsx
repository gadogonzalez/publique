import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import type { BusinessWithRelations } from "@/lib/types/database";

/** House ad for the paid plan / destacados system -- real businesses
 * already on the platform as the visual proof instead of stock photos.
 * Same destination as every other "Publicá/Sumá tu negocio" CTA. */
export function PromoBanner({ businesses }: { businesses: BusinessWithRelations[] }) {
  const showcased = businesses.slice(0, 4);
  if (showcased.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary to-[#2F8CFE] px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Para tu negocio
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Destacá tu negocio en Publiqué
          </h2>
          <p className="mt-3 text-white/90">
            Con el plan Básico aparecés con logo, galería de fotos y un lugar preferencial en tu
            categoría.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-white/90"
          >
            Destacá tu negocio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid w-full max-w-md grid-cols-4 gap-3 lg:w-auto">
          {showcased.map((business) => (
            <div key={business.id} className="aspect-square overflow-hidden rounded-xl ring-2 ring-white/40">
              <FeaturedBusinessCoverOnly business={business} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
