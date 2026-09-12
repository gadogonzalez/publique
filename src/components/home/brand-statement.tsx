import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WIDE } from "@/components/home/width";

/** The one full-bleed pink moment on the page (PUBLIQUE_STYLE_GUIDE.md
 * §5, §24: pink in 1-2 deliberate full-bleed moments, never a wash).
 * Typography here is graphic, not a tagline under a logo. */
export function BrandStatement() {
  return (
    <section className="bg-brand-pink py-20 text-foreground sm:py-28">
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
          className={buttonVariants({ variant: "dark", size: "lg", className: "mt-8" })}
        >
          Explorar negocios
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
