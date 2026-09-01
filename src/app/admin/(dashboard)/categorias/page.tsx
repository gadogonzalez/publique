import { CategoryManager } from "@/components/admin/category-manager";
import { getCategories, getKeywords, getServices } from "@/lib/data/taxonomy";

export default async function CategoriasPage() {
  const [categories, services, keywords] = await Promise.all([
    getCategories(),
    getServices(),
    getKeywords(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Categorías y servicios</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Los alias son frases que la gente busca (&quot;no sale agua&quot;) y
        que no aparecen en el nombre del servicio o categoría. Agregalos acá
        para que la búsqueda los encuentre — ver{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-xs">docs/SEARCH.md</code>.
      </p>
      <CategoryManager categories={categories} services={services} keywords={keywords} />
    </div>
  );
}
