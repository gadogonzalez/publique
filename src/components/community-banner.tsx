import Link from "next/link";

/** "Para negocios" B2B strip. Copy from PUBLIQUE_PRODUCT_PRINCIPLES.md §12. */
export function CommunityBanner() {
  return (
    <section className="border-t border-border bg-foreground py-14 text-background sm:py-20">
      <div className="container flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            Que tu barrio te encuentre.
          </h2>
          <p className="mt-2 max-w-md text-background/80">
            Sumá tu negocio a Publiqué y ganá visibilidad donde tus próximos
            clientes ya están buscando.
          </p>
        </div>
        <Link
          href="/admin/login"
          className="inline-flex h-11 shrink-0 items-center rounded-lg bg-background px-5 text-sm font-medium text-foreground hover:bg-background/90"
        >
          Conocer Publiqué
        </Link>
      </div>
    </section>
  );
}
