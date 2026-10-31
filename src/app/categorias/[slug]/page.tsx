import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import { BusinessFeaturedAndList } from "@/components/business-discovery-grid";
import { HERO_GRID } from "@/components/home/width";
import { getCategoryBySlug } from "@/lib/data/taxonomy";
import { getBusinessesByIds } from "@/lib/data/businesses";
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

  const { items, totalCount } = await search({ categorySlug: slug, page: 1, pageSize: PAGE_SIZE });
  const businesses = await getBusinessesByIds(items.map((i) => i.id));

  await trackServer({
    type: "search_performed",
    categoryId: category.id,
    metadata: { resultCount: totalCount },
  });

  const [heroBusiness, ...rest] = businesses;

  return (
    <div className={`${HERO_GRID} py-8`}>
      <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">{category.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {totalCount} {totalCount === 1 ? "resultado" : "resultados"}
      </p>

      {heroBusiness ? (
        <>
          <Link
            href={`/negocios/${heroBusiness.slug}`}
            className="group relative mt-8 block overflow-hidden rounded-2xl"
          >
            <FeaturedBusinessCoverOnly
              business={heroBusiness}
              className="aspect-[4/3] w-full sm:aspect-[21/9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
              <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                Lo más destacado en {category.name}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight sm:text-4xl">
                {heroBusiness.name}
              </h2>
              {heroBusiness.location && (
                <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
                  <MapPin className="h-3.5 w-3.5" />
                  {heroBusiness.location.name}
                </p>
              )}
              {heroBusiness.short_description && (
                <p className="mt-1 line-clamp-2 max-w-xl text-sm text-white/90">
                  {heroBusiness.short_description}
                </p>
              )}
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                Ver negocio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="mt-10">
              <BusinessFeaturedAndList businesses={rest} />
            </div>
          )}
        </>
      ) : (
        <p className="mt-10 text-muted-foreground">
          <span className="font-medium text-foreground">Todavía no hay negocios en esta categoría.</span>{" "}
          Volvé pronto o explorá otras categorías.
        </p>
      )}
    </div>
  );
}
