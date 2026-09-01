import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { BusinessCard } from "@/components/business-card";
import { getCategories } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { getFeaturedBusinesses } from "@/lib/data/businesses";

export default async function HomePage() {
  const [categories, localities, featured] = await Promise.all([
    getCategories(),
    getLocalities(),
    getFeaturedBusinesses(6),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-b from-secondary to-background py-14 sm:py-20">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            ¿Qué necesitás?
          </h1>
          <p className="max-w-xl text-muted-foreground sm:text-lg">
            Contanos qué te pasa y te ayudamos a encontrar, cerca tuyo, quién
            puede resolverlo. Plomeros, electricistas, viandas, mecánicos y
            mucho más en Guaymallén.
          </p>
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <h2 className="mb-4 text-lg font-semibold">Categorías populares</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/buscar?categoria=${category.slug}`}
              className="rounded-lg border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-10">
        <h2 className="mb-4 text-lg font-semibold">Zonas</h2>
        <div className="flex flex-wrap gap-2">
          {localities.map((locality) => (
            <Link
              key={locality.id}
              href={`/buscar?zona=${locality.id}`}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary hover:text-primary"
            >
              {locality.name}
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container py-10">
          <h2 className="mb-4 text-lg font-semibold">Negocios destacados</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      <section className="container py-14">
        <div className="rounded-2xl bg-secondary p-8 text-center sm:p-12">
          <h2 className="text-xl font-semibold">¿Qué es Publique?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Publique es una guía local pensada para que encuentres, en
            segundos, a los negocios y profesionales de tu barrio: sin
            vueltas, con WhatsApp y teléfono a un clic de distancia.
          </p>
        </div>
      </section>
    </div>
  );
}
