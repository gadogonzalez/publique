import { CategoryManager } from "@/components/admin/category-manager";
import { getCategories, getServices } from "@/lib/data/taxonomy";

export default async function CategoriasPage() {
  const [categories, services] = await Promise.all([getCategories(), getServices()]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Categorías y servicios</h1>
      <CategoryManager categories={categories} services={services} />
    </div>
  );
}
