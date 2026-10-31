import type { Metadata } from "next";
import { CategoryCard } from "@/components/category-card";
import { HERO_GRID } from "@/components/home/width";
import { getCategories, getCategoryBusinessCounts } from "@/lib/data/taxonomy";

export const metadata: Metadata = {
  title: "Categorías",
};

export default async function CategoriasIndexPage() {
  const [categories, counts] = await Promise.all([getCategories(), getCategoryBusinessCounts()]);

  return (
    <div className={`${HERO_GRID} py-8`}>
      <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">Categorías</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Explorá los negocios de Guaymallén por rubro.
      </p>

      {categories.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} count={counts[category.id] ?? 0} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted-foreground">Todavía no hay categorías cargadas.</p>
      )}
    </div>
  );
}
