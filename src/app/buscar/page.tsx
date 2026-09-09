import type { Metadata } from "next";
import { SearchBar } from "@/components/search-bar";
import { SearchFilters } from "@/components/search-filters";
import { BusinessListing } from "@/components/business-listing";
import { search } from "@/lib/search";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { getCategories, getCategoryBySlug } from "@/lib/data/taxonomy";
import { getLocalities, getLocationById } from "@/lib/data/locations";
import { trackServer } from "@/lib/analytics/server";

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Resultados de búsqueda",
};

interface BuscarPageProps {
  searchParams: Promise<{ q?: string; categoria?: string; zona?: string; page?: string }>;
}

export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || undefined;
  const categorySlug = params.categoria || undefined;
  const locationId = params.zona || undefined;
  const page = Number(params.page ?? "1") || 1;

  const [{ items, totalCount }, categories, localities, category, location] =
    await Promise.all([
      search({ query, categorySlug, locationId, page, pageSize: PAGE_SIZE }),
      getCategories(),
      getLocalities(),
      categorySlug ? getCategoryBySlug(categorySlug) : Promise.resolve(null),
      locationId ? getLocationById(locationId) : Promise.resolve(null),
    ]);

  const businesses = await getBusinessesByIds(items.map((i) => i.id));

  await Promise.all([
    trackServer({
      type: "search_performed",
      searchQuery: query,
      categoryId: category?.id,
      locationId: location?.id,
      metadata: { resultCount: totalCount },
    }),
    ...businesses.map((b) =>
      trackServer({ type: "business_impression", businessId: b.id, searchQuery: query })
    ),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="container py-10">
      <div className="max-w-xl">
        <SearchBar defaultValue={query} size="default" />
      </div>

      <div className="mt-8 border-t border-border pt-6">
        {query ? (
          <h1 className="font-serif text-2xl sm:text-3xl">
            Resultados para &ldquo;{query}&rdquo;
          </h1>
        ) : (
          <h1 className="font-serif text-2xl sm:text-3xl">Todos los negocios</h1>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "resultado" : "resultados"}
          {category ? <> en {category.name}</> : null}
          {location ? <> · {location.name}</> : null}
        </p>

        <div className="mt-4">
          <SearchFilters categories={categories} localities={localities} />
        </div>
      </div>

      {businesses.length === 0 ? (
        <p className="py-14 text-muted-foreground">
          <span className="font-medium text-foreground">
            No encontramos resultados todavía.
          </span>{" "}
          Probá con otra palabra, o explorá por categoría y zona.
        </p>
      ) : (
        <div className="mt-2 divide-y divide-border">
          {businesses.map((business) => (
            <BusinessListing key={business.id} business={business} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex justify-center gap-4 border-t border-border pt-6 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/buscar?${new URLSearchParams({
                ...(query ? { q: query } : {}),
                ...(categorySlug ? { categoria: categorySlug } : {}),
                ...(locationId ? { zona: locationId } : {}),
                page: String(p),
              }).toString()}`}
              className={
                p === page
                  ? "font-semibold text-primary underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {p}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
