import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedBusinessCoverOnly } from "@/components/home/featured-business-card";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Large, single-business editorial feature -- image left, content right.
 * The magazine-style module that lets someone encounter a business they
 * weren't searching for (see PUBLIQUE_PRODUCT_PRINCIPLES.md §9). */
export function EditorialSpotlight({ business }: { business: BusinessWithRelations }) {
  const category = business.categories[0];
  return (
    <section className="container border-t border-border py-14 sm:py-20">
      <p className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Conocé un negocio del barrio
      </p>
      <Link
        href={`/negocios/${business.slug}`}
        className="group grid grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <FeaturedBusinessCoverOnly business={business} className="aspect-[4/3] w-full rounded-xl" />
        <div>
          {category && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {category.name}
            </p>
          )}
          <h2 className="mt-2 font-serif text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
            {business.name}
          </h2>
          {business.short_description && (
            <p className="mt-4 max-w-md text-muted-foreground">{business.short_description}</p>
          )}
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground">
            Ver negocio
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </section>
  );
}
