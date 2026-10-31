import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { CategoryCard } from "@/components/category-card";
import { BusinessDiscoveryGrid } from "@/components/business-discovery-grid";
import { BrandStatement } from "@/components/home/brand-statement";
import { HERO_GRID } from "@/components/home/width";
import { getCategories, getCategoryBusinessCounts } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { search } from "@/lib/search";

const DISCOVERY_COUNT = 9;

export default async function HomePage() {
  const [categories, categoryCounts, localities, { items }] = await Promise.all([
    getCategories(),
    getCategoryBusinessCounts(),
    getLocalities(),
    search({ page: 1, pageSize: DISCOVERY_COUNT }),
  ]);
  const businesses = await getBusinessesByIds(items.map((i) => i.id));

  return (
    <div>
      <HeroSearch localities={localities} />

      {categories.length > 0 && (
        <section className={`${HERO_GRID} pb-16 pt-16 sm:pb-20 sm:pt-20`}>
          <h2 className="mb-6 font-serif text-2xl font-bold tracking-tight">Explorá por categoría</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                count={categoryCounts[category.id] ?? 0}
              />
            ))}
            <Link
              href="/categorias"
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center text-primary transition-colors hover:bg-primary/10"
            >
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              <span className="font-serif text-base font-bold tracking-tight">Explorar todo</span>
            </Link>
          </div>
        </section>
      )}

      {businesses.length > 0 && (
        <section className={`${HERO_GRID} pb-16 sm:pb-20`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold tracking-tight">Negocios destacados</h2>
          </div>
          <BusinessDiscoveryGrid businesses={businesses} />
          <div className="mt-10 flex justify-center">
            <Link
              href="/buscar"
              className="flex items-center gap-1 text-sm font-medium hover:text-brand-primary"
            >
              Ver todos los negocios <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      <BrandStatement />
    </div>
  );
}
