import { notFound } from "next/navigation";
import { BusinessForm } from "@/components/admin/business-form";
import { getBusinessById } from "@/lib/data/businesses";
import { getCategories, getServices } from "@/lib/data/taxonomy";
import { getLocalities, getDepartments } from "@/lib/data/locations";
import { getPlans } from "@/lib/data/plans";

export default async function EditarNegocioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [business, categories, services, localities, departments, plans] = await Promise.all([
    getBusinessById(id),
    getCategories(),
    getServices(),
    getLocalities(),
    getDepartments(),
    getPlans(),
  ]);

  if (!business) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Editar {business.name}</h1>
      <BusinessForm
        initial={business}
        categories={categories}
        services={services}
        localities={localities}
        department={departments[0] ?? null}
        plans={plans}
      />
    </div>
  );
}
