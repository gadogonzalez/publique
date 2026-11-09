import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { CategoryCard } from "@/components/category-card";
import { FeaturedTabs, type FeaturedTab } from "@/components/home/featured-tabs";
import { HomeBanners } from "@/components/home/home-banners";
import { BrandStatement } from "@/components/home/brand-statement";
import { HERO_GRID } from "@/components/home/width";
import { getCategories, getCategoryBusinessCounts, getTopSearchedCategoryIds } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getDestacadoBusinesses } from "@/lib/data/businesses";
import { getHomeBanners } from "@/lib/data/banners";
import { byExposure } from "@/lib/plans";

// Carousel supports up to 3 pages of 4 (12 slots).
const DESTACADOS_PER_TAB = 12;
// "Todas" + up to this many category filters.
const CATEGORY_TABS = 6;

export default async function HomePage() {
  const [categories, categoryCounts, localities, destacados, topSearched, banners] = await Promise.all([
    getCategories(),
    getCategoryBusinessCounts(),
    getLocalities(),
    getDestacadoBusinesses(),
    getTopSearchedCategoryIds(CATEGORY_TABS * 2),
    getHomeBanners(),
  ]);

  // Destacados: paid plans (Destacado + Premium) with logo and cover photo,
  // Premium first. Category filters = most searched categories that have
  // at least one destacado; padded with the categories with most
  // businesses while there's little search data.
  const ranked = [...destacados].sort(byExposure);
  const byCount = [...categories].sort((a, b) => (categoryCounts[b.id] ?? 0) - (categoryCounts[a.id] ?? 0));
  const candidateIds = [...new Set([...topSearched, ...byCount.map((c) => c.id)])];
  const categoryTabs: FeaturedTab[] = [];
  for (const id of candidateIds) {
    if (categoryTabs.length >= CATEGORY_TABS) break;
    const category = categories.find((c) => c.id === id);
    const inCategory = ranked.filter((b) => b.categories.some((c) => c.id === id));
    if (!category || inCategory.length === 0) continue;
    categoryTabs.push({
      id: category.id,
      label: category.name,
      moreHref: `/categorias/${category.slug}`,
      moreLabel: `Ver todo en ${category.name}`,
      businesses: inCategory.slice(0, DESTACADOS_PER_TAB),
    });
  }
  const tabs: FeaturedTab[] =
    ranked.length > 0
      ? [
          {
            id: "todas",
            label: "Todas",
            moreHref: "/buscar",
            moreLabel: "Ver todos los negocios",
            businesses: ranked.slice(0, DESTACADOS_PER_TAB),
          },
          ...categoryTabs,
        ]
      : [];

  const slides = banners.flatMap((b) =>
    b.business
      ? [
          {
            id: b.id,
            href: `/negocios/${b.business.slug}`,
            alt: b.alt_text || b.business.name,
            desktopSrc: b.desktop_image_url,
            mobileSrc: b.mobile_image_url,
          },
        ]
      : []
  );

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

      {tabs.length > 0 && (
        <section className={`${HERO_GRID} pb-16 sm:pb-20`}>
          <FeaturedTabs tabs={tabs} />
        </section>
      )}

      {slides.length > 0 && (
        <section className={`${HERO_GRID} pb-16 sm:pb-20`}>
          <HomeBanners slides={slides} />
        </section>
      )}

      <BrandStatement />
    </div>
  );
}
