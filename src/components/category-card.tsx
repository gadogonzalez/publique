import Link from "next/link";
import { CategoryPictogram } from "@/components/category-icon";
import type { Category } from "@/lib/types/database";

/** Category tile: icon in a tinted circle, name, optional business count.
 * Shared by the homepage grid and the /categorias landing grid -- same
 * destination, same card, no reason to duplicate it per page. */
export function CategoryCard({ category, count }: { category: Category; count?: number }) {
  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary hover:bg-secondary/40"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <CategoryPictogram
          icon={category.icon}
          className="h-7 w-7 text-primary transition-transform group-hover:scale-110"
        />
      </span>
      <span className="font-serif text-base font-bold leading-tight tracking-tight">
        {category.name}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">
          {count} {count === 1 ? "negocio" : "negocios"}
        </span>
      )}
    </Link>
  );
}
