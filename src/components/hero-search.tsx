import Image from "next/image";
import Link from "next/link";
import { HeroSearchBar } from "@/components/home/hero-search-bar";
import { FULL_BLEED_GUTTER } from "@/components/home/width";
import type { Location } from "@/lib/types/database";

const POPULAR_SEARCHES = ["Veterinaria", "Plomero", "Comida", "Electricista", "Gimnasio"];

/** One photographic hero canvas -- the Mendoza photo is the entire hero,
 * full-bleed, not a card or a right-side column. Nav floats on top of it
 * (see SiteHeader); content here sits over the same photo on a gradient
 * scrim, left-anchored to the same page gutter as the nav. */
export function HeroSearch({ localities = [] }: { localities?: Location[] }) {
  return (
    <section className="relative h-[560px] w-full overflow-hidden sm:h-[640px] lg:h-[760px]">
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

      <div className={`relative z-10 flex h-full items-center ${FULL_BLEED_GUTTER}`}>
        <div className="max-w-[700px] pt-24 sm:max-w-[800px] lg:pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-background/75">
            Comercio local, gente real
          </p>
          <h1 className="mt-4 font-serif font-bold leading-[1.08] tracking-tight text-background text-[clamp(2.5rem,6vw,4.5rem)]">
            Encontrá lo que necesitás,
            <br />
            cerca tuyo.
          </h1>
          <p className="mt-4 max-w-md text-base text-background/85 sm:text-lg">
            Descubrí negocios y servicios de tu barrio. Todo en un solo
            lugar.
          </p>

          <div className="mt-7 max-w-2xl">
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
