import Link from "next/link";
import { CategoryPictogram } from "@/components/category-icon";
import type { Category } from "@/lib/types/database";

export function CategoryShortcut({ category }: { category: Category }) {
  return (
    <Link
      href={`/buscar?categoria=${category.slug}`}
      className="group flex flex-col items-center gap-2 text-center"
    >
      <CategoryPictogram
        icon={category.icon}
        className="h-7 w-7 transition-transform group-hover:scale-110 sm:h-8 sm:w-8"
      />
      <span className="text-xs font-medium leading-tight sm:text-sm">
        {category.name}
      </span>
    </Link>
  );
}
