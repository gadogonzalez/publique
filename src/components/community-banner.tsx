import Link from "next/link";

export function CommunityBanner() {
  return (
    <section className="relative overflow-hidden bg-foreground py-16 text-background sm:py-20">
      <div className="container relative max-w-xl">
        <p className="text-xs font-medium uppercase tracking-wider text-background/70">
          Apoyá lo local
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Más que negocios,
          <br />
          comunidad
        </h2>
        <p className="mt-4 text-background/80">
          Descubrí, recomendá y apoyá a las personas que hacen crecer
          Guaymallén.
        </p>
        <Link
          href="/buscar"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-background px-5 text-sm font-medium text-foreground hover:bg-background/90"
        >
          Conocé más
        </Link>
      </div>
    </section>
  );
}
