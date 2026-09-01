import type { Metadata } from "next";
import { SearchBar } from "@/components/search-bar";
import { SearchFilters } from "@/components/search-filters";
import { BusinessCard } from "@/components/business-card";
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
    <div className="container py-8">
      <div className="mb-6 max-w-xl">
        <SearchBar defaultValue={query} size="default" />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {query ? (
              <>
                Resultados para <strong className="text-foreground">“{query}”</strong>
              </>
            ) : (
              "Todos los negocios"
            )}
            {category ? <> en {category.name}</> : null}
            {location ? <> · {location.name}</> : null}
          </p>
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "resultado" : "resultados"}
          </p>
        </div>
        <SearchFilters categories={categories} localities={localities} />
      </div>

      {businesses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          <p className="font-medium text-foreground">
            No encontramos resultados todavía.
          </p>
          <p className="mt-1 text-sm">
            Probá con otra palabra, o explorá por categoría y zona.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex justify-center gap-2 text-sm">
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
                  ? "rounded-md bg-primary px-3 py-1.5 text-primary-foreground"
                  : "rounded-md border border-border px-3 py-1.5 hover:border-primary"
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
