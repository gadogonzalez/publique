import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { CategoryShortcut } from "@/components/category-shortcut";
import { BusinessDiscoveryGrid } from "@/components/business-discovery-grid";
import { ZoneTile } from "@/components/zone-tile";
import { CommunityBanner } from "@/components/community-banner";
import { EditorialSpotlight } from "@/components/home/editorial-spotlight";
import { MotionReveal } from "@/components/home/motion-reveal";
import { getCategories } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getBusinessesByIds, getFeaturedBusinesses } from "@/lib/data/businesses";
import { search } from "@/lib/search";

const DISCOVERY_COUNT = 9;

export default async function HomePage() {
  const [categories, localities, { items }, [spotlightBusiness]] = await Promise.all([
    getCategories(),
    getLocalities(),
    search({ page: 1, pageSize: DISCOVERY_COUNT }),
    getFeaturedBusinesses(1),
  ]);
  const businesses = await getBusinessesByIds(items.map((i) => i.id));

  return (
    <div>
      <HeroSearch />

      {categories.length > 0 && (
        <section className="container border-t border-border py-10 sm:py-14">
          <h2 className="mb-6 font-serif text-xl font-bold tracking-tight sm:text-2xl">
            Explorá por categoría
          </h2>
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8">
            {categories.map((category) => (
              <CategoryShortcut key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {localities.length > 0 && (
        <section className="container border-t border-border py-10 sm:py-14">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {localities.map((locality) => (
              <ZoneTile key={locality.id} locality={locality} />
            ))}
          </div>
        </section>
      )}

      {businesses.length > 0 && (
        <section className="container border-t border-border py-10 sm:py-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold tracking-tight sm:text-2xl">
              Negocios destacados
            </h2>
          </div>
          <BusinessDiscoveryGrid businesses={businesses} />
          <div className="mt-10 flex justify-center">
            <Link
              href="/buscar"
              className="flex items-center gap-1 text-sm font-medium hover:text-brand-pink"
            >
              Ver todos los negocios <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      {spotlightBusiness && <EditorialSpotlight business={spotlightBusiness} />}

      <MotionReveal>
        <CommunityBanner />
      </MotionReveal>
    </div>
  );
}
