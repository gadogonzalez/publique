import Image from "next/image";
import Link from "next/link";
import { HeroSearchBar } from "@/components/home/hero-search-bar";
import { HERO_GRID } from "@/components/home/width";
import type { Location } from "@/lib/types/database";

const POPULAR_SEARCHES = ["Veterinaria", "Plomero", "Comida", "Electricista", "Gimnasio"];

/** One photographic hero canvas -- the Mendoza photo is the entire hero,
 * full-bleed, not a card or a right-side column. Nav floats on top of it
 * (see SiteHeader, positioned fixed over this section). Content is a
 * centered composition (eyebrow/headline/description/search/popular)
 * directly over the photo, inside the same HERO_GRID the nav uses so
 * it never expands past that grid on large desktops. */
export function HeroSearch({ localities = [] }: { localities?: Location[] }) {
  return (
    <section className="relative h-[75vh] w-full overflow-hidden">
      <Image
        src="/hero-guaymallen.jpg"
        alt="Vista de Guaymallén, Mendoza, con la cordillera de fondo"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Photographic-feeling scrim: cooler/darker behind the content on
       * the left, clearing toward the photo on the right -- not a flat
       * UI gradient. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"
      />

      <div className={`relative z-10 flex h-full items-center ${HERO_GRID}`}>
        <div className="mx-auto mt-6 flex w-full max-w-[1000px] flex-col items-center text-center sm:mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-background/75">
            Comercio local, gente real
          </p>
          <h1 className="mt-4 max-w-4xl font-serif font-bold leading-[1.08] tracking-tight text-background text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl">
            Encontrá lo que necesitás, cerca tuyo.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-background/85 sm:text-lg">
            Descubrí negocios y servicios de tu barrio. Todo en un solo lugar.
          </p>

          <div className="mt-7 w-full max-w-4xl">
            <HeroSearchBar localities={localities} />
          </div>

          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-background/85">
            <span className="mr-0.5">Búsquedas populares:</span>
            {POPULAR_SEARCHES.map((q) => (
              <Link
                key={q}
                href={`/buscar?q=${encodeURIComponent(q)}`}
                className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium backdrop-blur-sm hover:bg-black/35"
              >
                {q}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
