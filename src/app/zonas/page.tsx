import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { HERO_GRID } from "@/components/home/width";
import { getLocalities } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Zonas",
  description: "Explorá negocios y servicios por localidad en Guaymallén, Mendoza.",
};

export default async function ZonasPage() {
  const localities = await getLocalities();

  return (
    <div className={`${HERO_GRID} py-8`}>
      <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">Zonas</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Elegí tu localidad para ver los negocios y servicios que tenés cerca.
      </p>

      {localities.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {localities.map((loc) => (
            <li key={loc.id}>
              <Link
                href={`/buscar?zona=${loc.id}`}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 font-medium transition-colors hover:border-brand-primary"
              >
                <MapPin className="h-4 w-4 shrink-0 text-brand-primary" />
                {loc.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-muted-foreground">
          Todavía no hay zonas cargadas.{" "}
          <Link href="/buscar" className="font-medium text-brand-primary hover:underline">
            Ver todos los negocios
          </Link>
        </p>
      )}
    </div>
  );
}
