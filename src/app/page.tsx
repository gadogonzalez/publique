import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { CategoryShortcut } from "@/components/category-shortcut";
import { BusinessCard } from "@/components/business-card";
import { BusinessStory } from "@/components/business-story";
import { getCategories } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getBusinessesByIds } from "@/lib/data/businesses";
import { search } from "@/lib/search";

const DISCOVERY_COUNT = 12;

export default async function HomePage() {
  const [categories, localities, { items }] = await Promise.all([
    getCategories(),
    getLocalities(),
    search({ page: 1, pageSize: DISCOVERY_COUNT }),
  ]);
  const businesses = await getBusinessesByIds(items.map((i) => i.id));
  const [spotlight, ...grid] = businesses;

  return (
    <div>
      <section className="container py-8 sm:py-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Guaymallén, Mendoza
        </p>
        <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
          ¿Qué necesitás?
        </h1>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Contanos qué te pasa y te ayudamos a encontrar, cerca tuyo, quién
          puede resolverlo.
        </p>
        <div className="mt-4 max-w-2xl">
          <SearchBar />
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container border-t border-border py-8">
          <h2 className="mb-5 text-sm font-semibold">Explorá por rubro</h2>
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {categories.map((category) => (
              <CategoryShortcut key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {localities.length > 0 && (
        <section className="container border-t border-border py-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-2 text-sm font-semibold">Explorá por zona</h2>
            {localities.map((locality) => (
              <Link
                key={locality.id}
                href={`/buscar?zona=${locality.id}`}
                className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary hover:text-primary"
              >
                {locality.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {grid.length > 0 && (
        <section className="container border-t border-border py-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Negocios en tu zona</h2>
            <Link href="/buscar" className="text-sm font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {spotlight && (
        <section className="container border-t border-border py-12">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recomendado
          </p>
          <BusinessStory business={spotlight} />
        </section>
      )}
    </div>
  );
}
