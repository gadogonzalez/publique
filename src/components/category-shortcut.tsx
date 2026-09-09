import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import type { Category } from "@/lib/types/database";

export function CategoryShortcut({ category }: { category: Category }) {
  return (
    <Link
      href={`/buscar?categoria=${category.slug}`}
      className="group flex flex-col items-center gap-2 text-center"
    >
      <CategoryIcon
        icon={category.icon}
        colorKey={category.slug}
        className="h-14 w-14 transition-transform group-hover:scale-105 sm:h-16 sm:w-16"
        iconClassName="h-6 w-6 sm:h-7 sm:w-7"
      />
      <span className="text-xs font-medium leading-tight sm:text-sm">
        {category.name}
      </span>
    </Link>
  );
}
