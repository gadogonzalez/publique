import Link from "next/link";
import { MapPin } from "lucide-react";
import { SearchBar } from "@/components/search-bar";

const POPULAR_SEARCHES = ["electricista", "plomero", "viandas", "gomería", "arregla celulares"];

/** Stylized Andes-foothills dusk backdrop, drawn inline so the hero never
 * depends on an external photo host (this sandbox can't verify hotlinked
 * image URLs actually resolve -- see IMAGES note in the redesign report).
 * Swap for a real photo later by replacing this with a plain <Image>. */
function MendozaBackdrop() {
  return (
    <svg
      viewBox="0 0 800 640"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="publique-hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef1f0" />
          <stop offset="55%" stopColor="#f4dfc7" />
          <stop offset="100%" stopColor="#eeb98a" />
        </linearGradient>
      </defs>
      <rect width="800" height="640" fill="url(#publique-hero-sky)" />
      <circle cx="610" cy="220" r="68" fill="#fbe0b0" opacity="0.75" />
      <path
        d="M0 340 L90 260 L180 320 L260 230 L360 310 L460 240 L560 320 L650 250 L740 310 L800 270 L800 640 L0 640 Z"
        fill="#c9b9a8"
        opacity="0.55"
      />
      <path
        d="M0 400 L120 300 L220 380 L320 290 L420 370 L540 280 L640 380 L740 310 L800 360 L800 640 L0 640 Z"
        fill="#a58f79"
        opacity="0.75"
      />
      <path
        d="M0 470 L150 400 L300 460 L450 390 L620 450 L800 410 L800 640 L0 640 Z"
        fill="#5f6b4f"
      />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 20 + i * 56 + (i % 2 === 0 ? 0 : 18);
        const h = 55 + (i % 3) * 12;
        return (
          <path
            key={i}
            d={`M${x} 640 L${x} ${640 - h} L${x - 10} ${640 - h + 22} L${x + 10} ${640 - h + 22} Z`}
            fill="#3d4a34"
          />
        );
      })}
      <rect y="560" width="800" height="80" fill="#3d4a34" />
    </svg>
  );
}

export function HeroSearch() {
  return (
    <section className="container grid gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Comercio local, gente real
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl">
          Encontrá
          <br />
          lo que necesitás,
          <br />
          cerca tuyo
        </h1>
        <p className="mt-4 max-w-sm text-muted-foreground">
          Servicios, comercios y profesionales en Guaymallén. Rápido, simple y
          confiable.
        </p>

        <div className="mt-6">
          <SearchBar />
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>Búsquedas populares:</span>
          {POPULAR_SEARCHES.map((q) => (
            <Link
              key={q}
              href={`/buscar?q=${encodeURIComponent(q)}`}
              className="hover:text-foreground hover:underline"
            >
              {q}
            </Link>
          ))}
        </p>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[5/4]">
        <MendozaBackdrop />
        <span className="absolute right-6 top-5 -rotate-6 font-serif text-lg italic text-background">
          Negocios
          <br />
          de tu barrio
        </span>
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground">
          <MapPin className="h-3.5 w-3.5" />
          Guaymallén, Mendoza
        </div>
      </div>
    </section>
  );
}
