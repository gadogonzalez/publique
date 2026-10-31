import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { FeaturedBusinessCard, FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import { BusinessListRow } from "@/components/home/business-list-row";
import { getCategoryBySlug } from "@/lib/data/taxonomy";
import { getPrimaryMarket } from "@/lib/data/locations";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { getFeaturedForCategory } from "@/lib/data/featured";
import { search } from "@/lib/search";
import { trackServer } from "@/lib/analytics/server";

const PAGE_SIZE = 25;

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

  const market = await getPrimaryMarket();
  const [{ primary, secondary }, { items }] = await Promise.all([
    market
      ? getFeaturedForCategory(category.id, market.id)
      : Promise.resolve({ primary: null, secondary: [] }),
    search({ categorySlug: slug, page: 1, pageSize: PAGE_SIZE }),
  ]);

  const allBusinesses = await getBusinessesByIds(items.map((i) => i.id));
  const featuredIds = new Set([
    ...(primary ? [primary.id] : []),
    ...secondary.map((b) => b.id),
  ]);
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
    <div className="container py-8">
      <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {category.description ?? `Descubrí ${category.name.toLowerCase()} en Guaymallén.`}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {totalShown} {totalShown === 1 ? "resultado" : "resultados"}
      </p>

      {primary && (
        <Link
          href={`/negocios/${primary.slug}`}
          className="group relative mt-8 block overflow-hidden rounded-2xl"
        >
          <FeaturedBusinessCoverOnly business={primary} className="aspect-[4/3] w-full sm:aspect-[21/9]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
            <p className="text-xs font-medium uppercase tracking-wider text-white/80">
              Lo más destacado en {category.name}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight sm:text-4xl">
              {primary.name}
            </h2>
            {primary.location && (
              <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
                <MapPin className="h-3.5 w-3.5" />
                {primary.location.name}
              </p>
            )}
            {primary.short_description && (
              <p className="mt-1 line-clamp-2 max-w-xl text-sm text-white/90">
                {primary.short_description}
              </p>
            )}
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
              Conocer negocio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      )}

      {secondary.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-serif text-xl font-bold tracking-tight">Negocios destacados</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {secondary.map((business) => (
              <FeaturedBusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

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
        !primary &&
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
