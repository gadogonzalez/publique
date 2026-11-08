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

  // Only businesses whose plan includes homepage placement (Premium, see
  // plans.home_featured) with both a logo and a real cover photo are
  // eligible to be shown as "destacados" here -- one without its own cover
  // photo would otherwise fall back to a shared category stock photo,
  // making unrelated businesses look identical in this section.
  const featuredBusinesses = pool
    .filter(
      (b) => getPlanCapabilities(b.plan).canAppearOnHome && !!b.logo_url && !!b.cover_image_url
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
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-brand-primary"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors duration-300 group-hover:bg-brand-primary">
                <ArrowRight className="h-6 w-6 text-foreground transition-colors duration-300 group-hover:text-brand-primary-foreground" />
              </span>
              <span className="font-serif text-base font-bold leading-tight tracking-tight">Ver todas</span>
              <span className="text-xs text-muted-foreground">{categories.length} categorías</span>
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
