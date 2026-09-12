import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

const POPULAR_SEARCHES = ["electricista", "plomero", "viandas", "gomería", "arregla celulares"];

export function HeroSearch() {
  return (
    <section className="container grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[45%_55%] lg:gap-8 lg:py-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Comercio local, gente real
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
          Encontrá lo que necesitás, cerca tuyo.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Descubrí negocios y servicios de tu barrio. Tu barrio en un solo
          lugar.
        </p>

        <div className="mt-6">
          <SearchBar />
        </div>

        <p className="mt-4 truncate text-sm text-muted-foreground">
          Búsquedas populares:{" "}
          {POPULAR_SEARCHES.map((q, i) => (
            <span key={q}>
              <Link href={`/buscar?q=${encodeURIComponent(q)}`} className="hover:text-foreground">
                {q}
              </Link>
              {i < POPULAR_SEARCHES.length - 1 && <span className="mx-1.5">·</span>}
            </span>
          ))}
        </p>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-[5/4]">
        <Image
          src="/hero-guaymallen.jpg"
          alt="Vista de Guaymallén, Mendoza, con la cordillera de fondo"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
