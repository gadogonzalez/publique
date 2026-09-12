import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WIDE } from "@/components/home/width";

/** The one full-bleed brand-color moment on the page. Corrected pass:
 * lavender/purple surface derived from the Phantom reference, replacing
 * the earlier vivid-pink direction (deprecated, see
 * PUBLIQUE_STYLE_GUIDE.md §5). Copy/layout unchanged -- palette + grid
 * only. */
export function BrandStatement() {
  return (
    <section className="bg-brand-surface-strong py-20 text-foreground sm:py-28">
      <div className={WIDE}>
        <p className="text-xs font-semibold uppercase tracking-[0.08em]">Tu barrio</p>
        <h2 className="mt-3 font-serif font-bold leading-[0.92] tracking-tight text-[clamp(2.75rem,9vw,7rem)]">
          En un solo
          <br />
          lugar.
        </h2>
        <p className="mt-6 max-w-md text-base sm:text-lg">
          Comercios, servicios y personas reales de tu zona. Apoyá lo local.
          Hagamos un barrio más conectado.
        </p>
        <Link
          href="/buscar"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-background px-6 text-base font-medium text-foreground hover:bg-background/90"
        >
          Explorar negocios
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
