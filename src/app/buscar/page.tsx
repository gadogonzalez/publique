import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CategoryPictogram } from "@/components/category-icon";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search-bar";
import { SearchFilters } from "@/components/search-filters";
import { BusinessFeaturedAndList } from "@/components/business-discovery-grid";
import { HERO_GRID } from "@/components/home/width";
import { search } from "@/lib/search";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { getCategories, getCategoryBySlug } from "@/lib/data/taxonomy";
import { getLocalities, getLocationById } from "@/lib/data/locations";
import { trackServer } from "@/lib/analytics/server";

const PAGE_SIZE = 12;
const PAGE_LINK =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 font-medium text-muted-foreground hover:bg-secondary hover:text-foreground";

/** First, last, and the current page ±1, with null marking a gap. */
function pageWindow(page: number, total: number): (number | null)[] {
  const pages: (number | null)[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== null) pages.push(null);
  }
  return pages;
}

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
  const pageHref = (p: number) =>
    `/buscar?${new URLSearchParams({
      ...(query ? { q: query } : {}),
      ...(categorySlug ? { categoria: categorySlug } : {}),
      ...(locationId ? { zona: locationId } : {}),
      ...(p > 1 ? { page: String(p) } : {}),
    }).toString()}`;

  return (
    <div className={`${HERO_GRID} py-8`}>
      <div className="max-w-xl">
        <SearchBar key={query ?? ""} defaultValue={query} />
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {query ? (
            <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
              Resultados para &ldquo;{query}&rdquo;
            </h1>
          ) : (
            <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">Todos los negocios</h1>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "resultado" : "resultados"}
            {category ? <> en {category.name}</> : null}
            {location ? <> · {location.name}</> : null}
          </p>
        </div>

        <SearchFilters categories={categories} localities={localities} />
      </div>

      {businesses.length === 0 ? (
        <div className="py-14">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">
              No encontramos resultados{query ? <> para &ldquo;{query}&rdquo;</> : null}.
            </span>{" "}
            Probá con otra palabra o elegí una categoría.
          </p>
          {(query || category || location) && (
            <Link href="/buscar" className={cn(buttonVariants({ variant: "brand" }), "mt-5 rounded-full")}>
              Ver todos los negocios
            </Link>
          )}
          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categorias/${c.slug}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium hover:border-brand-primary"
                >
                  <CategoryPictogram icon={c.icon} className="h-4 w-4 text-brand-primary" />
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <BusinessFeaturedAndList businesses={businesses} />
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Paginación"
          className="mt-10 flex flex-wrap items-center justify-center gap-1 border-t border-border pt-6 text-sm"
        >
          {page > 1 && (
            <Link href={pageHref(page - 1)} className={PAGE_LINK}>
              Anterior
            </Link>
          )}
          {pageWindow(page, totalPages).map((p, i) =>
            p === null ? (
              <span key={`gap-${i}`} aria-hidden className="px-2 text-muted-foreground">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={pageHref(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Página ${p}`}
                className={cn(PAGE_LINK, p === page && "bg-foreground text-background hover:bg-foreground")}
              >
                {p}
              </Link>
            )
          )}
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className={PAGE_LINK}>
              Siguiente
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
