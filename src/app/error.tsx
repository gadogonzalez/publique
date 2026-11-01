"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HERO_GRID } from "@/components/home/width";
import { cn } from "@/lib/utils";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={`${HERO_GRID} py-20`}>
      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">No pudimos cargar esta página</h1>
        <p className="mt-3 text-muted-foreground">
          Hubo un problema de conexión. Probá de nuevo en unos segundos.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className={cn(buttonVariants({ variant: "brand" }))}>
            Reintentar
          </button>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
