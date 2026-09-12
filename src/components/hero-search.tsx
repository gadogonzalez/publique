import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { WIDE } from "@/components/home/width";

const POPULAR_SEARCHES = ["electricista", "plomero", "gomería", "viandas", "celulares"];

export function HeroSearch() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className={`${WIDE} relative grid grid-cols-1 items-center gap-10 py-16 lg:min-h-[720px] lg:grid-cols-2 lg:gap-8 lg:py-24`}>
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Comercio local, gente real
          </p>
          <h1 className="mt-4 font-serif text-[56px] font-bold leading-[0.95] tracking-tight sm:text-[72px] lg:text-[84px]">
            Encontrá lo que
            <br />
            necesitás, cerca tuyo.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
            Descubrí negocios y servicios de tu barrio. Todo en un solo lugar.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar />
          </div>

          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="mr-0.5">Búsquedas populares:</span>
            {POPULAR_SEARCHES.map((q) => (
              <Link
                key={q}
                href={`/buscar?q=${encodeURIComponent(q)}`}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-muted/70 hover:text-foreground"
              >
                {q}
              </Link>
            ))}
          </p>
        </div>

        {/* Breaks the grid on purpose -- bleeds past the content column
         * toward the viewport edge instead of sitting in a symmetric card. */}
        <div className="relative -mx-6 aspect-[4/3] overflow-hidden rounded-2xl sm:-mx-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:aspect-auto lg:w-[52%] lg:rounded-l-2xl lg:rounded-r-none">
          <Image
            src="/hero-guaymallen.jpg"
            alt="Vista de Guaymallén, Mendoza, con la cordillera de fondo"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Guaymallén, Mendoza
          </div>
        </div>
      </div>
    </section>
  );
}
