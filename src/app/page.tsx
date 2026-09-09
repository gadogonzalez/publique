import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { BusinessStory } from "@/components/business-story";
import { BusinessListing } from "@/components/business-listing";
import { getCategories } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getFeaturedBusinesses } from "@/lib/data/businesses";

const EXAMPLE_QUERIES = [
  "se me rompió la bomba de agua",
  "necesito un electricista",
  "viandas cerca de casa",
  "quién arregla celulares",
];

export default async function HomePage() {
  const [categories, localities, featured] = await Promise.all([
    getCategories(),
    getLocalities(),
    getFeaturedBusinesses(5),
  ]);

  const [lead, ...secondary] = featured;

  return (
    <div>
      <section className="container py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Guaymallén, Mendoza
          </p>
          <h1 className="font-serif text-4xl leading-[1.1] sm:text-6xl">
            ¿Qué necesitás?
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground sm:text-lg">
            Contanos qué te pasa y te ayudamos a encontrar, cerca tuyo, quién
            puede resolverlo.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
          <p className="mt-4 flex flex-wrap gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
            {EXAMPLE_QUERIES.map((q, i) => (
              <span key={q}>
                <Link
                  href={`/buscar?q=${encodeURIComponent(q)}`}
                  className="hover:text-primary hover:underline"
                >
                  {q}
                </Link>
                {i < EXAMPLE_QUERIES.length - 1 && <span className="ml-1.5">·</span>}
              </span>
            ))}
          </p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container border-t border-border py-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Categorías
          </p>
          <div className="flex gap-x-5 gap-y-2 overflow-x-auto whitespace-nowrap sm:flex-wrap sm:whitespace-normal">
            {categories.map((category, i) => (
              <span key={category.id} className="shrink-0">
                <Link
                  href={`/buscar?categoria=${category.slug}`}
                  className="text-base font-medium hover:text-primary"
                >
                  {category.name}
                </Link>
                {i < categories.length - 1 && (
                  <span className="ml-5 hidden text-border sm:inline">·</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {localities.length > 0 && (
        <section className="container border-t border-border py-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Zonas
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {localities.map((locality) => (
              <Link
                key={locality.id}
                href={`/buscar?zona=${locality.id}`}
                className="text-base font-medium hover:text-primary"
              >
                {locality.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {lead && (
        <section className="container border-t border-border py-14">
          <h2 className="mb-8 font-serif text-2xl">Recomendados en tu zona</h2>
          <BusinessStory business={lead} />
          {secondary.length > 0 && (
            <div className="mt-4 divide-y divide-border">
              {secondary.map((business) => (
                <BusinessListing key={business.id} business={business} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
