import Link from "next/link";
import { CategoryPictogram } from "@/components/category-icon";
import type { Category } from "@/lib/types/database";

/** Landing-page tile for /categorias -- bigger and boxed, unlike the
 * horizontal icon row on the homepage (CategoryShortcut). Same pictogram,
 * different context: this is the destination, not a shortcut. */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary hover:bg-secondary/40"
    >
      <CategoryPictogram
        icon={category.icon}
        className="h-8 w-8 transition-transform group-hover:scale-110"
      />
      <span className="font-serif text-base font-bold leading-tight tracking-tight">
        {category.name}
      </span>
    </Link>
  );
}
