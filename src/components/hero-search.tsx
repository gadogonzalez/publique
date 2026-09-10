import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { SearchBar } from "@/components/search-bar";

const POPULAR_SEARCHES = ["electricista", "plomero", "viandas", "gomería", "arregla celulares"];

/** Small hand-drawn-style arrow curving down-left, pointing from the
 * "Negocios de tu barrio" annotation toward the neighborhood photo. */
function AnnotationArrow() {
  return (
    <svg
      width="54"
      height="34"
      viewBox="0 0 54 34"
      fill="none"
      aria-hidden="true"
      className="text-foreground"
    >
      <path
        d="M48 4C36 4 14 8 8 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 24L7 27.5L6.5 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSearch() {
  return (
    <section className="relative h-[560px] w-full overflow-hidden bg-secondary sm:h-[640px] lg:h-[720px]">
      <Image
        src="/hero-guaymallen.jpg"
        alt="Vista de Guaymallén, Mendoza, con la cordillera de fondo"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[65%_center] sm:object-center"
      />

      {/* Warm cream fade from the left so the text stays readable without
       * darkening the whole photo. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.78) 32%, hsl(var(--background) / 0.15) 62%, transparent 78%)",
        }}
      />

      <div className="container relative z-10 flex h-full flex-col justify-center pt-16">
        <div className="max-w-md">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Comercio local, gente real
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.05] sm:text-5xl">
            Encontrá
            <br />
            lo que necesitás,
            <br />
            cerca tuyo
          </h1>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Servicios, comercios y profesionales en Guaymallén. Rápido, simple
            y confiable.
          </p>

          <div className="mt-6">
            <SearchBar />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Búsquedas populares:</span>
            {POPULAR_SEARCHES.map((q) => (
              <Link
                key={q}
                href={`/buscar?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs hover:border-foreground hover:text-foreground"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-10 top-24 z-10 hidden flex-col items-end sm:flex">
        <span className="-rotate-6 whitespace-nowrap font-serif text-lg italic text-foreground">
          Negocios
          <br />
          de tu barrio
        </span>
        <AnnotationArrow />
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground">
        <MapPin className="h-3.5 w-3.5" />
        Guaymallén, Mendoza
      </div>
    </section>
  );
}
