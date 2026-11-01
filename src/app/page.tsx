import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { CategoryCard } from "@/components/category-card";
import { FeaturedDestacadosCarousel } from "@/components/home/featured-carousel";
import { PromoBanner } from "@/components/home/promo-banner";
import { BrandStatement } from "@/components/home/brand-statement";
import { HERO_GRID } from "@/components/home/width";
import { getCategories, getCategoryBusinessCounts } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getBusinessesByIds, getBusinessBySlug } from "@/lib/data/businesses";
import { search } from "@/lib/search";
import { getPlanCapabilities } from "@/lib/plans";

// Carousel supports up to 3 pages of 4 (12 slots).
const DISCOVERY_COUNT = 12;
// Fetched wider than DISCOVERY_COUNT because "destacados" only shows
// paid-plan businesses with a logo and a cover photo (canBeFeatured +
// logo_url + cover_image_url) -- a shallow pool would often come up
// short after that filter.
const DISCOVERY_POOL_SIZE = 48;

export default async function HomePage() {
  const [categories, categoryCounts, localities, { items }, promoBusiness] = await Promise.all([
    getCategories(),
    getCategoryBusinessCounts(),
    getLocalities(),
    search({ page: 1, pageSize: DISCOVERY_POOL_SIZE }),
    getBusinessBySlug("patitas-pet-shop"),
  ]);
  const pool = await getBusinessesByIds(items.map((i) => i.id));

  // Only plan-pago businesses with both a logo and a real cover photo are
  // eligible to be shown as "destacados" -- free-plan businesses (no
  // custom logo allowed) never belong here, and one without its own cover
  // photo would otherwise fall back to a shared category stock photo,
  // making unrelated businesses look identical in this section.
  const featuredBusinesses = pool
    .filter(
      (b) => getPlanCapabilities(b.plan).canBeFeatured && !!b.logo_url && !!b.cover_image_url
    )
    .slice(0, DISCOVERY_COUNT);

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
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-primary/40 bg-brand-primary-soft p-6 text-center text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-primary-foreground"
            >
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              <span className="font-serif text-base font-bold tracking-tight">Explorar todo</span>
            </Link>
          </div>
        </section>
      )}

      {featuredBusinesses.length > 0 && (
        <section className={`${HERO_GRID} pb-16 sm:pb-20`}>
          <FeaturedDestacadosCarousel businesses={featuredBusinesses} />
        </section>
      )}

      <section className={`${HERO_GRID} pb-16 sm:pb-20`}>
        <PromoBanner business={promoBusiness} />
      </section>

      <BrandStatement />
    </div>
  );
}
