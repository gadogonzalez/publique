import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { CategoryShortcut } from "@/components/category-shortcut";
import { BusinessDiscoveryGrid } from "@/components/business-discovery-grid";
import { ZoneTile } from "@/components/zone-tile";
import { CommunityBanner } from "@/components/community-banner";
import { DiscoveryTiles } from "@/components/home/discovery-tiles";
import { BrandStatement } from "@/components/home/brand-statement";
import { CONTENT, WIDE } from "@/components/home/width";
import { getCategories } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { search } from "@/lib/search";

const DISCOVERY_COUNT = 9;

export default async function HomePage() {
  const [categories, localities, { items }] = await Promise.all([
    getCategories(),
    getLocalities(),
    search({ page: 1, pageSize: DISCOVERY_COUNT }),
  ]);
  const businesses = await getBusinessesByIds(items.map((i) => i.id));

  return (
    <div>
      <HeroSearch />

      <section className={`${CONTENT} py-16 sm:py-20`}>
        <DiscoveryTiles />
      </section>

      {categories.length > 0 && (
        <section className={`${CONTENT} pb-16 sm:pb-20`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold tracking-tight">Explorá por categoría</h2>
            <Link
              href="/buscar"
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="-mx-6 flex gap-8 overflow-x-auto px-6 sm:mx-0 sm:grid sm:grid-cols-8 sm:gap-6 sm:overflow-visible sm:px-0">
            {categories.map((category) => (
              <div key={category.id} className="shrink-0 sm:shrink">
                <CategoryShortcut category={category} />
              </div>
            ))}
          </div>
        </section>
      )}

      {businesses.length > 0 && (
        <section className={`${WIDE} pb-16 sm:pb-20`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold tracking-tight">Negocios destacados</h2>
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

      <BrandStatement />

      {localities.length > 0 && (
        <section className={`${WIDE} py-16 sm:py-20`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold tracking-tight">Explorá por zona</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {localities.map((locality, i) => (
              <ZoneTile key={locality.id} locality={locality} index={i} />
            ))}
          </div>
        </section>
      )}

      <CommunityBanner />
    </div>
  );
}
