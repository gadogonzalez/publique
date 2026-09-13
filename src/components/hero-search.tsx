import Image from "next/image";
import Link from "next/link";
import { HeroSearchBar } from "@/components/home/hero-search-bar";
import { HERO_GRID } from "@/components/home/width";
import type { Location } from "@/lib/types/database";

const POPULAR_SEARCHES = ["Veterinaria", "Plomero", "Comida", "Electricista", "Gimnasio"];

/** One photographic hero canvas -- the Mendoza photo is the entire hero,
 * full-bleed, not a card or a right-side column. Nav floats on top of it
 * (see SiteHeader, positioned absolute over this section), so hero
 * content gets extra top padding to clear it instead of the page adding
 * a spacer above the hero. Content shares the same HERO_GRID as the nav
 * so their left edges align, and is capped well below the full-bleed
 * image width so it doesn't stretch on large desktops. */
export function HeroSearch({ localities = [] }: { localities?: Location[] }) {
  return (
    <section className="relative min-h-[680px] w-full overflow-hidden md:min-h-[700px] lg:min-h-[720px] xl:min-h-[760px]">
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

      <div className={`relative z-10 flex h-full items-start ${HERO_GRID}`}>
        <div className="w-full max-w-2xl pt-32 lg:max-w-3xl lg:pt-40">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-background/75">
            Comercio local, gente real
          </p>
          <h1 className="mt-4 font-serif font-bold leading-[1.08] tracking-tight text-background text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl">
            Encontrá lo que necesitás,
            <br />
            cerca tuyo.
          </h1>
          <p className="mt-4 max-w-md text-base text-background/85 sm:text-lg">
            Descubrí negocios y servicios de tu barrio. Todo en un solo
            lugar.
          </p>

          <div className="mt-7 max-w-2xl lg:max-w-3xl">
            <HeroSearchBar localities={localities} />
          </div>

          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-background/85">
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
