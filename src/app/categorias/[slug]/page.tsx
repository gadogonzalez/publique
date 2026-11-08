import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import { FeaturedDestacadosCarousel } from "@/components/home/featured-carousel";
import { BusinessList } from "@/components/business-discovery-grid";
import { buttonVariants } from "@/components/ui/button";
import { HERO_GRID } from "@/components/home/width";
import { getCategoryBySlug } from "@/lib/data/taxonomy";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { byExposure, getPlanCapabilities } from "@/lib/plans";
import { search } from "@/lib/search";
import { trackServer } from "@/lib/analytics/server";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;
// Same cap as the homepage carousel (3 pages of 4).
const SECONDARY_COUNT = 12;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: category.name };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { items, totalCount } = await search({ categorySlug: slug, page: 1, pageSize: PAGE_SIZE });
  const allBusinesses = await getBusinessesByIds(items.map((i) => i.id));

  // Destacados: any paid plan with a logo and a real cover photo, higher
  // plans first (Premium > Destacado), relevance order within each plan.
  // The first one is the hero; the next few go in the carousel.
  const eligible = allBusinesses
    .filter((b) => getPlanCapabilities(b.plan).canBeFeatured && !!b.logo_url && !!b.cover_image_url)
    .sort(byExposure);
  const hero = eligible[0] ?? null;
  const secondary = eligible.slice(1, 1 + SECONDARY_COUNT);

  const featuredIds = new Set([...(hero ? [hero.id] : []), ...secondary.map((b) => b.id)]);
  // Rest of the list, also by plan (Premium > Destacado > Básico) with
  // relevance order kept within each. Ordering only -- no plan label shown.
  const listBusinesses = allBusinesses
    .filter((b) => !featuredIds.has(b.id))
    .sort(byExposure);
  const totalShown = listBusinesses.length + featuredIds.size;
  const hasMore = totalCount > allBusinesses.length;

  await trackServer({
    type: "search_performed",
    categoryId: category.id,
    metadata: { resultCount: totalShown },
  });

  return (
    <div className={`${HERO_GRID} py-8`}>
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {category.description ?? `Descubrí ${category.name.toLowerCase()} en Guaymallén.`}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {totalCount} {totalCount === 1 ? "negocio" : "negocios"}
      </p>

      {hero && (
        <Link
          href={`/negocios/${hero.slug}`}
          className="group relative mt-8 block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          <FeaturedBusinessCoverOnly
            business={hero}
            className="aspect-[4/5] w-full rounded-2xl sm:aspect-[16/9] lg:aspect-[2/1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:p-12">
            <p className="text-sm font-medium text-white/85">Lo más destacado en {category.name}</p>
            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              {hero.name}
            </h2>
            {hero.location && (
              <p className="mt-2 flex items-center gap-1 text-sm text-white/90 sm:text-base">
                <MapPin className="h-4 w-4" />
                {hero.location.name}
              </p>
            )}
            {hero.short_description && (
              <p className="mt-2 line-clamp-2 max-w-xl text-sm text-white/85 sm:text-base">
                {hero.short_description}
              </p>
            )}
            <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-foreground">
              Conocer negocio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      )}

      <section className="mt-16 sm:mt-20">
        {secondary.length > 0 ? (
          <FeaturedDestacadosCarousel
            businesses={secondary}
            description={`Una selección de ${category.name.toLowerCase()} destacados de Guaymallén.`}
            moreHref={`/buscar?categoria=${category.slug}`}
            moreLabel={`Ver todos los negocios de ${category.name}`}
          />
        ) : (
          <>
            <h2 className="font-serif text-2xl font-bold tracking-tight">Negocios destacados</h2>
            <div className="mt-6 rounded-2xl bg-brand-primary-soft p-6 sm:p-8">
              <h3 className="font-serif text-lg font-bold tracking-tight">¿Querés aparecer acá?</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Destacá tu negocio en {category.name} y aparecé primero cuando la gente busca.
              </p>
              <Link href="/para-negocios#planes" className={cn(buttonVariants({ variant: "brand" }), "mt-5")}>
                Ver planes
              </Link>
            </div>
          </>
        )}
      </section>

      {listBusinesses.length > 0 ? (
        <section className="mt-16 border-t border-border pt-16 sm:mt-20 sm:pt-20">
          <h2 className="mb-6 font-serif text-2xl font-bold tracking-tight">Todos los negocios</h2>
          <BusinessList businesses={listBusinesses} />
          {hasMore && (
            <Link href={`/buscar?categoria=${category.slug}`} className={cn(buttonVariants({ variant: "outline" }), "mt-8")}>
              Ver todos los negocios de {category.name}
            </Link>
          )}
        </section>
      ) : (
        !hero &&
        secondary.length === 0 && (
          <p className="mt-16 text-muted-foreground">
            <span className="font-medium text-foreground">Todavía no hay negocios en esta categoría.</span>{" "}
            <Link href="/categorias" className="font-medium text-brand-primary hover:underline">
              Explorá otras categorías
            </Link>
          </p>
        )
      )}
    </div>
  );
}
