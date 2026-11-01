import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HERO_GRID } from "@/components/home/width";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className={`${HERO_GRID} py-20`}>
      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight">No encontramos esta página</h1>
        <p className="mt-3 text-muted-foreground">
          Puede que el negocio ya no esté publicado o que el link tenga un error. Buscá lo que necesitás o
          explorá por categoría.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/buscar" className={cn(buttonVariants({ variant: "brand" }), "rounded-full")}>
            Buscar negocios
          </Link>
          <Link href="/categorias" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
            Ver categorías
          </Link>
        </div>
      </div>
    </div>
  );
}
