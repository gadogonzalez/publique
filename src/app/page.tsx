import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { CategoryShortcut } from "@/components/category-shortcut";
import { BusinessDiscoveryGrid } from "@/components/business-discovery-grid";
import { ZoneTile } from "@/components/zone-tile";
import { CommunityBanner } from "@/components/community-banner";
import { getCategories } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { search } from "@/lib/search";

const DISCOVERY_COUNT = 8;

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

      {categories.length > 0 && (
        <section className="container border-t border-border py-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Explorá por categoría</h2>
            <Link
              href="/buscar"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Ver todas las categorías <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {categories.map((category) => (
              <CategoryShortcut key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {businesses.length > 0 && (
        <section className="container border-t border-border py-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Negocios en tu zona</h2>
          </div>
          <BusinessDiscoveryGrid businesses={businesses} />
          <div className="mt-10 flex justify-center">
            <Link
              href="/buscar"
              className="flex items-center gap-1 text-sm font-medium hover:text-primary"
            >
              Ver todos los negocios <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      {localities.length > 0 && (
        <section className="container border-t border-border py-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Explorá por zona</h2>
            <Link
              href="/buscar"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Ver todas las zonas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {localities.map((locality) => (
              <ZoneTile key={locality.id} locality={locality} />
            ))}
          </div>
        </section>
      )}

      <CommunityBanner />
    </div>
  );
}
