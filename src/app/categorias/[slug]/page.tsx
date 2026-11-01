import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import { FeaturedCarouselCard } from "@/components/home/featured-carousel-card";
import { BusinessListRow } from "@/components/home/business-list-row";
import { buttonVariants } from "@/components/ui/button";
import { HERO_GRID } from "@/components/home/width";
import { getCategoryBySlug } from "@/lib/data/taxonomy";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { getPlanCapabilities } from "@/lib/plans";
import { search } from "@/lib/search";
import { trackServer } from "@/lib/analytics/server";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;
const SECONDARY_COUNT = 4;

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

  const { items } = await search({ categorySlug: slug, page: 1, pageSize: PAGE_SIZE });
  const allBusinesses = await getBusinessesByIds(items.map((i) => i.id));

  // Same destacado rule as the homepage: paid plan + logo + a real cover
  // photo (see src/lib/plans.ts) -- no separate per-category assignment
  // step, a business just has to be plan-pago and fully set up. First
  // eligible business (already relevance-ordered by search()) is the
  // hero; the next few are the secondary row.
  const eligible = allBusinesses.filter(
    (b) => getPlanCapabilities(b.plan).canBeFeatured && !!b.logo_url && !!b.cover_image_url
  );
  const hero = eligible[0] ?? null;
  const secondary = eligible.slice(1, 1 + SECONDARY_COUNT);

  const featuredIds = new Set([...(hero ? [hero.id] : []), ...secondary.map((b) => b.id)]);
  // Paid-plan businesses (not already shown as destacados) before free-plan
  // ones -- same relevance order within each group, just grouped. No
  // "Gratis"/"Básico" label shown to the consumer, this is ordering only.
  const listBusinesses = allBusinesses
    .filter((b) => !featuredIds.has(b.id))
    .sort((a, b) => Number(a.plan?.is_free ?? true) - Number(b.plan?.is_free ?? true));
  const totalShown = listBusinesses.length + featuredIds.size;

  await trackServer({
    type: "search_performed",
    categoryId: category.id,
    metadata: { resultCount: totalShown },
  });

  return (
    <div className={`${HERO_GRID} py-8`}>
      <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {category.description ?? `Descubrí ${category.name.toLowerCase()} en Guaymallén.`}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {totalShown} {totalShown === 1 ? "resultado" : "resultados"}
      </p>

      {hero && (
        <Link
          href={`/negocios/${hero.slug}`}
          className="group relative mt-8 block overflow-hidden rounded-2xl"
        >
          <FeaturedBusinessCoverOnly business={hero} className="aspect-[4/3] w-full sm:aspect-[21/9]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
            <p className="text-xs font-medium uppercase tracking-wider text-white/80">
              Lo más destacado en {category.name}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight sm:text-4xl">{hero.name}</h2>
            {hero.location && (
              <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
                <MapPin className="h-3.5 w-3.5" />
                {hero.location.name}
              </p>
            )}
            {hero.short_description && (
              <p className="mt-1 line-clamp-2 max-w-xl text-sm text-white/90">
                {hero.short_description}
              </p>
            )}
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
              Conocer negocio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      )}

      <section className="mt-10">
        <h2 className="mb-5 font-serif text-xl font-bold tracking-tight">Negocios destacados</h2>
        {secondary.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {secondary.map((business) => (
              <FeaturedCarouselCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-primary/40 bg-brand-primary-soft p-8 text-center">
            <h3 className="font-serif text-lg font-bold tracking-tight text-brand-primary">
              ¿Querés aparecer como destacado?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Consultá por nuestras promociones para destacar tu negocio en {category.name}.
            </p>
            <Link
              href="/para-negocios#planes"
              className={cn(buttonVariants({ variant: "brand" }), "mt-4 rounded-full")}
            >
              Consultar promociones
            </Link>
          </div>
        )}
      </section>

      {listBusinesses.length > 0 ? (
        <section className="mt-10 border-t border-border pt-10">
          <h2 className="mb-5 font-serif text-xl font-bold tracking-tight">Todos los negocios</h2>
          {/* Mobile: plain stacked list. Desktop: boxed cards, up to 3 per
              row, wrapping to further rows -- a single column reads as
              too sparse at that width. */}
          <div className="sm:hidden">
            {listBusinesses.map((business) => (
              <BusinessListRow key={business.id} business={business} />
            ))}
          </div>
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {listBusinesses.map((business) => (
              <BusinessListRow key={business.id} business={business} variant="card" />
            ))}
          </div>
        </section>
      ) : (
        !hero &&
        secondary.length === 0 && (
          <p className="mt-10 text-muted-foreground">
            <span className="font-medium text-foreground">
              Todavía no hay negocios en esta categoría.
            </span>{" "}
            Volvé pronto o explorá otras categorías.
          </p>
        )
      )}
    </div>
  );
}
