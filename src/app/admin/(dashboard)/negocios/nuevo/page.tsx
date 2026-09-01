import { BusinessForm } from "@/components/admin/business-form";
import { getCategories, getServices } from "@/lib/data/taxonomy";
import { getLocalities, getDepartments } from "@/lib/data/locations";
import { getPlans } from "@/lib/data/plans";

export default async function NuevoNegocioPage() {
  const [categories, services, localities, departments, plans] = await Promise.all([
    getCategories(),
    getServices(),
    getLocalities(),
    getDepartments(),
    getPlans(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Crear negocio</h1>
      <BusinessForm
        categories={categories}
        services={services}
        localities={localities}
        department={departments[0] ?? null}
        plans={plans}
      />
    </div>
  );
}
