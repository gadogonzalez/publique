import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { WIDE } from "@/components/home/width";

/** The one substantial full-width dark section (PUBLIQUE_STYLE_GUIDE.md
 * §3, §7): near-black background, white type, one pink CTA -- a real
 * section, not a short strip. Copy from PUBLIQUE_PRODUCT_PRINCIPLES.md §12. */
export function CommunityBanner() {
  return (
    <section className="bg-foreground py-20 text-background sm:py-28">
      <div className={WIDE}>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-background/60">
          Para negocios
        </p>
        <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Que tu barrio te encuentre.
        </h2>
        <p className="mt-6 max-w-md text-base text-background/75 sm:text-lg">
          Publicá tu negocio en Publiqué y llegá a más personas de tu zona.
          Visibilidad local, resultados que podés medir.
        </p>
        <Link
          href="/admin/login"
          className={buttonVariants({ variant: "brand", size: "lg", className: "mt-8" })}
        >
          Conocé nuestros planes
        </Link>
      </div>
    </section>
  );
}
