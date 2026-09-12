import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { WIDE } from "@/components/home/width";

const POPULAR_SEARCHES = ["electricista", "plomero", "gomería", "viandas", "celulares"];

/** One cohesive photographic hero surface (not a text column + image
 * column) -- the photo IS the hero, content sits on top of it behind a
 * gradient scrim for legibility. Wide module inside the global grid, not
 * edge-to-edge (see PUBLIQUE_STYLE_GUIDE.md §8 correction). */
export function HeroSearch() {
  return (
    <section className="bg-background py-8 sm:py-10 lg:py-14">
      <div className={WIDE}>
        <div className="relative flex min-h-[520px] items-end overflow-hidden rounded-[28px] lg:min-h-[680px] lg:items-center">
          <Image
            src="/hero-guaymallen.jpg"
            alt="Vista de Guaymallén, Mendoza, con la cordillera de fondo"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent lg:bg-gradient-to-r lg:from-black/75 lg:via-black/35 lg:to-transparent/0"
          />

          <div className="relative z-10 max-w-lg p-6 text-background sm:p-10 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-background/80">
              Comercio local, gente real
            </p>
            <h1 className="mt-3 font-serif font-bold leading-[1.05] tracking-tight text-[clamp(2.5rem,5vw,3.75rem)]">
              Encontrá lo que necesitás, cerca tuyo.
            </h1>
            <p className="mt-4 text-base text-background/85 sm:text-lg">
              Descubrí negocios y servicios de tu barrio. Todo en un solo
              lugar.
            </p>

            <div className="mt-6">
              <SearchBar />
            </div>

            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-background/80">
              <span className="mr-0.5">Búsquedas populares:</span>
              {POPULAR_SEARCHES.map((q) => (
                <Link
                  key={q}
                  href={`/buscar?q=${encodeURIComponent(q)}`}
                  className="rounded-full bg-background/15 px-3 py-1 text-xs font-medium hover:bg-background/25"
                >
                  {q}
                </Link>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
